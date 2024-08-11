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

interface GetFaqResponse {
    faqNo: number;
    question: string;
    answer: string;
}

const FeedbackAndFaq: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<GetFeedbackResponse[]>([]);
    const [faqs, setFaqs] = useState<GetFaqResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [activeTab, setActiveTab] = useState<string>('feedback');
    const [newFaq, setNewFaq] = useState<GetFaqResponse>({ faqNo: 0, question: '', answer: '' });
    const [editFaq, setEditFaq] = useState<GetFaqResponse | null>(null);

    useEffect(() => {
        if (activeTab === 'feedback') {
            fetchFeedbacks(currentPage);
        } else if (activeTab === 'faq') {
            fetchFaqs();
        }
    }, [currentPage, activeTab]);

    const fetchFeedbacks = async (page: number) => {
        try {
            const url = `/api/v1/feedbacks/admin`;
            const response = await apiClient.get<ApiResult<FeedbackPageResponse>>(url, {
                params: {
                    page: page,
                    size: 10,
                },
            });
            const feedbackData = response.data?.data;
            if (feedbackData) {
                setFeedbacks(feedbackData.content ?? []);
                setTotalPages(feedbackData.totalPages ?? 1);
                setCurrentPage(feedbackData.currentPage ?? 1);

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

    const fetchFaqs = async () => {
        try {
            const url = `/api/v1/faq`;
            const response = await apiClient.get<ApiResult<GetFaqResponse[]>>(url);
            const faqData = response.data?.data;
            if (faqData) {
                setFaqs(faqData ?? []);
            } else {
                console.log('Invalid response data structure');
            }
        } catch (error) {
            console.error('FAQ 가져오기 에러:', error);
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

    const addFaq = async () => {
        try {
            const response = await apiClient.post('/api/v1/faq', newFaq);
            if (response.status === 201) {
                setNewFaq({ faqNo: 0, question: '', answer: '' });
                fetchFaqs();
            }
        } catch (error) {
            console.error('FAQ 추가 에러:', error);
        }
    };

    const updateFaq = async (faqNo: number) => {
        try {
            if (editFaq) {
                await apiClient.put(`/api/v1/faq/${faqNo}`, editFaq);
                setEditFaq(null);
                fetchFaqs();
            }
        } catch (error) {
            console.error('FAQ 수정 에러:', error);
        }
    };

    const deleteFaq = async (faqNo: number) => {
        try {
            await apiClient.delete(`/api/v1/faq/${faqNo}`);
            fetchFaqs();
        } catch (error) {
            console.error('FAQ 삭제 에러:', error);
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleFaqInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editFaq) {
            setEditFaq({ ...editFaq, [name]: value });
        } else {
            setNewFaq({ ...newFaq, [name]: value });
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <h1 className={styles.title}>관리 페이지</h1>
                    <div className={styles.tabContainer}>
                        <button className={`${styles.tabButton} ${activeTab === 'feedback' ? styles.activeTab : ''}`} onClick={() => handleTabChange('feedback')}>피드백</button>
                        <button className={`${styles.tabButton} ${activeTab === 'faq' ? styles.activeTab : ''}`} onClick={() => handleTabChange('faq')}>FAQ</button>
                    </div>

                    {activeTab === 'feedback' && (
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
                    )}

                    {activeTab === 'faq' && (
                        <div className={styles.tableContainer}>
                            <table className={styles.feedbackTable}>
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>질문</th>
                                    <th>답변</th>
                                    <th>작업</th>
                                </tr>
                                </thead>
                                <tbody>
                                {faqs.length > 0 ? (
                                    faqs.map(faq => (
                                        <tr key={faq.faqNo}>
                                            <td>{faq.faqNo}</td>
                                            <td>
                                                {editFaq && editFaq.faqNo === faq.faqNo ? (
                                                    <input
                                                        type="text"
                                                        name="question"
                                                        value={editFaq.question}
                                                        onChange={handleFaqInputChange}
                                                        className={styles.replyTextarea}
                                                    />
                                                ) : (
                                                    faq.question
                                                )}
                                            </td>
                                            <td>
                                                {editFaq && editFaq.faqNo === faq.faqNo ? (
                                                    <textarea
                                                        name="answer"
                                                        value={editFaq.answer}
                                                        onChange={handleFaqInputChange}
                                                        className={styles.replyTextarea}
                                                    />
                                                ) : (
                                                    faq.answer
                                                )}
                                            </td>
                                            <td>
                                                {editFaq && editFaq.faqNo === faq.faqNo ? (
                                                    <button onClick={() => updateFaq(faq.faqNo)} className={styles.submitButton}>저장</button>
                                                ) : (
                                                    <button onClick={() => setEditFaq(faq)} className={styles.submitButton}>수정</button>
                                                )}
                                                <button onClick={() => deleteFaq(faq.faqNo)} className={styles.deleteButton}>삭제</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>FAQ가 없습니다.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                            <div className={styles.faqForm}>
                                <h3>FAQ 추가</h3>
                                <input
                                    type="text"
                                    name="question"
                                    placeholder="질문"
                                    value={newFaq.question}
                                    onChange={handleFaqInputChange}
                                    className={styles.replyTextarea}
                                />
                                <textarea
                                    name="answer"
                                    placeholder="답변"
                                    value={newFaq.answer}
                                    onChange={handleFaqInputChange}
                                    className={styles.replyTextarea}
                                />
                                <button onClick={addFaq} className={styles.addButton}>추가</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackAndFaq;
