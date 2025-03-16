"use client";

import React, { Suspense } from 'react';
import TypingTest from '../../components/TypingTest';
import Loading from '../../components/Loading';

export default function TypingTestPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TypingTest />
    </Suspense>
  );
}