import React from 'react';
import { FaCalculator, FaListOl, FaChartLine, FaBullseye } from 'react-icons/fa';
import './Navigation.css'; 
const navItems = [
  { key: 'single', label: 'Tính điểm môn', icon: <FaCalculator /> },
  { key: 'manage', label: 'Quản lý GPA', icon: <FaListOl /> },
  { key: 'estimator', label: 'Dự đoán điểm', icon: <FaBullseye /> },
  // { key: 'cumulative', label: 'GPA Tích Lũy', icon: <FaChartLine /> }, // Có thể gộp vào 'manage'
];

function Navigation({ activeView, setActiveView }) {
  return (
    <nav className="app-navigation">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`nav-button ${activeView === item.key ? 'active' : ''}`}
          onClick={() => setActiveView(item.key)}
          title={item.label} // Tooltip cho icon
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;