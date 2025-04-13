import React, { useState, useEffect, useCallback, useId } from 'react';
import CourseInput from './CourseInput';
import CourseList from './CourseList';
import GPADisplay from './GPADisplay';
import { calculateGPA } from '../utils/gpaCalculator';

const Semester = React.memo(({ semesterData, onUpdateSemester, onRemoveSemester }) => {
  const [courses, setCourses] = useState(() => semesterData.courses || []);
  const [semesterName, setSemesterName] = useState(() => semesterData.name || `Học kỳ ${semesterData.id}`);
  const [semesterResult, setSemesterResult] = useState({ gpa: 0, totalCredits: 0 });
  const semesterId = useId(); // ID cho input tên học kỳ

  // Tính toán GPA học kỳ và cập nhật state tổng thể (App.js)
  const updateSemesterCalculation = useCallback(() => {
    const result = calculateGPA(courses); // Tính toán dựa trên state courses hiện tại
    setSemesterResult(result);

    // Kiểm tra xem có cần cập nhật lên App không (nếu có thay đổi thực sự)
    // So sánh nông là đủ vì calculateGPA trả về object mới
    if (semesterData.name !== semesterName ||
        semesterData.gpa !== result.gpa ||
        semesterData.totalCredits !== result.totalCredits ||
        // So sánh sâu hơn cho courses nếu cần, nhưng thường không cần thiết nếu chỉ thêm/xóa
        JSON.stringify(semesterData.courses) !== JSON.stringify(courses) )
    {
        onUpdateSemester(semesterData.id, {
            // ...semesterData, // Không cần spread cái cũ nếu ta gửi đủ dữ liệu mới
            id: semesterData.id, // Giữ lại ID
            name: semesterName,
            courses: courses, // Gửi danh sách courses mới nhất
            gpa: result.gpa,
            totalCredits: result.totalCredits
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, semesterName, semesterData.id, onUpdateSemester, semesterData.name, semesterData.gpa, semesterData.totalCredits, semesterData.courses]); // Thêm dependencies từ semesterData để kiểm tra thay đổi

  // Effect chạy khi courses hoặc semesterName thay đổi để tính lại và cập nhật
  useEffect(() => {
    updateSemesterCalculation();
  }, [courses, semesterName, updateSemesterCalculation]);

  const handleAddCourse = useCallback((newCourse) => {
    setCourses(prevCourses => [...prevCourses, newCourse]);
    // updateSemesterCalculation sẽ được trigger bởi useEffect
  }, []);

  const handleRemoveCourse = useCallback((courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    // updateSemesterCalculation sẽ được trigger bởi useEffect
  }, []);

  const handleNameChange = useCallback((e) => {
    setSemesterName(e.target.value);
    // updateSemesterCalculation sẽ được trigger bởi useEffect
  }, []);

  return (
    <div className="semester-container">
      <div className="semester-header">
        <input
          type="text"
          id={`${semesterId}-name`}
          value={semesterName}
          onChange={handleNameChange}
          className="semester-name-input"
          aria-label="Tên học kỳ"
        />
         <GPADisplay
            label="GPA Kỳ"
            gpa={semesterResult.gpa}
            totalCredits={semesterResult.totalCredits}
            isCumulative={false}
         />
        <button
            onClick={() => onRemoveSemester(semesterData.id)}
            className="remove-button remove-semester-button"
            aria-label={`Xóa ${semesterName}`}>
            × Xóa kỳ
        </button>
      </div>

      <CourseInput onAddCourse={handleAddCourse} />
      <CourseList courses={courses} onRemoveCourse={handleRemoveCourse} />

    </div>
  );
});

export default Semester;