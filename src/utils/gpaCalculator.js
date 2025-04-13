// src/utils/gpaCalculator.js

// --- Constants ---

// QUAN TRỌNG: Thang điểm quy đổi chính thức từ VAA
// Bảng 1: Điểm hệ 10 -> Điểm chữ
const scoreToLetterGradeMap = [
    { min: 8.5, max: 10.0, grade: 'A' },
    { min: 8.0, max: 8.4, grade: 'B+' },
    { min: 7.0, max: 7.9, grade: 'B' },
    { min: 6.5, max: 6.9, grade: 'C+' },
    { min: 5.5, max: 6.4, grade: 'C' },
    { min: 5.0, max: 5.4, grade: 'D+' },
    { min: 4.0, max: 4.9, grade: 'D' },
    { min: 3.0, max: 3.9, grade: 'F+' }, // Lưu ý F+
    { min: 0.0, max: 2.9, grade: 'F' },
  ];
  
  // Bảng 2: Điểm chữ -> Điểm hệ 4
  const letterGradeToPointMap = {
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F+': 0.5, // Lưu ý F+
    'F': 0.0,
  };
  
  // Ngưỡng GPA để xếp loại (Xác nhận lại với quy định VAA nếu cần)
  // Sắp xếp từ cao xuống thấp để hàm getRankFromGPA hoạt động chính xác
  export const GPA_RANKS = [
    { rank: 'Xuất sắc', threshold: 3.60, key: 'excellent' },
    { rank: 'Giỏi', threshold: 3.20, key: 'good' },
    { rank: 'Khá', threshold: 2.50, key: 'fair' },
    { rank: 'Trung bình', threshold: 2.00, key: 'average' }, // Ngưỡng ví dụ
    { rank: 'Trung bình yếu', threshold: 1.00, key: 'weak_average' }, // Ngưỡng ví dụ
    { rank: 'Yếu/Kém', threshold: 0.00, key: 'poor' }, // Ngưỡng thấp nhất
  ];
  
  export const MAX_GPA = 4.0;
  
  // --- Calculation Functions ---
  
  /**
   * Tính điểm trung bình môn (hệ 10) từ các điểm thành phần và tỷ lệ.
   * @param {Array<{score: number | string, weight: number | string}>} components - Mảng các thành phần điểm (điểm và trọng số có thể là string).
   * @returns {number | null} Điểm trung bình đã làm tròn 1 chữ số hoặc null nếu không hợp lệ.
   */
  export const calculateAverageScore10 = (components) => {
    if (!Array.isArray(components) || components.length === 0) {
      return null;
    }
    let totalScore = 0;
    let totalWeight = 0;
    let hasInvalidComponent = false;
  
    for (const item of components) {
      // Parse score và weight thành số
      const score = parseFloat(item.score);
      const weight = parseFloat(item.weight);
  
      // Kiểm tra tính hợp lệ của điểm (0-10) và trọng số (>0)
      if (isNaN(score) || score < 0 || score > 10 || isNaN(weight) || weight <= 0) {
        console.warn("Thành phần điểm hoặc trọng số không hợp lệ:", item);
        hasInvalidComponent = true;
        break; // Dừng nếu gặp thành phần không hợp lệ
      }
      totalScore += score * weight;
      totalWeight += weight;
    }
  
    // Kiểm tra nếu có thành phần không hợp lệ HOẶC tổng trọng số không xấp xỉ 1
    if (hasInvalidComponent || totalWeight <= 0 || Math.abs(totalWeight - 1.0) > 0.01) {
      console.warn("Không thể tính điểm trung bình. Thành phần không hợp lệ hoặc tổng trọng số khác 1:", totalWeight);
      return null;
    }
  
    // Tính điểm trung bình (chia cho totalWeight để xử lý sai số nhỏ) và làm tròn 1 chữ số thập phân
    const average = totalScore / totalWeight;
    return parseFloat(average.toFixed(1));
  };
  
  /**
   * Quy đổi điểm hệ 10 sang điểm chữ dựa trên bảng scoreToLetterGradeMap.
   * @param {number | null} averageScore10 - Điểm trung bình hệ 10 (đã làm tròn 1 chữ số).
   * @returns {string | null} Điểm chữ tương ứng hoặc null nếu không hợp lệ.
   */
  export const getLetterGrade = (averageScore10) => {
    // Kiểm tra đầu vào
    if (averageScore10 === null || isNaN(averageScore10) || averageScore10 < 0 || averageScore10 > 10) {
      return null;
    }
    // Đảm bảo đầu vào đã được làm tròn (phòng trường hợp gọi từ nguồn khác)
    const score = parseFloat(averageScore10.toFixed(1));
  
    // Tìm điểm chữ tương ứng trong bảng map
    for (const mapping of scoreToLetterGradeMap) {
      // So sánh trong khoảng min và max (đã bao gồm cả cận)
      if (score >= mapping.min && score <= mapping.max) {
        return mapping.grade;
      }
    }
  
    // Nếu không tìm thấy trong các khoảng đã định nghĩa (trường hợp hy hữu)
    console.warn(`Không tìm thấy điểm chữ cho điểm số: ${score}`);
    return null;
  };
  
  /**
   * Quy đổi điểm chữ sang điểm hệ 4 dựa trên bảng letterGradeToPointMap.
   * @param {string | null} letterGrade - Điểm chữ.
   * @returns {number | null} Điểm hệ 4 tương ứng hoặc null nếu không hợp lệ.
   */
  export const getGradePoint = (letterGrade) => {
    if (!letterGrade) {
      return null; // Trả về null nếu không có điểm chữ
    }
    // Trả về điểm tương ứng hoặc null nếu không tìm thấy trong map
    return letterGradeToPointMap[letterGrade] ?? null;
  };
  
  /**
   * Helper function: Tính toán chi tiết điểm cho một môn học (hệ 10, chữ, hệ 4).
   * @param {object} course - Object môn học chứa 'components' là mảng các thành phần điểm.
   * @returns {{averageScore10: number | null, letterGrade: string | null, gradePoint4: number | null}} Object chứa các kết quả tính toán.
   */
  export const getCourseDetails = (course) => {
    // Kiểm tra đầu vào cơ bản
    if (!course || !Array.isArray(course.components)) {
      return { averageScore10: null, letterGrade: null, gradePoint4: null };
    }
  
    // Tính toán các giá trị
    const averageScore10 = calculateAverageScore10(course.components);
    const letterGrade = getLetterGrade(averageScore10);
    const gradePoint4 = getGradePoint(letterGrade);
  
    // Trả về kết quả
    return { averageScore10, letterGrade, gradePoint4 };
  };
  
  /**
   * Tính GPA tổng (hệ 4) cho một danh sách các môn học.
   * @param {Array<object>} courses - Mảng các object môn học, mỗi object cần có 'credits' và 'components'.
   * @returns {{gpa: number, totalCredits: number}} Object chứa GPA và tổng số tín chỉ đã tính.
   */
  export const calculateGPA = (courses) => {
    let totalWeightedPoints4 = 0; // Tổng điểm trọng số (Điểm hệ 4 * Tín chỉ)
    let totalCreditsAttempted = 0; // Tổng tín chỉ của các môn được tính vào GPA
  
    // Kiểm tra nếu courses không phải là mảng hoặc rỗng
    if (!Array.isArray(courses)) {
      return { gpa: 0, totalCredits: 0 };
    }
  
    courses.forEach(course => {
      // Parse tín chỉ thành số
      const credits = parseFloat(course.credits);
  
      // Chỉ xử lý những môn có số tín chỉ hợp lệ (dương)
      if (!isNaN(credits) && credits > 0) {
        // Lấy chi tiết điểm của môn học
        const details = getCourseDetails(course);
  
        // Chỉ tính vào GPA nếu môn đó có điểm hệ 4 hợp lệ (khác null)
        // Điều này đảm bảo các môn F (0 điểm) và F+ (0.5 điểm) vẫn được tính
        if (details.gradePoint4 !== null) {
          totalCreditsAttempted += credits;
          totalWeightedPoints4 += credits * details.gradePoint4;
        }
      }
    });
  
    // Tránh chia cho 0 nếu không có môn nào được tính
    if (totalCreditsAttempted === 0) {
      return { gpa: 0, totalCredits: 0 };
    }
  
    // Tính GPA và làm tròn đến 2 chữ số thập phân
    const gpa = totalWeightedPoints4 / totalCreditsAttempted;
    return {
      gpa: parseFloat(gpa.toFixed(2)),
      totalCredits: totalCreditsAttempted
    };
  };
  
  /**
   * Tính GPA trung bình cần đạt trong tương lai để đạt được một GPA mục tiêu.
   * @param {number} currentGPA - GPA tích lũy hiện tại.
   * @param {number} currentCredits - Tổng số tín chỉ đã tích lũy.
   * @param {number} targetGPA - GPA mục tiêu muốn đạt.
   * @param {number} futureCredits - Số tín chỉ dự kiến học trong tương lai.
   * @returns {number | null} GPA cần đạt cho các tín chỉ tương lai (đã làm tròn 2 chữ số) hoặc null nếu đầu vào không hợp lệ.
   */
  export const calculateRequiredGPA = (currentGPA, currentCredits, targetGPA, futureCredits) => {
    // Kiểm tra các giá trị đầu vào
    if (
      isNaN(currentGPA) || isNaN(currentCredits) || currentCredits < 0 ||
      isNaN(targetGPA) ||
      isNaN(futureCredits) || futureCredits <= 0 // Tín chỉ tương lai phải dương
    ) {
      return null;
    }
  
    // Tính toán dựa trên công thức:
    // requiredGPA = (targetGPA * (currentCredits + futureCredits) - currentGPA * currentCredits) / futureCredits
    const requiredTotalPoints = targetGPA * (currentCredits + futureCredits);
    const currentTotalPoints = currentGPA * currentCredits;
    const requiredFuturePoints = requiredTotalPoints - currentTotalPoints;
    const requiredGPA = requiredFuturePoints / futureCredits;
  
    // Trả về kết quả đã làm tròn, không giới hạn trong khoảng 0-4 ở đây
    // Việc diễn giải kết quả (ví dụ: > 4.0 là không thể) sẽ do component gọi xử lý
    return parseFloat(requiredGPA.toFixed(2));
  };
  
  /**
   * Xác định xếp loại học lực dựa trên GPA.
   * @param {number | null} gpa - Điểm GPA hệ 4.
   * @returns {string} Tên xếp loại tương ứng hoặc '-' nếu GPA không hợp lệ.
   */
  export const getRankFromGPA = (gpa) => {
    if (gpa === null || isNaN(gpa)) {
      return '-'; // Trả về ký hiệu không xác định nếu GPA không hợp lệ
    }
  
    // Duyệt qua các mức xếp loại từ cao xuống thấp
    for (const rankInfo of GPA_RANKS) {
      // Nếu GPA đạt hoặc vượt ngưỡng của mức xếp loại hiện tại
      if (gpa >= rankInfo.threshold) {
        return rankInfo.rank; // Trả về tên xếp loại đó
      }
    }
  
    // Nếu không rơi vào trường hợp nào ở trên (vô lý nếu GPA_RANKS có ngưỡng 0.0)
    return 'Không xác định'; // Hoặc một giá trị mặc định khác
  };