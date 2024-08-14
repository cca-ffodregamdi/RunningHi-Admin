import React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/useAuthStore';

const LogoutButton: React.FC = () => {
    const { clearTokens } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        clearTokens();
        router.push('/login');
    };

    return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
