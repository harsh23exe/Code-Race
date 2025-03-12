import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {
  private languages = ['python', 'javascript', 'java'];

  getLanguages(): string[] {
    return this.languages;
  }
}