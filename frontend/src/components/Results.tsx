"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Results.module.css';

// First import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Then dynamically import the Line component
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { 
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

const Results: React.FC = () => {
  const [results, setResults] = useState<{ 
    speed: number; 
    accuracy: number;
    timestamp: string;
  }[]>([]);
  const [lastSpeed, setLastSpeed] = useState<number>(0);
  const [lastAccuracy, setLastAccuracy] = useState<number>(0);

  useEffect(() => {
    // Move data fetching to client side
    const storedResults = JSON.parse(localStorage.getItem('typingResults') || '[]');
    const storedSpeed = parseInt(localStorage.getItem('lastSpeed') || '0');
    const storedAccuracy = parseInt(localStorage.getItem('lastAccuracy') || '0');
    setResults(storedResults);
    setLastSpeed(storedSpeed);
    setLastAccuracy(storedAccuracy);
  }, []);

  const formatTimeLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}w ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months}m ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years}y ago`;
    }
  };

  const data = {
    labels: results.map(result => formatTimeLabel(result.timestamp)),
    datasets: [
      {
        label: 'WPM',
        data: results.map(result => result.speed),
        borderColor: '#7aff7a',
        backgroundColor: '#7aff7a',
        tension: 0,
        yAxisID: 'y'
      },
      {
        label: 'Accuracy %',
        data: results.map(result => result.accuracy),
        borderColor: '#ff7a7a',
        backgroundColor: '#ff7a7a',
        tension: 0,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{lastSpeed}</div>
          <div className={styles.statLabel}>WPM</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{lastAccuracy}%</div>
          <div className={styles.statLabel}>Accuracy</div>
        </div>
      </div>
      <div className={styles.graphContainer}>
        {results.length > 0 && (
          <div className={styles.chart}>
            <Line data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;