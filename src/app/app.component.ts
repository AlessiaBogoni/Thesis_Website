import { Component } from "@angular/core";
import { TranslationService } from "./pages/translation.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "SurveyJS + Angular";

  constructor(public translationService: TranslationService) {
    const savedLang = localStorage.getItem("lang");

    this.translationService.setLanguage(savedLang);
  }
}
