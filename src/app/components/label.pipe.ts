import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../pages/translation.service';

@Pipe({
    name: 'label'
})
export class LabelPipe implements PipeTransform {
    constructor(private translationService: TranslationService) {}

    transform(key: string): string {
        return this.translationService.t(key);
    }
}
