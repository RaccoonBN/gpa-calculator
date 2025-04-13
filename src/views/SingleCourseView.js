import React, { useState, useMemo } from 'react';
import CourseInput from '../components/CourseInput'; // Dùng lại form input
import { getCourseDetails } from '../utils/gpaCalculator';
import './ViewStyles.css';
import { FaCalculator } from 'react-icons/fa'

function SingleCourseView() {
  const [courseData, setCourseData] = useState(null); // Lưu trữ dữ liệu môn vừa nhập
  const [tempIdCounter, setTempIdCounter] = useState(0); // Để CourseInput không bị lỗi thiếu key

  const handleCourseAdd = (newCourseData) => {
    // Chỉ lấy dữ liệu, không cần ID phức tạp
    setCourseData({
        name: newCourseData.name,
        credits: newCourseData.credits,
        components: newCourseData.components
    });
     setTempIdCounter(prev => prev + 1); // Trigger re-render của CourseInput nếu cần
  };

  // Tính toán kết quả khi courseData thay đổi
  const calculatedDetails = useMemo(() => {
    if (!courseData) return null;
    return getCourseDetails(courseData);
  }, [courseData]);

  const renderScore = (score) => (score !== null && !isNaN(score) ? score.toFixed(1) : '-');
  const renderGrade = (grade) => (grade !== null ? grade : '-');
  const renderGradePoint = (point) => (point !== null && !isNaN(point) ? point.toFixed(1) : '-');

  return (
    <div className="view-container single-course-view">
      <h2><FaCalculator /> Tính điểm trung bình môn</h2>
      <p>Nhập thông tin môn học để xem điểm hệ 10, điểm chữ và điểm hệ 4.</p>
      {/* Sử dụng CourseInput nhưng chỉ để nhập, không lưu vào state tổng */}
      {/* Truyền key thay đổi để reset form sau khi submit */}
      <CourseInput key={`single-${tempIdCounter}`} onAddCourse={handleCourseAdd} />

      {calculatedDetails && courseData && (
        <div className="result-display single-result-display">
          <h3>Kết quả cho môn: {courseData.name} ({courseData.credits} TC)</h3>
          <div className="result-grid">
            <div className="result-item">
                <span className="result-label">Điểm QT:</span>
                <span className="result-value">{renderScore(courseData.components?.[0]?.score)}</span>
            </div>
             <div className="result-item">
                <span className="result-label">Điểm CK:</span>
                <span className="result-value">{renderScore(courseData.components?.[1]?.score)}</span>
            </div>
             <div className="result-item result-highlight">
                <span className="result-label">Điểm hệ 10:</span>
                <span className="result-value">{renderScore(calculatedDetails.averageScore10)}</span>
            </div>
             <div className="result-item result-highlight">
                <span className="result-label">Điểm chữ:</span>
                <span className="result-value">{renderGrade(calculatedDetails.letterGrade)}</span>
            </div>
             <div className="result-item result-highlight score4">
                <span className="result-label">Điểm hệ 4:</span>
                <span className="result-value">{renderGradePoint(calculatedDetails.gradePoint4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCourseView;