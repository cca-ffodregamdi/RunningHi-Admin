"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    { name: 'main', icon: mainIcon, iconSelected: mainIconSelected, alt: '메인', width: 45, height: 45 },
    { name: 'report', icon: reportIcon, iconSelected: reportIconSelected, alt: '신고 관리', width: 45, height: 45 },
    { name: 'feedback', icon: feedbackIcon, iconSelected: feedbackIconSelected, alt: '피드백 / QnA', width: 60, height: 40 },
    { name: 'challenge', icon: challengeIcon, iconSelected: challengeIconSelected, alt: '챌린지', width: 30, height: 45 },
    { name: 'notification', icon: notificationIcon, iconSelected: notificationIconSelected, alt: '알림', width: 28, height: 45 },
    { name: 'announcement', icon: announcementIcon, iconSelected: announcementIconSelected, alt: '공지사항', width: 40, height: 40 },
];

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const currentPath = window.location.pathname.split('/')[1];
        setActiveItem(currentPath);
    }, []);

    const handleNavigation = (path: string) => {
        setActiveItem(path);
        router.push(`/${path}`);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <Image src={logoIcon} alt="Logo" width={60} height={60} />
            </div>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            className={`${styles.navItem} ${activeItem === item.name ? styles.active : ''}`}
                        >
                            <button
                                className={styles.navLink}
                                onClick={() => handleNavigation(item.name)}
                                aria-label={item.alt}
                            >
                                <Image
                                    src={activeItem === item.name ? item.iconSelected : item.icon}
                                    alt={item.alt}
                                    width={item.width}
                                    height={item.height}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.profile}>
                <Image src={profileIcon} alt="Profile" width={30} height={30} />
                <span>M_이효진</span>
            </div>
        </div>
    );
};


export default Sidebar;