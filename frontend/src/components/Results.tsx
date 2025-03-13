"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';

const Results: React.FC = () => {
  const searchParams = useSearchParams();
  const speed = searchParams ? searchParams.get('speed') : null;

  return (
    <div>
      <h1>Results</h1>
      <p>Your typing speed is {speed} words per minute.</p>
    </div>
  );
};

export default Results;