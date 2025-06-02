import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header() {
    const { user, logout } = useContext(UserContext);

    return (
        <header className="bg-white text-dark shadow-sm py-2">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    {/* Logo  */}
                    <a className="navbar-brand" href="/">
                        <img
                            src="/images/hb1.png"
                            alt="Heatwave Scholarship"
                            style={{ height: '40px' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder-logo.png";
                            }}
                        />
                    </a>

                    {/* Menu chính giữa */}
                    <div className="mx-auto">
                        <ul className="navbar-nav" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/about">ABOUT</a>
                            </li>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/search">FIND SCHOLARSHIPS</a>
                            </li>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/services">SERVICES</a>
                            </li>
                        </ul>
                    </div>

                    {/* Dropdown user menu */}
                    <div className="ms-auto">
                        <div className="dropdown">
                            <button
                                className="btn btn-light dropdown-toggle d-flex align-items-center"
                                type="button"
                                id="userMenu"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ border: 'none' }}
                            >
                                <i className="fas fa-user-circle fs-4"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                <li><a className="dropdown-item" href="/contact">Contact</a></li>
                                {!user.isLoggedIn ? (
                                    <>
                                        <li><a className="dropdown-item" href="/auth/login">Login</a></li>
                                        <li><a className="dropdown-item" href="/auth/user-register">Register</a></li>
                                    </>
                                ) : (
                                    <>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><a className="dropdown-item" href="/admin/manage-users">Manage Users</a></li>
                                                <li><a className="dropdown-item" href="/manage-scholarships">Manage Scholarships</a></li>
                                            </>
                                        )}
                                        <li><a className="dropdown-item" href="/profile">Profile</a></li>
                                        <li>
                                            <a
                                                className="dropdown-item text-danger"
                                                href="/logout"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    logout();
                                                    window.location.href = "/auth/login";
                                                }}
                                            >
                                                Logout
                                            </a>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}