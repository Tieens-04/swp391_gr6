import { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";

function ScholarshipCard() {
    const [isLoading, setIsLoading] = useState(false);



    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Scholarship Title</h5>
                <p className="card-text">School Name</p>

                <p>Dia diem</p>
                <p>Trinh do chuyen mon</p>
                <p>Hinh thuc ho tro</p>
                <p>Deadline</p>
                <p>Giatri</p>
                <button
                    className="btn btn-primary"
                    onSubmit>
                    Apply Now
                </button>
            </div>
        </div>
    );
}

export default ScholarshipCard;