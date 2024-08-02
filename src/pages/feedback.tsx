import React from 'react';
import styles from '../css/Index.module.css';
import Sidebar from '../components/Sidebar';

const Feedback: React.FC = () => {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          {/* Add your main content here */}
        </div>
      </div>
    );
  };
export default Feedback;