import { Controller, Get, Query } from '@nestjs/common';
import { TypingTestService } from './typing-test.service';

@Controller('typing-test')
export class TypingTestController {
  constructor(private readonly typingTestService: TypingTestService) {}

  @Get('snippet')
  getSnippet(@Query('language') language: string): string {
    return this.typingTestService.getTypingTestSnippet(language);
  }
}