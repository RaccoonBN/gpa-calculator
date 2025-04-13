import React from 'react';
import Semester from '../components/Semester';
import GPADisplay from '../components/GPADisplay';
import { FaPlusCircle, FaListOl } from 'react-icons/fa';
import './ViewStyles.css';

function GPAManagementView({
  semesters,
  cumulativeResult,
  onAddSemester,
  onUpdateSemester,
  onRemoveSemester
}) {
  return (
    <div className="view-container gpa-management-view">
        <h2><FaListOl /> Quản lý & Tính GPA Học kỳ / Tích lũy</h2>

        {/* Hiển thị GPA Tích lũy */}
        <section className="cumulative-gpa-section summary-box">
          <h3>Tổng kết</h3>
          <GPADisplay
            label="GPA Tích lũy"
            gpa={cumulativeResult.gpa}
            totalCredits={cumulativeResult.totalCredits}
            isCumulative={true}
          />
           {/* Có thể thêm hiển thị xếp loại ở đây */}
           {/* <p>Xếp loại dự kiến: <strong>{getRankFromGPA(cumulativeResult.gpa)}</strong></p> */}
        </section>

       {/* Nút Thêm học kỳ */}
        <div className="add-semester-controls">
            <button onClick={onAddSemester} className="action-button add-semester-button">
              <FaPlusCircle /> Thêm học kỳ mới
            </button>
        </div>

        {/* Danh sách học kỳ */}
         <div className="semesters-list">
          {semesters.length > 0 ? (
              [...semesters] // Tạo bản sao để sort không ảnh hưởng state gốc
                .sort((a, b) => (a?.id || 0) - (b?.id || 0))
                .map((semester) => (
                  <Semester
                    key={semester.id}
                    semesterData={semester}
                    onUpdateSemester={onUpdateSemester}
                    onRemoveSemester={onRemoveSemester}
                  />
               ))
          ) : (
             <p className="no-semesters-message">Chưa có học kỳ nào. Nhấn "Thêm học kỳ" để bắt đầu nhập điểm.</p>
          )}
        </div>
    </div>
  );
}

export default GPAManagementView;