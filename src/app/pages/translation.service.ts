import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as langEN from 'assets/i18n/en.json'
import * as langIT from 'assets/i18n/it.json'

@Injectable({ providedIn: "root" })
export class TranslationService {
  public currentLang;
 translations: any = langEN;

  constructor(private http: HttpClient) {}

  setLanguage(lang: string) {
    this.currentLang = lang;
    this.translations = lang === 'en' ? langEN : langIT 
  }

  /*   t(key: string): string {
    return this.translations[key] || "key";
  } */
  t(key: string, params?: Record<string, any>): string {
    let translation = this.translations?.[key] || key;
    if (params) {
      Object.keys(params).forEach((p) => {
        translation = translation.replace(`{{${p}}}`, params[p]);
      });
    }
    return translation;
  }
}
