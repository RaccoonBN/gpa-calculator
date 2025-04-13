import React from 'react';

function GPADisplay({ label, gpa, totalCredits, isCumulative = false }) {
  if (gpa === null || isNaN(gpa)) {
    // Có thể trả về một placeholder nếu muốn
    return (
        <div className={`gpa-display-item ${isCumulative ? 'cumulative' : 'semester-gpa'}`}>
          <span className="gpa-label">{label}:</span>
          <span className="gpa-value">-</span>
          {totalCredits > 0 && (
              <span className="gpa-credits"> ({totalCredits} TC)</span>
          )}
        </div>
    );
  }

  const gpaValue = gpa.toFixed(2);

  return (
    <div className={`gpa-display-item ${isCumulative ? 'cumulative' : 'semester-gpa'}`}>
      <span className="gpa-label">{label}:</span>
      <span className="gpa-value">{gpaValue}</span>
      {totalCredits > 0 && (
          <span className="gpa-credits"> ({totalCredits} TC)</span>
      )}
    </div>
  );
}

export default GPADisplay;