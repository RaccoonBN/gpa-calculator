const scoreToLetterGradeMap = [
    { min: 8.5, max: 10.0, grade: 'A' },
    { min: 8.0, max: 8.4, grade: 'B+' },
    { min: 7.0, max: 7.9, grade: 'B' },
    { min: 6.5, max: 6.9, grade: 'C+' },
    { min: 5.5, max: 6.4, grade: 'C' },
    { min: 5.0, max: 5.4, grade: 'D+' },
    { min: 4.0, max: 4.9, grade: 'D' },
    { min: 3.0, max: 3.9, grade: 'F+' }, 
    { min: 0.0, max: 2.9, grade: 'F' },
  ];
  
  const letterGradeToPointMap = {
    'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0,
    'D+': 1.5, 'D': 1.0, 'F+': 0.5, 'F': 0.0,
  };
  
  // Sắp xếp từ cao xuống thấp để hàm getRankFromGPA hoạt động chính xác
  export const GPA_RANKS = [
    { rank: 'Xuất sắc', threshold: 3.60, key: 'excellent' },
    { rank: 'Giỏi', threshold: 3.20, key: 'good' },
    { rank: 'Khá', threshold: 2.50, key: 'fair' },
    { rank: 'Trung bình', threshold: 2.00, key: 'average' },
    { rank: 'Trung bình yếu', threshold: 1.00, key: 'weak_average' }, 
    { rank: 'Yếu/Kém', threshold: 0.00, key: 'poor' }, 
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
  
      // 1. Kiểm tra điểm có hợp lệ (0-10) không?
      // Nếu trọng số là 0, điểm không cần kiểm tra chặt chẽ (có thể trống)
      if (weight > 0 && (isNaN(score) || score < 0 || score > 10)) {
        console.warn("Điểm thành phần không hợp lệ khi trọng số > 0:", item);
        hasInvalidComponent = true;
        break;
      }
      // Nếu trọng số là 0 nhưng điểm nhập vào không hợp lệ (vd: chữ)
      if (weight === 0 && item.score && item.score.toString().trim() !== '' && isNaN(score)) {
          console.warn("Điểm thành phần không hợp lệ (kể cả khi trọng số = 0):", item);
          hasInvalidComponent = true;
          break;
      }
  
  
      // 2. Kiểm tra trọng số có hợp lệ (>= 0) không? (Cho phép trọng số bằng 0)
      if (isNaN(weight) || weight < 0) {
        console.warn("Trọng số thành phần không hợp lệ:", item);
        hasInvalidComponent = true;
        break;
      }
  
      // 3. Nếu cả điểm và trọng số đều hợp lệ, cộng vào tổng
      // Đảm bảo chỉ cộng điểm khi trọng số > 0 (điểm với trọng số 0 không ảnh hưởng)
      if (weight > 0 && !isNaN(score)) {
          totalScore += score * weight;
      }
      // Luôn cộng trọng số (kể cả 0) để kiểm tra tổng
      totalWeight += weight;
    }
  
    // 4. Kiểm tra nếu có thành phần không hợp lệ trong quá trình lặp
    if (hasInvalidComponent) {
       console.warn("Không thể tính điểm trung bình do có thành phần không hợp lệ.");
      return null;
    }
  
    // 5. Kiểm tra tổng trọng số có hợp lệ không?
    // Phải lớn hơn 0 và xấp xỉ 1
    if (totalWeight <= 0 || Math.abs(totalWeight - 1.0) > 0.01) {
      console.warn("Không thể tính điểm trung bình. Tổng trọng số không hợp lệ:", totalWeight);
      return null;
    }
  
    // 6. Tính điểm trung bình và làm tròn 1 chữ số thập phân
    const average = totalScore / totalWeight; // Chia cho totalWeight để chuẩn hóa
    return parseFloat(average.toFixed(1));
  };
  
  /**
   * Quy đổi điểm hệ 10 sang điểm chữ dựa trên bảng scoreToLetterGradeMap.
   * @param {number | null} averageScore10 - Điểm trung bình hệ 10.
   * @returns {string | null} Điểm chữ tương ứng hoặc null.
   */
  export const getLetterGrade = (averageScore10) => {
    if (averageScore10 === null || isNaN(averageScore10) || averageScore10 < 0 || averageScore10 > 10) {
      return null;
    }
    const score = parseFloat(averageScore10.toFixed(1));
  
    for (const mapping of scoreToLetterGradeMap) {
      if (score >= mapping.min && score <= mapping.max) {
        return mapping.grade;
      }
    }
    console.warn(`Không tìm thấy điểm chữ cho điểm số: ${score}`);
    return null;
  };
  
  /**
   * Quy đổi điểm chữ sang điểm hệ 4 dựa trên bảng letterGradeToPointMap.
   * @param {string | null} letterGrade - Điểm chữ.
   * @returns {number | null} Điểm hệ 4 tương ứng hoặc null.
   */
  export const getGradePoint = (letterGrade) => {
    if (!letterGrade) return null;
    return letterGradeToPointMap[letterGrade] ?? null;
  };
  
  /**
   * Helper: Tính toán chi tiết điểm cho một môn học (hệ 10, chữ, hệ 4).
   * @param {object} course - Object môn học chứa 'components'.
   * @returns {{averageScore10: number | null, letterGrade: string | null, gradePoint4: number | null}}
   */
  export const getCourseDetails = (course) => {
    if (!course || !Array.isArray(course.components)) {
      return { averageScore10: null, letterGrade: null, gradePoint4: null };
    }
    const averageScore10 = calculateAverageScore10(course.components);
    const letterGrade = getLetterGrade(averageScore10);
    const gradePoint4 = getGradePoint(letterGrade);
    return { averageScore10, letterGrade, gradePoint4 };
  };
  
  /**
   * Tính GPA tổng (hệ 4) cho một danh sách các môn học.
   * @param {Array<object>} courses - Mảng các object môn học.
   * @returns {{gpa: number, totalCredits: number}}
   */
  export const calculateGPA = (courses) => {
    let totalWeightedPoints4 = 0;
    let totalCreditsAttempted = 0;
  
    if (!Array.isArray(courses)) return { gpa: 0, totalCredits: 0 };
  
    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      if (!isNaN(credits) && credits > 0) {
        const details = getCourseDetails(course);
        // Chỉ tính môn có điểm hệ 4 hợp lệ (bao gồm F, F+)
        if (details.gradePoint4 !== null) {
          totalCreditsAttempted += credits;
          totalWeightedPoints4 += credits * details.gradePoint4;
        }
      }
    });
  
    if (totalCreditsAttempted === 0) return { gpa: 0, totalCredits: 0 };
  
    const gpa = totalWeightedPoints4 / totalCreditsAttempted;
    return {
      gpa: parseFloat(gpa.toFixed(2)),
      totalCredits: totalCreditsAttempted
    };
  };
  
  /**
   * Tính GPA cần thiết trong tương lai để đạt mục tiêu.
   * @param {number | null} currentGPA - GPA hiện tại (có thể null).
   * @param {number} currentCredits - Tín chỉ hiện tại.
   * @param {number} targetGPA - GPA mục tiêu.
   * @param {number} futureCredits - Tín chỉ tương lai.
   * @returns {number | null} GPA cần đạt hoặc null.
   */
  export const calculateRequiredGPA = (currentGPA, currentCredits, targetGPA, futureCredits) => {
    // Chấp nhận currentGPA là null hoặc 0 khi chưa có điểm
    const validCurrentGPA = (currentGPA === null || isNaN(currentGPA)) ? 0 : currentGPA;
    const validCurrentCredits = isNaN(currentCredits) ? 0 : currentCredits;
  
    if (
      validCurrentCredits < 0 || // Tín chỉ hiện tại không thể âm
      isNaN(targetGPA) ||
      isNaN(futureCredits) || futureCredits <= 0
    ) {
      return null;
    }
  
    const requiredTotalPoints = targetGPA * (validCurrentCredits + futureCredits);
    const currentTotalPoints = validCurrentGPA * validCurrentCredits;
    const requiredFuturePoints = requiredTotalPoints - currentTotalPoints;
    const requiredGPA = requiredFuturePoints / futureCredits;
    return parseFloat(requiredGPA.toFixed(2));
  };
  
  /**
   * Quy đổi điểm hệ 4 sang điểm chữ tương ứng gần nhất.
   * @param {number | null} gradePoint4 - Điểm hệ 4.
   * @returns {string | null} Điểm chữ hoặc null.
   */
  export const getLetterGradeFromPoint = (gradePoint4) => {
    if (gradePoint4 === null || isNaN(gradePoint4)) return null;
  
    // Xử lý các trường hợp biên đặc biệt
    if (gradePoint4 > MAX_GPA) gradePoint4 = MAX_GPA;
    if (gradePoint4 < 0) gradePoint4 = 0;
  
    let closestGrade = null;
    let minDiff = Infinity;
  
    for (const grade in letterGradeToPointMap) {
      const point = letterGradeToPointMap[grade];
      const diff = Math.abs(gradePoint4 - point);
  
     
      if (diff < minDiff) {
        minDiff = diff;
        closestGrade = grade;
      } else if (diff === minDiff) {
          // Nếu khoảng cách bằng nhau, có thể chọn cái có điểm 4 cao hơn
          if (point > letterGradeToPointMap[closestGrade]) {
               closestGrade = grade;
          }
      }
    }
    return closestGrade;
  };
  
  
  /**
   * Ước lượng khoảng điểm hệ 10 từ điểm hệ 4 (dựa trên điểm chữ tương ứng).
   * @param {number | null} gradePoint4 - Điểm hệ 4.
   * @returns {string} Chuỗi mô tả khoảng điểm hệ 10 ước lượng hoặc '-'.
   */
  export const getApproximateScore10RangeFromPoint = (gradePoint4) => {
      const letterGrade = getLetterGradeFromPoint(gradePoint4);
      if (!letterGrade) return '-';
  
      const scoreRange = scoreToLetterGradeMap.find(range => range.grade === letterGrade);
      if (!scoreRange) return '-';
  
      // Trả về khoảng điểm dạng "min - max"
      return `${scoreRange.min.toFixed(1)} - ${scoreRange.max.toFixed(1)}`;
  };
  
  
  /**
   * Xác định xếp loại học lực dựa trên GPA.
   * @param {number | null} gpa - Điểm GPA hệ 4.
   * @returns {string} Tên xếp loại hoặc '-'.
   */
  export const getRankFromGPA = (gpa) => {
    if (gpa === null || isNaN(gpa)) return '-';
  
    for (const rankInfo of GPA_RANKS) {
      if (gpa >= rankInfo.threshold) {
        return rankInfo.rank;
      }
    }
    // Đảm bảo luôn trả về rank thấp nhất nếu không đạt ngưỡng nào khác
    return GPA_RANKS[GPA_RANKS.length - 1]?.rank || 'Không xác định';
  };