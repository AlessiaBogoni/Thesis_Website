import { Injectable } from "@angular/core";
import { TextHighlightComponent } from "./text-higlighter/text-highlight.component";
import {
  LastText,
  textPerGroup,
  Text,
  textPerSecondGroup,
} from "../data/texts";
import { HttpClient } from "@angular/common/http";
import { match } from "node:assert";
import { map } from "rxjs";
import { SurveyService } from "./survey.service";
import { PreSurvey } from "app/data/pre.survey";

@Injectable({
  providedIn: "root",
})
export class ScoreService {
  highlightSections: {
    text: string;
    color: string;
    element: HTMLElement;
    startIndex: number;
    endIndex: number;
  }[] = [];

  originalData;
  lang: string;
  highlightSolution: any;
  text: string;

  constructor(public http: HttpClient, private surveyService: SurveyService) {}
  groupSolutions = {
    en: {
      ai: [
        { startIndex: 188, endIndex: 193, text: "above" },
        { startIndex: 458, endIndex: 476, text: "less than two days" },
        { startIndex: 523, endIndex: 535, text: "only one day" },
      ],
      human: [
        { startIndex: 220, endIndex: 225, text: "above" },
        { startIndex: 577, endIndex: 595, text: "less than two days" },
        { startIndex: 626, endIndex: 638, text: "only one day" },
      ],
    },
    it: {
      ai: [
        { startIndex: 220, endIndex: 225, text: "sopra" },
        { startIndex: 542, endIndex: 560, text: "meno di due giorni" },
        { startIndex: 614, endIndex: 628, text: "solo un giorno" },
      ],
      human: [
        { startIndex: 231, endIndex: 236, text: "sopra" },
        { startIndex: 608, endIndex: 626, text: "meno di due giorni" },
        { startIndex: 667, endIndex: 681, text: "solo un giorno" },
      ],
    },
  };


  chooseGroupSolution(secondGroup: string, lang: "en" | "it" = "en") {
    // console.log("Soluzione scelta:", this.groupSolutions[lang][secondGroup]);
  
    return this.groupSolutions[lang][secondGroup] || [];
  }
  /*   chooseGroupSolution(secondGroup: string) {
    if (secondGroup === "ai") {
      return [
        {
          endIndex: 193,
          startIndex: 188,
          text: "above",
        },
        {
          endIndex: 476,
          startIndex: 458,
          text: "less than two days",
        },
        {
          endIndex: 535,
          startIndex: 523,
          text: "only one day",
        },
      ];
    } else if (secondGroup === "human") {
      return [
        {
          endIndex: 225,
          startIndex: 220,
          text: "above",
        },
        {
          endIndex: 595,
          startIndex: 577,
          text: "less than two days",
        },
        {
          endIndex: 640,
          startIndex: 626,
          text: "only one day's",
        },
      ];
    }
  }
 */
  createHeatmap(match, test) {
    // console.log("createHeatmap");
    const map = new Array(test.length).fill(0);
    for (const m of match) {
      const s = m.startIndex;
      const e = m.endIndex;
      map.forEach((_, i) => {
        const newValue = this.value(i, s, e);
        if (newValue > map[i]) {
          map[i] = newValue;
        }
      });
    }
    // console.log("map " + map);
    return map;
  }

  computeScore(lastTextResult, text: string) {
    const correctMatches = this.chooseGroupSolution(
      lastTextResult.lastText.type, lastTextResult.lastText.lang
    );
    const correctHeatmap = this.createHeatmap(correctMatches, text);
    const highlightSections = lastTextResult.highlightSections;
    const test = [];

    // Flatten user selection into character indices
    highlightSections.forEach((selection) => {
      for (
        let index = selection.startIndex;
        index < selection.endIndex;
        index++
      ) {
        test.push(index);
      }
    });

    // Calculate fuzzy precision, recall, specificity and F1
    const precision = this.getPrecision(test, correctHeatmap);
    const recall = this.getRecall(test, correctHeatmap);
    const specificity = this.getSpecificity(test, correctHeatmap);
    const fuzzyScore = this.overlapCalc(test, correctHeatmap);
    const f1 = this.getF1(precision, recall); // optional, still useful

    return {
      precision,
      recall,
      f1,
      specificity,
      fuzzyScore,
    };
  }

  value(i: number, s: number, e: number): number {
    if (i >= s && i <= e) return 1;
    if (i === s - 1 || i === e + 1) return 1;
    if (i === s - 2 || i === e + 2) return 0.9;
    if (i === s - 3 || i === e + 3) return 0.9;
    if (i === s - 4 || i === e + 4) return 0.8;
    if (i === s - 5 || i === e + 5) return 0.8;
    if (i === s - 6 || i === e + 6) return 0.7;
    if (i === s - 7 || i === e + 7) return 0.7;
    if (i === s - 8 || i === e + 8) return 0.6;
    if (i === s - 9 || i === e + 9) return 0.5;
    if (i === s - 10 || i === e + 10) return 0.4;
    if (i === s - 11 || i === e + 11) return 0.3;
    if (i === s - 12 || i === e + 12) return 0.2;
    if (i === s - 13 || i === e + 13) return 0.1;
    return 0;
  }

  overlapCalc(test: number[], heatmap: number[]): number {
    // console.log("overlapCalc");
    let sum = 0;
    for (const index of test) {
      if (index >= 0 && index < heatmap.length) {
        //console.log("overlapcalc index");
        sum += heatmap[index];
      }
    }
    return sum / test.length;
  }

  /**
   * Computes fuzzy precision.
   * Measures how much of the selected characters by the user are close to actual errors.
   */
  getPrecision(userSelection: number[], heatmap: number[]): number {
    // console.log("getPrecision");
    if (userSelection.length === 0) {
      //console.log("userSelection.length === 0");
      return 0;
    }

    let sum = 0;
    for (const index of userSelection) {
      //console.log("index " + index);
      //console.log("heatmap.length " + heatmap.length);
      if (index >= 0 && index < heatmap.length) {
        sum += heatmap[index];
        //console.log("sum dopo" + sum); // high value if user clicked near a real error
      }
    }
    //console.log("sum/userselection.length " + sum / userSelection.length);
    return sum / userSelection.length;
  }

  /**
   * Computes fuzzy recall.
   * Measures how much of the actual error area was successfully identified by the user.
   */
  /* getRecall(userSelection: number[], heatmap: number[]): number {
    console.log("getRecall");
    let sumSelected = 0;
    let totalGroundTruth = 0;

    for (let i = 0; i < heatmap.length; i++) {
      console.log("totalGroundTruth " + totalGroundTruth);
      totalGroundTruth += heatmap[i]; // max possible score if user did perfect selection
      console.log(
        "totalgroundtruth += heatmap[i] " + (totalGroundTruth += heatmap[i])
      );
    }
    console.log("userSelection " + userSelection);
    for (const index of userSelection) {
      if (index >= 0 && index < heatmap.length) {
        console.log(" index if ");
        sumSelected += heatmap[index]; // actual score user got from selected positions
        console.log("sumSelected " + sumSelected);
      }
    }

    return totalGroundTruth === 0 ? 0 : sumSelected / totalGroundTruth;
  } */

    getRecall(userSelection: number[], heatmap: number[]): number {
  // console.log("getRecall");
  let sumSelected = 0;
  let totalGroundTruth = 0;

  // Calculate the totalGroundTruth based ONLY on the core correct answers (heatmap values of 1)
  for (const value of heatmap) {
    if (value === 1) {
      totalGroundTruth += 1;
    }
  }

  // Calculate the sum of the scores for the user's selection
  for (const index of userSelection) {
    if (index >= 0 && index < heatmap.length) {
      sumSelected += heatmap[index];
    }
  }

  // Cap the sumSelected at totalGroundTruth to ensure the recall score does not exceed 1
  if (sumSelected > totalGroundTruth) {
    sumSelected = totalGroundTruth;
  }

  // Handle the case where there are no correct answers to avoid division by zero
  return totalGroundTruth === 0 ? 0 : sumSelected / totalGroundTruth;
}

  /**
   * Computes fuzzy F1 score.
   * Harmonic mean between precision and recall.
   */
  getF1(precision: number, recall: number): number {
    // console.log("getF1");
    if (precision + recall === 0) {
      //console.log("precision + recall === 0");
      return 0;
    }
    //console.log("2 * (precision * recall) " + 2 * (precision * recall));
    return (2 * (precision * recall)) / (precision + recall);
  }

  /**
   * Computes fuzzy specificity.
   * Measures how well the user avoided selecting correct (non-error) characters.
   */
  getSpecificity(userSelection: number[], heatmap: number[]): number {
    // console.log("getSpecificity");
    const negativeIndexes = heatmap
      .map((value, index) => (value === 0 ? index : -1))
      .filter((index) => index !== -1);

    const selectedNegatives = userSelection.filter(
      (i) => i >= 0 && i < heatmap.length && heatmap[i] === 0
    );

    const TN = negativeIndexes.length - selectedNegatives.length; // true negatives: correct untouched
    const FP = selectedNegatives.length;

    const denominator = TN + FP;
    return denominator === 0 ? 0 : TN / denominator;
  }

  // last text
  calculateGuessingSkillScoreForLastText(lastTextResult: any): number {
    //console.log("lastTextResult.lastText.type " + lastTextResult.lastText.type);
    const actualSource = lastTextResult.lastText.type === "ai" ? 0 : 1;
    const participantGuess = lastTextResult.humanSoundness / 10;
    const lastGuessScore = 1 - Math.abs(participantGuess - actualSource);
    return lastGuessScore; // Range: 0 to 1
  }

  // texts
  calculateGuessingSkillScoreForText(result: any): number {
    const actualSource = result.text.type === "ai" ? 0 : 1;
    const participantGuess = result.humanSoundness / 10; // 0-1 scale
    return 1 - Math.abs(participantGuess - actualSource); // [0,1]
  }

  calculateGuessingSkillScores(textResults: any[]): {
    guessScores: number[];
    guessFour: number;
  } {
    const textResultsArray = Object.values(textResults);
    const guessScores = textResultsArray.map((r) =>
      this.calculateGuessingSkillScoreForText(r)
    );
    const guessFour =
      guessScores.reduce((a, b) => a + b, 0) / guessScores.length; // average
    return { guessScores, guessFour };
  }

  calculateGuessingSkillScoreForTexts(textResults: any[]): number {
    let textScore = 0;
    let totalScore = 0;

    for (const result of textResults) {
      const actualSource = result.text.type === "ai" ? 0 : 1;
      const participantGuess = result.humanSoundness / 10;
      const score = 1 - Math.abs(participantGuess - actualSource);
      textScore = score;
      // totalScore += score;
    }

    return textScore;
  }
}
