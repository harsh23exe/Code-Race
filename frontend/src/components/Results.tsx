"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Results.module.css';

// Import Chart.js components
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

// Dynamically import Line component
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { 
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

interface WpmDataPoint {
  second: number;
  wpm: number;
}

interface TestResult {
  speed: number;
  accuracy: number;
  timestamp: string;
}

const Results: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [wpmData, setWpmData] = useState<WpmDataPoint[]>([]);

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

  useEffect(() => {
    try {
      const storedResults = JSON.parse(localStorage.getItem('typingResults') || '[]');
      const storedWpmData = JSON.parse(localStorage.getItem('lastWpmData') || '[]');
      
      console.log('Raw stored WPM data:', storedWpmData);
      console.log('Raw stored results:', storedResults);
      
      // Validate data with more strict checks
      const validResults = Array.isArray(storedResults) 
        ? storedResults.filter(result => 
            result && 
            typeof result === 'object' &&
            typeof result.speed === 'number' && 
            !isNaN(result.speed) &&
            typeof result.accuracy === 'number' && 
            !isNaN(result.accuracy) &&
            typeof result.timestamp === 'string' &&
            result.timestamp.length > 0
          )
        : [];
      
      const validWpmData = Array.isArray(storedWpmData)
        ? storedWpmData.filter(point => 
            point && 
            typeof point === 'object' &&
            typeof point.second === 'number' && 
            !isNaN(point.second) &&
            typeof point.wpm === 'number' && 
            !isNaN(point.wpm)
          )
        : [];
      
      console.log('Valid results:', validResults);
      console.log('Valid WPM data:', validWpmData);
      console.log('WPM data length:', validWpmData.length);
      
      setResults(validResults);
      setWpmData(validWpmData);
    } catch (error) {
      console.error('Error loading results data:', error);
      setResults([]);
      setWpmData([]);
    }
  }, []);

  // Check if current test was recent (within last 5 minutes)
  const isCurrentTestRecent = () => {
    if (wpmData.length === 0) return false;
    
    try {
      const lastWpmData = wpmData[wpmData.length - 1];
      if (!lastWpmData || typeof lastWpmData.second !== 'number') return false;
      
      // Always return true if we have valid WPM data (show previous test data)
      return true;
    } catch (error) {
      console.error('Error checking if test is recent:', error);
      return false;
    }
  };

  // Graph 1: Current test speed over time
  const currentTestData = {
    labels: wpmData
      .filter(point => point && typeof point === 'object' && typeof point.second === 'number' && !isNaN(point.second))
      .map(point => `${point.second}s`),
    datasets: [
      {
        label: 'WPM',
        data: wpmData
          .filter(point => point && typeof point === 'object' && typeof point.wpm === 'number' && !isNaN(point.wpm))
          .map(point => point.wpm),
        borderColor: '#7aff7a',
        backgroundColor: 'rgba(122, 255, 122, 0.1)',
        tension: 0, // Disable tension completely to avoid errors
        fill: false,
        pointBackgroundColor: '#7aff7a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  const currentTestOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Previous Test Speed Over Time',
        color: '#f8f8f2',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (seconds)',
          color: '#f8f8f2'
        },
        ticks: { color: '#f8f8f2' },
        grid: { color: 'rgba(248, 248, 242, 0.1)' }
      },
      y: {
        title: {
          display: true,
          text: 'Words Per Minute',
          color: '#f8f8f2'
        },
        ticks: { color: '#f8f8f2' },
        grid: { color: 'rgba(248, 248, 242, 0.1)' }
      }
    }
  };

  // Graph 2: Overall accuracy over all tests
  const overallAccuracyData = {
    labels: results
      .filter(result => result && typeof result === 'object' && typeof result.timestamp === 'string' && result.timestamp.length > 0)
      .map(result => formatTimeLabel(result.timestamp)),
    datasets: [
      {
        label: 'Accuracy %',
        data: results
          .filter(result => result && typeof result === 'object' && typeof result.accuracy === 'number' && !isNaN(result.accuracy))
          .map(result => result.accuracy),
        borderColor: '#ff7a7a',
        backgroundColor: 'rgba(255, 122, 122, 0.1)',
        tension: 0, // Disable tension completely to avoid errors
        fill: false,
        pointBackgroundColor: '#ff7a7a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 2,
      }
    ]
  };

  const overallAccuracyOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Overall Accuracy Over All Tests',
        color: '#f8f8f2',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#f8f8f2'
        },
        ticks: { color: '#f8f8f2' },
        grid: { color: 'rgba(248, 248, 242, 0.1)' }
      },
      y: {
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: '#f8f8f2'
        },
        ticks: { 
          color: '#f8f8f2',
          callback: function(value: string | number) {
            return value + '%';
          }
        },
        grid: { color: 'rgba(248, 248, 242, 0.1)' },
        min: 0,
        max: 100
      }
    }
  };

  // Graph 3: Overall speed over all tests
  const overallSpeedData = {
    labels: results
      .filter(result => result && typeof result === 'object' && typeof result.timestamp === 'string' && result.timestamp.length > 0)
      .map(result => formatTimeLabel(result.timestamp)),
    datasets: [
      {
        label: 'WPM',
        data: results
          .filter(result => result && typeof result === 'object' && typeof result.speed === 'number' && !isNaN(result.speed))
          .map(result => result.speed),
        borderColor: '#7aff7a',
        backgroundColor: 'rgba(122, 255, 122, 0.1)',
        tension: 0, // Disable tension completely to avoid errors
        fill: false,
        pointBackgroundColor: '#7aff7a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  const overallSpeedOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Overall Speed Over All Tests',
        color: '#f8f8f2',
        font: { size: 16, weight: 'bold' as const }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#f8f8f2'
        },
        ticks: { color: '#f8f8f2' },
        grid: { color: 'rgba(248, 248, 242, 0.1)' }
      },
      y: {
        title: {
          display: true,
          text: 'Words Per Minute',
          color: '#f8f8f2'
        },
        ticks: { color: '#f8f8f2' },
        grid: { color: 'rgba(248, 248, 242, 0.1)' }
      }
    }
  };

  // --- Stats summary ---
  const averageWpm = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.speed, 0) / results.length) : 0;
  const averageAccuracy = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length) : 0;
  const bestWpm = results.length > 0 ? Math.max(...results.map(r => r.speed)) : 0;
  const bestAccuracy = results.length > 0 ? Math.max(...results.map(r => r.accuracy)) : 0;
  const lastWpm = results.length > 0 ? results[results.length - 1].speed : 0;
  const lastAccuracy = results.length > 0 ? results[results.length - 1].accuracy : 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Results</h1>
      {/* Stats summary row */}
      {results.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{averageWpm}</div>
            <div className={styles.statLabel}>Avg WPM</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{averageAccuracy}%</div>
            <div className={styles.statLabel}>Avg Accuracy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{bestWpm}</div>
            <div className={styles.statLabel}>Best WPM</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{bestAccuracy}%</div>
            <div className={styles.statLabel}>Best Accuracy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{lastWpm}</div>
            <div className={styles.statLabel}>Last WPM</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{lastAccuracy}%</div>
            <div className={styles.statLabel}>Last Accuracy</div>
          </div>
        </div>
      )}
      {/* Previous Test Graph on top */}
      {isCurrentTestRecent() && wpmData.length > 0 && wpmData.filter(point => point && typeof point === 'object' && typeof point.wpm === 'number' && !isNaN(point.wpm)).length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>WPM vs Time (Current Test)</h2>
          <div className={styles.chartContainer}>
            {(() => {
              try {
                return <Line data={currentTestData} options={currentTestOptions} />;
              } catch (error) {
                console.error('Error rendering current test chart:', error);
                return <div>Error loading chart</div>;
              }
            })()}
          </div>
        </section>
      )}
      {/* Bottom row: Average WPM and Accuracy side by side */}
      <div className={styles.chartsGridRow}>
        {/* Graph 2: Overall WPM over all tests */}
        {results.length > 0 && results.filter(result => result && typeof result === 'object' && typeof result.speed === 'number' && !isNaN(result.speed)).length > 0 && (
          <section className={styles.section + ' ' + styles.chartsGridCol}>
            <h2 className={styles.sectionTitle}>Average WPM (All Tests)</h2>
            <div className={styles.chartContainer}>
              {(() => {
                try {
                  return <Line data={overallSpeedData} options={overallSpeedOptions} />;
                } catch (error) {
                  console.error('Error rendering speed chart:', error);
                  return <div>Error loading chart</div>;
                }
              })()}
            </div>
          </section>
        )}
        {/* Graph 3: Overall accuracy over all tests */}
        {results.length > 0 && results.filter(result => result && typeof result === 'object' && typeof result.accuracy === 'number' && !isNaN(result.accuracy)).length > 0 && (
          <section className={styles.section + ' ' + styles.chartsGridCol}>
            <h2 className={styles.sectionTitle}>Average Accuracy (All Tests)</h2>
            <div className={styles.chartContainer}>
              {(() => {
                try {
                  return <Line data={overallAccuracyData} options={overallAccuracyOptions} />;
                } catch (error) {
                  console.error('Error rendering accuracy chart:', error);
                  return <div>Error loading chart</div>;
                }
              })()}
            </div>
          </section>
        )}
      </div>
      {/* No data message */}
      {results.length === 0 && (
        <section className={styles.section}>
          <div className={styles.noData}>
            <p>No test results found. Complete a typing test to see your performance data.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Results;