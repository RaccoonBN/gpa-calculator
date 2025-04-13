import React, { useState } from 'react';
import { calculateRequiredGPA, GPA_RANKS, MAX_GPA } from '../utils/gpaCalculator';
import { FaQuestionCircle } from 'react-icons/fa'; 

function GPAGoalEstimator({ currentGPA, currentCredits }) {
  const [futureCredits, setFutureCredits] = useState('');
  const [estimations, setEstimations] = useState([]); // Lưu kết quả cho từng rank
  const [error, setError] = useState('');

  const handleEstimate = () => {
    const credits = parseFloat(futureCredits);
    setError('');
    setEstimations([]); // Reset

    if (isNaN(credits) || credits <= 0) {
      setError('Vui lòng nhập số tín chỉ dự kiến hợp lệ (> 0).');
      return;
    }
    if (currentGPA === null || isNaN(currentGPA) || isNaN(currentCredits)) {
        setError('GPA tích lũy hiện tại không hợp lệ.');
        return;
    }

    const results = GPA_RANKS.map(rankInfo => {
        const requiredGPA = calculateRequiredGPA(currentGPA, currentCredits, rankInfo.threshold, credits);
        return { ...rankInfo, requiredGPA };
    });

    setEstimations(results);
  };

  const renderEstimationResult = (rankInfo) => {
    const { rank, threshold, requiredGPA } = rankInfo;

    if (currentGPA >= threshold) {
      return `Bạn đã đạt/vượt mục tiêu ${rank} (${threshold.toFixed(2)}).`;
    }
    if (requiredGPA === null) {
      return `Lỗi tính toán cho mục tiêu ${rank}.`;
    }
    if (requiredGPA > MAX_GPA) {
      return `Để đạt ${rank} (${threshold.toFixed(2)}), cần GPA > ${MAX_GPA.toFixed(2)} (Rất khó/Không thể).`;
    }
    if (requiredGPA <= 0) {
      return `Để đạt ${rank} (${threshold.toFixed(2)}), bạn chỉ cần không bị điểm F.`;
    }
    return `Để đạt ${rank} (${threshold.toFixed(2)}), cần đạt GPA trung bình ${requiredGPA.toFixed(2)}.`;
  };

  return (
    <div className="gpa-estimator modern-estimator">
      {/* Bỏ thẻ H3 vì đã có trong EstimatorView */}
      {/* <p>Nhập tổng số tín chỉ dự kiến học tiếp...</p> */}
      <div className="estimator-input-group">
        <label htmlFor="futureCredits">Số tín chỉ dự kiến học tiếp:</label>
        <input
          type="number" id="futureCredits" value={futureCredits}
          onChange={(e) => setFutureCredits(e.target.value)}
          placeholder="VD: 15" min="1"
        />
        <button onClick={handleEstimate} className="action-button estimate-button">
          Ước lượng
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {estimations.length > 0 && (
        <div className="estimation-results modern-results">
          <h4>Kết quả ước lượng cho {parseFloat(futureCredits)} tín chỉ tới:</h4>
          <ul>
            {estimations.map(result => (
              <li key={result.key}>
                {renderEstimationResult(result)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GPAGoalEstimator;