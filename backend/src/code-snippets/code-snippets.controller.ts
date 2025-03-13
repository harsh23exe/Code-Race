import { Controller, Get, Query } from '@nestjs/common';
import { CodeSnippetsService } from './code-snippets.service';

@Controller('code-snippets')
export class CodeSnippetsController {
  constructor(private readonly codeSnippetsService: CodeSnippetsService) {}

  @Get('random')
  getRandomSnippet(@Query('language') language: string): { snippet: string } {
    const snippet = this.codeSnippetsService.getRandomSnippet(language);
    return { snippet };
  }
}