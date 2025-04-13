import React from 'react';
import './Header.css'; 

function Header() {
  return (
    <header className="app-header">
        <div className="header-content">
        <img
            src={process.env.PUBLIC_URL + '/logo.svg'}
            alt="VAA Logo"
            className="vaa-logo"
            onError={(e) => console.error("Image failed to load:", e.target.src)}
            onLoad={(e) => console.log("Image loaded successfully:", e.target.src)}
        />
        <div className="text-content">
            <h1 className="app-title">VAA GPA Calculator</h1>
            <p className="app-subtitle">
            Công cụ hỗ trợ tính điểm cho sinh viên Học viện Hàng không Việt Nam
            </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
