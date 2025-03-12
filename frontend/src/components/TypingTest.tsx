"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

  return (
    <div>
      <h1>Typing Test</h1>
      <pre>{snippet}</pre>
      <textarea value={typedText} onChange={handleTyping} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TypingTest;