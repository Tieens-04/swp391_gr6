import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { UserContext } from "../contexts/UserContext";
import { seekerProfile, sendUpdateSeekerProfileOtp, verifyUpdateSeekerProfileOtp, seekerProfileUpdate } from "../services/seekerApi";
import { sendUpdateUserProfileOtp, verifyUpdateUserProfileOtp, userProfileUpdate } from "../services/userApi";
import { changePassword } from "../services/authApi";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OtpModal from "../components/OtpModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

import "../css/user-profile.css";

const profileSchema = yup.object().shape({
    // Thông tin cá nhân
    name: yup.string().required("Vui lòng nhập họ tên"),
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),
    date_of_birth: yup
        .string()
        .required("Vui lòng chọn ngày sinh"),
    gender: yup
        .string()
        .oneOf(["male", "female", ""], "Giới tính không hợp lệ"),
    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),

    // Thông tin học vấn & mục tiêu
    current_education_level: yup
        .string()
        .oneOf(["high_school", "undergraduate", "graduate", "postgraduate", ""], "Trình độ học vấn không hợp lệ")
        .nullable(),
    field_of_study: yup.string().nullable(),
    gpa: yup
        .number()
        .nullable()
        .min(0, "GPA phải lớn hơn hoặc bằng 0")
        .max(4, "GPA tối đa là 4"),
    target_degree: yup.string().nullable(),
    target_countries: yup.string().nullable(),
    preferred_languages: yup.string().nullable(),
    financial_need_level: yup
        .string()
        .oneOf(["low", "medium", "high", ""], "Mức tài chính không hợp lệ")
        .nullable(),
    cv_url: yup.string().url("Đường dẫn CV không hợp lệ").nullable(),
    bio: yup.string().nullable(),
});

const educationLevels = {
    high_school: "High School",
    undergraduate: "Undergraduate",
    graduate: "Graduate",
    postgraduate: "Postgraduate",
};

const financialLevels = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

function UserProfile() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editAcademic, setEditAcademic] = useState(false);

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [pendingUpdateType, setPendingUpdateType] = useState("");

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {}
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user || !user.accessToken) {
                    setLoading(false);
                    return;
                }
                const response = await seekerProfile({
                    token: user.accessToken
                });
                if (response.status !== 200) {
                    throw new Error("Failed to fetch profile");
                }
                setProfile(response.data);
                reset(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, reset]);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found.</div>;

    // Khi thay đổi input
    const handleChange = (e) => {
        setValue(e.target.name, e.target.value);
    };

    // Gửi OTP sau khi validate
    const onSendOtp = async (data, type) => {
        setOtpError("");
        setOtpLoading(true);
        try {
            if (type === "personal") {
                await sendUpdateUserProfileOtp({ email: data.email });
            } else {
                await sendUpdateSeekerProfileOtp({ email: profile.email });
            }
            setShowOtpModal(true);
            setPendingUpdateType(type);
        } catch (err) {
            setOtpError("Không gửi được OTP. Vui lòng thử lại.");
        }
        setOtpLoading(false);
    };

    // Xác thực OTP và cập nhật profile
    const handleSubmitOtp = async (otp) => {
        setOtpLoading(true);
        setOtpError("");
        try {
            let verified = false;
            const data = { ...profile, ...getValues() };
            if (pendingUpdateType === "personal") {
                const res = await verifyUpdateUserProfileOtp({ email: data.email, otp });
                verified = res.status === 200;
            } else {
                const res = await verifyUpdateSeekerProfileOtp({ email: profile.email, otp });
                verified = res.status === 200;
            }
            if (!verified) throw new Error();

            if (pendingUpdateType === "personal") {
                await userProfileUpdate({
                    name: data.name,
                    phone: data.phone,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    email: data.email,
                    token: user.accessToken
                });
            } else {
                await seekerProfileUpdate({
                    current_education_level: data.current_education_level,
                    field_of_study: data.field_of_study,
                    gpa: data.gpa,
                    target_degree: data.target_degree,
                    target_countries: data.target_countries,
                    preferred_languages: data.preferred_languages,
                    financial_need_level: data.financial_need_level,
                    cv_url: data.cv_url,
                    bio: data.bio,
                    token: user.accessToken
                });
            }

            setShowOtpModal(false);
            setEditPersonal(false);
            setEditAcademic(false);
            const response = await seekerProfile({ token: user.accessToken });
            setProfile(response.data);
            reset(response.data);
        } catch (err) {
            setOtpError("OTP không đúng hoặc đã hết hạn.");
        }
        setOtpLoading(false);
    };

    // Đổi mật khẩu
    const handleChangePassword = async (data) => {
        setChangePasswordLoading(true);
        setChangePasswordError("");
        try {
            const res = await changePassword({
                email: profile.email,
                oldPassword: data.old_password, // Đúng tên trường backend yêu cầu
                newPassword: data.new_password, // Đúng tên trường backend yêu cầu
                token: user.accessToken
            });
            if (res.status === 200) {
                toast.success("Đổi mật khẩu thành công!");
                setShowChangePasswordModal(false);
            }
        } catch (err) {
            setChangePasswordError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
        setChangePasswordLoading(false);
    };

    return (
        <div>
            <Header />
            <div className="container user-profile-container">
                <h2 className="text-center mb-2">User Profile</h2>
                <div className="text-center mb-4 fw-semibold">
                    ID: <span className="fw-normal">{profile.user_id || "Chưa cập nhật"}</span>
                </div>
                {/* Thông tin cá nhân */}
                {editPersonal ? (
                    <form onSubmit={handleSubmit((data) => onSendOtp(data, "personal"))}>
                        <div className="card mb-4 profile-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Thông tin cá nhân</span>
                                <div>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        type="submit"
                                        disabled={otpLoading}
                                    >
                                        Xác nhận
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        type="button"
                                        onClick={() => setEditPersonal(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td><b>Name:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("name")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.name?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Email:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("email")}
                                                    disabled
                                                />
                                                <span className="text-danger">{errors.email?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Phone:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("phone")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.phone?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Date of Birth:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    {...register("date_of_birth")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.date_of_birth?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Gender:</b></td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    {...register("gender")}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chưa cập nhật</option>
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                </select>
                                                <span className="text-danger">{errors.gender?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Password:</b></td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => setShowChangePasswordModal(true)}
                                                >
                                                    Đổi mật khẩu
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="card mb-4 profile-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Thông tin cá nhân</span>
                            <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={() => setEditPersonal(true)}
                            >
                                Cập nhật thông tin
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <table className="table mb-0">
                                <tbody>
                                    <tr>
                                        <td><b>Name:</b></td>
                                        <td>{profile.name || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Email:</b></td>
                                        <td>{profile.email || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Phone:</b></td>
                                        <td>{profile.phone || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Date of Birth:</b></td>
                                        <td>{profile.date_of_birth || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Gender:</b></td>
                                        <td>
                                            {profile.gender === "male"
                                                ? "Nam"
                                                : profile.gender === "female"
                                                    ? "Nữ"
                                                    : "Chưa cập nhật"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Password:</b></td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm"
                                                onClick={() => setShowChangePasswordModal(true)}
                                            >
                                                Đổi mật khẩu
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Thông tin học vấn & mục tiêu */}
                {editAcademic ? (
                    <form onSubmit={handleSubmit((data) => onSendOtp(data, "academic"))}>
                        <div className="card profile-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Thông tin học vấn & mục tiêu</span>
                                <div>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        type="submit"
                                        disabled={otpLoading}
                                    >
                                        Xác nhận
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        type="button"
                                        onClick={() => setEditAcademic(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td><b>Current Education Level:</b></td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    {...register("current_education_level")}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chưa cập nhật</option>
                                                    {Object.entries(educationLevels).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                                <span className="text-danger">{errors.current_education_level?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Field of Study:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("field_of_study")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.field_of_study?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>GPA:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("gpa")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.gpa?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Target Degree:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("target_degree")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.target_degree?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Target Countries:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("target_countries")}
                                                    onChange={handleChange}
                                                    placeholder="Nhập các nước, cách nhau bởi dấu phẩy"
                                                />
                                                <span className="text-danger">{errors.target_countries?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Preferred Languages:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("preferred_languages")}
                                                    onChange={handleChange}
                                                    placeholder="Nhập các ngôn ngữ, cách nhau bởi dấu phẩy"
                                                />
                                                <span className="text-danger">{errors.preferred_languages?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Financial Need Level:</b></td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    {...register("financial_need_level")}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chưa cập nhật</option>
                                                    {Object.entries(financialLevels).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                                <span className="text-danger">{errors.financial_need_level?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>CV:</b></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("cv_url")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.cv_url?.message}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Bio:</b></td>
                                            <td>
                                                <textarea
                                                    className="form-control"
                                                    {...register("bio")}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-danger">{errors.bio?.message}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="card profile-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Thông tin học vấn & mục tiêu</span>
                            <button
                                className="btn btn-primary btn-sm"
                                type="button"
                                onClick={() => setEditAcademic(true)}
                            >
                                Cập nhật thông tin
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <table className="table mb-0">
                                <tbody>
                                    <tr>
                                        <td><b>Current Education Level:</b></td>
                                        <td>{educationLevels[profile.current_education_level] || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Field of Study:</b></td>
                                        <td>{profile.field_of_study || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>GPA:</b></td>
                                        <td>{profile.gpa || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Target Degree:</b></td>
                                        <td>{profile.target_degree || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Target Countries:</b></td>
                                        <td>{profile.target_countries || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Preferred Languages:</b></td>
                                        <td>{profile.preferred_languages || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Financial Need Level:</b></td>
                                        <td>{financialLevels[profile.financial_need_level] || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>CV:</b></td>
                                        <td>
                                            {profile.cv_url ? (
                                                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                                                    View CV
                                                </a>
                                            ) : "Chưa cập nhật"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Bio:</b></td>
                                        <td>{profile.bio || "Chưa cập nhật"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <OtpModal
                show={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSubmitOtp={handleSubmitOtp}
                isLoading={otpLoading}
                errorMessage={otpError}
            />
            <ChangePasswordModal
                show={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSubmit={handleChangePassword}
                isLoading={changePasswordLoading}
                errorMessage={changePasswordError}
            />
            <Footer />
        </div>
    );
}

export default UserProfile;