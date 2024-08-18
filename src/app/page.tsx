'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../css/Home.module.css';

const Home: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTokenValidity = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                router.push('/auth');
                return;
            }

            try {
                const response = await axios.get('/api/v1/member/id', {
                    headers: {
                        Authorization: accessToken,
                    },
                });

                console.log(response.data);
                setLoading(false);
                router.push('/main')
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                router.push('/auth');
            }
        };

        checkTokenValidity();
    }, [router]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className={styles.homeContainer}>
            <h1>러닝하이 관리자 대시보드에 오신 것을 환영합니다</h1>
            <p>애플리케이션, 회원 관리와 모니터링을 위한 대시보드입니다.</p>
        </div>
    );
};

export default Home;