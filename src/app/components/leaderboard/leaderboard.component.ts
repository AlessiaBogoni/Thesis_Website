import { Component, OnInit } from "@angular/core";
import { SurveyService } from "../../pages/survey.service";
import { HttpClient } from "@angular/common/http";
import { ScoreService } from "../../pages/score.service";
import { TranslationService } from "../../pages/translation.service";
import { totalmem } from "node:os";
import { highlight } from "ace-builds/src-noconflict/ext-static_highlight";

@Component({
  selector: "app-leaderboard",
  templateUrl: "leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
  machineCode: string = "";
  leaderboard: any[] = [];

  constructor(private http: HttpClient, private scoreService: ScoreService, private translationservice: TranslationService) {}

  ngOnInit(): void {
    this.getLeaderboard();
    this.machineCode = localStorage.getItem("0machineCode") || "";
  }

  getLeaderboard() {
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.leaderboard = [];

      for (const key in data) {
        const entry = data[key];
        const allResults = entry.results;

        // Pick the latest result by max key (text number)
        const latestKey = Object.keys(allResults || {}).sort().pop();
        const lastResultData = allResults?.[latestKey];

        if (!lastResultData || lastResultData.leaderboardScore == null) continue;

        this.leaderboard.push({
          machineCode: key,
          name: entry.pre?.name || "Anonymous",
          highlightScore: lastResultData.leaderboardScore ?? 0,
          precision: lastResultData.precisionScore ?? null,
          recall: lastResultData.recallScore ?? null,
          f1: lastResultData.f1Score ?? null,
          specificity: lastResultData.specificityScore ?? null,
          fuzzyScore: lastResultData.score?.fuzzyScore ?? lastResultData.leaderboardScore,
          me: key === this.machineCode,
          guessScore: lastResultData.score.totalGuessingScore ?? 0,
          totalScore: (lastResultData.leaderboardScore ?? 0) + (lastResultData.score.totalGuessingScore ?? 0),
        });
      }

      // Sort the leaderboard by score
      this.leaderboard.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
    });
  }
}
