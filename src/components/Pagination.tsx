import React from 'react';
import styles from '../css/Index.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    const maxPagesToShow = 5; // 최대 페이지 버튼 개수
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, currentPage + halfMaxPages);

    return (
        <div className={styles.pagination}>
            {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className={styles.pageButton}>
                    이전
                </button>
            )}
            {startPage > 1 && (
                <>
                    <button onClick={() => setCurrentPage(1)} className={styles.pageButton}>
                        1
                    </button>
                    {startPage > 2 && <span className={styles.dots}>...</span>}
                </>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                >
                    {page}
                </button>
            ))}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className={styles.dots}>...</span>}
                    <button onClick={() => setCurrentPage(totalPages)} className={styles.pageButton}>
                        {totalPages}
                    </button>
                </>
            )}
            {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className={styles.pageButton}>
                    다음
                </button>
            )}
        </div>
    );
};

export default Pagination;
