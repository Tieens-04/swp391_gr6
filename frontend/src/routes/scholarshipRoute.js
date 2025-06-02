import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ScholarshipManage from "../pages/scholarship-manage";
import Search from "../pages/search";

    function ScholarshipRoute() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage-scholarships" element={<ScholarshipManage />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        );
    }

export default ScholarshipRoute;