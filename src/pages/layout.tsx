import React from 'react';
import {Sidebar} from "lucide-react";
import styles from '../css/Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

export default Layout;