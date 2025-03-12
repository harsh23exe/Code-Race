import React, { ReactNode } from 'react';
import '../styles/globals.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
      <div className="container">
      {children}
    </div>
      </body>
    </html>
   
  );
};

export default Layout;