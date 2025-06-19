import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CodeSnippetsService {
  private readonly logger = new Logger(CodeSnippetsService.name);
  private readonly snippetsDir: string;

  constructor() {
    // Handle both development and production paths
    const isDist = __dirname.includes('dist');
    this.snippetsDir = path.join(
      __dirname,
      '..',                // go up to src or dist
      isDist ? '..' : '',  // if in dist, go up one more level
      'snippets'          // then into snippets
    );
    
    // Log the resolved path for debugging
    this.logger.log(`Initializing with snippets directory: ${this.snippetsDir}`);
    
    // Verify the directory exists on service initialization
    if (!fs.existsSync(this.snippetsDir)) {
      this.logger.error(`Failed to find snippets directory at: ${this.snippetsDir}`);
      this.logger.debug(`Current directory: ${__dirname}`);
      this.logger.debug(`Available files in parent directory:`, fs.readdirSync(path.join(__dirname, '..')));
      throw new Error(`Snippets directory not found at ${this.snippetsDir}`);
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