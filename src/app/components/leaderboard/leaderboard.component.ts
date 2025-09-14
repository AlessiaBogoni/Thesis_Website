import { Component, OnInit } from "@angular/core";
import { SurveyService } from "../../pages/survey.service";
import { HttpClient } from "@angular/common/http";
import { ScoreService } from "../../pages/score.service";
import { TranslationService } from "../../pages/translation.service";
import { totalmem } from "node:os";
import { highlight } from "ace-builds/src-noconflict/ext-static_highlight";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: "app-leaderboard",
  templateUrl: "leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
  machineCode: string = "";
  leaderboard: any[] = [];

  userHighlightScore: number | null = null;
  userGuessScore: number | null = null;
  userTotalScore: number | null = null;
  finalOutput: SafeHtml;
  finalOutcome: SafeHtml;

  constructor(
    private http: HttpClient,
    private scoreService: ScoreService,
    private translationService: TranslationService,
    private sanitizer: DomSanitizer
  ) {}

    private formatNumber(value: number | null): string {
    if (value === null || isNaN(value)) {
      return '0.00'; // Default value for null or invalid numbers
    }
    // Format to a minimum of 1 integer digit and 2 fractional digits
    return value.toFixed(2);
  }

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
        const latestKey = Object.keys(allResults || {})
          .sort()
          .pop();
        const lastResultData = allResults?.[latestKey];

        if (!lastResultData || lastResultData.leaderboardScore == null)
          continue;

        this.leaderboard.push({
          machineCode: key,
          name: entry.pre?.name || "Anonymous",
          highlightScore: lastResultData.leaderboardScore ?? 0,
          precision: lastResultData.precisionScore ?? null,
          recall: lastResultData.recallScore ?? null,
          f1: lastResultData.f1Score ?? null,
          specificity: lastResultData.specificityScore ?? null,
          fuzzyScore:
            lastResultData.score?.fuzzyScore ?? lastResultData.leaderboardScore,
          me: key === this.machineCode,
          guessScore: lastResultData.score.totalGuessingScore ?? 0,
          totalScore:
            ((lastResultData.leaderboardScore ?? 0) +
            (lastResultData.score.totalGuessingScore ?? 0))/2,
        });
      }

      // Sort the leaderboard by score
      this.leaderboard.sort(
        (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
      );

      // Find the current user's entry and set the scores
      const userEntry = this.leaderboard.find((entry) => entry.me);
      if (userEntry) {
        this.userHighlightScore = userEntry.highlightScore;
        this.userGuessScore = userEntry.guessScore;
        this.userTotalScore = userEntry.totalScore;
      }

      const finalOutput = this.translationService
      .t("final_output")
      .replace(
        "{{guess}}",
        this.formatNumber(this.userGuessScore)
      )
      .replace(
        "{{ userHighlightScore | number: '1.2-2' }}",
        this.formatNumber(this.userHighlightScore)
      )
      .replace(
        "{{ userTotalScore | number: '1.2-2' }}",
        this.formatNumber(this.userTotalScore)
      )
      .replace(
        "{{ userTotalScore * 30 | number: '1.2-2' }}",
        this.formatNumber((this.userTotalScore ?? 0) * 30)
      );
      this.finalOutcome = this.sanitizer.bypassSecurityTrustHtml(finalOutput)
    });
  }
}
