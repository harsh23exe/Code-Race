import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeSnippetsModule } from './code-snippets/code-snippets.module';
import { TypingTestModule } from './typing-test/typing-test.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [CodeSnippetsModule, TypingTestModule, LanguageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
