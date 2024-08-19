'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../css/Index.module.css';
import reportStyles from '../css/Report.module.css';
import Sidebar from '../components/Sidebar';
import Pagination from "@/components/Pagination";
import ReportDetailModal from '@/components/ReportModal';
import appClient from '@/lib/appClient';

interface ApiResult<T> {
    timeStamp: string;
    status: string;
    message: string;
    data: T;
}

interface GetAllPostReportsResponse {
    postReportNo: number;
    category: string;
    content: string;
    status: string;
    reporterNo: number;
    reportedPostNo: string;
    postContent: string;
}

interface PostReportPageResponse {
    content: GetAllPostReportsResponse[];
    currentPage: number;
    totalPages: number;
}

interface GetAllReplyReportsResponse {
    replyReportNo: number;
    category: string;
    content: string;
    status: string;
    reporterNo: number;
    reportedReplyNo: string;
    replyContent: string;
}

interface ReplyReportPageResponse {
    content: GetAllReplyReportsResponse[];
    currentPage: number;
    totalPages: number;
}

const token = process.env.TOKEN;

const PostAndReplyReport: React.FC = () => {
    const [postReports, setPostReports] = useState<GetAllPostReportsResponse[]>([]);
    const [replyReports, setReplyReports] = useState<GetAllReplyReportsResponse[]>([]);
    const [postCurrentPage, setPostCurrentPage] = useState(1);
    const [replyCurrentPage, setReplyCurrentPage] = useState(1);
    const [postTotalPages, setPostTotalPages] = useState(1);
    const [replyTotalPages, setReplyTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState<string>('post');

    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getCategoryBadgeClass = (category: string) => {
        return `${reportStyles.categoryBadge} ${reportStyles[`categoryBadge-${category}`]}`;
    };

    const getStatusBadgeClass = (status: string) => {
        return `${reportStyles.statusBadge} ${reportStyles[`statusBadge-${status}`]}`;
    };

    const getStatusInKorean = (status: string): string => {
        const categoryMap: { [key: string]: string } = {
            'INPROGRESS': '처리중',
            'ACCEPTED': '신고 수락',
            'REJECTED': '신고거절',
        };
        return categoryMap[status] || status;
    };

    const handleReportClick = (report: any) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };


    const fetchPostReports = useCallback(async (page: number) => {
        try {
            const url = '/api/v1/post-reports';
            const params = new URLSearchParams({
                page: page.toString(),
                size: '10',
            });
    
            const response = await appClient(`${url}?${params.toString()}`, { method: 'GET' });
            const data: ApiResult<PostReportPageResponse> = await response.json();
            const postReportData = data.data;
            if (postReportData) {
                setPostReports(postReportData.content ?? []);
                setPostTotalPages(postReportData.totalPages ?? 1);
                setPostCurrentPage(page);
            } else {
                console.log('Invalid response data structure');
            }
        } catch (error) {
            console.error('게시글 신고목록 가져오기 에러:', error);
        }
    }, []);


    const fetchReplyReports = useCallback(async (page: number) => {
        try {
            const url = '/api/v1/reply-reports';
            const params = new URLSearchParams({
                page: page.toString(),
                size: '10',
            });
    
            const response = await appClient(`${url}?${params.toString()}`, { method: 'GET' });
            const data: ApiResult<ReplyReportPageResponse> = await response.json();
            const replyReportData = data.data;
            if (replyReportData) {
                setReplyReports(replyReportData.content ?? []);
                setReplyTotalPages(replyReportData.totalPages ?? 1);
                setReplyCurrentPage(page);
            } else {
                console.log('Invalid response data structure');
            }
        } catch (error) {
            console.error('댓글 신고목록 가져오기 에러:', error);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'post') {
            fetchPostReports(postCurrentPage);
        } else if (activeTab === 'reply') {
            fetchReplyReports(replyCurrentPage);
        }
    },  [activeTab, postCurrentPage, replyCurrentPage, fetchPostReports, fetchReplyReports]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handlePostPageChange = (page: number) => {
        if (page !== postCurrentPage) {
            setPostCurrentPage(page);
        }
    };
    
    const handleReplyPageChange = (page: number) => {
        if (page !== replyCurrentPage) {
            setReplyCurrentPage(page);
        }
    };

    const renderReportTable = (reports: GetAllPostReportsResponse[] | GetAllReplyReportsResponse[], isPostReport: boolean) => (
        <table className={reportStyles.reportTable}>
            <thead>
                <tr>
                    <th className={reportStyles.numberColumn}>번호</th>
                    <th className={reportStyles.contentColumn}>내용</th>
                    <th className={reportStyles.categoryColumn}>카테고리</th>
                    <th className={reportStyles.reporterColumn}>신고자 번호</th>
                    <th className={reportStyles.reportedItemColumn}>{isPostReport ? '게시글' : '댓글'} 번호</th>
                    <th className={reportStyles.statusColumn}>진행상황</th>
                </tr>
            </thead>
            <tbody>
            {reports.length > 0 ? (
                reports.map((report: any) => (
                    <tr key={isPostReport ? report.postReportNo : report.replyReportNo} onClick={() => handleReportClick(report)}>
                        <td className={reportStyles.numberColumn}>{isPostReport ? report.postReportNo : report.replyReportNo}</td>
                        <td className={reportStyles.contentColumn}>{report.content}</td>
                        <td className={reportStyles.categoryColumn}>
                            <span className={getCategoryBadgeClass(report.category)}>
                                {report.category}
                            </span>
                        </td>
                        <td className={reportStyles.numberColumn}>{isPostReport ? report.reportedPostNo : report.reportedReplyNo}</td>
                        <td className={reportStyles.numberColumn}>{isPostReport ? report.reportedPostNo : report.reportedReplyNo}</td>
                        <td className={reportStyles.statusColumn}>
                            <span className={getStatusBadgeClass(report.status)}>
                                {getStatusInKorean(report.status)}
                            </span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6}>신고가 없습니다.</td>
                </tr>
            )}
            </tbody>
        </table>
    );

    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <h1 className={styles.title}>게시글 / 댓글 신고 관리</h1>
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'post' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('post')}
                        >
                            게시글
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'reply' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('reply')}
                        >
                            댓글
                        </button>
                    </div>

                    {activeTab === 'post' && (
                        <div className={styles.tableContainer}>
                            {renderReportTable(postReports, true)}
                            <Pagination
                                currentPage={postCurrentPage}
                                totalPages={postTotalPages}
                                setCurrentPage={handlePostPageChange}
                            />
                        </div>
                    )}

                    {activeTab === 'reply' && (
                        <div className={styles.tableContainer}>
                            {renderReportTable(replyReports, false)}
                            <Pagination
                                currentPage={replyCurrentPage}
                                totalPages={replyTotalPages}
                                setCurrentPage={handleReplyPageChange}
                            />
                        </div>
                    )}

                    {isModalOpen && selectedReport && (
                        <ReportDetailModal 
                            report={selectedReport}
                            isPostReport={activeTab === 'post'}
                            onClose={closeModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostAndReplyReport;