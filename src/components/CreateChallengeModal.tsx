import React, { useState, useRef } from 'react';
import styles from '../css/CreateChallengeModal.module.css';

interface CreateChallengeModalProps {
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

interface CreateChallengeRequest {
  title: string;
  content: string;
  challengeCategory: 'DISTANCE' | 'SPEED' | 'ATTENDANCE';
  image: File;
  goal: number;
  goalDetail: string;
  startDate: string;
  endDate: string;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [challengeCategory, setChallengeCategory] = useState<'DISTANCE' | 'SPEED' | 'ATTENDANCE'>('DISTANCE');
  const [goal, setGoal] = useState<number>(0);
  const [goalDetail, setGoalDetail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('challengeCategory', challengeCategory);
    formData.append('goal', goal.toString());
    formData.append('goalDetail', goalDetail);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('image', image);

    onSave(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>새 챌린지 추가</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formLayout}>
            <div className={styles.imageSection}>
              <div className={styles.imagePreview} onClick={triggerFileInput}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                ) : (
                  <div className={styles.uploadPlaceholder}>클릭하여 이미지 업로드</div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className={styles.inputSection}>
              <div className={styles.inputGroup}>
                <label htmlFor="title">제목</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="content">설명</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="challengeCategory">카테고리</label>
                <select
                  id="challengeCategory"
                  value={challengeCategory}
                  onChange={(e) => setChallengeCategory(e.target.value as 'DISTANCE' | 'SPEED' | 'ATTENDANCE')}
                  required
                >
                  <option value="DISTANCE">거리</option>
                  <option value="SPEED">속도</option>
                  <option value="ATTENDANCE">출석</option>
                </select>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="goal">목표</label>
                  <input
                    id="goal"
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="goalDetail">목표 상세정보</label>
                  <input
                    id="goalDetail"
                    type="text"
                    value={goalDetail}
                    onChange={(e) => setGoalDetail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="startDate">시작일</label>
                  <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    placeholder="날짜와 시간을 선택하세요"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="endDate">종료일</label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    placeholder="날짜와 시간을 선택하세요"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallengeModal;