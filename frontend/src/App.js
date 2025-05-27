import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import AuthRoute from "./routes/authRoute";
import UserRoute from "./routes/userRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Router>
          <Routes>
            
            <Route path="/*" element={<AuthRoute />} />
            <Route path="/admin/*" element={<UserRoute />} />
            {/* Thêm các route khác ở đây nếu có */}
          </Routes>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;