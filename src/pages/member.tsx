'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBan, FaCheck } from 'react-icons/fa'; // Import icons
import styles from '../css/Index.module.css'; // Importing the index.module.css
import memberStyles from '../css/Member.module.css';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import appClient from '@/lib/appClient';

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
    const [members, setMembers] = useState<Member[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [blacklistFilter, setBlacklistFilter] = useState<boolean | null>(null); // State for blacklist filter
    const membersPerPage = 10;

    const fetchMembers = useCallback(async (page: number) => {
        try {
            const url = `/api/v1/members`;
            const params = new URLSearchParams({
                page: page.toString(),
                size: membersPerPage.toString(),
            });

            const response = await appClient(`${url}?${params.toString()}`, { method: 'GET' });
            const data = await response.json();
            if (Array.isArray(data.content)) {
                setMembers(data.content);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                console.error('Expected an array of members, but received:', data);
                setMembers([]);
            }
        } catch (error) {
            console.error('회원 가져오기 에러:', error);
            setMembers([]);
        }
    }, [membersPerPage]);

    useEffect(() => {
        fetchMembers(currentPage);
    }, [currentPage, fetchMembers]);

    const toggleBlacklist = async (memberId: string) => {
        setMembers(members.map(member =>
            member.id === memberId
                ? { ...member, isBlacklisted: !member.isBlacklisted }
                : member
        ));

        await appClient(`/api/v1/members/${memberId}/blacklist`, {
            method: 'POST',
            body: JSON.stringify({ isBlacklisted: !members.find(m => m.id === memberId)?.isBlacklisted }),
            headers: { 'Content-Type': 'application/json' }
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const handleFilterChange = (filter: boolean | null) => {
        setBlacklistFilter(filter);
        setCurrentPage(1);
    };

    const filteredMembers = members.filter(member =>
        (blacklistFilter === null || member.isBlacklisted === blacklistFilter) &&
        (member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalFilteredPages = Math.ceil(filteredMembers.length / membersPerPage);

    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <h1 className={styles.title}>회원 관리</h1>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${blacklistFilter === null ? styles.activeTab : ''}`}
                            onClick={() => handleFilterChange(null)}
                        >
                            전체 회원
                        </button>
                        <button
                            className={`${styles.tabButton} ${blacklistFilter === false ? styles.activeTab : ''}`}
                            onClick={() => handleFilterChange(false)}
                        >
                            일반 회원
                        </button>
                        <button
                            className={`${styles.tabButton} ${blacklistFilter === true ? styles.activeTab : ''}`}
                            onClick={() => handleFilterChange(true)}
                        >
                            블랙리스트 회원
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
                                <th className={memberStyles.numberColumn}>ID</th>
                                <th className={memberStyles.nicknameColumn}>닉네임</th>
                                <th className={memberStyles.levelColumn}>레벨</th>
                                <th className={memberStyles.nameColumn}>이름</th>
                                <th className={memberStyles.reportColumn}>신고 횟수</th>
                                <th className={memberStyles.statusColumn}>상태</th>
                                <th className={memberStyles.blacklistColumn}>블랙리스트</th>
                                <th className={memberStyles.actionColumn}>작업</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentMembers.length > 0 ? (
                                currentMembers.map(member => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8}>해당 조건의 회원이 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalFilteredPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Member;