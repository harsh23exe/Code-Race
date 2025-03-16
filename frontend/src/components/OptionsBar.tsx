"use client";

import React, { useState, useEffect } from 'react';
import { fetchLanguages } from '../utils/api';
import styles from '../styles/OptionsBar.module.css';

interface OptionsBarProps {
  onTimerChange: (time: number | null) => void;
  onLanguageChange: (language: string) => void;
  onNewSnippet: () => void;
}

const OptionsBar: React.FC<OptionsBarProps> = ({ 
  onTimerChange, 
  onLanguageChange, 
  onNewSnippet 
}) => {
  const [activeOption, setActiveOption] = useState('time');
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchLanguages();
        if (data && data.languages) {
          setLanguages(data.languages);
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };

    loadLanguages();
  }, []);

  const handleOptionClick = (option: string) => {
    setActiveOption(option);
    setShowTimeOptions(option === 'time');
    setShowLanguageOptions(option === 'language');
  };

  const handleTimeSelection = (time: number | null) => {
    onTimerChange(time);
    setShowTimeOptions(false);
  };

  const handleLanguageSelection = (language: string) => {
    onLanguageChange(language);
    setShowLanguageOptions(false);
  };

  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsBar}>
        <div
          className={`${styles.option} ${activeOption === 'time' ? styles.active : ''}`}
          onClick={() => handleOptionClick('time')}
        >
          Time
        </div>
        <div
          className={`${styles.option} ${activeOption === 'language' ? styles.active : ''}`}
          onClick={() => handleOptionClick('language')}
        >
          Language
        </div>
        <div
          className={`${styles.option}`}
          onClick={onNewSnippet}
        >
          New Snippet
        </div>
      </div>
      
      {showTimeOptions && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownOption} onClick={() => handleTimeSelection(30)}>
            30s
          </div>
          <div className={styles.dropdownOption} onClick={() => handleTimeSelection(60)}>
            60s
          </div>
          <div className={styles.dropdownOption} onClick={() => handleTimeSelection(null)}>
            Complete Text
          </div>
        </div>
      )}

      {showLanguageOptions && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <div 
              key={lang}
              className={styles.dropdownOption} 
              onClick={() => handleLanguageSelection(lang)}
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionsBar;