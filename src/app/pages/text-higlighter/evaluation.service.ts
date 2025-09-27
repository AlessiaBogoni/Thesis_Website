// src/app/services/evaluation.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SurveyService } from '../survey.service';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  constructor(private http: HttpClient) {}
  
  // This object holds the correct highlighting solutions for your experiment.
  // It's a key part of your scoring logic.
  private groupSolutions = {
    en: {
      ai: [
        { startIndex: 185, endIndex: 190},
        { startIndex: 462, endIndex: 480},
        { startIndex: 527, endIndex: 539},
      ],
      human: [
        { startIndex: 205, endIndex: 210},
        { startIndex: 553, endIndex: 571},
        { startIndex: 602, endIndex: 614},
      ],
    },
    it: {
      ai: [
        { startIndex: 217, endIndex: 222},
        { startIndex: 539, endIndex: 560},
        { startIndex: 614, endIndex: 628},
      ],
      human: [
        { startIndex: 222, endIndex: 227},
        { startIndex: 597, endIndex: 615},
        { startIndex: 656, endIndex: 670},
      ],
    },
  };

  /**
   * Selects the correct highlighting solution based on the text's group and language.
   */
  chooseGroupSolution(secondGroup: string, lang: "en" | "it" = "en") {
    return this.groupSolutions[lang][secondGroup] || [];
  }

  /**
   * Generates a heatmap array based on correct error matches.
   * The heatmap assigns a score (1, 0.9, 0.8, etc.) to each character index
   * based on its proximity to a correct error.
   */
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

  /**
   * Computes the overall highlighting score for the last text.
   * This method uses several helper functions to calculate precision, recall, etc.
   */
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

    const precision = this.getPrecision(test, correctHeatmap);
    const recall = this.getRecall(test, correctHeatmap);
    const specificity = this.getSpecificity(test, correctHeatmap);
    const fuzzyScore = this.overlapCalc(test, correctHeatmap);
    const f1 = this.getF1(precision, recall);

    return {
      precision,
      recall,
      f1,
      specificity,
      fuzzyScore,
    };
  }

  /**
   * Calculates the fuzzy value for a character's proximity to a correct error.
   */
  value(i: number, s: number, e: number): number {
    if (i >= s && i < e) return 1;
    if (i === s - 1 || i === e) return 0.9;
    if (i === s - 2 || i === e + 1) return 0.9;
    if (i === s - 3 || i === e + 2) return 0.9;
    if (i === s - 4 || i === e + 3) return 0.8;
    if (i === s - 5 || i === e + 4) return 0.8;
    if (i === s - 6 || i === e + 5) return 0.7;
    if (i === s - 7 || i === e + 6) return 0.7;
    if (i === s - 8 || i === e + 7) return 0.6;
    if (i === s - 9 || i === e + 8) return 0.5;
    if (i === s - 10 || i === e + 9) return 0.4;
    if (i === s - 11 || i === e + 10) return 0.3;
    if (i === s - 12 || i === e + 11) return 0.2;
    if (i === s - 13 || i === e + 12) return 0.1;
    return 0;
  }

  /**
   * Calculates the fuzzy overlap score.
   */
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
   */
  getPrecision(userSelection: number[], heatmap: number[]): number {
    if (userSelection.length === 0) {
      return 0;
    }
    let sum = 0;
    for (const index of userSelection) {
      if (index >= 0 && index < heatmap.length) {
        sum += heatmap[index];
      }
    }
    return sum / userSelection.length;
  }

  /**
   * Computes fuzzy recall.
   */
  getRecall(userSelection: number[], heatmap: number[]): number {
    let sumSelected = 0;
    let totalGroundTruth = 0;

    for (const value of heatmap) {
      if (value === 1) {
        totalGroundTruth += 1;
      }
    }

    for (const index of userSelection) {
      if (index >= 0 && index < heatmap.length) {
        sumSelected += heatmap[index];
      }
    }

    if (sumSelected > totalGroundTruth) {
      sumSelected = totalGroundTruth;
    }

    return totalGroundTruth === 0 ? 0 : sumSelected / totalGroundTruth;
  }

  /**
   * Computes fuzzy F1 score.
   */
  getF1(precision: number, recall: number): number {
    if (precision + recall === 0) {
      return 0;
    }
    return (2 * (precision * recall)) / (precision + recall);
  }

  /**
   * Computes fuzzy specificity.
   */
  getSpecificity(userSelection: number[], heatmap: number[]): number {
    const negativeIndexes = heatmap
      .map((value, index) => (value === 1 ? -1 : index))
      .filter((index) => index !== -1);

    const selectedNegatives = userSelection.filter(
      (i) => negativeIndexes.indexOf(i) >= 0
    );

    const TN = negativeIndexes.length - selectedNegatives.length;
    const FP = selectedNegatives.length;

    const denominator = TN + FP;
    return denominator === 0 ? 0 : TN / denominator;
  }



  /**
   * Calculates the guessing score for the last text.
   */
  calculateGuessingSkillScoreForLastText(lastTextResult: any): number {
    const actualSource = lastTextResult.lastText.type === "ai" ? 0 : 1;
    const participantGuess = lastTextResult.humanSoundness / 10;
    const lastGuessScore = 1 - Math.abs(participantGuess - actualSource);
    return lastGuessScore;
  }

  /**
   * Calculates the guessing score for a single text.
   */
  calculateGuessingSkillScoreForText(result: any): number {
    const actualSource = result.text.type === "ai" ? 0 : 1;
    const participantGuess = result.humanSoundness / 10;
    return 1 - Math.abs(participantGuess - actualSource);
  }

   calculateGuessingSkillScoresFromFirebase(machineCode: string): Observable<{
    guessScores: number[];
    guessFour: number;
  }> {
    return this.http
      .get<any[]>(SurveyService.getUrl(`${machineCode}/results`))
      .pipe(
        map((results) => {
          // results = array of saved text results from Firebase
          const guessScores = results.filter(Boolean).filter(e => e.text).map((r) =>
            this.calculateGuessingSkillScoreForText(r)
          );
          const guessFour =
            (guessScores.reduce((a, b) => a + b, 0) - 2) /
            (guessScores.length - 2);
          return { guessScores, guessFour };
        })
      );
    }

  /**
   * Calculates the average guessing score across multiple texts.
   */
  calculateGuessingSkillScores(textResults: any[]): {
    guessScores: number[];
    guessFour: number;
  } {
    const textResultsArray = Object.values(textResults);
    const guessScores = textResultsArray.map((r) =>
      this.calculateGuessingSkillScoreForText(r)
    );
    const guessFour =
      (guessScores.reduce((a, b) => a + b, 0)-2) / (guessScores.length-2);
          // console.log("guessScore, guessfour:"+ guessScores, guessFour)
    return { guessScores, guessFour };

  }

  /**
   * Provides a sample text and solution for the interactive example.
   */
  getInteractiveExampleText() {
    return {
      text: 'The company reported that sales were above expectations, which was unexpected.',
      errors: [
        { startIndex: 37, endIndex: 42, text: 'above' },
        { startIndex: 52, endIndex: 61, text: 'unexpected' }
      ],
      correctGuess: 'ai'
    };
  }
}