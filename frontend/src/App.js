import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import AuthRoute from "./routes/authRoute";
import UserRoute from "./routes/userRoute";
import SeekerRoute from "./routes/seekerRoute";
import ScholarshipRoute from "./routes/scholarshipRoute";
import DetailRoute from "./routes/detailRoute";

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/auth/*" element={<AuthRoute />} />
                        <Route path="/admin/*" element={<UserRoute />} />
                        <Route path="/seeker/*" element={<SeekerRoute />} />
                        <Route path="/*" element={<ScholarshipRoute />} />
                        <Route path="/detailRoute/*" element={<DetailRoute />} />
                        {/* Thêm các route khác ở đây nếu có */}
                    </Routes>
                </Router>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;