import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CodeSnippetsService {
  private snippetsDir = path.join( '..', 'snippets');

  getRandomSnippet(language: string): string {
    const languageDir = path.join(this.snippetsDir, language);
    const files = fs.readdirSync(languageDir);
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return fs.readFileSync(path.join(languageDir, randomFile), 'utf-8');
  }
}