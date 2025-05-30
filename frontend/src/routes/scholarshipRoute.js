import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ScholarshipManage from "../pages/scholarship-manage";

    function ScholarshipRoute() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage-scholarships" element={<ScholarshipManage />} />
            </Routes>
        );
    }

export default ScholarshipRoute;