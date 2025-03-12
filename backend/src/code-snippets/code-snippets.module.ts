import { Module } from '@nestjs/common';
import { CodeSnippetsService } from './code-snippets.service';
import { CodeSnippetsController } from './code-snippets.controller';

@Module({
  providers: [CodeSnippetsService],
  controllers: [CodeSnippetsController],
  exports: [CodeSnippetsService],
})
export class CodeSnippetsModule {}