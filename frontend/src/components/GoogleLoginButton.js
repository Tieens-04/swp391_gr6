import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { googleLogin } from '../services/authApi';

function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const res = await googleLogin({
                token: credentialResponse.credential,
            });
            localStorage.setItem('jwt', res.data.token);
            toast.success('Đăng nhập thành công!');
            window.location.href = '/';
        } catch (err) {
            console.error('Error during Google login:', err);
            toast.error('Đăng nhập Google thất bại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            useOneTap
            disabled={isLoading}
        />
    );
}

export default GoogleLoginButton;