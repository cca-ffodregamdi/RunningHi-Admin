'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../css/Index.module.css';
import Sidebar from '../components/Sidebar';
import appClient from '@/lib/appClient';
import challengeStyles from '../css/Challenge.module.css'
import CreateChallengeModal from '../components/CreateChallengeModal'


interface ApiResult<T> {
  timeStamp: string;
  status: string;
  message: string;
  data: T;
}

interface ChallengeData {
  challengeList: GetChallengeResponse[];
  challengeCount: number;
}

interface GetChallengeResponse {
  challengeNo: number;
  title: string;
  category: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: string;
  remainingTime: number;
  participantsCount: number;
}

type ChallengeStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';

const Challenge: React.FC = () => {
  const [challenges, setChallenges] = useState<GetChallengeResponse[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus>('IN_PROGRESS');
  const [selectedChallenge, setSelectedChallenge] = useState<GetChallengeResponse | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);



  const getChallengeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': '예정',
      'IN_PROGRESS': '진행중',
      'COMPLETED': '종료',
    };
    return statusMap[status] || status;
  };

  const fetchChallenges = useCallback(async (status: ChallengeStatus) => {
    try {
      const url = `/api/v1/challenges/status`;
      const params = new URLSearchParams({
        status: status,
      });

      const response = await appClient(`${url}?${params.toString()}`, { method: 'GET' });
      const data: ApiResult<ChallengeData> = await response.json();
      const { challengeList, challengeCount } = data.data;
      if (challengeList) {
        setChallenges(challengeList);
      } else {
        console.log('Invalid response data structure');
      }
    } catch (error) {
      console.error('challenge 가져오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchChallenges(selectedStatus);
  }, [fetchChallenges, selectedStatus]);

  const handleStatusChange = (status: ChallengeStatus) => {
    setSelectedStatus(status);
  };

  const handleChallengeClick = (challenge: GetChallengeResponse) => {
    setSelectedChallenge(challenge);
  };

  const handleAddChallenge = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveChallenge = async (formData: FormData) => {
    console.log(formData.get('endDate'))
    try {
      const response = await appClient('/api/v1/challenges', {
        method: 'POST',
        body: formData,
        headers: {
        },
      });

      if (response.ok) {
        alert('챌린지가 저장되었습니다.')
      } else {
        throw new Error('챌린지 저장에 실패했습니다.');
      }

      const savedChallenge = await response.json();
      setChallenges(prevChallenges => [...prevChallenges, savedChallenge]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert('챌린지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>챌린지 관리</h1>
          <div className={challengeStyles.filterContainer}>
            <button
              onClick={() => handleStatusChange('SCHEDULED')}
              className={`${challengeStyles.filterButton} ${selectedStatus === 'SCHEDULED' ? challengeStyles.activeFilter : ''}`}
            >
              예정
            </button>
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className={`${challengeStyles.filterButton} ${selectedStatus === 'IN_PROGRESS' ? challengeStyles.activeFilter : ''}`}
            >
              진행중
            </button>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className={`${challengeStyles.filterButton} ${selectedStatus === 'COMPLETED' ? challengeStyles.activeFilter : ''}`}
            >
              종료
            </button>
          </div>
          <div>
            <div className={challengeStyles.tableContainer}>
              <table className={challengeStyles.challengeTable}>
                <thead>
                  <tr>
                    <th className={challengeStyles.numberColumn}>번호</th>
                    <th className={challengeStyles.titleColumn}>제목</th>
                    <th className={challengeStyles.categoryColumn}>카테고리</th>
                    <th className={challengeStyles.dateColumn}>시작일</th>
                    <th className={challengeStyles.dateColumn}>종료일</th>
                    <th className={challengeStyles.statusColumn}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.length > 0 ? (
                    challenges.map(challenge => (
                      <tr key={challenge.challengeNo} onClick={() => handleChallengeClick(challenge)} className={challengeStyles.clickableRow}>
                        <td className={challengeStyles.numberColumn}>{challenge.challengeNo}</td>
                        <td className={challengeStyles.titleColumn}>{challenge.title}</td>
                        <td className={challengeStyles.categoryColumn}>{challenge.category}</td>
                        <td className={challengeStyles.dateColumn}>{new Date(challenge.startDate).toLocaleDateString()}</td>
                        <td className={challengeStyles.dateColumn}>{new Date(challenge.endDate).toLocaleDateString()}</td>
                        <td className={challengeStyles.statusColumn}>{getChallengeStatus(challenge.status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>챌린지가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className={challengeStyles.addButtonContainer}>
            <button className={challengeStyles.addButton} onClick={handleAddChallenge}>
              챌린지 추가
            </button>
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <CreateChallengeModal onClose={handleCloseModal} onSave={handleSaveChallenge} />
      )}
    </div>
  );
};

export default Challenge;