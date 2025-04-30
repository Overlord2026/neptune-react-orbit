
import React, { ReactNode } from 'react';
import DashboardLayout from './DashboardLayout';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component that wraps the application content
 * in the DashboardLayout for consistent UI across apps
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default MainLayout;
