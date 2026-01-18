import React from 'react';
import { FaCoffee, FaCopy, FaUniversity, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './Footer.css'; 

function Footer() {
  const accountNumber = "11379983047";
  const accountName = "TRẦN HUỲNH BẢO NGỌC";

  const handleCopy = (e) => {
    // Ngăn chặn sự kiện bị lan truyền nếu có component cha
    if (e) e.stopPropagation();

    // Thực hiện copy
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        toast.dismiss(); // Tắt các toast cũ (nếu có)
        toast.success('Đã sao chép số tài khoản!', {
          position: "top-center", 
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
      })
      .catch((err) => {
        // Fallback cho các trình duyệt cũ hoặc lỗi quyền truy cập
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Đã sao chép!');
      });
  };

  return (
    <footer className="app-footer">
      {/* Cấu hình Container tối giản nhất để tránh lỗi hiển thị ảo */}
      <ToastContainer 
        limit={1} 
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />

      <div className="footer-content">
        <p>© 2025 VAA GPA Calculator - Công cụ tham khảo.</p>
        <p>Luôn đối chiếu với quy định đào tạo của Học viện Hàng không Việt Nam.</p>
        <p>Dự án được thực hiện bởi <strong>RaccoonBN</strong>.</p>
      </div>

      <div className="footer-donation">
        <p className="donation-text">
          <FaCoffee className="icon-coffee" /> Nếu hữu ích, hãy mời mình một ly cafe nhé!
        </p>
        {/* Đảm bảo onClick được gắn chính xác vào thẻ bao ngoài */}
        <div className="bank-card" onClick={handleCopy} role="button" tabIndex="0">
          <div className="bank-brand">
            <FaUniversity className="icon-bank" />
            <span>TP BANK</span>
          </div>
          <div className="bank-details">
            <p className="acc-name"><FaUser className="icon-user" /> {accountName}</p>
            <p className="acc-number">{accountNumber}</p>
          </div>
          <FaCopy className="icon-copy" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;