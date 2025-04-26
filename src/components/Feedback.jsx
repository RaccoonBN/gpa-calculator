import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import './Feedback.css'; // CSS file riêng cho feedback form

const FeedbackForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch('https://formspree.io/f/xpwdwdgp', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      toast.success('Góp ý đã được gửi thành công! Cảm ơn bạn rất nhiều.');
      form.reset();
    } else {
      toast.error('Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="feedback-form-container">
      <form onSubmit={handleSubmit} className="feedback-form">
        <label htmlFor="name">Tên của bạn (không bắt buộc):</label>
        <input type="text" id="name" name="name" placeholder="Nhập tên của bạn (nếu muốn)" />

        <label htmlFor="message">Nội dung góp ý<span style={{ color: 'red' }}>*</span>:</label>
        <textarea id="message" name="message" rows="5" required placeholder="Viết nội dung góp ý của bạn..." />

        <button type="submit">Gửi Góp Ý</button>
      </form>

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default FeedbackForm;
