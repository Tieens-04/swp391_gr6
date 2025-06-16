import React, { useState, useEffect } from 'react';

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

    const [costOptions] = useState([100000, 80000, 50000]);
    const [selectedCost, setSelectedCost] = useState([]);

    // Thêm filter cho language requirements
    const [toeflOptions] = useState([60, 80, 100]);
    const [selectedToefl, setSelectedToefl] = useState([]);

    const [ieltsOptions] = useState([6.0, 7.0, 8.0]);
    const [selectedIelts, setSelectedIelts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

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
        const maxSelectedCost = Math.min(...selectedCost);
        return amount <= maxSelectedCost;
    };

    // Filter cho language requirements
    const filterByLanguageRequirements = (scholarship) => {
        let pass = true;

        try {
            const lang = JSON.parse(scholarship.languageRequirements);

            if (selectedToefl.length > 0 && lang.toefl) {
                const minSelectedToefl = Math.min(...selectedToefl);
                if (lang.toefl > minSelectedToefl) pass = false;
            }

            if (selectedIelts.length > 0 && lang.ielts) {
                const minSelectedIelts = Math.min(...selectedIelts);
                if (lang.ielts > minSelectedIelts) pass = false;
            }
        } catch {
            // Nếu không parse được thì bỏ qua filter này
        }

        return pass;
    };

    const applyFilter = () => {
        const filtered = scholarships.filter(
            (s) =>
                filterByFields(s) &&
                filterByCities(s) &&
                filterByCost(s) &&
                filterByLanguageRequirements(s)
        );
        setFilteredScholarships(filtered);
        setCurrentPage(1);
        setShowFilter(false);
    };

    const clearFilters = () => {
        setSelectedFields([]);
        setSelectedCities([]);
        setSelectedCost([]);
        setSelectedToefl([]);
        setSelectedIelts([]);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = filteredScholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <p className="breadcrumb">Heatwave / Tìm học bổng cho bạn ngay nào</p>
                <h2 className="fw-bold mb-2">Học bổng cho bạn</h2>
                <p className="text-muted">
                    Khám phá các học bổng từ các trường đại học hàng đầu bên dưới. Sử dụng bộ lọc để tìm kiếm theo lĩnh vực, ngôn ngữ, thành phố và chi phí
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
                                        <input className="form-check-input" type="checkbox" id={`field-${i}`}
                                            checked={selectedFields.includes(field)}
                                            onChange={() => toggleSelection(field, selectedFields, setSelectedFields)} />
                                        <label className="form-check-label" htmlFor={`field-${i}`}>{field}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="col-md-3">
                                <p className="fw-semibold">Thành phố</p>
                                {cities.map((city, i) => (
                                    <div className="form-check" key={i}>
                                        <input className="form-check-input" type="checkbox" id={`city-${i}`}
                                            checked={selectedCities.includes(city)}
                                            onChange={() => toggleSelection(city, selectedCities, setSelectedCities)} />
                                        <label className="form-check-label" htmlFor={`city-${i}`}>{city}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="col-md-3">
                                <p className="fw-semibold">Chi phí học bổng</p>
                                {costOptions.map((cost, i) => (
                                    <div className="form-check" key={i}>
                                        <input className="form-check-input" type="checkbox" id={`cost-${i}`}
                                            checked={selectedCost.includes(cost)}
                                            onChange={() => toggleSelection(cost, selectedCost, setSelectedCost)} />
                                        <label className="form-check-label" htmlFor={`cost-${i}`}>
                                            {cost.toLocaleString('vi-VN')} GBP
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="col-md-3">
                                <p className="fw-semibold">Yêu cầu TOEFL</p>
                                {toeflOptions.map((score, i) => (
                                    <div className="form-check" key={i}>
                                        <input className="form-check-input" type="checkbox" id={`toefl-${i}`}
                                            checked={selectedToefl.includes(score)}
                                            onChange={() => toggleSelection(score, selectedToefl, setSelectedToefl)} />
                                        <label className="form-check-label" htmlFor={`toefl-${i}`}>
                                            {score} điểm
                                        </label>
                                    </div>
                                ))}

                                <p className="fw-semibold mt-3">Yêu cầu IELTS</p>
                                {ieltsOptions.map((score, i) => (
                                    <div className="form-check" key={i}>
                                        <input className="form-check-input" type="checkbox" id={`ielts-${i}`}
                                            checked={selectedIelts.includes(score)}
                                            onChange={() => toggleSelection(score, selectedIelts, setSelectedIelts)} />
                                        <label className="form-check-label" htmlFor={`ielts-${i}`}>
                                            {score.toFixed(1)}
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
                    {currentScholarships.length === 0 ? (
                        <div className="text-center my-5" style={{ fontWeight: 'bold', color: '#c2185b' }}>
                            Không có học bổng nào phù hợp.
                        </div>
                    ) : (
                        currentScholarships.map((scholarship) => (
                            <div className="col-md-4 mb-3" key={scholarship.scholarshipId}>
                                <ScholarshipCard scholarship={scholarship} />
                            </div>
                        ))
                    )}
                </div>

                {filteredScholarships.length > itemsPerPage && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    &laquo;
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
            <Footer />
        </>
    );
};

export default SearchSchool;
