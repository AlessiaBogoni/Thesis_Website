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
  highlightSolution: any;
  text: string;

  constructor(public http: HttpClient, private surveyService: SurveyService) {
    
  }

  chooseGroupSolution(secondGroup: string) {
    if (secondGroup === "ai") {
      return [
        {
          endIndex: 650,
          startIndex: 617,
          text: "turnover takes less than two days",
        },
        {
          endIndex: 738,
          startIndex: 697,
          text: "Tenants often provide only a day's notice",
        },
        {
          endIndex: 791,
          startIndex: 774,
          text: "rapid transitions",
        },
        {
          endIndex: 674,
          startIndex: 652,
          text: "minimizing income loss",
        },
      ];
    } else if (secondGroup === "human") {
      return [
        {
          endIndex: 717,
          startIndex: 672,
          text: "This process usually takes less than two days",
        },
        {
          endIndex: 748,
          startIndex: 722,
          text: "you won't lose much income",
        },
        {
          endIndex: 817,
          startIndex: 773,
          text: "tenants typically give only one day's notice",
        },
        {
          endIndex: 884,
          startIndex: 869,
          text: "fast turnaround",
        },
      ];
    }
  }

  createHeatmap(match, test) {
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
    return map;
  }

    computeScore(lastTextResult, text: string) {
    const correctMatches = this.chooseGroupSolution(lastTextResult.lastText.type);
    const correctHeatmap = this.createHeatmap(correctMatches, text);
    const highlightSections = lastTextResult.highlightSections;
    const test = [];

    // Flatten user selection into character indices
    highlightSections.forEach(selection => {
      for (let index = selection.startIndex; index < selection.endIndex; index++) {
        test.push(index);
      }
    });

    // Calculate fuzzy precision, recall, specificity and F1
    const precision = this.getPrecision(test, correctHeatmap);
    const recall = this.getRecall(test, correctHeatmap);
    const f1 = this.getF1(precision, recall);
    const specificity = this.getSpecificity(test, correctHeatmap);
    const fuzzyScore = this.overlapCalc(test, correctHeatmap); // optional, still useful

    return {
      precision,
      recall,
      f1,
      specificity,
      fuzzyScore
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
    let sum = 0;
    for (const index of test) {
      if (index >= 0 && index < heatmap.length) {
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
    if (userSelection.length === 0) return 0;
    
    let sum = 0;
    for (const index of userSelection) {
      if (index >= 0 && index < heatmap.length) {
        sum += heatmap[index];  // high value if user clicked near a real error
      }
    }
    return sum / userSelection.length;
  }

  /**
   * Computes fuzzy recall.
   * Measures how much of the actual error area was successfully identified by the user.
   */
  getRecall(userSelection: number[], heatmap: number[]): number {
    let sumSelected = 0;
    let totalGroundTruth = 0;

    for (let i = 0; i < heatmap.length; i++) {
      totalGroundTruth += heatmap[i]; // max possible score if user did perfect selection
    }

    for (const index of userSelection) {
      if (index >= 0 && index < heatmap.length) {
        sumSelected += heatmap[index]; // actual score user got from selected positions
      }
    }

    return totalGroundTruth === 0 ? 0 : sumSelected / totalGroundTruth;
  }

  /**
   * Computes fuzzy F1 score.
   * Harmonic mean between precision and recall.
   */
  getF1(precision: number, recall: number): number {
    if (precision + recall === 0) return 0;
    return 2 * (precision * recall) / (precision + recall);
  }

  /**
   * Computes fuzzy specificity.
   * Measures how well the user avoided selecting correct (non-error) characters.
   */
  getSpecificity(userSelection: number[], heatmap: number[]): number {
    const negativeIndexes = heatmap
      .map((value, index) => (value === 0 ? index : -1))
      .filter(index => index !== -1);

    const selectedNegatives = userSelection.filter(i => i >= 0 && i < heatmap.length && heatmap[i] === 0);

    const TN = negativeIndexes.length - selectedNegatives.length; // true negatives: correct untouched
    const FP = selectedNegatives.length;

    const denominator = TN + FP;
    return denominator === 0 ? 0 : TN / denominator;
  }
calculateGuessingSkillScoreForLastText(lastTextResult: any): number {
  const actualSource = lastTextResult.text.type === 'ai' ? 0 : 1;
  const participantGuess = lastTextResult.humanSoundness / 10;
  return 1 - Math.abs(participantGuess - actualSource); // Range: 0 to 1
}

calculateGuessingSkillScoreForTexts(textResults: any[]): number {
  let textScore = 0;
  let totalScore = 0;

  for (const result of textResults) {
    const actualSource = result.text.type === 'ai' ? 0 : 1;
    const participantGuess = result.humanSoundness / 10;
    const score = 1 - Math.abs(participantGuess - actualSource);
    textScore = score;
    // totalScore += score;

  }

  return textScore;
}

}
