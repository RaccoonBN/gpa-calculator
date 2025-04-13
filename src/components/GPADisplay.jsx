import React from 'react';
import './GPADisplay.css'; // Import CSS cho component

/**
 * Component hiển thị điểm GPA (học kỳ hoặc tích lũy).
 * @param {string} label - Nhãn hiển thị (VD: "GPA Kỳ", "GPA Tích lũy").
 * @param {number | null} gpa - Giá trị GPA (hệ 4).
 * @param {number | null} totalCredits - Tổng số tín chỉ tương ứng.
 * @param {boolean} isCumulative - Cờ xác định đây là GPA tích lũy hay không.
 */
function GPADisplay({ label, gpa, totalCredits, isCumulative = false }) {
  // Xác định class CSS dựa trên loại GPA để style khác nhau
  const containerClass = `gpa-display-item ${isCumulative ? 'cumulative' : 'semester-gpa'}`;

  // Xử lý trường hợp GPA không hợp lệ (null hoặc NaN)
  if (gpa === null || isNaN(gpa)) {
    return (
      <div className={containerClass}>
        <span className="gpa-label">{label}:</span>
        <span className="gpa-value placeholder">-</span> {/* Hiển thị dấu gạch ngang */}
        {/* Vẫn hiển thị tín chỉ nếu có, kể cả là 0 */}
        {totalCredits !== null && !isNaN(totalCredits) && totalCredits >= 0 && (
          <span className="gpa-credits"> ({totalCredits} TC)</span>
        )}
      </div>
    );
  }

  // Định dạng giá trị GPA hiển thị (luôn 2 chữ số thập phân)
  const gpaValue = gpa.toFixed(2);

  // Render giao diện khi GPA hợp lệ
  return (
    <div className={containerClass}>
      <span className="gpa-label">{label}:</span>
      <span className="gpa-value">{gpaValue}</span>
      {/* Chỉ hiển thị tổng tín chỉ khi nó lớn hơn 0 */}
      {totalCredits !== null && !isNaN(totalCredits) && totalCredits > 0 && (
        <span className="gpa-credits"> ({totalCredits} TC)</span>
      )}
    </div>
  );
}

export default GPADisplay;