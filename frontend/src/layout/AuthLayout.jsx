import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-body) 100%)',
            padding: '1rem'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <Outlet />
            </div>
        </div>
    );
};
export default AuthLayout;
