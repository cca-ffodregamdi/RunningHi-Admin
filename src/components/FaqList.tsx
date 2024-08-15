import React, { useState } from 'react';
import feedbackStyles from '../css/Feedback.module.css';

interface GetFaqResponse {
    faqNo: number;
    question: string;
    answer: string;
}

interface FaqListProps {
    faqs: GetFaqResponse[];
    onEdit: (faq: GetFaqResponse) => void;
    onDelete: (faqNo: number) => void;
    onSave: (faq: GetFaqResponse) => void;
}

const FaqList: React.FC<FaqListProps> = ({ faqs, onEdit, onDelete, onSave }) => {
    const [editFaqNo, setEditFaqNo] = useState<number | null>(null);
    const [editableFaq, setEditableFaq] = useState<GetFaqResponse | null>(null);

    const handleEditClick = (faq: GetFaqResponse) => {
        setEditFaqNo(faq.faqNo);
        setEditableFaq(faq);
    };

    const handleSaveClick = () => {
        if (editableFaq) {
            onSave(editableFaq);
            setEditFaqNo(null);
            setEditableFaq(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editableFaq) {
            const { name, value } = e.target;
            setEditableFaq({ ...editableFaq, [name]: value });
        }
    };

    return (
        <table className={feedbackStyles.feedbackTable}>
            <thead>
            <tr>
                <th className={feedbackStyles.numberColumnFaq}>번호</th>
                <th className={feedbackStyles.contentColumnFaq}>질문</th>
                <th className={feedbackStyles.contentColumnFaq}>답변</th>
                <th className={feedbackStyles.actionColumnFaq}>작업</th>
            </tr>
            </thead>
            <tbody>
            {faqs.length > 0 ? (
                faqs.map(faq => (
                    <tr key={faq.faqNo}>
                        <td>{faq.faqNo}</td>
                        <td>
                            {editFaqNo === faq.faqNo ? (
                                <input
                                    type="text"
                                    name="question"
                                    value={editableFaq?.question || ''}
                                    onChange={handleInputChange}
                                    className={feedbackStyles.editInput}
                                    size={70}
                                />
                            ) : (
                                faq.question
                            )}
                        </td>
                        <td>
                            {editFaqNo === faq.faqNo ? (
                                <textarea
                                    name="answer"
                                    value={editableFaq?.answer || ''}
                                    onChange={handleInputChange}
                                    className={feedbackStyles.editTextarea}
                                    cols={70}
                                    rows={5}
                                />
                            ) : (
                                faq.answer
                            )}
                        </td>
                        <td>
                            {editFaqNo === faq.faqNo ? (
                                <>
                                    <div className={feedbackStyles.buttonContainer}>
                                        <button onClick={handleSaveClick} className={feedbackStyles.saveButton}>저장</button>
                                        <button onClick={() => setEditFaqNo(null)} className={feedbackStyles.deleteButton}>취소</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={feedbackStyles.buttonContainer}>
                                        <button onClick={() => handleEditClick(faq)} className={feedbackStyles.editButton}>수정</button>
                                        <button onClick={() => onDelete(faq.faqNo)} className={feedbackStyles.deleteButton}>삭제</button>
                                    </div>
                                </>
                            )}
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
    );
};

export default FaqList;
