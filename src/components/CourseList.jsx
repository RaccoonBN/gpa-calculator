import React from 'react';
import { getCourseDetails } from '../utils/gpaCalculator';
import { FaTrashAlt } from 'react-icons/fa';
import './CourseList.css'; // Import CSS cho component

/**
 * Component hiển thị danh sách các môn học trong một học kỳ dưới dạng bảng.
 * @param {Array<object>} courses - Mảng các môn học.
 * @param {function} onRemoveCourse - Hàm callback để xóa một môn học.
 */
function CourseList({ courses, onRemoveCourse }) {
  // Hiển thị thông báo nếu không có môn học nào
  if (!courses || courses.length === 0) {
    return <p className="no-courses-message">Chưa có môn học nào được thêm vào học kỳ này.</p>;
  }

  // Helper functions để định dạng và hiển thị điểm số/chữ cái
  const renderScore = (score) => (score !== null && !isNaN(score) ? score.toFixed(1) : '-');
  const renderGrade = (grade) => (grade !== null ? grade : '-');
  const renderGradePoint = (point) => (point !== null && !isNaN(point) ? point.toFixed(1) : '-');

  // Render bảng danh sách môn học
  return (
    <div className="course-list-container"> {/* Container hỗ trợ scroll ngang */}
      <table className="course-table">
        <thead>
          <tr>
            {/* Các cột tiêu đề */}
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
          {/* Lặp qua danh sách môn học để render từng dòng */}
          {courses.map((course) => {
            // Tính toán điểm chi tiết cho môn học hiện tại
            const details = getCourseDetails(course);
            // Lấy điểm thành phần để hiển thị (nếu có)
            const qtScore = course.components?.[0]?.score ?? null;
            const ckScore = course.components?.[1]?.score ?? null;

            return (
              <tr key={course.id}>
                {/* Các ô dữ liệu tương ứng với tiêu đề */}
                <td className="col-name">{course.name}</td>
                <td className="col-credits">{course.credits}</td>
                <td className="col-component">{renderScore(qtScore)}</td>
                <td className="col-component">{renderScore(ckScore)}</td>
                <td className="col-avg10">{renderScore(details.averageScore10)}</td>
                <td className="col-letter">{renderGrade(details.letterGrade)}</td>
                <td className="col-gpa4">{renderGradePoint(details.gradePoint4)}</td>
                <td className="col-action">
                  {/* Nút xóa môn học */}
                  <button
                    onClick={() => onRemoveCourse(course.id)}
                    className="remove-button"
                    aria-label={`Xóa môn ${course.name}`}
                    title="Xóa môn học này"
                  >
                    <FaTrashAlt />
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