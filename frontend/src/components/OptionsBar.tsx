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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchLanguages();
        if (data ) {
          setLanguages(data);
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };

    loadLanguages();
  }, []);

  const handleMouseEnter = (option: string) => {
    setActiveDropdown(option);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleTimeSelection = (time: number | null) => {
    onTimerChange(time);
    setActiveDropdown(null);
  };

  const handleLanguageSelection = (language: string) => {
    onLanguageChange(language);
    setActiveDropdown(null);
  };

  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsBar}>
        <div
          className={styles.optionWrapper}
          onMouseEnter={() => handleMouseEnter('time')}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${styles.option} ${activeDropdown === 'time' ? styles.active : ''}`}>
            Time
          </div>
          {activeDropdown === 'time' && (
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
        </div>
        <div
          className={styles.optionWrapper}
          onMouseEnter={() => handleMouseEnter('language')}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${styles.option} ${activeDropdown === 'language' ? styles.active : ''}`}>
            Language
          </div>
          {activeDropdown === 'language' && (
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
        <div
          className={styles.option}
          onClick={onNewSnippet}
        >
          New Snippet
        </div>
      </div>
    </div>
  );
};

export default OptionsBar;