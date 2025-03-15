"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSnippet } from '../utils/api';
import styles from '../styles/TypingTest.module.css';
import OptionsBar from './OptionsBar';

const TypingTest: React.FC = () => {
  const [snippet, setSnippet] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [currentLanguage, setCurrentLanguage] = useState('JavaScript');
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams ? searchParams.get('language') : null;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSnippet = async () => {
      if (language) {
        try {
          const snippet = await fetchSnippet(language);
          setSnippet(snippet);
          console.log('Fetched snippet:', snippet);
        } catch (error) {
          console.error('Error fetching snippet:', error);
        }
      }
    };

    loadSnippet();
  }, [language]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (startTime && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime]);

  const handleTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    e.preventDefault();

    // Only start timer on actual character input, not on modifier keys
    if (!startTime && key.length === 1) {
      setStartTime(Date.now());
    }

    // Ignore modifier keys like Shift
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
      return;
    }

    if (key === 'Backspace') {
      setTypedText(typedText.slice(0, -1));
    } else if (key === 'Enter') {
      setTypedText(typedText + '\n');
    } else if (key === 'Tab') {
      // Find the next non-space character position
      let currentPos = typedText.length;
      let nextNonSpacePos = currentPos;
      
      while (nextNonSpacePos < snippet.length && snippet[nextNonSpacePos] === ' ') {
        nextNonSpacePos++;
      }
      
      // Add all spaces up to the next non-space character
      const spacesToAdd = snippet.slice(currentPos, nextNonSpacePos);
      setTypedText(typedText + spacesToAdd);
    } else if (key.length === 1) {
      setTypedText(typedText + key);
    }
  
    if (typedText.length === snippet.length - 1) {
      endTest();
    }
  };

  const endTest = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - (startTime || 0)) / 1000;
    const wordsTyped = typedText.split(' ').length;
    const typingSpeed = (wordsTyped / timeTaken) * 60;
    const accuracy = calculateAccuracy();

    // Store the result in local storage
    const results = JSON.parse(localStorage.getItem('typingResults') || '[]');
    results.push({ 
      speed: Math.round(typingSpeed),
      accuracy: accuracy, 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('typingResults', JSON.stringify(results));
    localStorage.setItem('lastSpeed', Math.round(typingSpeed).toString());
    localStorage.setItem('lastAccuracy', accuracy.toString());

    router.push('/results');
  };

  const renderSnippet = () => {
    return snippet.split('').map((char, index) => {
      let className = '';
      if (index < typedText.length) {
        className = char === typedText[index] ? styles.correct : styles.incorrect;
      } else if (index === typedText.length) {
        className = styles.cursor;
      }
      
      // Handle special characters
      let displayChar = char;
       if (char === '\n') {
        displayChar = '↵\n'; // Display enter symbol and actual line break
      }
      
      return (
        <span key={index} className={className}>
          {displayChar}
        </span>
      );
    });
  };

  const handleTimerChange = (time: number | null) => {
    setTimerDuration(time);
    setTimeLeft(time || Infinity);
  };

  const handleLanguageChange = async (language: string) => {
    setCurrentLanguage(language);
    try {
      const newSnippet = await fetchSnippet(language);
      setSnippet(newSnippet);
      resetTest();
    } catch (error) {
      console.error('Error fetching snippet:', error);
    }
  };

  const handleNewSnippet = async () => {
    try {
      const newSnippet = await fetchSnippet(currentLanguage);
      setSnippet(newSnippet);
      resetTest();
    } catch (error) {
      console.error('Error fetching snippet:', error);
    }
  };

  const resetTest = () => {
    setTypedText('');
    setStartTime(null);
    setTimeLeft(timerDuration || Infinity);
  };

  const calculateWPM = () => {
    const wordsTyped = typedText.split(' ').length;
    const timeTaken = (Date.now() - (startTime || 0)) / 1000 / 60; // in minutes
    return Math.round(wordsTyped / timeTaken);
  };

  const calculateAccuracy = () => {
    const correctChars = typedText.split('').filter((char, index) => char === snippet[index]).length;
    return Math.round((correctChars / typedText.length) * 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.optionsContainer}>
        <OptionsBar 
          onTimerChange={handleTimerChange}
          onLanguageChange={handleLanguageChange}
          onNewSnippet={handleNewSnippet}
        />
      </div>
      <div className={styles.header}>
        <div className={styles.timer}>{timeLeft}s</div>
        <div className={styles.wpm}>WPM: {calculateWPM()}</div>
        <div className={styles.accuracy}>ACC: {calculateAccuracy()}%</div>
      </div>
      <div 
        className={styles.textDisplay} 
        tabIndex={0} 
        ref={containerRef}
        onKeyDown={handleTyping}
      >
        {renderSnippet()}
      </div>
      <div className={styles.footer}>
        <div className={styles.hint}>Press any key to start typing</div>
      </div>
    </div>
  );
};

export default TypingTest;