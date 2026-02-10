import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Path to your sidebar
import Navbar from '../components/Navbar';   // Path to your navbar

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ 
                flex: 1, 
                marginLeft: 'var(--sidebar-width)', 
                marginTop: 'var(--header-height)',
                minHeight: 'calc(100vh - var(--header-height))',
                background: '#f8fafc',
                padding: '2rem'
            }}>
                <Navbar />
                <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet /> {/* This renders the specific admin pages */}
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;