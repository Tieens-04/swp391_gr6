function UserCard({ user }) {
    return (
        <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                        <i className="fas fa-user-circle fa-4x text-secondary"></i>
                    </div>
                    <div>
                        <h5 className="card-title mb-0">Name: {user.name}</h5>
                        <h5 className="card-title mb-1">Email: {user.email}</h5>
                        <span className="badge bg-info text-dark">{user.role}</span>
                    </div>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <strong>ID:</strong> {user.user_id}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default UserCard;