import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";

    function ScholarshipRoute() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        );
    }

export default ScholarshipRoute;