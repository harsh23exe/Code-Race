import { Module } from '@nestjs/common';
import { TypingTestService } from './typing-test.service';
import { TypingTestController } from './typing-test.controller';
import { CodeSnippetsModule } from '../code-snippets/code-snippets.module';

@Module({
  imports: [CodeSnippetsModule],
  providers: [TypingTestService],
  controllers: [TypingTestController],
})
export class TypingTestModule {}