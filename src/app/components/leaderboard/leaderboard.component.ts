import { Component, OnInit } from "@angular/core";
import { SurveyService } from "../../pages/survey.service";
import { HttpClient } from "@angular/common/http";
import { ScoreService } from "../../pages/score.service";
import { TranslationService } from "../../pages/translation.service";

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
  }

  getLeaderboard() {
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.leaderboard = [];

      for (const key in data) {
        const entry = data[key];
        const allResults = entry.results;

        // Pick the latest result by max key (text number)
        const latestKey = Object.keys(allResults || {}).sort().pop();
        const resultData = allResults?.[latestKey];

        if (!resultData || resultData.leaderboardScore == null) continue;

        this.leaderboard.push({
          machineCode: key,
          name: entry.pre?.name || "Anonymous",
          totalScore: resultData.leaderboardScore ?? 0,
          precision: resultData.precisionScore ?? null,
          recall: resultData.recallScore ?? null,
          f1: resultData.f1Score ?? null,
          specificity: resultData.specificityScore ?? null,
          fuzzyScore: resultData.score?.fuzzyScore ?? resultData.leaderboardScore,
          me: key === this.machineCode,
        });
      }

      // Sort the leaderboard by score
      this.leaderboard.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
    });
  }
}
