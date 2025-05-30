import React, { useEffect, useState, useContext } from 'react';

import Header from '../components/header';
import Footer from '../components/footer';
import ScholarshipCard1 from '../components/ScholarshipCard1';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { getAllScholarships } from '../services/scholarshipApi';
import { UserContext } from '../contexts/UserContext';

function ScholarshipManage() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const token = user?.accessToken;
                if (!token) {
                    setScholarships([]);
                    setLoading(false);
                    return;
                }
                const res = await getAllScholarships({ token });
                setScholarships(res.data);
            } catch (err) {
                setScholarships([]);
            }
            setLoading(false);
        };
        fetchScholarships();
    }, [user]);

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center">Quản lý học bổng</h2>
                <div className="row">
                    {loading ? (
                        <div className="text-center my-5">Đang tải học bổng...</div>
                    ) : scholarships.length === 0 ? (
                        <div className="text-center my-5">Không có học bổng nào.</div>
                    ) : (
                        scholarships.map((scholarship) => (
                            <ScholarshipCard1
                                key={scholarship.scholarshipId}
                                scholarship={scholarship}
                            />
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ScholarshipManage;