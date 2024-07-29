"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../css/Sidebar.module.css';
import logoIcon from '../icon/logo.png';
import mainIcon from '../icon/main.png';
import mainIconSelected from '../icon/main-select.png';
import reportIcon from '../icon/report.png';
import reportIconSelected from '../icon/report-select.png';
import feedbackIcon from '../icon/feedback.png';
import feedbackIconSelected from '../icon/feedback-select.png';
import challengeIcon from '../icon/challenge.png';
import challengeIconSelected from '../icon/challenge-select.png';
import notificationIcon from '../icon/notification.png';
import notificationIconSelected from '../icon/notification-select.png';
import announcementIcon from '../icon/announcement.png';
import announcementIconSelected from '../icon/announcement-select.png';
import profileIcon from '../icon/profile.png';

const Sidebar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src={logoIcon} alt="Logo" width={95} height={95} />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('main')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="main" className={styles.navLink}>
              <Image
                src={hoveredItem === 'main' ? mainIconSelected : mainIcon}
                alt="메인"
                width={55}
                height={55}
              />
            </a>
          </li>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('report')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="report" className={styles.navLink}>
              <Image
                src={hoveredItem === 'report' ? reportIconSelected : reportIcon}
                alt="신고 관리"
                width={55}
                height={55}
              />
            </a>
          </li>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('feedback')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="feedback" className={styles.navLink}>
              <Image
                src={hoveredItem === 'feedback' ? feedbackIconSelected : feedbackIcon}
                alt="피드백 / QnA"
                width={76}
                height={50}
              />
            </a>
          </li>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('challenge')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="challenge" className={styles.navLink}>
              <Image
                src={hoveredItem === 'challenge' ? challengeIconSelected : challengeIcon}
                alt="챌린지"
                width={37}
                height={52}
              />
            </a>
          </li>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('notification')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="notification" className={styles.navLink}>
              <Image
                src={hoveredItem === 'notification' ? notificationIconSelected : notificationIcon}
                alt="알림"
                width={35}
                height={55}
              />
            </a>
          </li>
          <li
            className={styles.navItem}
            onMouseEnter={() => setHoveredItem('announcement')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <a href="announcement" className={styles.navLink}>
              <Image
                src={hoveredItem === 'announcement' ? announcementIconSelected : announcementIcon}
                alt="공지사항"
                width={50}
                height={50}
              />
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.profile}>
        <Image src={profileIcon} alt="Profile" width={50} height={50} />
        <span>M_이효진</span>
      </div>
    </div>
  );
};

export default Sidebar;
