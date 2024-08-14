'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
        return <div>Loading...</div>;
    }

    return <div>Welcome to the Home Page!</div>;
};

export default Home;
