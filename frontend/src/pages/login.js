import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login as loginUser } from "../services/authApi";

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu"),
});

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const res = await loginUser({
                email: data.email,
                password: data.password,
            });

            if (res.status === 200) {
                const { accessToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                toast.success("Đăng nhập thành công!");
                window.location.href = "/";
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Email hoặc mật khẩu không đúng");
                toast.error("Đăng nhập thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <div>
                    <label>Email:</label>
                    <input {...register("email")} />
                    <p style={{ color: "red" }}>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" {...register("password")} />
                    <p style={{ color: "red" }}>{errors.password?.message}</p>
                </div>

                <button
                    type="submit"
                    style={{ marginTop: 16 }}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <a href="/forgot-password" style={{ display: "block", marginTop: 16 }}>
                    Quên mật khẩu?
                </a>
            </form>
            <ToastContainer />
        </div>
    );
}

export default LoginForm;