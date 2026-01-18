import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© 2025 VAA GPA Calculator - Công cụ tham khảo.</p>
        <p>Luôn đối chiếu với quy định đào tạo của Học viện Hàng không Việt Nam.</p>
        <p>Dự án được thực hiện bởi <strong>RaccoonBN</strong>.</p>
      </div>

      <div className="footer-donation">
        <p className="donation-text">
          ☕ Nếu hữu ích, bạn có thể mời mình một ly cafe nhé!
        </p>
        <div className="qr-container">
          <img 
            src={process.env.PUBLIC_URL + '/qr.jpg'} 
            alt="Mã QR TP Bank" 
            className="qr-code"
            onError={(e) => {
              e.target.style.display = 'none'; 
              console.error("QR Image failed to load");
            }}
          />
          <div className="bank-info">
            <p className="bank-name">TP BANK</p>
            <p className="bank-number">11379983047</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;