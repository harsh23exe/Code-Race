import React from 'react';
import { useRouter } from 'next/router';

const Results: React.FC = () => {
  const router = useRouter();
  const { speed } = router.query;

  return (
    <div>
      <h1>Results</h1>
      <p>Your typing speed is {speed} words per minute.</p>
    </div>
  );
};

export default Results;