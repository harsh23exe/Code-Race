import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CodeSnippetsService {
  private readonly logger = new Logger(CodeSnippetsService.name);
  private readonly snippetsDir: string;

  constructor() {
    // Handle different environments:
    // - Local development: backend/src/code-snippets -> backend/snippets
    // - Vercel serverless: /var/task/backend/src/code-snippets -> /var/task/snippets
    const possiblePaths = [
      // For Vercel serverless (files are at function root)
      path.join(process.cwd(), 'snippets'),
      // For local development
      path.join(__dirname, '..', '..', 'snippets'),
      // Fallback
      path.join(__dirname, '..', 'snippets'),
    ];

    // Try each path until we find one that exists
    for (const snippetPath of possiblePaths) {
      if (fs.existsSync(snippetPath)) {
        this.snippetsDir = snippetPath;
        this.logger.log(`Found snippets directory at: ${this.snippetsDir}`);
        break;
      }
    }

    // If no path was found, use the first one and let it fail with a clear error
    if (!this.snippetsDir) {
      this.snippetsDir = possiblePaths[0];
      this.logger.error(`Failed to find snippets directory. Tried paths:`, possiblePaths);
      this.logger.debug(`Current directory: ${__dirname}`);
      this.logger.debug(`Process cwd: ${process.cwd()}`);
      throw new Error(`Snippets directory not found. Tried: ${possiblePaths.join(', ')}`);
    }
  }

  getRandomSnippet(language: string): string {
    // Validate language parameter
    if (!language) {
      throw new Error('Language parameter is required');
    }

    const languageDir = path.join(this.snippetsDir, language);
    
    // Check if language directory exists
    if (!fs.existsSync(languageDir)) {
      throw new Error(`Language directory not found: ${language}`);
    }

    // Get all files in the language directory
    const files = fs.readdirSync(languageDir);
    
    // Check if there are any files
    if (files.length === 0) {
      throw new Error(`No snippet files found for language: ${language}`);
    }

    // Get a random file
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(languageDir, randomFile);

    try {
      // Read and return the file contents
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Error reading snippet file: ${filePath}`, error);
      throw new Error(`Failed to read snippet file for language: ${language}`);
    }
  }
}