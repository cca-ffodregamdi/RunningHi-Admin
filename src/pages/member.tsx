'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaBan, FaCheck } from 'react-icons/fa'; // Import icons
import memberStyles from '../css/Member.module.css';
import styles from '../css/Index.module.css';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import appClient from "@/lib/appClient";

interface Member {
    id: string;
    nickname: string;
    level: number;
    name: string;
    isBlacklisted: boolean;
    reportCnt: number;
    isActive: boolean;
}

const Member: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [members, setMembers] = useState<Member[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const membersPerPage = 10;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await appClient('/api/members', {
                    method: 'GET',
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setMembers(data);
                } else {
                    console.error('Expected an array of members, but received:', data);
                    setMembers([]);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
                setMembers([]);
            }
        };

        fetchMembers();
    }, []);

    const toggleBlacklist = async (memberId: string) => {
        setMembers(members.map(member =>
            member.id === memberId
                ? { ...member, isBlacklisted: !member.isBlacklisted }
                : member
        ));

        await appClient(`/api/members/${memberId}/blacklist`, {
            method: 'POST',
            body: JSON.stringify({ isBlacklisted: !members.find(m => m.id === memberId)?.isBlacklisted }),
            headers: { 'Content-Type': 'application/json' }
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 여기에 검색 로직 추가. 현재는 필터링만 수행합니다.
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const filteredMembers = members.filter(member =>
        (activeTab === 'all' || (activeTab === 'blacklist' && member.isBlacklisted)) &&
        (member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    return (
        <div className={memberStyles.container}>
            <Sidebar />
            <div className={memberStyles.main}>
                <h1 className={memberStyles.title}>회원 관리</h1>
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        전체 회원
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'blacklist' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('blacklist')}
                    >
                        블랙리스트
                    </button>
                </div>
                <form onSubmit={handleSearch} className={memberStyles.searchContainer}>
                    <input
                        type="text"
                        className={memberStyles.searchInput}
                        placeholder="닉네임 또는 이름으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className={memberStyles.searchIcon}>
                        <FaSearch />
                    </button>
                </form>
                <div className={styles.tableContainer}>
                    <table className={memberStyles.memberTable}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>닉네임</th>
                            <th>레벨</th>
                            <th>이름</th>
                            <th>신고 횟수</th>
                            <th>상태</th>
                            <th>블랙리스트</th>
                            <th>작업</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentMembers.map(member => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.nickname}</td>
                                <td>{member.level}</td>
                                <td>{member.name}</td>
                                <td>{member.reportCnt}</td>
                                <td>{member.isActive ? '활성' : '비활성'}</td>
                                <td>
                                    {member.isBlacklisted ? (
                                        <FaBan className={memberStyles.iconDanger} />
                                    ) : (
                                        <FaCheck className={memberStyles.iconSuccess} />
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={member.isBlacklisted ? memberStyles.buttonDanger : memberStyles.button}
                                        onClick={() => toggleBlacklist(member.id)}
                                    >
                                        {member.isBlacklisted ? '블랙리스트 해제' : '블랙리스트 등록'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Member;