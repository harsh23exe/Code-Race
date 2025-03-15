"use client";

import React, { useState } from 'react';
import styles from '../styles/OptionsBar.module.css';

const OptionsBar: React.FC = () => {
  const [activeOption, setActiveOption] = useState('time');

  const handleOptionClick = (option: string) => {
    setActiveOption(option);
    // Add logic to handle option click
  };

  return (
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
        className={`${styles.option} ${activeOption === 'newSnippet' ? styles.active : ''}`}
        onClick={() => handleOptionClick('newSnippet')}
      >
        New Snippet
      </div>
    </div>
  );
};

export default OptionsBar;