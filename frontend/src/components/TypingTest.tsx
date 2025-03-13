"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSnippet } from '../utils/api';
import styles from '../styles/TypingTest.module.css';

const TypingTest: React.FC = () => {
  const [snippet, setSnippet] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
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
    if (startTime) {
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
    if (!startTime) {
      setStartTime(Date.now());
    }
    const { key } = e;
    if (key === 'Backspace') {
      setTypedText(typedText.slice(0, -1));
    } else if (key.length === 1) {
      setTypedText(typedText + key);
    }
    console.log('Typed text:', typedText);

    if (typedText.length === snippet.length - 1) {
      endTest();
    }
  };

  const endTest = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - (startTime || 0)) / 1000; // in seconds
    const wordsTyped = typedText.split(' ').length;
    const typingSpeed = (wordsTyped / timeTaken) * 60; // words per minute

    // Store the result in local storage
    const results = JSON.parse(localStorage.getItem('typingResults') || '[]');
    results.push({ speed: typingSpeed, timestamp: new Date().toISOString() });
    localStorage.setItem('typingResults', JSON.stringify(results));

    router.push(`/results?speed=${typingSpeed}`);
  };

  const renderSnippet = () => {
    console.log('Rendering snippet:', snippet);
    return snippet.split('').map((char, index) => {
      let className = '';
      if (index < typedText.length) {
        className = char === typedText[index] ? styles.correct : styles.incorrect;
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const renderClock = () => {
    const rotation = (360 * (60 - timeLeft)) / 60;
    return (
      <div className={styles.clock}>
        <div className={styles.hand} style={{ transform: `rotate(${rotation}deg)` }} />
      </div>
    );
  };

  return (
    <div
      className={styles.container}
      onKeyDown={handleTyping}
      tabIndex={0}
      ref={containerRef}
    >
      <h1>Typing Test</h1>
      {renderClock()}
      <div className={styles.snippet}>{renderSnippet()}</div>
    </div>
  );
};

export default TypingTest;