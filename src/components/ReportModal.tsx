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
    const [reportList, setReportList] = useState<PostReportList[] | ReplyReportList[]>([]);
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
            const data: ApiResult<PostReportList[] | ReplyReportList[]> = await response.json();
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
                                value={isPostReport ? detailedReport.postReportNo : detailedReport.replyReportNo}
                                readOnly
                            />
                        </div>
        
                        <div className={styles.inputWrapper}>
                            <label>{isPostReport ? '게시글' : '댓글'} 번호:</label>
                            <input
                                type="number"
                                value={isPostReport ? detailedReport.reportedPostNo : detailedReport.reportedReplyNo}
                                readOnly
                            />
                        </div>
                    </div>
                    
                    <div className={styles.contentWrapper}>
                        <strong>{isPostReport ? '게시글' : '댓글'} 내용:</strong> 
                        <p>{isPostReport ? (detailedReport as PostReport).postContent : (detailedReport as ReplyReport).replyContent}</p>
                    </div>
                    
                    {isPostReport && (detailedReport as PostReport).imageUrl && (
                        <div className={styles.imageWrapper}>
                            <img src={(detailedReport as PostReport).imageUrl} alt="신고된 게시글 이미지" className={styles.reportImage} />
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
                                    <tr key={isPostReport ? row.postReportNo : row.replyReportNo}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRows.includes(isPostReport ? row.postReportNo : row.replyReportNo)}
                                                onChange={() => handleRowSelect(isPostReport ? row.postReportNo : row.replyReportNo)}
                                            />
                                        </td>
                                        <td>{isPostReport ? row.postReportNo : row.replyReportNo}</td>
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