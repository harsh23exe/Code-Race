"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSnippet } from '../utils/api';
import styles from '../styles/TypingTest.module.css';

const TypingTest: React.FC = () => {
  const [snippet, setSnippet] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
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
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - (startTime || 0)) / 1000; // in seconds
    const wordsTyped = typedText.split(' ').length;
    const typingSpeed = (wordsTyped / timeTaken) * 60; // words per minute

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

  return (
    <div
      className={styles.container}
      onKeyDown={handleTyping}
      tabIndex={0}
      ref={containerRef}
    >
      <h1>Typing Test</h1>
      <div className={styles.snippet}>{renderSnippet()}</div>
      <button className={styles.button} onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TypingTest;