import React from 'react';
import { FaRegComments } from 'react-icons/fa'; // Import icon từ react-icons
import FeedbackForm from '../components/Feedback'; // Import FeedbackForm component
import './ViewStyles.css'; // Import CSS chung cho view

const FeedbackPage = () => {
  return (
    <div className="view-container feedback-page">
      <h2>
        <FaRegComments/> {/* Thêm icon ở đây */}
        Đóng Góp Ý Kiến
      </h2>
      <FeedbackForm />
    </div>
  );
};

export default FeedbackPage;
