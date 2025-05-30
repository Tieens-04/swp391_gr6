import React, { useEffect, useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../components/banner';
import Header from '../components/header';
import Footer from '../components/footer';
import ScholarshipCard from '../components/ScholarshipCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { getAllScholarships } from '../services/scholarshipApi';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const res = await getAllScholarships();
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
            <Banner />
            <main className="container mt-5">
                <h2 className="text-center">Available Scholarships</h2>
                <div className="row">
                    {loading ? (
                        <div className="text-center my-5">Đang tải học bổng...</div>
                    ) : scholarships.length === 0 ? (
                        <div className="text-center my-5">Không có học bổng nào.</div>
                    ) : (
                        scholarships.map((scholarship) => (
                            <ScholarshipCard key={scholarship.scholarshipId} scholarship={scholarship} />
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}