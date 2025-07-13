/**
 * @file analytics.page.ts
 * @description Componente Angular per la pagina di analisi della percezione di autorialità AI vs Human.
 */

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SurveyService } from "./survey.service";
import { AnalyticsService } from "./analytics.service";
import { Text, textPerGroup, textPerSecondGroup } from "../data/texts";
import _ from "lodash";
import * as jStat from "jstat";
declare var echarts: any;

@Component({
  selector: "analytics-page",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.css"],
})
export class AnalyticsPage {
  /**
   * Risultati dell'analisi della percezione di autorialità.
   **/
  results = {
    ai: 0,
    human: 0,
    ai_std: 0,
    human_std: 0,
    valid: false,
  };

  /**
   * Word cloud dei testi analizzati.
   * @type {Object}
   */
  wordCloud = [];
  /**
   * Numero totale di partecipanti al sondaggio.
   */
  totalParticipants = {
    ai: 0,
    human: 0,
    tot: 0,
  };
  /**
   * Dati filtrati in base al valore del filtro.
   */
  data;

  /**
   * Dati originali non filtrati.
   */
  originalData;

  /**
   * Colori utilizzati nei grafici.
   */
  colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333"];

  /**
   * Valore del filtro attuale.
   */
  private filterValue;

  /**
   * Categoria selezionata per l'analisi.
   */
  selectedCategory = "authorship";

  /**
   * Istogramma dei dati.
   */
  histoChart;

  /**
   * Imposta il valore del filtro e aggiorna i dati filtrati.
   * @param value Il nuovo valore del filtro.
   */
  set filter(value) {
    this.filterValue = value;
    this.data = null;
    setTimeout(() => {
      this.data = this.originalData
        .filter((e) => e.group === value)
        .map((e) => e.text);
    }, 500);
  }

  /**
   * Restituisce il valore attuale del filtro.
   * @returns Il valore del filtro.
   */
  get filter() {
    return this.filterValue;
  }

  /**
   * Genera un istogramma dai dati forniti.
   * @param data I dati da analizzare.
   * @param size La dimensione dei bin dell'istogramma.
   * @returns Un array di coppie [valore, frequenza].
   */
  histogram(data, size) {
    let min = Infinity;
    let max = -Infinity;

    for (const item of data) {
      if (item < min) {
        min = item;
      }
      if (item > max) {
        max = item;
      }
    }

    const bins = Math.ceil((max - min + 1) / size);

    const histo = new Array(bins > 0 ? bins : 0).fill(0);

    for (const item of data) {
      histo[Math.floor((item - min) / size)]++;
    }

    return histo.map((item, index) => [min + (index + 1) * size, item]);
  }

  σ(array) {
    const avg = _.sum(array) / array.length;
    return Math.sqrt(
      _.sum(_.map(array, (i) => Math.pow(i - avg, 2))) / array.length
    );
  }

  /**
   * Costruttore del componente AnalyticsPage.
   * @param http Servizio HttpClient per le richieste HTTP.
   * @param analyticsService Servizio per la generazione dei grafici di analisi.
   */
  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService
  ) {
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.originalData = Object.values(data || {}) || [];
      this.filter = "ai";
      this.totalParticipants = {
        ai: this.originalData.filter((e) => e.group === "ai").length,
        human: this.originalData.filter((e) => e.group === "human").length,
        tot: this.originalData.length,
      };
      const aiGroup = this.originalData.filter((e) => e.group === "ai");
      const humanGroup = this.originalData.filter((e) => e.group === "human");
      const aiScores = aiGroup.map((e) => e.evaluation || 0);
      const humanScores = humanGroup.map((e) => e.evaluation || 0);
      this.results = {
        ai: _.mean(aiScores),
        human: _.mean(humanScores),
        ai_std: this.σ(aiScores),
        human_std: this.σ(humanScores),
        valid: this.ttest(aiScores, humanScores),
      };

      this.createWordCloud();
      const chartDom = document.getElementById("chart") as HTMLElement;
      this.histoChart = echarts.init(chartDom);
      this.histoChart.setOption({
        textStyle: {
          color: "white",
        },
        color: ["orange", "yellow"],
      });
    });
  }

  createWordCloud() {
    let message = "";
    this.originalData.forEach((e) => {
      message += (e.text?.text || "") + " ";
    });
    message = message.replace(/[^a-zA-Z ]/g, "");
    const words = message.split(" ").filter((e) => e);
    const wordCount = {};
    words.forEach((word) => {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });
    this.wordCloud = Object.keys(wordCount).map((word) => {
      return {
        text: word,
        value: wordCount[word] * 60,
      };
    });
  }

  /**
   * Genera un grafico EChart per la categoria specificata.
   * @param type Il tipo di grafico da generare (predefinito: 'authorship').
   */
  generateEChart(type = "authorship") {
    this.analyticsService.generateEChart.bind(this)(type);
  }

  ttest(sample1, sample2, alpha = 0.05) {
    if (sample1.length === 0 || sample2.length === 0) {
      throw new Error("Both samples must have at least one observation.");
    }

    // Helper function to calculate mean
    const mean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

    // Helper function to calculate variance
    const variance = (arr, meanValue) =>
      arr.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) /
      (arr.length - 1);

    // Calculate means
    const mean1 = mean(sample1);
    const mean2 = mean(sample2);

    // Calculate variances
    const variance1 = variance(sample1, mean1);
    const variance2 = variance(sample2, mean2);

    // Calculate pooled standard error
    const standardError = Math.sqrt(
      variance1 / sample1.length + variance2 / sample2.length
    );

    // Calculate t-statistic
    const tStatistic = (mean1 - mean2) / standardError;

    // Calculate degrees of freedom (Welch-Satterthwaite approximation)
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

    // Return true if p-value < alpha (statistically significant)
    return pValue < alpha;
  }
}
