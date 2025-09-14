
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EvaluationService } from './text-higlighter/evaluation.service';
import { TranslationService } from './translation.service';


@Component({
  selector: 'app-scoring-instructions',
  templateUrl: './scoring-instructions.component.html',
  styleUrls: ['./scoring-instructions.component.css']
})
export class ScoringInstructionsComponent implements OnInit {
 

  humanSoundnessExample: number = 5;
  guessingScore: number = 0.5;
  scoringHtml1: SafeHtml;
  scoringHtml2: SafeHtml;
    language: string;
    lang;

  
  interactiveText: any;
  
  highlightingExampleHtml: SafeHtml;

  //readonly HIGHLIGHT_EXAMPLE_TEXT = `During the spring season, many trees lose their leaves. The autumn sun rises in the east, casting long shadows on the ground. A warm breeze carries the scent of pumpkin spice, while a distant bird sings its summer song in the crisp air. The changing leaves turn brilliant shades of blue, orange, and red.`;
  readonly HIGHLIGHT_EXAMPLE_TEXT = this.translationService.t("text_2");
  readonly HIGHLIGHT_EXAMPLE_ERRORS = [
    { startIndex: 12, endIndex: 22, text: "spring season" },
    { startIndex: 222, endIndex: 224, text: "blue" }
  ];

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private translationService: TranslationService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2, // This is no longer needed either
  ) {
        this.interactiveText = this.evaluationService.getInteractiveExampleText();
        

        this.highlightingExampleHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.generateColoredText(this.HIGHLIGHT_EXAMPLE_TEXT, this.HIGHLIGHT_EXAMPLE_ERRORS)
    );
   }

  async ngOnInit() {

    this.updateGuessingScore();


    this.loadScoringContent1();
    this.loadScoringContent2();
    this.lang = this.translationService.currentLang;

  }


  updateGuessingScore() {
    const actualSource = this.interactiveText.correctGuess === 'ai' ? 0 : 1;
    const participantGuess = this.humanSoundnessExample / 10;
    this.guessingScore = 1 - Math.abs(participantGuess - actualSource);
  }

    loadScoringContent1() {
    const htmlString = this.translationService.t("score_instruction_1");
    this.scoringHtml1 = this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
    loadScoringContent2() {
    const htmlString = this.translationService.t("score_instruction_2");
    this.scoringHtml2 = this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }


private generateColoredText(text: string, errors: { startIndex: number, endIndex: number }[]): string {
  const heatmap = this.evaluationService.createHeatmap(errors, text);
  let coloredHtml = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const value = heatmap[i];
    let style = '';

    if (value === 1) {
      // For a perfect match (value of 1), make the text bold and use a distinct color.
      // A bright green or teal can work well on a black background.
      style = `background-color: hsla(150, 100%, 20%, 1); font-weight: bold; text-decoration: underline; color: #f5f5f5;`; // A dark green background, bold text
    } else if (value > 0) {
      // For fuzzy matches (value < 1), use a red gradient.
      // Adjust the lightness for a smooth transition from bright to dim.
      const lightness = 0 + (value * 80);
      style = `background-color: hsl(${lightness}, 100%, 20%, 1);`;
    }

    coloredHtml += `<span style="${style}">${char}</span>`;
  }
  return coloredHtml;
}
 
  goToMainInstructions() {
    window.close()
  }
}