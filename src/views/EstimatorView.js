import React from 'react';
import GPAGoalEstimator from '../components/GPAGoalEstimator'; // Dùng lại component estimator
import { FaBullseye } from 'react-icons/fa';
import './ViewStyles.css';

function EstimatorView({ cumulativeResult }) {
  return (
    <div className="view-container estimator-view">
      <h2><FaBullseye /> Dự đoán điểm cần đạt</h2>

      {cumulativeResult.totalCredits > 0 ? (
        <GPAGoalEstimator
          currentGPA={cumulativeResult.gpa}
          currentCredits={cumulativeResult.totalCredits}
        />
      ) : (
        <p className="info-message">
          Bạn cần nhập ít nhất một môn học trong phần "Quản lý GPA" để có thể sử dụng chức năng dự đoán.
        </p>
      )}
    </div>
  );
}

export default EstimatorView;