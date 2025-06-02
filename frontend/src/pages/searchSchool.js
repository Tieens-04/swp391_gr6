import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Search.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard from '../components/ScholarshipCard';
import { getAllScholarships } from '../services/scholarshipApi';

const SearchSchool = () => {
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);

  const [fields, setFields] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const [schoolRanks] = useState([80, 50, 10, 5, 1]);
  const [selectedSchoolRanks, setSelectedSchoolRanks] = useState([]);

  const [costOptions] = useState([100000, 80000, 50000]);
  const [selectedCost, setSelectedCost] = useState([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await getAllScholarships();
        const data = res.data;

        setScholarships(data);
        setFilteredScholarships(data);

        const fieldsSet = new Set();
        const citiesSet = new Set();

        data.forEach((sch) => {
          try {
            const fs = JSON.parse(sch.fieldsOfStudy);
            if (Array.isArray(fs)) fs.forEach((f) => fieldsSet.add(f));
            else fieldsSet.add(fs);
          } catch {
            if (sch.fieldsOfStudy) fieldsSet.add(sch.fieldsOfStudy);
          }

          try {
            const cs = JSON.parse(sch.countries);
            if (Array.isArray(cs)) cs.forEach((c) => citiesSet.add(c));
            else citiesSet.add(cs);
          } catch {
            if (sch.countries) citiesSet.add(sch.countries);
          }
        });

        setFields(Array.from(fieldsSet).sort());
        setCities(Array.from(citiesSet).sort());
      } catch (error) {
        console.error('Lỗi khi tải học bổng:', error);
        setScholarships([]);
        setFilteredScholarships([]);
      }
    };

    fetchScholarships();
  }, []);

  // Helpers để chọn/bỏ chọn checkbox đa lựa chọn
  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const filterByFields = (scholarship) => {
    if (selectedFields.length === 0) return true;
    try {
      const fs = JSON.parse(scholarship.fieldsOfStudy);
      if (Array.isArray(fs)) return fs.some((f) => selectedFields.includes(f));
      else return selectedFields.includes(fs);
    } catch {
      return selectedFields.includes(scholarship.fieldsOfStudy);
    }
  };

  const filterBySchoolRank = (scholarship) => {
    if (selectedSchoolRanks.length === 0) return true;
    const orgRank = Number(scholarship.organizationWorldRank);
    if (isNaN(orgRank)) return false;
    const maxSelectedRank = Math.max(...selectedSchoolRanks);
    return orgRank <= maxSelectedRank;
  };

  const filterByCities = (scholarship) => {
    if (selectedCities.length === 0) return true;
    try {
      const cs = JSON.parse(scholarship.countries);
      if (Array.isArray(cs)) return cs.some((c) => selectedCities.includes(c));
      else return selectedCities.includes(cs);
    } catch {
      return selectedCities.includes(scholarship.countries);
    }
  };

  const filterByCost = (scholarship) => {
    if (selectedCost.length === 0) return true;
    const amount = Number(scholarship.amount);
    if (isNaN(amount)) return false;
    // Chọn cost nhỏ nhất trong những cost được chọn để so sánh
    const maxSelectedCost = Math.min(...selectedCost);
    return amount <= maxSelectedCost;
  };

  const applyFilter = () => {
    const filtered = scholarships.filter(
      (s) =>
        filterByFields(s) &&
        filterBySchoolRank(s) &&
        filterByCities(s) &&
        filterByCost(s)
    );
    setFilteredScholarships(filtered);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setSelectedFields([]);
    setSelectedSchoolRanks([]);
    setSelectedCities([]);
    setSelectedCost([]);
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <p className="breadcrumb">Heatwave / Tìm học bổng cho bạn ngay nào</p>
        <h2 className="fw-bold mb-2">Học bổng cho bạn</h2>
        <p className="text-muted">
          Khám phá các học bổng từ các trường đại học hàng đầu bên dưới. Sử dụng bộ lọc để tìm kiếm theo lĩnh vực, school rank, điểm đến và nhiều tiêu chí khác
        </p>

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
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`field-${i}`}
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleSelection(field, selectedFields, setSelectedFields)}
                    />
                    <label className="form-check-label" htmlFor={`field-${i}`}>
                      {field}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-3">
                <p className="fw-semibold">Xếp hạng tổ chức</p>
                {schoolRanks.map((rank, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`rank-${i}`}
                      checked={selectedSchoolRanks.includes(rank)}
                      onChange={() => toggleSelection(rank, selectedSchoolRanks, setSelectedSchoolRanks)}
                    />
                    <label className="form-check-label" htmlFor={`rank-${i}`}>
                      Top {rank}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-3">
                <p className="fw-semibold">Thành phố</p>
                {cities.map((city, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`city-${i}`}
                      checked={selectedCities.includes(city)}
                      onChange={() => toggleSelection(city, selectedCities, setSelectedCities)}
                    />
                    <label className="form-check-label" htmlFor={`city-${i}`}>
                      {city}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-3">
                <p className="fw-semibold">Chi phí học bổng (≤)</p>
                {costOptions.map((cost, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cost-${i}`}
                      checked={selectedCost.includes(cost)}
                      onChange={() => toggleSelection(cost, selectedCost, setSelectedCost)}
                    />
                    <label className="form-check-label" htmlFor={`cost-${i}`}>
                      {cost.toLocaleString('vi-VN')} GBP
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => { clearFilters(); setShowFilter(false); }}>
                Hủy bỏ
              </button>
              <button className="btn btn-primary" onClick={applyFilter}>
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        )}

        <div className="row">
          {filteredScholarships.length === 0 ? (
            <div
              className="text-center my-5"
              style={{ fontWeight: 'bold', color: '#c2185b' }}
            >
              Không có học bổng nào phù hợp.
            </div>

          ) : (
            filteredScholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.scholarshipId} scholarship={scholarship} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchSchool;
