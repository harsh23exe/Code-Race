import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {
  private languages = ['python', 'javascript', 'java', 'cpp'];

  getLanguages(): string[] {
    return this.languages;
  }
}