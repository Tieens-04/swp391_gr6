import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header() {
    const { user, logout } = useContext(UserContext);

    return (
        <header className="bg-dark text-white">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <i className="fas fa-home"></i> Home
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {!user.isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/auth/login">Login</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/auth/user-register">Register</a>
                                    </li>
                                </>
                            )}
                            {user.isLoggedIn && user.role === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/admin/manage-users">Manage Users</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/manage-scholarships">Manage Scholarships</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/admin-dashboard">Admin Dashboard</a>
                                    </li>
                                </>
                            )}
                            {user.isLoggedIn && user.role === 'seeker' && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/profile">Profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/my-orders">My Orders</a>
                                    </li>
                                </>
                            )}
                            {user.isLoggedIn && (
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/logout"
                                        onClick={e => {
                                            e.preventDefault();
                                            logout();
                                            window.location.href = "/auth/login";
                                        }}
                                    >
                                        Logout
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}