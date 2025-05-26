import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../services/authApi";

const schema = yup.object().shape({
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

function PasswordReset() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const email = localStorage.getItem("resetPasswordEmail");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await resetPassword({
                email: email,
                newPassword: data.password,
            });

            if (res.status === 200) {
                toast.success(res.body);
                localStorage.removeItem("resetPasswordEmail");
                window.location.href = "/login";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Đặt lại mật khẩu thất bại!");
                toast.error("Đặt lại mật khẩu thất bại!");
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
            <h2>Đặt lại mật khẩu</h2>
            <p className="text-center text-muted login-form-subtitle">
                Vui lòng nhập mật khẩu mới của bạn.
            </p>
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Mật khẩu mới:</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div>
                    <label>Xác nhận mật khẩu:</label>
                    <input type="password" {...register("confirmPassword")} />
                    <p style={{ color: "red" }}>{errors.confirmPassword?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }} disabled={isLoading}>
                    {isLoading ? "Đang đặt lại..." : "Đặt lại"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default PasswordReset;