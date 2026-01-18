import React from 'react';
// Import các icon cần thiết
import { FaCalculator, FaListOl, FaBullseye, FaCommentDots } from 'react-icons/fa';
import './Navigation.css'; // Import CSS

// Danh sách các mục điều hướng
const navItems = [
  { key: 'single', label: 'Tính điểm môn', icon: <FaCalculator /> },
  { key: 'manage', label: 'Quản lý GPA', icon: <FaListOl /> },
  { key: 'estimator', label: 'Dự đoán điểm', icon: <FaBullseye /> },
  { key: 'feedback', label: 'Góp Ý & Ủng hộ', icon: <FaCommentDots /> }, // <<< Thêm tab Góp Ý
];

/**
 * Component thanh điều hướng ngang, chỉ hiển thị icon trên màn hình nhỏ.
 * @param {string} activeView - Key của view đang active.
 * @param {function} setActiveView - Hàm để đổi view active.
 */
function Navigation({ activeView, setActiveView }) {
  return (
    <nav className="app-navigation">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`nav-button ${activeView === item.key ? 'active' : ''}`}
          onClick={() => setActiveView(item.key)}
          title={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
