import React, { useState, useEffect, useCallback, useId } from 'react';
import CourseInput from './CourseInput';
import CourseList from './CourseList';
import GPADisplay from './GPADisplay';
import { calculateGPA } from '../utils/gpaCalculator';
import { FaTrashAlt } from 'react-icons/fa';
import './Semester.css';

// Sử dụng React.memo để tối ưu, chỉ render lại khi props thay đổi thực sự
const Semester = React.memo(({ semesterData, onUpdateSemester, onRemoveSemester }) => {
  // State quản lý danh sách môn học và tên học kỳ
  const [courses, setCourses] = useState(() => semesterData.courses || []);
  const [semesterName, setSemesterName] = useState(() => semesterData.name || `Học kỳ ${semesterData.id}`);
  // State lưu kết quả tính toán GPA của kỳ này
  const [semesterResult, setSemesterResult] = useState({ gpa: 0, totalCredits: 0 });
  // Tạo ID duy nhất cho input tên học kỳ để đảm bảo label htmlFor hoạt động đúng
  const semesterId = useId();

  // Hàm tính toán GPA kỳ và gọi callback để cập nhật state ở App.js
  const updateSemesterCalculation = useCallback(() => {
    const result = calculateGPA(courses);
    setSemesterResult(result);

    // Chỉ gọi onUpdateSemester nếu có sự thay đổi dữ liệu so với props nhận vào
    if (
      semesterData.name !== semesterName ||
      semesterData.gpa !== result.gpa ||
      semesterData.totalCredits !== result.totalCredits ||
      JSON.stringify(semesterData.courses) !== JSON.stringify(courses) // So sánh nông courses array
    ) {
      onUpdateSemester(semesterData.id, {
        id: semesterData.id,
        name: semesterName,
        courses: courses,
        gpa: result.gpa,
        totalCredits: result.totalCredits,
      });
    }
  // Dependencies cần thiết để hàm useCallback được tạo lại khi các giá trị này thay đổi
  }, [courses, semesterName, semesterData, onUpdateSemester]); // Bỏ các trường cụ thể của semesterData để đơn giản hơn

  // Effect chạy khi courses hoặc semesterName thay đổi để tính toán lại
  useEffect(() => {
    updateSemesterCalculation();
  }, [courses, semesterName, updateSemesterCalculation]);

  // Callback xử lý việc thêm môn học mới
  const handleAddCourse = useCallback((newCourse) => {
    setCourses(prevCourses => [...prevCourses, newCourse]);
  }, []);

  // Callback xử lý việc xóa môn học
  const handleRemoveCourse = useCallback((courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  }, []);

  // Callback xử lý việc thay đổi tên học kỳ
  const handleNameChange = useCallback((e) => {
    setSemesterName(e.target.value);
  }, []);

  return (
    <div className="semester-container">
      {/* Phần header của học kỳ: Tên, GPA, Nút xóa */}
      <div className="semester-header">
        <input
          type="text"
          id={`${semesterId}-name`}
          value={semesterName}
          onChange={handleNameChange}
          className="semester-name-input"
          aria-label="Tên học kỳ"
          placeholder="Nhập tên học kỳ..."
        />
        <div className="semester-gpa-display">
          <GPADisplay
            label="GPA Kỳ"
            gpa={semesterResult.gpa}
            totalCredits={semesterResult.totalCredits}
            isCumulative={false} // Đánh dấu đây là GPA kỳ
          />
        </div>
        <button
          onClick={() => onRemoveSemester(semesterData.id)}
          className="remove-semester-button"
          aria-label={`Xóa ${semesterName}`}
          title={`Xóa ${semesterName}`}
        >
          <FaTrashAlt />
          <span className="button-text">Xóa kỳ</span>
        </button>
      </div>

      {/* Phần nội dung: Form nhập và danh sách môn học */}
      <div className="semester-content">
        <CourseInput onAddCourse={handleAddCourse} />
        <CourseList courses={courses} onRemoveCourse={handleRemoveCourse} />
      </div>
    </div>
  );
});

export default Semester;