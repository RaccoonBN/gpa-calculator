import React from 'react';
import './Header.css'; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <img
          src="/logo.svg"
          alt="VAA Logo"
          className="vaa-logo"
          style={{ height: '50px', width: 'auto' }}
        />
      </div>
    </header>
  );
}

export default Header;