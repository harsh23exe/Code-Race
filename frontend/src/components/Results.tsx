"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Results: React.FC = () => {
  const searchParams = useSearchParams();
  const speed = searchParams ? searchParams.get('speed') : null;
  const [results, setResults] = useState<{ speed: number; timestamp: string }[]>([]);

  useEffect(() => {
    // Retrieve results from local storage
    const storedResults = JSON.parse(localStorage.getItem('typingResults') || '[]');
    setResults(storedResults);
  }, []);

  const data = {
    labels: results.map((result) => new Date(result.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Typing Speed (WPM)',
        data: results.map((result) => result.speed),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div>
      <h1>Results</h1>
      <p>Your typing speed is {speed} words per minute.</p>
      <h2>Typing Speed Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export default Results;