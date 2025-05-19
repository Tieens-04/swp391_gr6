import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register as registerUser } from "../services/authApi";

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

    const email = localStorage.getItem("registerEmail");

    const onSubmit = async (data) => {
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
            } else {
                toast.error("Đăng ký thất bại!");
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
                    <label>Họ tên:</label>
                    <input {...register("fullname")} />
                    <p style={{ color: "red" }}>{errors.fullname?.message}</p>
                </div>

                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <div>
                    <label>Xác nhận mật khẩu:</label>
                    <input type="password" {...register("confirmPassword")} />
                    <p style={{ color: "red" }}>{errors.confirmPassword?.message}</p>
                </div>

                <button type="submit" style={{ marginTop: 16 }}>
                    Đăng ký
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default UserRegisterForm;