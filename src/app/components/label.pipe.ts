import { Pipe, PipeTransform } from "@angular/core";
import { TranslationService } from "../pages/translation.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "label",
})
export class LabelPipe implements PipeTransform {
  constructor(
    private translationService: TranslationService,
    private sanitizer: DomSanitizer
  ) {}

  transform(key: string): SafeHtml {
    const html = this.translationService.t(key);
    return html;
  }
}
