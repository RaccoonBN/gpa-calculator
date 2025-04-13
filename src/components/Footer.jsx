import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="app-footer">
      <p>
        © {new Date().getFullYear()} VAA GPA Calculator - Công cụ tham khảo.
      </p>
      <p>
        Luôn đối chiếu với quy định đào tạo chính thức của Học viện Hàng không Việt Nam.
      </p>
      <p>
        Dự án được thực hiện bởi <strong>RaccoonBN</strong>.
      </p>
    </footer>
  );
}

export default Footer;
