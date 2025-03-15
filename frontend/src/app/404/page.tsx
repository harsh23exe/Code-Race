"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Custom404: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return null;
};

export default Custom404;