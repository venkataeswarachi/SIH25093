import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../auth/AuthContext';

const MainLayout = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ padding: '2rem' }}>Loading app...</div>;
    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card">
                    <h2 className="heading-md" style={{ color: 'var(--danger)' }}>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                    <button onClick={() => window.history.back()} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <Sidebar />
            <Navbar />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                paddingTop: 'var(--header-height)',
                padding: 'calc(var(--header-height) + 2rem) 2rem 2rem 2rem',
                minHeight: '100vh'
            }}>
                <div className="container" style={{ maxWidth: '100%', margin: 0 }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
export default MainLayout;
