import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  getLanguages(): string[] {
    return this.languageService.getLanguages();
  }
}