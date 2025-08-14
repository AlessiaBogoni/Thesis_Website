import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class TranslationService {
  public currentLang = "it";
  private translations: any = {};

  constructor(private http: HttpClient) {}

  setLanguage(lang: string): Promise<void> {
    this.currentLang = lang;
    return new Promise((resolve) => {
      this.http.get(`/assets/i18n/${lang}.json`).subscribe((data) => {
        this.translations = data;
        resolve(); // This is where the promise is resolved
      });
    });
  }

  t(key: string): string {
    return this.translations[key] || "key";
  }
}
