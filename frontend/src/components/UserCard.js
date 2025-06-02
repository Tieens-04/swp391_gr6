function UserCard({ user, onBan }) {
    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary fs-6">
                        <strong>ID:</strong> {user.userId}
                    </span>
                    <span className="badge bg-info text-dark">{user.role}</span>
                </div>
                <div className="text-center mb-3">
                    <i className="fas fa-user-circle fa-4x text-secondary"></i>
                </div>
                <div className="mb-2">
                    <h5 className="card-title mb-1">Name: {user.name}</h5>
                </div>
                <div className="mb-2">
                    <h5 className="card-title mb-1">Email: {user.email}</h5>
                </div>
                <div className="mb-2">
                    <h5 className="card-title mb-1">Phone: {user.phone}</h5>
                </div>
                <div className="mb-3">
                    <h5 className="card-title mb-1">Date of Birth: {user.dateOfBirth}</h5>
                </div>
                <div className="d-grid">
                    <button
                        className="btn btn-danger"
                        onClick={() => onBan && onBan(user)}
                    >
                        <i className="fas fa-ban me-2"></i>Ban
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserCard;