import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isLoggedIn: false,
        role: null,
        accessToken: null,
    });

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken); // Đã sửa ở đây
                setUser({
                    isLoggedIn: true,
                    name: decoded.name || null,
                    role: decoded.role,
                    accessToken,
                });
            } catch {
                setUser({ isLoggedIn: false, role: null, accessToken: null });
            }
        }
    }, []);

    const login = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        const decoded = jwtDecode(accessToken);
        setUser({
            isLoggedIn: true,
            name: decoded.name || null,
            role: decoded.role,
            accessToken,
        });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser({ isLoggedIn: false, role: null, accessToken: null });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}