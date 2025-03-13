"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLanguages } from '../../utils/api';
import styles from '../../styles/Home.module.css';

const HomePage: React.FC = () => {
  const [languages, setLanguages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesList = await fetchLanguages();
        setLanguages(languagesList);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    loadLanguages();
  }, []);

  const handleLanguageClick = (language: string) => {
    router.push(`/typing-test?language=${language}`);
  };

  return (
    <div className={styles.container}>
      <h2>Select a Language</h2>
      <div className={styles.tiles}>
        {languages.map((language) => (
          <div
            key={language}
            className={styles.tile}
            onClick={() => handleLanguageClick(language)}
          >
            {language}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;