import React, { ReactNode } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import OptionsBar from '../components/OptionsBar';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <Navbar />
        <OptionsBar />
        <main className={styles.container}>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;