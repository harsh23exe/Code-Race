"use client";

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/home" className={styles.logo}>
          Code Race
        </Link>
        <div className={styles.links}>
          <Link href="/home" className={styles.link}>
            Home
          </Link>
          <Link href="/typing-test" className={styles.link}>
            Typing Test
          </Link>
          <Link href="/results" className={styles.link}>
            Results
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;