import React from 'react';
import { getCourseDetails } from '../utils/gpaCalculator'; // Import helper

function CourseList({ courses, onRemoveCourse }) {
  if (!courses || courses.length === 0) {
    return <p className="no-courses-message">Chưa có môn học nào được thêm vào học kỳ này.</p>;
  }

  // Helper để hiển thị điểm hoặc dấu gạch ngang
  const renderScore = (score) => (score !== null && !isNaN(score) ? score.toFixed(1) : '-');
  const renderGrade = (grade) => (grade !== null ? grade : '-');
   const renderGradePoint = (point) => (point !== null && !isNaN(point) ? point.toFixed(1) : '-'); // Hiển thị 1 chữ số thập phân cho điểm 4

  return (
    <div className="course-list-container"> {/* Bọc ngoài để scroll nếu cần */}
        <table className="course-table">
          <thead>
            <tr>
              <th className="col-name">Tên môn học</th>
              <th className="col-credits">TC</th>
              <th className="col-component">Điểm QT</th>
              <th className="col-component">Điểm CK</th>
              <th className="col-avg10">Điểm 10</th>
              <th className="col-letter">Điểm Chữ</th>
              <th className="col-gpa4">Điểm 4</th>
              <th className="col-action">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              // Tính toán chi tiết điểm cho từng môn
              const details = getCourseDetails(course);
              const qtScore = course.components?.[0]?.score ?? null; // Lấy điểm QT (nếu có)
              const ckScore = course.components?.[1]?.score ?? null; // Lấy điểm CK (nếu có)

              return (
                <tr key={course.id}>
                  <td className="col-name">{course.name}</td>
                  <td className="col-credits">{course.credits}</td>
                  <td className="col-component">{renderScore(qtScore)}</td>
                  <td className="col-component">{renderScore(ckScore)}</td>
                  <td className="col-avg10">{renderScore(details.averageScore10)}</td>
                  <td className="col-letter">{renderGrade(details.letterGrade)}</td>
                  <td className="col-gpa4">{renderGradePoint(details.gradePoint4)}</td>
                  <td className="col-action">
                    <button
                      onClick={() => onRemoveCourse(course.id)}
                      className="remove-button"
                      aria-label={`Xóa môn ${course.name}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
}

export default CourseList;