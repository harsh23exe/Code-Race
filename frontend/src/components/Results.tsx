"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../styles/Results.module.css';

const Results: React.FC = () => {
  const searchParams = useSearchParams();
  const speed = searchParams ? searchParams.get('speed') : null;
  const [results, setResults] = useState<{ speed: number; timestamp: string }[]>([]);

  useEffect(() => {
    // Retrieve results from local storage
    const storedResults = JSON.parse(localStorage.getItem('typingResults') || '[]');
    setResults(storedResults);
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
        label: 'Typing Speed (WPM)',
        data: results.map(result => result.speed),
        fill: false,
        backgroundColor: 'rgba(122, 255, 122, 0.4)',
        borderColor: '#7aff7a',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: '#333'
        },
        ticks: {
          color: '#666',
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
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
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            return new Date(results[index].timestamp).toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Results</h1>
      <p>Your typing speed is {speed} words per minute.</p>
      <div className={styles.graphContainer}>
        <div className={styles.chart}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Results;