import { Injectable } from '@nestjs/common';
import { CodeSnippetsService } from '../code-snippets/code-snippets.service';

@Injectable()
export class TypingTestService {
  constructor(private readonly codeSnippetsService: CodeSnippetsService) {}

  getTypingTestSnippet(language: string): string {
    return this.codeSnippetsService.getRandomSnippet(language);
  }
}