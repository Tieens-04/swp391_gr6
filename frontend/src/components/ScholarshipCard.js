import { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/register.css';

function ScholarshipCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [liked, setLiked] = useState(false);

    return (
        <div className="col-md-4 mb-4">
            <div className="card scholarship-card h-100 shadow-sm border-2 rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <span className="badge bg-success mb-2">Hỗ trợ nhanh gọn</span>
                        <h5 className="fw-bold sponsor-name" style={{ cursor: 'pointer' }}>
                            Đơn vị tài trợ
                        </h5>
                        <p className="text-muted mb-2">Tên trường</p>
                    </div>
                    <i
                        className={`fa${liked ? 's' : 'r'} fa-heart fa-lg`}
                        style={{ color: liked ? 'hotpink' : 'gray', cursor: 'pointer' }}
                        onClick={() => setLiked(!liked)}
                    ></i>
                </div>

                <hr />

                <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                        <i className="fas fa-chart-line me-2"></i>
                        world rank : 1
                    </li>
                    <li className="mb-2">
                        <i className="fas fa-graduation-cap me-2"></i>
                        Trình độ học vấn
                    </li>
                    <li className="mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Nơi chốn (thành phố)
                    </li>
                    <li className="mb-2">
                        <i className="fas fa-calendar-alt me-2"></i>
                        time lineline
                    </li>
                    <li className="mb-2">
                        <i className="fas fa-check-circle me-2"></i>
                        đầu vào
                    </li>
                    <li className="mb-2">
                        <i className="fas fa-dollar-sign me-2"></i>
                        tiền tài trợ <i className="fas fa-dollar"></i>
                    </li>
                </ul>

                <div className="d-grid gap-2">
                    <button className="btn btn-primary rounded-pill">
                        Xem tôi có đủ điều kiện không
                    </button>
                    <button className="btn btn-outline-dark rounded-pill">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ScholarshipCard;
