import "react-toastify/dist/ReactToastify.css";
import '../css/register.css';

function ScholarshipCard1({ scholarship, onEdit, onDelete }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const formatAmount = (amount, currency) => {
        if (amount == null) return 'Không rõ';
        return amount.toLocaleString('vi-VN') + (currency ? ` ${currency}` : '');
    };

    const parseJson = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr);
            if (Array.isArray(arr)) return arr.join(', ');
            return jsonStr;
        } catch {
            return jsonStr;
        }
    };

    return (
        <div className="col-12 mb-4">
            <div className="card scholarship-card h-100 shadow-sm border-2 rounded-4 p-3 d-flex flex-row align-items-stretch">
                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                {scholarship?.featured && (
                                    <span className="badge bg-warning text-dark mb-2 me-2">Nổi bật</span>
                                )}
                                <h5 className="fw-bold sponsor-name" style={{ cursor: 'pointer' }}>
                                    {scholarship?.title || 'Tên học bổng'}
                                </h5>
                                <p className="text-muted mb-2">{scholarship?.organizationName || 'Đơn vị tài trợ'}</p>
                            </div>
                        </div>
                        <hr />
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <i className="fas fa-chart-line me-2"></i>
                                Xếp hạng tổ chức: {scholarship?.organizationWorldRank ?? 'Không rõ'}
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-graduation-cap me-2"></i>
                                {parseJson(scholarship?.fieldsOfStudy) || 'Không rõ'}
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {parseJson(scholarship?.countries) || 'Không rõ'}
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-calendar-alt me-2"></i>
                                Hạn nộp: {formatDate(scholarship?.applicationDeadline)}
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-check-circle me-2"></i>
                                Yêu cầu ngôn ngữ: {parseJson(scholarship?.languageRequirements) || 'Không yêu cầu'}
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-dollar-sign me-2"></i>
                                Chi phí: {formatAmount(scholarship?.amount, scholarship?.currency)}
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex justify-content-end mt-3 gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => onEdit?.(scholarship)}>
                            <i className="fas fa-edit me-1"></i>Chỉnh sửa
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(scholarship)}>
                            <i className="fas fa-trash me-1"></i>Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScholarshipCard1;