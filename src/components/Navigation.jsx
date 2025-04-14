import React from 'react';
// Import các icon cần thiết
import { FaCalculator, FaListOl, FaBullseye } from 'react-icons/fa';
import './Navigation.css'; // Import CSS

// Danh sách các mục điều hướng
const navItems = [
  { key: 'single', label: 'Tính điểm môn', icon: <FaCalculator /> },
  { key: 'manage', label: 'Quản lý GPA', icon: <FaListOl /> },
  { key: 'estimator', label: 'Dự đoán điểm', icon: <FaBullseye /> },
];

/**
 * Component thanh điều hướng ngang, chỉ hiển thị icon trên màn hình nhỏ.
 * @param {string} activeView - Key của view đang active.
 * @param {function} setActiveView - Hàm để đổi view active.
 */
function Navigation({ activeView, setActiveView }) {
  return (
    // Sử dụng class CSS cho thanh điều hướng
    <nav className="app-navigation">
      {/* Lặp qua danh sách các mục để tạo nút */}
      {navItems.map(item => (
        <button
          key={item.key}
          // Thêm class 'active' nếu nút tương ứng với view hiện tại
          className={`nav-button ${activeView === item.key ? 'active' : ''}`}
          onClick={() => setActiveView(item.key)} // Gọi hàm đổi view khi nhấn
          title={item.label} // Tooltip hiển thị tên đầy đủ khi hover (desktop)
        >
          {/* Phần hiển thị icon */}
          <span className="nav-icon">{item.icon}</span>
          {/* Phần hiển thị label (sẽ bị ẩn bởi CSS trên màn hình nhỏ) */}
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;