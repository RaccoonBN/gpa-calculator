import React, { useState } from 'react';
import {
  calculateRequiredGPA,
  GPA_RANKS,
  MAX_GPA,
  getLetterGradeFromPoint,
  getApproximateScore10RangeFromPoint
} from '../utils/gpaCalculator';
import { FaQuestionCircle, FaChartLine, FaCalculator, FaBullseye, FaClipboardCheck, FaInfoCircle } from 'react-icons/fa';
import './GPAGoalEstimator.css'; // Import CSS cho component

function GPAGoalEstimator({ currentGPA, currentCredits }) {
  // State quản lý số tín chỉ tương lai, kết quả ước lượng và lỗi
  const [futureCredits, setFutureCredits] = useState('');
  const [estimations, setEstimations] = useState([]);
  const [error, setError] = useState('');

  // Xử lý sự kiện khi nhấn nút "Ước lượng"
  const handleEstimate = () => {
    const credits = parseFloat(futureCredits);
    setError(''); // Reset lỗi trước khi tính toán
    setEstimations([]); // Reset kết quả cũ

    // Kiểm tra đầu vào
    if (isNaN(credits) || credits <= 0) {
      setError('Vui lòng nhập số tín chỉ dự kiến hợp lệ (> 0).');
      return;
    }
    if (isNaN(currentCredits) || currentCredits < 0 || currentGPA === null || isNaN(currentGPA)) {
      setError('GPA tích lũy hoặc số tín chỉ hiện tại không hợp lệ.');
      return;
    }

    // Tính toán GPA cần thiết cho từng hạng mục xếp loại
    const results = GPA_RANKS.map(rankInfo => {
      const requiredGPA = calculateRequiredGPA(currentGPA, currentCredits, rankInfo.threshold, credits);
      return { ...rankInfo, requiredGPA };
    }).filter(r => r !== null); // Lọc bỏ kết quả null (nếu có lỗi tính toán)

    setEstimations(results); // Cập nhật state kết quả
  };

  // Hàm render giao diện cho từng mục kết quả ước lượng
  const renderEstimationResult = (rankInfo) => {
    const { rank, threshold, requiredGPA } = rankInfo;
    let statusClass = ''; // Class CSS động dựa trên kết quả
    let statusIcon = null;  // Icon động dựa trên kết quả
    let message = '';       // Thông điệp chính
    let explanation = ''; // Giải thích thêm (điểm chữ/10)

    // Xác định trạng thái và thông điệp tương ứng
    if (currentGPA >= threshold) {
      statusClass = 'status-achieved';
      statusIcon = <FaBullseye />;
      message = <>Đã đạt/vượt mục tiêu <strong>{rank}</strong> ({threshold.toFixed(2)}).</>;
    } else if (requiredGPA === null) {
      statusClass = 'status-error';
      statusIcon = <FaQuestionCircle />;
      message = `Lỗi tính toán cho mục tiêu ${rank}.`;
    } else if (requiredGPA > MAX_GPA) {
      statusClass = 'status-impossible';
      statusIcon = <FaChartLine style={{ transform: 'scaleY(-1)' }} />;
      message = <>Để đạt <strong>{rank}</strong> ({threshold.toFixed(2)}), cần GPA TB <span className="gpa-value required-impossible">{`> ${MAX_GPA.toFixed(2)}`}</span>.</>;
      explanation = "(Rất khó/Không thể)";
    } else if (requiredGPA <= 0) {
      statusClass = 'status-easy';
      statusIcon = <FaClipboardCheck />;
      message = <>Để đạt <strong>{rank}</strong> ({threshold.toFixed(2)}), chỉ cần không bị điểm F.</>;
      explanation = "(GPA TB cần ≤ 0.0)";
    } else {
      statusClass = 'status-possible';
      statusIcon = <FaChartLine />;
      const requiredLetter = getLetterGradeFromPoint(requiredGPA);
      const requiredScore10Range = getApproximateScore10RangeFromPoint(requiredGPA);
      message = <>Để đạt <strong>{rank}</strong> ({threshold.toFixed(2)}), cần GPA TB <span className="gpa-value required-possible">{requiredGPA.toFixed(2)}</span>.</>;
      explanation = `(Tương đương điểm chữ TB ${requiredLetter || '?'} hoặc điểm 10 TB ${requiredScore10Range || '?'})`;
    }

    // Trả về phần tử list item với style động
    return (
      <li key={rankInfo.key} className={`estimation-item ${statusClass}`}>
        <span className="status-icon">{statusIcon}</span>
        <div className="estimation-content">
          <span className="estimation-message">{message}</span>
          {explanation && <span className="estimation-explanation">{explanation}</span>}
        </div>
      </li>
    );
  };

  // Render giao diện chính của component
  return (
    <div className="gpa-estimator">
      {/* Khu vực nhập liệu */}
      <div className="estimator-input-area">
        <div className="input-group">
          <label htmlFor="futureCredits">
            <FaChartLine /> Số tín chỉ dự kiến học tiếp:
          </label>
          <input
            type="number"
            id="futureCredits"
            value={futureCredits}
            onChange={(e) => setFutureCredits(e.target.value)}
            placeholder="VD: 15"
            min="1"
            aria-label="Số tín chỉ dự kiến học tiếp"
          />
        </div>
        <button onClick={handleEstimate} className="action-button estimate-button">
          <FaCalculator /> Ước lượng
        </button>
      </div>

      {/* Giải thích ý nghĩa kết quả */}
      <p className="input-hint estimator-explanation-note">
        <FaInfoCircle /> Kết quả dưới đây cho biết điểm **trung bình** (hệ 4, chữ, 10) bạn cần đạt cho **tất cả** các tín chỉ dự kiến ở trên để đạt được xếp loại mong muốn.
      </p>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error-message estimator-error">{error}</p>}

      {/* Hiển thị kết quả ước lượng */}
      {estimations.length > 0 && (
        <div className="estimation-results">
          <h4>Kết quả ước lượng cho {parseFloat(futureCredits)} tín chỉ tới:</h4>
          <ul className="estimation-list">
            {estimations.map(result => renderEstimationResult(result))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GPAGoalEstimator;