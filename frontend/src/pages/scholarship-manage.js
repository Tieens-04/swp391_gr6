import React, { useEffect, useState, useContext } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard1 from '../components/ScholarshipCard1';

import { getAllScholarships } from '../services/scholarshipApi';
import { UserContext } from '../contexts/UserContext';

function ScholarshipManage() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const token = user?.accessToken;
                if (!token) {
                    setScholarships([]);
                    setLoading(false);
                    return;
                }
                const res = await getAllScholarships({ token });
                setScholarships(res.data);
            } catch (err) {
                setScholarships([]);
            }
            setLoading(false);
        };
        fetchScholarships();
    }, [user]);

    // Tính toán các học bổng sẽ hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = scholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(scholarships.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center">Quản lý học bổng</h2>
                <div className="row">
                    {loading ? (
                        <div className="text-center my-5">Đang tải học bổng...</div>
                    ) : scholarships.length === 0 ? (
                        <div className="text-center my-5">Không có học bổng nào.</div>
                    ) : (
                        currentScholarships.map((scholarship) => (
                            <ScholarshipCard1
                                key={scholarship.scholarshipId}
                                scholarship={scholarship}
                            />
                        ))
                    )}
                </div>
                {/* Phân trang */}
                {!loading && scholarships.length > itemsPerPage && (
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
            </main>
            <Footer />
        </>
    );
}

export default ScholarshipManage;