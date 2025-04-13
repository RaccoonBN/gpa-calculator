# GPA Calculator for Students - Vietnam Aviation Academy 🎓✈️

Ứng dụng web đơn giản giúp sinh viên Học viện Hàng không Việt Nam (VAA) tính nhanh điểm trung bình học kỳ, điểm trung bình môn, và GPA tích lũy theo đúng công thức chuẩn của nhà trường.

## 🚀 Tính năng chính

- ✅ Tính GPA học kỳ nhanh chóng
- ✅ Tính GPA tích lũy nhiều kỳ
- ✅ Không cần đăng nhập hay lưu trữ
- ✅ Ước tính điểm trung bình cần đạt để đạt loại **Giỏi/Xuất sắc**
- ✅ Hỗ trợ giao diện dễ sử dụng, chạy trực tiếp trên trình duyệt

## 🖥️ Công nghệ sử dụng

- ⚛️ [React](https://reactjs.org/)
- 🧮 JavaScript / HTML / CSS
- 🧾 GitHub Pages (triển khai miễn phí)

## 📊 Công thức tính GPA tích lũy

\[
\text{GPA}_{\text{năm học}} = \frac{
(GPA_{\text{kỳ I}} \times \sum TC_{\text{kỳ I}}) + 
(GPA_{\text{kỳ II}} \times \sum TC_{\text{kỳ II}}) + 
(GPA_{\text{kỳ III}} \times \sum TC_{\text{kỳ III}})
}{
\sum TC_{\text{năm học}}
}
\]

## 📦 Cài đặt & chạy local

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
npm start
