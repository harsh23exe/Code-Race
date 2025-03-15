"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../styles/Results.module.css';

const Results: React.FC = () => {
  const [results, setResults] = useState<{ 
    speed: number; 
    accuracy: number;
    timestamp: string;
  }[]>([]);
  const [lastSpeed, setLastSpeed] = useState<number>(0);
  const [lastAccuracy, setLastAccuracy] = useState<number>(0);

  useEffect(() => {
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
        fill: false,
        borderColor: '#7aff7a',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Accuracy %',
        data: results.map(result => result.accuracy),
        fill: false,
        borderColor: '#ff7a7a',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: '#333'
        },
        ticks: {
          color: '#7aff7a'
        }
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
        ticks: {
          color: '#ff7a7a',
          stepSize: 20 // This will show ticks at 0, 20, 40, 60, 80, 100
        }
      },
      x: {
        grid: {
          color: '#333'
        },
        ticks: {
          color: '#666'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#666'
        }
      }
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
        <div className={styles.chart}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Results;