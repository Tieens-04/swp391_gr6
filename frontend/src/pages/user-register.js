import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendOtp } from "../services/authApi";

import Header from '../components/header.js';
import Footer from '../components/footer.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../css/register.css";

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

function UserRegister() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await sendOtp({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success("Gửi mã OTP thành công!");
                localStorage.setItem("registerEmail", data.email);
                window.location.href = "/verify-otp";
            } else {
                toast.error("Gửi mã OTP thất bại!");
            }
        } catch (error) {
            toast.error("Lỗi kết nối server!");
            console.error("Error:", error);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="login-container">
                <div className="container login-form-container shadow rounded overflow-hidden">
                    <div className="row">
                        {/* Cột ảnh bên trái */}
                        <div className="col-md-6 d-none d-md-block login-image-col">
                            <img
                                src="https://picsum.photos/800"
                                alt="Login Visual"
                                className="login-image"
                            />
                        </div>

                        {/* Cột form bên phải */}
                        <div className="col-md-6 bg-white login-form-col">
                            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="text-center mb-3">
                                    <i className="fas fa-sign-in-alt me-2"></i>Đăng ký
                                </h2>
                                <p className="text-center text-muted mb-4">
                                    Chào mừng! Vui lòng nhập email để đăng ký.
                                </p>

                                <div className="mb-3">
                                    <label>Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Nhập email"
                                            {...register("email")}
                                        />
                                    </div>
                                    <p className="text-danger">{errors.email?.message}</p>
                                </div>

                                <button type="submit" className="btn btn-primary login-form-button">
                                    Gửi mã OTP
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default UserRegister;
