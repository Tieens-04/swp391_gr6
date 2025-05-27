import { Routes, Route } from "react-router-dom";
import UserManage from "../pages/user-manage";

function UserRoute() {
    return (
        <Routes>
            <Route path="/manage-users" element={<UserManage />} />
        </Routes>
    );
}

export default UserRoute;