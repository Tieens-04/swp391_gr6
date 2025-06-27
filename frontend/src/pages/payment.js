// src/pages/Payment.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/payment.css'; // <-- THÊM DÒNG NÀY
export default function Payment() {
    return (
        <div className="container my-5"> {/* Thêm margin top/bottom */}
            <h1 className="text-center mb-4 display-4 text-primary fw-bold">Trang Thanh Toán Dịch Vụ Học Bổng</h1>
            <p className="lead text-center mb-5 text-muted">
                Chào mừng bạn đến với trang thanh toán của Heatwave Scholarship.
                Tại đây, bạn có thể xem các gói dịch vụ hỗ trợ săn học bổng và tiến hành thanh toán.
            </p>

            <div className="row justify-content-center g-4"> {/* g-4 để tạo khoảng cách giữa các cột */}
                {/* GÓI HỖ TRỢ ĐƠN GIẢN */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-lg border-0 rounded-3 plan-card plan-basic"> {/* Thêm class cho CSS */}
                        <div className="card-header bg-success text-white text-center py-3 rounded-top-3">
                            <h3 className="mb-0">1. GÓI HỖ TRỢ ĐƠN GIẢN</h3>
                        </div>
                        <div className="card-body d-flex flex-column">
                            <p className="card-text text-center text-muted mb-3 flex-grow-1">
                                Phù hợp với người có thể tự làm, chỉ cần hướng dẫn đúng lộ trình.
                            </p>
                            <h4 className="text-center text-success mb-3">
                                Giá tham khảo: 10.000 VNĐ
                            </h4>
                            <ul className="list-unstyled text-start mb-4">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Định hướng chọn ngành, trường, học bổng phù hợp.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Checklist hồ sơ cần chuẩn bị.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Mẫu CV, SOP, thư giới thiệu.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Nhận xét nhanh 1 lần trên hồ sơ.</li>
                                <li className="text-danger"><i className="fas fa-times-circle text-danger me-2"></i>Không bao gồm: sửa bài luận, hỗ trợ nộp hồ sơ hoặc visa.</li>
                            </ul>
                            <div className="text-center mt-auto"> {/* Nút ở cuối card */}
                                <button className="btn btn-outline-success btn-lg">
                                    Chọn Gói Này
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GÓI TƯ VẤN CAO CẤP */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-lg border-0 rounded-3 plan-card plan-premium">
                        <div className="card-header bg-warning text-dark text-center py-3 rounded-top-3">
                            <h3 className="mb-0">2. GÓI TƯ VẤN CAO CẤP</h3>
                        </div>
                        <div className="card-body d-flex flex-column">
                            <p className="card-text text-center text-muted mb-3 flex-grow-1">
                                Dành cho người cần người đồng hành sát sao trong từng bước xin học bổng.
                            </p>
                            <h4 className="text-center text-warning mb-3">
                                Giá tham khảo: 20.000  VNĐ
                            </h4>
                            <ul className="list-unstyled text-start mb-4">
                                <li className="mb-2"><i className="fas fa-check-circle text-warning me-2"></i>Tư vấn chọn chiến lược học bổng & trường.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-warning me-2"></i>Sửa chi tiết CV, SOP, thư giới thiệu nhiều vòng.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-warning me-2"></i>Luyện phỏng vấn học bổng 1:1.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-warning me-2"></i>Theo dõi toàn bộ quy trình nộp hồ sơ.</li>
                            </ul>
                            <div className="text-center mt-auto">
                                <button className="btn btn-outline-warning btn-lg">
                                    Chọn Gói Này
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GÓI CHUYÊN SÂU TOÀN DIỆN */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-lg border-0 rounded-3 plan-card plan-ultimate">
                        <div className="card-header bg-danger text-white text-center py-3 rounded-top-3">
                            <h3 className="mb-0">3. GÓI CHUYÊN SÂU TOÀN DIỆN</h3>
                        </div>
                        <div className="card-body d-flex flex-column">
                            <p className="card-text text-center text-muted mb-3 flex-grow-1">
                                Phù hợp với người cần “kết quả”, không có thời gian hoặc muốn đảm bảo hiệu quả cao.
                            </p>
                            <h4 className="text-center text-danger mb-3">
                                Giá tham khảo: 30.000 VNĐ.
                            </h4>
                            <ul className="list-unstyled text-start mb-4">
                                <li className="mb-2"><i className="fas fa-check-circle text-danger me-2"></i>Làm việc 1-1 với chuyên gia từng đạt học bổng lớn.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-danger me-2"></i>Viết, chỉnh sửa SOP, CV, thư giới thiệu từ A-Z.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-danger me-2"></i>Nộp hồ sơ hộ, hỗ trợ xin visa, liên hệ trường.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-danger me-2"></i>Hướng dẫn trước khi bay, chọn chỗ ở, lên kế hoạch tài chính.</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-danger me-2"></i>Ưu tiên xử lý hồ sơ sớm.</li>
                            </ul>
                            <div className="text-center mt-auto">
                                <button className="btn btn-outline-danger btn-lg">
                                    Chọn Gói Này
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center mt-5 text-muted">
                Chúng tôi chấp nhận thanh toán qua ZaloPay và các hình thức khác.
            </p>

            <div className="text-center mt-4">
                <Link to="/contact" className="btn btn-info btn-lg">
                    Có câu hỏi? Liên hệ chúng tôi
                </Link>
            </div>
        </div>
    );
}