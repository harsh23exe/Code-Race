"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLanguages } from '../utils/api';

const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesList = await fetchLanguages();
        console.log('Fetched languages:', languagesList); // Debugging log
        setLanguages(languagesList);
      } catch (error) {
        console.error('Error fetching languages:', error); // Debugging log
      }
    };

    loadLanguages();
  }, []);

  const handleStartTest = () => {
    if (language) {
      router.push(`/typing-test?language=${language}`);
    }
  };

  return (
    <div>
      <h1>Select Language</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="">Select a language</option>
        {languages && languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <button onClick={handleStartTest}>Start Typing Test</button>
    </div>
  );
};

export default LanguageSelector;