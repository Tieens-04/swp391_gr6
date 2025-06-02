import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Search.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Search = () => {
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  const fields = ['Kế toán', 'Khoa học máy tính', 'Quảng cáo', 'Kỹ thuật hàng không', 'Sức khỏe cộng đồng'];
  const levels = ['Trung học', 'Đại học', 'Sau Đại học', 'Tiến sĩ'];
  const cities = ['Hà Nội', 'TP. HCM', 'Đà Nẵng'];
  const universities = ['ĐH Bách Khoa', 'ĐH Kinh tế Quốc dân', 'RMIT'];

  return (
    <>
     <Header />
     <div className="container mt-4">
      <p className="breadcrumb">Heatwave / Tìm học bổng cho bạn ngay nào</p>
      <h2 className="fw-bold mb-2">Học bổng cho bạn</h2>
      <p className="text-muted">Khám phá các học bổng từ các trường đại học hàng đầu bên dưới. Sử dụng bộ lọc để tìm kiếm theo lĩnh vực, trình độ, điểm đến và nhiều tiêu chí khác</p>
      
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary" onClick={toggleFilter}>
          <i className="fas fa-filter me-2"></i>Lọc học bổng
        </button>
      </div>

      {showFilter && (
        <div className="filter-panel shadow-sm p-4 mb-3">
          <h5 className="mb-3 fw-bold">Lọc các học bổng theo</h5>

          <div className="row">
            <div className="col-md-3">
              <p className="fw-semibold">Lĩnh vực giảng dạy</p>
              {fields.map((field, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" id={`field-${i}`} />
                  <label className="form-check-label" htmlFor={`field-${i}`}>{field}</label>
                </div>
              ))}
            </div>

            <div className="col-md-3">
              <p className="fw-semibold">Trình độ học tập</p>
              {levels.map((level, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" id={`level-${i}`} />
                  <label className="form-check-label" htmlFor={`level-${i}`}>{level}</label>
                </div>
              ))}
            </div>

            <div className="col-md-3">
              <p className="fw-semibold">Thành phố</p>
              {cities.map((city, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" id={`city-${i}`} />
                  <label className="form-check-label" htmlFor={`city-${i}`}>{city}</label>
                </div>
              ))}
            </div>

            <div className="col-md-3">
              <p className="fw-semibold">Trường đại học</p>
              {universities.map((uni, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" id={`uni-${i}`} />
                  <label className="form-check-label" htmlFor={`uni-${i}`}>{uni}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={toggleFilter}>Hủy bỏ</button>
            <button className="btn btn-primary">Áp dụng bộ lọc</button>
          </div>
        </div>
      )}
      
    </div>
    <Footer/>
    </>
    
  );
};

export default Search;
