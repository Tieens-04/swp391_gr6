import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/UserContext";
import { userManage } from "../services/userApi";

import Header from '../components/Header';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import UserChart from "../components/UserChart";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function UserManage() {
    const { user: contextUser } = useContext(UserContext);
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 20;

    useEffect(() => {
        setLoading(true);
        setError(null);
        if (contextUser.accessToken === null && !contextUser.isLoggedIn) {
            setLoading(false);
            setError("Bạn chưa đăng nhập!");
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await userManage({ token: contextUser.accessToken });
                setUserData(response.data);
                setError(null);
            } catch (err) {
                let message = "Đã xảy ra lỗi!";
                if (err.response) {
                    if (err.response.status === 401) {
                        message = "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.";
                    } else if (err.response.status === 403) {
                        message = "Bạn không có quyền truy cập chức năng này.";
                    } else if (typeof err.response.data === "string") {
                        message = err.response.data;
                    }
                }
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [contextUser]);

    const totalPages = Math.ceil(userData.length / usersPerPage);
    const paginatedUsers = userData.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Header />
            <div className="container py-5" style={{ minHeight: "80vh" }}>
                <div className="container my-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-body text-center py-4">
                                    <h2 className="mb-3 fw-bold text-primary d-flex justify-content-center align-items-center gap-2">
                                        <i className="fas fa-users-cog"></i>
                                        <span>Quản lý người dùng</span>
                                    </h2>
                                    <p className="text-muted mb-4">
                                        Quản lý, thống kê và theo dõi thông tin người dùng hệ thống.
                                    </p>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                                        <a
                                            className="btn btn-success fw-bold shadow-sm d-flex align-items-center gap-2"
                                            href="/admin/create-staff"
                                        >
                                            <i className="fas fa-user-plus"></i>
                                            <span>Thêm nhân viên</span>
                                        </a>
                                        <a
                                            className="btn btn-primary fw-bold shadow-sm d-flex align-items-center gap-2"
                                            href="/admin/create-admin"
                                        >
                                            <i className="fas fa-user-shield"></i>
                                            <span>Thêm admin</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Biểu đồ thống kê */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <UserChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danh sách người dùng */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                {error ? (
                                    <div className="alert alert-danger text-center">{error}</div>
                                ) : loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Đang tải thông tin người dùng...</p>
                                    </div>
                                ) : (
                                    userData.length > 0 ? (
                                        <>
                                            <div className="row g-4">
                                                {paginatedUsers.map(user => (
                                                    <div className="col-md-6" key={user.user_id}>
                                                        <UserCard user={user} />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Pagination */}
                                            <nav className="mt-4">
                                                <ul className="pagination justify-content-center">
                                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            &laquo;
                                                        </button>
                                                    </li>
                                                    {Array.from({ length: totalPages }, (_, i) => (
                                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => handlePageChange(i + 1)}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            &raquo;
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </>
                                    ) : (
                                        <div className="alert alert-info text-center">Không có người dùng nào.</div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
}

export default UserManage;