"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/TypingTest.module.css';

const TypingTest: React.FC = () => {
  const [snippet, setSnippet] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams ? searchParams.get('language') : null;

  useEffect(() => {
    if (language) {
      fetch(`/typing-test/snippet?language=${language}`)
        .then((response) => response.json())
        .then((data) => setSnippet(data.snippet));
    }
  }, [language]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setTypedText(e.target.value);
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - (startTime || 0)) / 1000; // in seconds
    const wordsTyped = typedText.split(' ').length;
    const typingSpeed = (wordsTyped / timeTaken) * 60; // words per minute

    router.push(`/results?speed=${typingSpeed}`);
  };

  const renderSnippet = () => {
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
    <div className={styles.container}>
      <h1>Typing Test</h1>
      <div className={styles.snippet}>{renderSnippet()}</div>
      <textarea
        className={styles.textarea}
        value={typedText}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            setTypedText(typedText.slice(0, -1));
          }
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TypingTest;