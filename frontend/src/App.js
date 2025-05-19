import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/user-register";
import OtpVerificationForm from "./pages/opt-verification";
import UserRegisterForm from "./pages/user-register-form";
import LoginForm from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/verify-otp" element={<OtpVerificationForm />} />
        <Route path="/user-register-form" element={<UserRegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;