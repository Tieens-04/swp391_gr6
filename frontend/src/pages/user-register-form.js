import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register as registerUser } from "../services/authApi";
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/register.css';

const schema = yup.object().shape({
    fullname: yup
        .string()
        .required("Vui lòng nhập họ tên")
        .matches(/^[a-zA-Z\s]+$/, "Họ tên không được chứa số hoặc ký tự đặc biệt"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải từ 8 ký tự trở lên")
        .matches(/[a-zA-Z]/, "Mật khẩu cần có chữ cái")
        .matches(/\d/, "Mật khẩu cần có số")
        .matches(/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]/, "Mật khẩu cần có ký tự đặc biệt"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

function UserRegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const email = localStorage.getItem("registerEmail");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await registerUser({
                fullName: data.fullname,
                email: email,
                passwordHash: data.password,
                role: "applicant",
            });

            if (res.status === 201) {
                toast.success("Đăng ký thành công!");
                localStorage.removeItem("registerEmail");
                window.location.href = "/login";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Đăng ký thất bại!");
                toast.error("Đăng ký thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="register-container">
                <div className="register-form">
                    <h2 className="register-title">Đăng ký</h2>
                    <p className="register-subtitle">
                        Vui lòng điền thông tin để tạo tài khoản.
                    </p>

                    {errorMessage && (
                        <div className="alert alert-danger register-error">{errorMessage}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Họ tên:</label>
                            <input
                                className={`form-input ${errors.fullname ? 'input-error' : ''}`}
                                {...register("fullname")}
                                placeholder="Nhập họ và tên"
                            />
                            {errors.fullname && (
                                <p className="error-message">{errors.fullname.message}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu:</label>
                            <input
                                type="password"
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                {...register("password")}
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && (
                                <p className="error-message">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Xác nhận mật khẩu:</label>
                            <input
                                type="password"
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                {...register("confirmPassword")}
                                placeholder="Nhập lại mật khẩu"
                            />
                            {errors.confirmPassword && (
                                <p className="error-message">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </div>
    );

}

export default UserRegisterForm;