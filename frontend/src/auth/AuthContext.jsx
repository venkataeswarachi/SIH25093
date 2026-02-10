import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { parseJwt } from '../utils/authUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                // Backend stores role in 'role' claim: { sub: email, role: "STUDENT", ... }
                // We can synthesize a user object
                setUser({
                    email: decoded.sub,
                    role: decoded.role,
                    ...decoded
                });
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data === 'CHANGE_PASSWORD_REQUIRED') {
                return { success: false, status: 'CHANGE_PASSWORD_REQUIRED' };
            }

            const token = response.data;
            if (typeof token === 'string' && token.length > 10) {
                localStorage.setItem('token', token);
                const decoded = parseJwt(token);
                setUser({
                    email: decoded.sub,
                    role: decoded.role,
                    ...decoded
                });
                return { success: true };
            } else {
                return { success: false, error: 'Invalid response from server' };
            }
        } catch (error) {
            console.error('Login error', error);
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
