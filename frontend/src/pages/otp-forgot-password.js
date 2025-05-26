import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOtp } from "../services/authApi";

const schema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
});

function OtpForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await verifyOtp({
                email: localStorage.getItem("resetPasswordEmail"),
                otp: data.otp,
                task: "reset_password",
            });

            if (res.status === 200) {
                toast.success(res.body);
                window.location.href = "/password-reset";
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Mã OTP không đúng hoặc đã hết hạn");
                toast.error("Xác thực thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Lỗi:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Đăng ký</h2>
            <p className="text-center text-muted login-form-subtitle">
                Vui lòng nhập mã OTP đã được gửi đến email của bạn.
            </p>
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Mã OTP:</label>
                    <input type="text" {...register("otp")} />
                    <p style={{ color: "red" }}>{errors.otp?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }} disabled={isLoading}>
                    {isLoading ? "Đang xác thực..." : "Xác thực"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default OtpForgotPassword;