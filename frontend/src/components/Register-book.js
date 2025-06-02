import React, { useState } from "react";
import "../css/register-book.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    studyTime: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ";
    if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.match(/^0\d{9}$/)) newErrors.phone = "SĐT không hợp lệ";
    if (!formData.country) newErrors.country = "Chọn quốc gia";
    if (!formData.studyTime) newErrors.studyTime = "Chọn thời gian";
    if (!formData.agree) newErrors.agree = "Bạn phải đồng ý với điều khoản";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate();
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length === 0) {
      alert("Gửi thành công!");
      // send formData to backend or API
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Đăng ký tư vấn cùng Chúng Tôi</h2>
        <p>
          Hãy để lại thông tin liên hệ của bạn để được tư vấn miễn phí với các
          chuyên gia của chúng tôi về khóa học, điểm đến du học, trường học phù
          hợp và cả học bổng!
        </p>

        <div className="row">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="Tên*"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Họ*"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Địa chỉ email*"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <select disabled>
              <option value="+84">+84 VN</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại*"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <select name="country" value={formData.country} onChange={handleChange}>
              <option value="">Quốc gia bạn muốn du học*</option>
              <option>Úc</option>
              <option>Mỹ</option>
              <option>Canada</option>
            </select>
            {errors.country && <span className="error-msg">{errors.country}</span>}
          </div>

          <div className="form-group">
            <select name="studyTime" value={formData.studyTime} onChange={handleChange}>
              <option value="">Bạn dự định du học khi nào?*</option>
              <option>2025</option>
              <option>2026</option>
            </select>
            {errors.studyTime && <span className="error-msg">{errors.studyTime}</span>}
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <select>
              <option>Văn phòng FPT gần nhất*</option>
              <option>Hà Nội</option>
              <option>TP. HCM</option>
            </select>
          </div>
          <div className="form-group">
            <select>
              <option>Hình thức tư vấn phù hợp*</option>
              <option>Gặp trực tiếp</option>
              <option>Online</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <select>
              <option>Bạn sẽ chi trả cho việc học như thế nào?*</option>
              <option>Cá nhân</option>
              <option>Học bổng</option>
            </select>
          </div>
          <div className="form-group">
            <select>
              <option>Bậc học bạn quan tâm*</option>
              <option>Đại học</option>
              <option>Thạc sĩ</option>
            </select>
          </div>
        </div>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            Tôi đồng ý với Chúng Tôi <a href="#">Điều khoản</a> và{" "}
            <a href="#">chính sách bảo mật</a>
            {errors.agree && <span className="error-msg">{errors.agree}</span>}
          </label>
          <label>
            <input type="checkbox" />
            Vui lòng liên hệ với tôi qua Zalo, email hoặc Facebook để hỗ trợ
          </label>
          <label>
            <input type="checkbox" />
            Tôi muốn nhận thông tin cập nhật và ưu đãi từ Chúng tôi
          </label>
        </div>

        <button type="submit" className="submit-button">
          Liên hệ tư vấn ngay
        </button>
      </form>

      <div className="image-box">
        <img src="/images/register-book-girl.png" alt="Student" />
      </div>
    </div>
  );
};

export default RegisterForm;
