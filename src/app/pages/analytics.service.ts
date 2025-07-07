/**
 * @file analytics.service.ts
 * @description Servizio per la generazione di grafici utilizzando ECharts per analizzare la percezione dell'autorialità AI vs Human.
 */

import { Injectable } from "@angular/core";
import { AnalyticsPage } from "./analytics.page";
declare var echarts;

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  /**
   * Genera un grafico a barre con ECharts evidenziando la percezione dell'autorialità AI vs Human.
   *
   * @param this Riferimento alla pagina di analisi.
   * @param type Tipo di categoria da visualizzare nel grafico. Default è "authorship".
   */
  generateEChart(this: AnalyticsPage, type = "authorship") {
    if (!this.originalData) {
      return;
    }

    this.selectedCategory = type;

    const aiPerception = this.originalData
      .filter((e) => e.text?.type === "ai")
      .map((e) => e.evaluation)
      .filter((e) => e !== undefined);

    const humanPerception = this.originalData
      .filter((e) => e.text?.type === "human")
      .map((e) => e.evaluation)
      .filter((e) => e !== undefined);

    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const meanAI = mean(aiPerception);
    const meanHuman = mean(humanPerception);

    const maxXAxis = Math.ceil(
      Math.max(Math.max(...aiPerception), Math.max(...humanPerception)) + 1
    );

    const histoAI = this.histogram(aiPerception, 1);
    const histoHuman = this.histogram(humanPerception, 1);

    const formatter = (arr: number[]) => (params: any) => {
      if (!params.value[1]) {
        return "";
      }
      return (
        ((params.value[1] / arr.length) * 100).toFixed(0) + "%"
      );
    };

    const option = {
      legend: {
        textStyle: {
          color: "white",
        },
        selectedMode: true,
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { type: ["line", "bar"] },
          saveAsImage: {},
        },
      },
      xAxis: [
        {
          max: maxXAxis,
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#333",
            },
          },
        },
        {
          max: maxXAxis,
          gridIndex: 1,
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#333",
            },
          },
        },
      ],
      grid: [
        {
          left: 60,
          right: 50,
          height: "40%",
        },
        {
          left: 60,
          right: 50,
          top: "50%",
          height: "40%",
        },
      ],
      yAxis: [
        {
          gridIndex: 0,
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#333",
            },
          },
          name: "Frequency histogram",
        },
        {
          gridIndex: 1,
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#333",
            },
          },
          inverse: true,
        },
      ],
      series: [
        {
          name: "AI Perception",
          type: "bar",
          markLine: {
            data: [
              [
                { name: meanAI.toFixed(2), xAxis: meanAI, yAxis: 0 },
                { xAxis: meanAI, yAxis: 10 },
              ],
            ],
          },
          label: {
            show: true,
            backgroundColor: "#fca6",
            padding: 5,
            borderRadius: 5,
            color: "black",
            formatter: formatter(aiPerception),
          },
          barWidth: "10",
          data: histoAI,
        },
        {
          name: "Human Perception",
          type: "bar",
          barWidth: "10",
          xAxisIndex: 1,
          yAxisIndex: 1,
          markLine: {
            data: [
              [
                { name: meanHuman.toFixed(2), xAxis: meanHuman, yAxis: 0 },
                { xAxis: meanHuman, yAxis: 10 },
              ],
            ],
          },
          label: {
            show: true,
            backgroundColor: "#ffa6",
            padding: 5,
            borderRadius: 5,
            color: "black",
            formatter: formatter(humanPerception),
          },
          data: histoHuman,
        },
      ],
    };

    this.histoChart.setOption(option);
  }

  /**
   * Crea un istogramma dai dati forniti.
   *
   * @param data Array di numeri.
   * @param binSize Dimensione del bin.
   * @returns Array di dati per l'istogramma.
   */
  private histogram(data: number[], binSize: number) {
    const bins: { [key: number]: number } = {};
    data.forEach((value) => {
      const bin = Math.floor(value / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });

    return Object.keys(bins).map((key) => [parseFloat(key), bins[key]]);
  }
}
