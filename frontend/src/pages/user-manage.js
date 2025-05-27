import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/UserContext";
import { userManage } from "../services/userApi";

import Header from '../components/header';
import Footer from '../components/footer';
import UserCard from '../components/UserCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function UserManage() {
    const { user: contextUser } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    return (
        <>
            <Header />
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="mb-4 text-center">
                            <i className="fas fa-users-cog me-2"></i>
                            Quản lý người dùng
                        </h2>
                        {error ? (
                            <div className="alert alert-danger text-center">{error}</div>
                        ) : userData ? (
                            <UserCard user={userData} />
                        ) : (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Đang tải thông tin người dùng...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
}

export default UserManage;