import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../services/authApi";

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

function ForgotPassword() {
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
            const res = await forgotPassword({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success(res.body);
                localStorage.setItem("resetPasswordEmail", data.email);
                window.location.href = "/otp-forgot-password";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Gửi mã OTP thất bại!");
                toast.error("Gửi mã OTP thất bại!");
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
            <h2>Quên mật khẩu</h2>
            <p className="text-center text-muted login-form-subtitle">
                Vui lòng nhập email của bạn để nhận mã OTP.
            </p>
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }} disabled={isLoading}>
                    {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ForgotPassword;