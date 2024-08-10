'use client';

import React, { useState, useEffect } from 'react';
import styles from '../css/Index.module.css';
import Sidebar from '../components/Sidebar';
import apiClient from '../lib/axios';
import axios from "axios";

interface ApiResult<T> {
    timeStamp: string;
    status: string;
    message: string;
    data: T;
}

interface GetFeedbackResponse {
    feedbackNo: number;
    title: string;
    content: string;
    category: string;
    createDate: string;
    updateDate: string;
    hasReply: boolean;
    reply: string | null;
    nickname: string;
}

interface FeedbackPageResponse {
    content: GetFeedbackResponse[];
    currentPage: number;
    totalPages: number;
}

const Feedback: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<GetFeedbackResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchFeedbacks(currentPage);
    }, [currentPage]);

    const fetchFeedbacks = async (page: number) => {
        try {
            const url = `/api/v1/feedbacks/admin`;
            console.log('Fetching feedbacks from URL:', url);
            const response = await apiClient.get<ApiResult<FeedbackPageResponse>>(url, {
                params: {
                    page: page,
                    size: 10,
                },
            });
            console.log('Response data:', response.data);
            const feedbackData = response.data?.data;
            if (feedbackData) {
                setFeedbacks(feedbackData.content ?? []);
                setTotalPages(feedbackData.totalPages ?? 1);
                setCurrentPage(feedbackData.currentPage ?? 1);

                // Initialize replyContent with existing replies
                const initialReplyContent = feedbackData.content.reduce((acc, feedback) => {
                    acc[feedback.feedbackNo] = feedback.reply?.trim() ?? '';
                    return acc;
                }, {} as Record<number, string>);

                setReplyContent(initialReplyContent);
            } else {
                console.log('Invalid response data structure');
            }
        } catch (error) {
            console.error('피드백 가져오기 에러:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    message: error.message,
                    code: error.code,
                    response: error.response?.data,
                });
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const handleReplyChange = (feedbackNo: number, content: string) => {
        setReplyContent(prev => ({ ...prev, [feedbackNo]: content }));
    };

    const submitReply = async (feedbackNo: number) => {
        try {
            await apiClient.put(`/api/v1/feedbacks/admin/${feedbackNo}`, { content: replyContent[feedbackNo] });
            fetchFeedbacks(currentPage);
        } catch (error) {
            console.error('답변 제출 에러:', error);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <h1 className={styles.title}>피드백 관리</h1>
                    <div className={styles.tableContainer}>
                        <table className={styles.feedbackTable}>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>카테고리</th>
                                <th>생성일</th>
                                <th>수정일</th>
                                <th>닉네임</th>
                                <th>답변</th>
                                <th>작업</th>
                            </tr>
                            </thead>
                            <tbody>
                            {feedbacks.length > 0 ? (
                                feedbacks.map(feedback => (
                                    <tr key={feedback.feedbackNo}>
                                        <td>{feedback.feedbackNo}</td>
                                        <td>{feedback.title}</td>
                                        <td>{feedback.content}</td>
                                        <td>{feedback.category}</td>
                                        <td>{new Date(feedback.createDate).toLocaleString()}</td>
                                        <td>{new Date(feedback.updateDate).toLocaleString()}</td>
                                        <td>{feedback.nickname}</td>
                                        <td>
                                                <textarea
                                                    className={styles.replyTextarea}
                                                    value={replyContent[feedback.feedbackNo] || ''}
                                                    onChange={(e) => handleReplyChange(feedback.feedbackNo, e.target.value)}
                                                />
                                        </td>
                                        <td>
                                            <button
                                                className={styles.submitButton}
                                                onClick={() => submitReply(feedback.feedbackNo)}
                                            >
                                                {feedback.hasReply ? '답변 수정' : '답변 제출'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9}>피드백이 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.pagination}>
                        <button className={styles.pageButton} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            이전
                        </button>
                        <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
                        <button className={styles.pageButton} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;