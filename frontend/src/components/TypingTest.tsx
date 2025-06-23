"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSnippet } from '../utils/api';
import styles from '../styles/TypingTest.module.css';
import OptionsBar from './OptionsBar';

const TypingTest: React.FC = () => {
  
  const [snippet, setSnippet] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentLanguage, setCurrentLanguage] = useState('JavaScript');
  const [timerDuration, setTimerDuration] = useState<number | null>(60);
  const [wpmData, setWpmData] = useState<{ second: number; wpm: number }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams ? searchParams.get('language') : null;
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);
  const wpmTrackingRef = useRef<NodeJS.Timeout | null>(null);
  const typedTextLengthRef = useRef<number>(0);
  const typedTextRef = useRef('');

  // Calculate accuracy memoized
  const calculateAccuracy = useCallback(() => {
    if (typedText.length === 0) return 100;
    const correctChars = typedText.split('')
      .filter((char, index) => char === snippet[index]).length;
    return Math.round((correctChars / typedText.length) * 100);
  }, [typedText, snippet]);

  // Calculate WPM memoized
  const calculateWPM = useCallback(() => {
    if (!startTime || typedText.length === 0) return 0;

    const timeElapsedInSeconds = (Date.now() - startTime) / 1000;

    // To prevent WPM spikes, wait for at least 2 seconds before calculating
    if (timeElapsedInSeconds < 2) {
      return 0;
    }

    const wordsTyped = typedText.length / 5; // Using 5 chars per word as a standard
    const timeElapsedInMinutes = timeElapsedInSeconds / 60;
    const wpm = Math.round(wordsTyped / timeElapsedInMinutes);

    return wpm;
  }, [typedText, startTime]);

  // End test function memoized
  const endTest = useCallback(() => {
    if (!startTime) return;
    
    // Clean up WPM tracking interval
    if (wpmTrackingRef.current) {
      clearInterval(wpmTrackingRef.current);
      wpmTrackingRef.current = null;
    }
    
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const wordsTyped = typedText.length / 5; // Using 5 chars per word as a standard
    const typingSpeed = Math.round((wordsTyped / timeTaken) * 60);
    const accuracy = calculateAccuracy();

    const results = JSON.parse(localStorage.getItem('typingResults') || '[]');
    results.push({ 
      speed: typingSpeed,
      accuracy, 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('typingResults', JSON.stringify(results));
    localStorage.setItem('lastSpeed', typingSpeed.toString());
    localStorage.setItem('lastAccuracy', accuracy.toString());
    localStorage.setItem('lastWpmData', JSON.stringify(wpmData));

    router.push('/results');
  }, [startTime, typedText, calculateAccuracy, router, wpmData]);

  // Reset test function memoized
  const resetTest = useCallback(() => {
    // Clean up WPM tracking interval
    if (wpmTrackingRef.current) {
      clearInterval(wpmTrackingRef.current);
      wpmTrackingRef.current = null;
    }
    
    setTypedText('');
    setStartTime(null);
    setTimeLeft(timerDuration || 60);
    setWpmData([]);
    typedTextLengthRef.current = 0;
    // Clear WPM data from localStorage when resetting
    try {
      localStorage.removeItem('lastWpmData');
    } catch (error) {
      console.error('Error clearing WPM data from localStorage:', error);
    }
  }, [timerDuration]);

  // Timer effect
  useEffect(() => {
    if (startTime && timeLeft > 0) {
      lastTickRef.current = performance.now();
      
      timerRef.current = setInterval(() => {
        const now = performance.now();
        const deltaTime = now - lastTickRef.current;
        lastTickRef.current = now;

        setTimeLeft((prevTime) => {
          const newTime = Math.max(0, prevTime - deltaTime / 1000);
          if (newTime <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            endTest();
            return 0;
          }
          return newTime;
        });
      }, 100); // Update more frequently

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [startTime, endTest, timeLeft]);

  // WPM tracking effect
  useEffect(() => {
    console.log('WPM tracking useEffect triggered:', { startTime, hasStartTime: !!startTime });
    
    if (startTime) {
      console.log('Starting WPM tracking interval');
      
      wpmTrackingRef.current = setInterval(() => {
        const timeElapsedInSeconds = (Date.now() - startTime) / 1000;
        // Use the latest typedText for WPM calculation
        const wordsTyped = typedTextRef.current.length / 5;
        const timeElapsedInMinutes = timeElapsedInSeconds / 60;
        const currentWpm = timeElapsedInMinutes > 0 ? Math.round(wordsTyped / timeElapsedInMinutes) : 0;
        const second = Math.floor(timeElapsedInSeconds);

        setWpmData(prev => {
          // Only append if this second is not already present
          if (prev.length > 0 && prev[prev.length - 1].second === second) return prev;
          const newData = [...prev, { second, wpm: currentWpm }];
          try {
            localStorage.setItem('lastWpmData', JSON.stringify(newData));
          } catch (error) {
            console.error('Error saving WPM data to localStorage:', error);
          }
          return newData;
        });
      }, 1000);

      return () => {
        console.log('Cleaning up WPM tracking interval');
        if (wpmTrackingRef.current) {
          clearInterval(wpmTrackingRef.current);
        }
      };
    } else {
      console.log('WPM tracking not started - no startTime');
    }
  }, [startTime]);

  // Update typedTextLengthRef when typedText changes
  useEffect(() => {
    typedTextLengthRef.current = typedText.length;
  }, [typedText]);

  // Load snippet effect
  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const newSnippet = await fetchSnippet(language || currentLanguage);
        setSnippet(newSnippet);
      } catch (error) {
        console.error('Error fetching snippet:', error);
      }
    };
    loadSnippet();
  }, [language, currentLanguage]);

  // Focus effect
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleTyping = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    e.preventDefault();

    if (!startTime && key.length === 1) {
      console.log('Test starting - setting startTime');
      setStartTime(Date.now());
      // Clear previous WPM data when starting a new test
      setWpmData([]);
      try {
        localStorage.removeItem('lastWpmData');
        console.log('Cleared previous WPM data from localStorage');
      } catch (error) {
        console.error('Error clearing WPM data from localStorage:', error);
      }
    }

    if (['Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
      return;
    }

    if (key === 'Backspace') {
      setTypedText(prev => prev.slice(0, -1));
    } else if (key === 'Enter') {
      setTypedText(prev => prev + '\n');
    } else if (key === 'Tab') {
      const currentPos = typedText.length;
      let nextNonSpacePos = currentPos;
      
      while (nextNonSpacePos < snippet.length && snippet[nextNonSpacePos] === ' ') {
        nextNonSpacePos++;
      }
      
      const spacesToAdd = snippet.slice(currentPos, nextNonSpacePos);
      setTypedText(prev => prev + spacesToAdd);
    } else if (key.length === 1) {
      setTypedText(prev => prev + key);
    }

    if (typedText.length >= snippet.length - 1) {
      endTest();
    }
  }, [startTime, typedText, snippet, endTest]);

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

  // Update timeLeft display with rounded value
  const displayTime = Math.ceil(timeLeft);

  // Update typedTextRef when typedText changes
  useEffect(() => {
    typedTextRef.current = typedText;
  }, [typedText]);

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
        <div className={styles.timer}>{displayTime}s</div>
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