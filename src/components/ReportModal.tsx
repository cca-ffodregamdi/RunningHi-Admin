import React, { useState, useEffect } from 'react';
import styles from '../css/Modal.module.css';
import appClient from '@/lib/appClient';

interface ReportDetailModalProps {
    report: any;
    isPostReport: boolean;
    onClose: () => void;
}

interface ApiResult<T> {
    timeStamp: string;
    status: string;
    message: string;
    data: T;
}

interface PostReport {
    postReportNo: number;
    category: string;
    content: string;
    status: string;
    reportedPostNo: number;
    postContent: string;
    imageUrl: string;
}

interface ReplyReport {
    replyReportNo: number;
    category: string;
    content: string;
    status: string;
    reportedReplyNo: number;
    replyContent: string;
}

type ReportList = PostReportList[] | ReplyReportList[];

interface PostReportList {
    postReportNo: number;
    category: string;
    content: string;
    status: string;
    reporterNo: number;
    reportedPostNo: number;
    postContent: string;
}

interface ReplyReportList {
    replyReportNo: number;
    category: string;
    content: string;
    status: string;
    reporterNo: number;
    reportedReplyNo: number;
    replyContent: string;
}

const ReportModal: React.FC<ReportDetailModalProps> = ({ report, isPostReport, onClose }) => {
    const [detailedReport, setDetailedReport] = useState<PostReport | ReplyReport | null>(null);
    const [reportList, setReportList] = useState<ReportList>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const fetchDetailedReport = async () => {
        try {
            const url = isPostReport
                ? `/api/v1/post-reports/${report.postReportNo}`
                : `/api/v1/reply-reports/${report.replyReportNo}`;
    
            const response = await appClient(url, { method: 'GET' });
            const data: ApiResult<PostReport | ReplyReport> = await response.json();
            setDetailedReport(data.data);
        } catch (error) {
            console.error('상세 정보 가져오기 에러:', error);
        }
    };
    
    const fetchDetailedReportList = async () => {
        try {
            const url = isPostReport
                ? `/api/v1/post-reports/post?postNo=${report.reportedPostNo}`
                : `/api/v1/reply-reports/reply?replyNo=${report.reportedReplyNo}`;
    
            const response = await appClient(url, { method: 'GET' });
            const data: ApiResult<ReportList> = await response.json();
            setReportList(data.data);
        } catch (error) {
            console.error('상세 정보 가져오기 에러:', error);
        }
    };

    useEffect(() => {
        fetchDetailedReport();
        fetchDetailedReportList();
    }, [report, isPostReport]);

    if (!detailedReport) return null;

    const handleRowSelect = (reportNo: number) => {
        setSelectedRows(prevSelected => 
            prevSelected.includes(reportNo)
                ? prevSelected.filter(id => id !== reportNo)
                : [...prevSelected, reportNo]
        );
    };

    const isPostReportType = (report: PostReport | ReplyReport): report is PostReport => {
        return 'postReportNo' in report;
    };

    const getReportNo = (report: PostReport | ReplyReport): number => {
        return isPostReportType(report) ? report.postReportNo : report.replyReportNo;
    };

    const getReportedItemNo = (report: PostReport | ReplyReport): number => {
        return isPostReportType(report) ? report.reportedPostNo : report.reportedReplyNo;
    };

    const getReportedContent = (report: PostReport | ReplyReport): string => {
        return isPostReportType(report) ? report.postContent : report.replyContent;
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalLeft}>
                    <h2>신고 상세 정보</h2>
                    
                    <div className={styles.inputContainer}>
                        <div className={styles.inputWrapper}>
                            <label>신고 번호:</label>
                            <input
                                type="number"
                                value={getReportNo(detailedReport)}
                                readOnly
                            />
                        </div>
        
                        <div className={styles.inputWrapper}>
                            <label>{isPostReport ? '게시글' : '댓글'} 번호:</label>
                            <input
                                type="number"
                                value={getReportedItemNo(detailedReport)}
                                readOnly
                            />
                        </div>
                    </div>
                    
                    <div className={styles.contentWrapper}>
                        <strong>{isPostReport ? '게시글' : '댓글'} 내용:</strong> 
                        <p>{getReportedContent(detailedReport)}</p>
                    </div>
                    
                    {isPostReportType(detailedReport) && detailedReport.imageUrl && (
                        <div className={styles.imageWrapper}>
                            <img src={detailedReport.imageUrl} alt="신고된 게시글 이미지" className={styles.reportImage} />
                        </div>
                    )}
                </div>
                <div className={styles.modalRight}>
                    <div className={styles.tableContainer}>
                        <table className={styles.reportTable}>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>신고 번호</th>
                                    <th>카테고리</th>
                                    <th>내용</th>
                                    <th>상태</th>
                                    <th>신고자 번호</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportList.map((row) => (
                                    <tr key={isPostReport ? (row as PostReportList).postReportNo : (row as ReplyReportList).replyReportNo}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRows.includes(isPostReport ? (row as PostReportList).postReportNo : (row as ReplyReportList).replyReportNo)}
                                                onChange={() => handleRowSelect(isPostReport ? (row as PostReportList).postReportNo : (row as ReplyReportList).replyReportNo)}
                                            />
                                        </td>
                                        <td>{isPostReport ? (row as PostReportList).postReportNo : (row as ReplyReportList).replyReportNo}</td>
                                        <td>{row.category}</td>
                                        <td>{row.content}</td>
                                        <td>{row.status}</td>
                                        <td>{row.reporterNo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={onClose} className={styles.closeButton}>삭제</button>
                        <button onClick={onClose} className={styles.closeButton}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;