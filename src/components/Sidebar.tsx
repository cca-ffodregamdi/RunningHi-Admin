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

const navItems = [
  { name: 'main', icon: mainIcon, iconSelected: mainIconSelected, alt: '메인', width: 55, height: 55 },
  { name: 'report', icon: reportIcon, iconSelected: reportIconSelected, alt: '신고 관리', width: 55, height: 55 },
  { name: 'feedback', icon: feedbackIcon, iconSelected: feedbackIconSelected, alt: '피드백 / QnA', width: 76, height: 50 },
  { name: 'challenge', icon: challengeIcon, iconSelected: challengeIconSelected, alt: '챌린지', width: 37, height: 52 },
  { name: 'notification', icon: notificationIcon, iconSelected: notificationIconSelected, alt: '알림', width: 35, height: 55 },
  { name: 'announcement', icon: announcementIcon, iconSelected: announcementIconSelected, alt: '공지사항', width: 50, height: 50 },
];

const Sidebar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src={logoIcon} alt="Logo" width={95} height={95} />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li
              key={item.name}
              className={`${styles.navItem} ${hoveredItem === item.name ? styles.hovered : ''}`}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a href={item.name} className={styles.navLink}>
                <Image
                  src={hoveredItem === item.name ? item.iconSelected : item.icon}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                />
              </a>
            </li>
          ))}
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
