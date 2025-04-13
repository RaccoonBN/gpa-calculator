import React, { useState, useCallback, useId } from 'react';
import { FaBook, FaStar, FaPercentage, FaWeightHanging, FaPlusCircle, FaInfoCircle, FaClipboardCheck } from 'react-icons/fa';
import './CourseInput.css';

const DEFAULT_QT_WEIGHT_PERCENT = 50;
const DEFAULT_CK_WEIGHT_PERCENT = 50;

function CourseInput({ onAddCourse }) {
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [qtScore, setQtScore] = useState('');
  const [qtWeight, setQtWeight] = useState(DEFAULT_QT_WEIGHT_PERCENT);
  const [ckScore, setCkScore] = useState('');
  const [ckWeight, setCkWeight] = useState(DEFAULT_CK_WEIGHT_PERCENT);
  const [error, setError] = useState('');
  const formId = useId();

  const validateInputs = useCallback(() => {
    setError('');
    const creditsNum = parseFloat(credits);
    const qtScoreNum = parseFloat(qtScore);
    const ckScoreNum = parseFloat(ckScore);
    const qtWeightNum = parseFloat(qtWeight);
    const ckWeightNum = parseFloat(ckWeight);

    if (!courseName.trim()) return 'Vui lòng nhập tên môn học.';
    if (isNaN(creditsNum) || creditsNum <= 0) return 'Số tín chỉ phải là một số dương.';
    if (qtWeightNum > 0 && (qtScore.trim() === '' || isNaN(qtScoreNum) || qtScoreNum < 0 || qtScoreNum > 10)) return 'Điểm quá trình không hợp lệ (0-10) khi tỷ lệ > 0%.';
    if (ckWeightNum > 0 && (ckScore.trim() === '' || isNaN(ckScoreNum) || ckScoreNum < 0 || ckScoreNum > 10)) return 'Điểm cuối kỳ không hợp lệ (0-10) khi tỷ lệ > 0%.';
    if (qtWeightNum === 0 && qtScore.trim() !== '' && (isNaN(qtScoreNum) || qtScoreNum < 0 || qtScoreNum > 10)) return 'Điểm quá trình không hợp lệ (0-10).';
    if (ckWeightNum === 0 && ckScore.trim() !== '' && (isNaN(ckScoreNum) || ckScoreNum < 0 || ckScoreNum > 10)) return 'Điểm cuối kỳ không hợp lệ (0-10).';
    if (isNaN(qtWeightNum) || qtWeightNum < 0 || qtWeightNum > 100 || isNaN(ckWeightNum) || ckWeightNum < 0 || ckWeightNum > 100) return 'Tỷ lệ % không hợp lệ (0-100).';
    if (Math.abs(qtWeightNum + ckWeightNum - 100) > 0.1) return 'Tổng tỷ lệ Quá trình và Cuối kỳ phải bằng 100%.';

    return null;
  }, [courseName, credits, qtScore, ckScore, qtWeight, ckWeight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const finalQtScore = parseFloat(qtWeight) === 0 ? 0 : parseFloat(qtScore || '0');
    const finalCkScore = parseFloat(ckWeight) === 0 ? 0 : parseFloat(ckScore || '0');

    const newCourse = {
      id: `course-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: courseName.trim(),
      credits: parseFloat(credits),
      components: [
        { score: finalQtScore, weight: parseFloat(qtWeight) / 100 },
        { score: finalCkScore, weight: parseFloat(ckWeight) / 100 },
      ],
    };

    onAddCourse(newCourse);

    setCourseName('');
    setCredits('');
    setQtScore('');
    setCkScore('');
    setQtWeight(DEFAULT_QT_WEIGHT_PERCENT);
    setCkWeight(DEFAULT_CK_WEIGHT_PERCENT);
    setError('');
  };

  const handleWeightChange = (type, value) => {
    const numValue = parseFloat(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      const currentVal = value === '' ? '' : numValue;
      const otherVal = (value !== '' && !isNaN(numValue)) ? 100 - numValue : '';

      if (type === 'qt') {
        setQtWeight(currentVal);
        if (otherVal !== '' && otherVal >= 0 && otherVal <= 100) {
          setCkWeight(otherVal);
        } else if (value === '') {
          setCkWeight('');
        }
      } else {
        setCkWeight(currentVal);
        if (otherVal !== '' && otherVal >= 0 && otherVal <= 100) {
          setQtWeight(otherVal);
        } else if (value === '') {
          setQtWeight('');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="course-input-form">
      <div className="form-section course-info-section">
        <div className="form-group course-name">
          <label htmlFor={`${formId}-courseName`}><FaBook /> Tên môn học:</label>
          <input type="text" id={`${formId}-courseName`} value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="VD: Cơ sở dữ liệu" required />
        </div>
        <div className="form-group course-credits">
          <label htmlFor={`${formId}-credits`}><FaWeightHanging /> Số tín chỉ:</label>
          <input type="number" id={`${formId}-credits`} value={credits} onChange={(e) => setCredits(e.target.value)} min="0.5" step="0.5" placeholder="3" required />
        </div>
      </div>

      <div className="form-section score-section">
        <p className="input-hint">
          <FaInfoCircle /> Môn chỉ có điểm cuối kỳ? Nhập Điểm QT là 0, Tỷ lệ QT là 0%.
        </p>
        <div className="score-row">
          <div className="form-group score-input">
            <label htmlFor={`${formId}-qtScore`}><FaClipboardCheck /> Điểm QT:</label>
            <input type="number" id={`${formId}-qtScore`} value={qtScore} onChange={(e) => setQtScore(e.target.value)} min="0" max="10" step="0.1" placeholder="0-10" />
          </div>
          <div className="form-group weight-input">
            <label htmlFor={`${formId}-qtWeight`}><FaPercentage /> Tỷ lệ QT (%):</label>
            <input type="number" id={`${formId}-qtWeight`} value={qtWeight} onChange={(e) => handleWeightChange('qt', e.target.value)} min="0" max="100" step="1" placeholder="%" />
          </div>
          <div className="form-group score-input">
            <label htmlFor={`${formId}-ckScore`}><FaStar /> Điểm CK:</label>
            <input type="number" id={`${formId}-ckScore`} value={ckScore} onChange={(e) => setCkScore(e.target.value)} min="0" max="10" step="0.1" placeholder="0-10" />
          </div>
          <div className="form-group weight-input">
            <label htmlFor={`${formId}-ckWeight`}><FaPercentage /> Tỷ lệ CK (%):</label>
            <input type="number" id={`${formId}-ckWeight`} value={ckWeight} onChange={(e) => handleWeightChange('ck', e.target.value)} min="0" max="100" step="1" placeholder="%" />
          </div>
        </div>
      </div>

      <div className="form-submit-area">
        {error && <p className="error-message form-error">{error}</p>}
        <button type="submit" className="add-button add-course-button">
          <FaPlusCircle /> Thêm môn học
        </button>
      </div>
    </form>
  );
}

export default CourseInput;