import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendOtp } from "../services/authApi";

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
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }}>
                    Gửi mã OTP
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default UserRegister;