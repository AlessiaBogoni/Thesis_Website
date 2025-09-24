/**
 * @file analytics.page.ts
 * @description Componente Angular per la pagina di analisi della percezione di autorialità AI vs Human.
 */

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SurveyService } from "./survey.service";
import { AnalyticsService } from "./analytics.service";
import { textPerGroup } from "../data/texts";
import _ from "lodash";
import * as jStat from "jstat";
declare var echarts: any;

@Component({
  selector: "analytics-page",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.css"],
})
export class AnalyticsPage {
  results = {
    ai_read: 0,
    human_read: 0,
    ai_std_read: 0,
    human_std_read: 0,
    valid_read: false,
  };

  wordCloud = [];
  totalParticipants = {
    ai: 0,
    human: 0,
    tot: 0,
    groupA: 0,
    groupB: 0,
    groupC: 0,
    groupD: 0,
  };

  data;
  originalData;

  colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333"];

  private filterValue;
  selectedCategory = "authorship";
  histoChart;

  groupResults: any[] = [];
  lastTextResults: any[] = [];

  set filter(value) {
    this.filterValue = value;
    this.data = null;
    setTimeout(() => {
      // results is an object keyed by text id, so use flatMap over Object.values
      this.data = (this.originalData || [])
        .flatMap((e) => Object.values(e?.results || {}))
        .filter((r: any) => r?.text?.type === value)
        .map((r: any) => r?.text);
    }, 500);
  }

  get filter() {
    return this.filterValue;
  }

  histogram(data, size) {
    if (!Array.isArray(data) || data.length === 0) return [];
    let min = Infinity;
    let max = -Infinity;

    for (const item of data) {
      if (item < min) min = item;
      if (item > max) max = item;
    }

    const bins = Math.ceil((max - min + 1) / size);
    const histo = new Array(bins > 0 ? bins : 0).fill(0);

    for (const item of data) {
      histo[Math.floor((item - min) / size)]++;
    }

    return histo.map((item, index) => [min + (index + 1) * size, item]);
  }

  σ(array: number[]) {
    if (!Array.isArray(array) || array.length === 0) return 0;
    const avg = _.sum(array) / array.length;
    return Math.sqrt(
      _.sum(_.map(array, (i) => Math.pow(i - avg, 2))) / array.length
    );
  }

  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService
  ) {
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.originalData = Object.values(data || {}) || [];
      this.filter = "ai";

      this.totalParticipants = {
        ai: (this.originalData || []).filter(
          (e) => e?.pre?.second_group === "AI"
        ).length,
        human: (this.originalData || []).filter(
          (e) => e?.pre?.second_group === "human"
        ).length,
        tot: (this.originalData || []).length,
        groupA: (this.originalData || []).filter(
          (e) => e?.pre?.experiment_group === "groupA"
        ).length,
        groupB: (this.originalData || []).filter(
          (e) => e?.pre?.experiment_group === "groupB"
        ).length,
        groupC: (this.originalData || []).filter(
          (e) => e?.pre?.experiment_group === "groupC"
        ).length,
        groupD: (this.originalData || []).filter(
          (e) => e?.pre?.experiment_group === "groupD"
        ).length,
      };

      // Group results (texts 1–4) - safe indexing
      this.groupResults = ["A", "B", "C", "D"].map((group) => {
        return {
          group,
          texts: [1, 2, 3, 4].map((id) => {
            const subset = (this.originalData || [])
              .filter((e) => e?.pre?.experiment_group === "group" + group)
              .map((e) => (e && e.results && e.results[String(id)] ? e.results[String(id)] : undefined))
              .filter((r) => r); // remove undefined

            const textInfo = (textPerGroup("en") || {})[group]?.find((t) => t.id === String(id)) || null;

            return {
              id,
              type: textInfo?.type || "unknown",
              labeled: !!textInfo?.labeled,
              humansoundness: this.computeStats(subset, "humanSoundness"),
              readability: this.computeStats(subset, "readability"),
              accuracy: this.computeStats(subset, "accuracy"),
            };
          }),
        };
      });

      // Last text (id 5) for AI and Human - safe indexing
      this.lastTextResults = ["AI", "human"].map((g) => {
        const subset = (this.originalData || [])
          .filter((e) => e?.pre?.second_group === g)
          .map((e) => (e && e.results && e.results["5"] ? e.results["5"] : undefined))
          .filter((r) => r);

        return {
          group: g,
          id: 5,
          type: g.toLowerCase(),
          labeled: false,
          humansoundness: this.computeStats(subset, "humanSoundness"),
          readability: this.computeStats(subset, "readability"),
          accuracy: this.computeStats(subset, "accuracy"),
        };
      });

      this.createWordCloud();

      // histogram init (safe)
      const chartDom = document.getElementById("chart") as HTMLElement | null;
      if (chartDom) {
        this.histoChart = echarts.init(chartDom);
        this.histoChart.setOption({
          textStyle: { color: "white" },
          color: ["orange", "yellow"],
        });
      }

      // Plot metric charts for texts 1-4
      ['humanSoundness','readability','accuracy'].forEach(metric => {
        [1,2,3,4].forEach(textId => this.plotMetricPerText(metric, String(textId)));
      });
    });
  }

  computeANOVA(metric: string) {
    const results: any = {};

    ['1','2','3','4'].forEach(id => {
      const groupValues = ['A','B','C','D'].map(g => {
        return (this.originalData || [])
          .filter(e => e?.pre?.experiment_group === 'group' + g && e.results?.[id])
          .map(e => e.results[id][metric])
          .filter(v => v !== undefined && v !== null);
      });

      // safe check: need at least two groups with data to run ANOVA
      const groupsWithData = groupValues.filter(arr => arr && arr.length > 0);
      let f = NaN;
      let p = NaN;
      let significant = false;
      if (groupsWithData.length >= 2) {
        try {
          f = jStat.anovaftest(...groupValues);
          // compute p-value using F-distribution CDF if possible
          // degrees: k-1, N-k
          const k = groupValues.length;
          const N = groupValues.flat().length;
          const df1 = k - 1;
          const df2 = N - k;
          if (df2 > 0) {
            const pValue = 1 - jStat.centralF.cdf(f, df1, df2);
            p = pValue;
            significant = pValue < 0.05;
          }
        } catch (err) {
          // ANOVA failed, leave NaN
        }
      }

      results[id] = { groupValues, f, p, significant };
    });

    return results;
  }

  createWordCloud() {
    let message = "";
    (this.originalData || []).forEach((e) => {
      const res = e?.results || {};
      Object.values(res).forEach((r: any) => {
        if (!r) return;
        // r.text may be an object {text: '...'} or a string
        const txt = typeof r.text === "string" ? r.text : (r.text?.text || "");
        if (txt) message += txt + " ";
      });
    });

    message = message.replace(/[^a-zA-Z ]/g, "");
    const words = message.split(" ").filter((w) => w);
    const wordCount: { [key: string]: number } = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    this.wordCloud = Object.keys(wordCount).map((word) => ({
      text: word,
      value: wordCount[word] * 60,
    }));
  }

  generateEChart(type = "authorship") {
    this.analyticsService.generateEChart.bind(this)(type);
  }

  ttest(sample1: number[], sample2: number[], alpha = 0.05) {
    if (!Array.isArray(sample1) || !Array.isArray(sample2) || sample1.length === 0 || sample2.length === 0) {
      throw new Error("Both samples must have at least one observation.");
    }
    const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const variance = (arr: number[], m: number) =>
      arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / (arr.length - 1);

    const mean1 = mean(sample1);
    const mean2 = mean(sample2);
    const variance1 = variance(sample1, mean1);
    const variance2 = variance(sample2, mean2);

    const standardError = Math.sqrt(
      variance1 / sample1.length + variance2 / sample2.length
    );
    const tStatistic = (mean1 - mean2) / standardError;

    const numerator = Math.pow(
      variance1 / sample1.length + variance2 / sample2.length,
      2
    );
    const denominator =
      Math.pow(variance1 / sample1.length, 2) / (sample1.length - 1) +
      Math.pow(variance2 / sample2.length, 2) / (sample2.length - 1);
    const degreesOfFreedom = numerator / denominator;

    const pValue =
      2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), degreesOfFreedom));

    return pValue < alpha;
  }

  computeStats(data: any[], metric: "accuracy" | "humanSoundness" | "readability") {
    const values = (data || [])
      .map((r) => r?.[metric])
      .filter((v) => typeof v === "number");
    if (values.length === 0) {
      return { mean: 0, std: 0, n: 0 };
    }
    return {
      mean: _.mean(values),
      std: values.length > 1 ? this.σ(values) : 0,
      n: values.length
    };
  }

plotMetricPerText(metric: string, textId: string) {
  const chartDom = document.getElementById(`chart-${metric}-${textId}`);
  if (!chartDom) return;

  const chart = echarts.init(chartDom);
  const groups = ['A','B','C','D'];

  const data = groups.map(g => {
    const values = this.originalData
      .filter(e => e?.pre?.experiment_group === 'group' + g && e.results?.[textId])
      .map(e => e.results[textId][metric])
      .filter(v => typeof v === 'number');

    if (values.length === 0) {
      return { group: g, mean: 0, std: 0, n: 0 };
    }

    return {
      group: g,
      mean: _.mean(values),
      std: values.length > 1 ? this.σ(values) : 0,
      n: values.length
    };
  });

  chart.setOption({
    xAxis: { type: 'category', data: groups },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: data.map(d => d.mean)
    }],
    tooltip: {
      formatter: (params) => {
        const item = data[params.dataIndex];
        return `Group: ${item.group}<br/>Mean: ${item.mean.toFixed(2)} ± ${item.std.toFixed(2)} (n=${item.n})`;
      }
    }
  });
}

}
