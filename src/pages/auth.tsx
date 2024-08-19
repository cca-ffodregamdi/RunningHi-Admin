import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../css/Auth.module.css';
import SHA256 from 'crypto-js/sha256';

const Auth: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [loginData, setLoginData] = useState({ account: '', password: '' });
    const [signupData, setSignupData] = useState({ account: '', password: '', inviteCode: '' });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));
    };

    const hashPassword = (password: string) => {
        return SHA256(password).toString();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const hashedPassword = hashPassword(loginData.password);
            const response = await axios.put('/api/v1/sign-in/admin', {
                ...loginData,
                password: hashedPassword
            });

            const accessToken = response.headers['authorization'];
            const refreshToken = response.headers['refresh-token'];

            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                console.log('Access Token:', localStorage.getItem('accessToken'));
                console.log('Refresh Token:', localStorage.getItem('refreshToken'));

                router.push('/');
            }
        } catch (err) {
            setError('로그인 실패. 사용자 이름이나 비밀번호를 확인하세요.');
            console.error(err);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const hashedPassword = hashPassword(signupData.password);
            await axios.post('/api/v1/sign-up/admin', {
                ...signupData,
                password: hashedPassword
            });
            setActiveTab('login');
        } catch (err) {
            setError('회원가입 실패. 이미 존재하는 사용자 이름일 수 있습니다.');
            console.error(err);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.tabs}>
                <button
                    className={activeTab === 'login' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('login')}
                >
                    로그인
                </button>
                <button
                    className={activeTab === 'signup' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('signup')}
                >
                    회원가입
                </button>
            </div>

            {activeTab === 'login' && (
                <form className={styles.form} onSubmit={handleLogin}>
                    <h2>로그인</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <input
                        type="text"
                        name="account"
                        value={loginData.account}
                        onChange={handleLoginChange}
                        placeholder="아이디"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="비밀번호"
                        required
                    />
                    <button type="submit">로그인</button>
                </form>
            )}

            {activeTab === 'signup' && (
                <form className={styles.form} onSubmit={handleSignup}>
                    <h2>회원가입</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <input
                        type="text"
                        name="account"
                        value={signupData.account}
                        onChange={handleSignupChange}
                        placeholder="아이디"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="비밀번호"
                        required
                    />
                    <input
                        type="text"
                        name="inviteCode"
                        value={signupData.inviteCode}
                        onChange={handleSignupChange}
                        placeholder="초대 코드"
                        required
                    />
                    <button type="submit">회원가입</button>
                </form>
            )}
        </div>
    );
};

export default Auth;