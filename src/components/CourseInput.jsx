import React, { useState, useCallback, useId } from 'react';

// Tỷ lệ mặc định và có thể cấu hình nếu muốn
const DEFAULT_QT_WEIGHT_PERCENT = 30;
const DEFAULT_CK_WEIGHT_PERCENT = 70;

function CourseInput({ onAddCourse }) {
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [qtScore, setQtScore] = useState('');
  const [qtWeight, setQtWeight] = useState(DEFAULT_QT_WEIGHT_PERCENT);
  const [ckScore, setCkScore] = useState('');
  const [ckWeight, setCkWeight] = useState(DEFAULT_CK_WEIGHT_PERCENT);
  const [error, setError] = useState('');
  const formId = useId(); // Tạo ID duy nhất cho các field trong form

  const validateInputs = useCallback(() => {
    setError('');
    const creditsNum = parseFloat(credits);
    const qtScoreNum = parseFloat(qtScore);
    const ckScoreNum = parseFloat(ckScore);
    const qtWeightNum = parseFloat(qtWeight);
    const ckWeightNum = parseFloat(ckWeight);

    if (!courseName.trim()) return 'Vui lòng nhập tên môn học.';
    if (isNaN(creditsNum) || creditsNum <= 0) return 'Số tín chỉ phải là một số dương.';
    if (qtScore.trim() === '' || isNaN(qtScoreNum) || qtScoreNum < 0 || qtScoreNum > 10) return 'Điểm quá trình không hợp lệ (0-10).';
    if (ckScore.trim() === '' || isNaN(ckScoreNum) || ckScoreNum < 0 || ckScoreNum > 10) return 'Điểm cuối kỳ không hợp lệ (0-10).';
    if (isNaN(qtWeightNum) || qtWeightNum < 0 || qtWeightNum > 100 || isNaN(ckWeightNum) || ckWeightNum < 0 || ckWeightNum > 100) return 'Tỷ lệ % không hợp lệ (0-100).';
    if (Math.abs(qtWeightNum + ckWeightNum - 100) > 0.1) return 'Tổng tỷ lệ Quá trình và Cuối kỳ phải bằng 100%.';

    return null; // No error
  }, [courseName, credits, qtScore, ckScore, qtWeight, ckWeight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const newCourse = {
      id: `course-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: courseName.trim(),
      credits: parseFloat(credits),
      components: [
        { score: parseFloat(qtScore), weight: parseFloat(qtWeight) / 100 },
        { score: parseFloat(ckScore), weight: parseFloat(ckWeight) / 100 },
      ],
    };

    onAddCourse(newCourse);

    // Reset form
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
      if (value === '' || (numValue >= 0 && numValue <= 100)) {
          if (type === 'qt') {
              setQtWeight(value === '' ? '' : numValue);
              if(value !== '' && !isNaN(100 - numValue)) setCkWeight(100 - numValue);
          } else { // type === 'ck'
              setCkWeight(value === '' ? '' : numValue);
               if(value !== '' && !isNaN(100 - numValue)) setQtWeight(100 - numValue);
          }
      }
  };

  return (
    <form onSubmit={handleSubmit} className="course-input-form">
        {/* Row 1: Tên môn và Tín chỉ */}
        <div className="form-row">
            <div className="form-group name-credits-group">
                <label htmlFor={`${formId}-courseName`}>Tên môn học:</label>
                <input
                    type="text"
                    id={`${formId}-courseName`}
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="VD: Lập trình Web"
                    required
                />
            </div>
            <div className="form-group name-credits-group credits-input">
                <label htmlFor={`${formId}-credits`}>Số tín chỉ:</label>
                <input
                    type="number"
                    id={`${formId}-credits`}
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    min="0.5"
                    step="0.5"
                    placeholder="VD: 3"
                    required
                />
            </div>
        </div>

        {/* Row 2: Điểm thành phần và Tỷ lệ */}
        <div className="form-row score-weights-row">
            {/* Quá trình */}
            <div className="form-group component-group">
                <label htmlFor={`${formId}-qtScore`}>Điểm QT:</label>
                <input
                    type="number"
                    id={`${formId}-qtScore`}
                    value={qtScore}
                    onChange={(e) => setQtScore(e.target.value)}
                    min="0" max="10" step="0.1"
                    placeholder="0-10"
                    required
                />
            </div>
             <div className="form-group component-group weight-input">
                 <label htmlFor={`${formId}-qtWeight`}>Tỷ lệ QT (%):</label>
                <input
                    type="number"
                    id={`${formId}-qtWeight`}
                    value={qtWeight}
                    onChange={(e) => handleWeightChange('qt', e.target.value)}
                    min="0" max="100" step="1"
                    placeholder="%"
                    required
                />
            </div>

            {/* Cuối kỳ */}
             <div className="form-group component-group">
                <label htmlFor={`${formId}-ckScore`}>Điểm CK:</label>
                <input
                    type="number"
                    id={`${formId}-ckScore`}
                    value={ckScore}
                    onChange={(e) => setCkScore(e.target.value)}
                    min="0" max="10" step="0.1"
                    placeholder="0-10"
                    required
                />
            </div>
            <div className="form-group component-group weight-input">
                 <label htmlFor={`${formId}-ckWeight`}>Tỷ lệ CK (%):</label>
                <input
                    type="number"
                    id={`${formId}-ckWeight`}
                    value={ckWeight}
                    onChange={(e) => handleWeightChange('ck', e.target.value)}
                    min="0" max="100" step="1"
                    placeholder="%"
                    required
                />
            </div>
        </div>

        {error && <p className="error-message form-error">{error}</p>}
        <button type="submit" className="add-button add-course-button">Thêm môn</button>
    </form>
  );
}

export default CourseInput;