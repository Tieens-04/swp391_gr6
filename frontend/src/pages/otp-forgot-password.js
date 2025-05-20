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

    const onSubmit = async (data) => {
        try {
            const res = await verifyOtp({
                email: localStorage.getItem("resetPasswordEmail"),
                otp: data.otp,
                task: "reset_password",
            });

            if (res.status === 200) {
                toast.success(res.body);
                window.location.href = "/password-reset";
            } else {
                toast.error("Xác thực thất bại!");
            }
        } catch (error) {
            toast.error("Lỗi kết nối server!");
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Mã OTP:</label>
                    <input type="text" {...register("otp")} />
                    <p style={{ color: "red" }}>{errors.otp?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }}>
                    Xác thực
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default OtpForgotPassword;