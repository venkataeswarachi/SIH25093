import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import vvitLogo from '../assets/vvit-logo.png';
const Sidebar = () => {
    const { user } = useAuth();
    const role = user?.role || 'STUDENT';

    const links = {
        STUDENT: [
            { to: '/student/dashboard', label: 'Dashboard' },
            { to: '/student/profile', label: 'My Profile' },
            { to: '/student/academics', label: 'Academics' },
            { to: '/student/my-documents', label: 'My Documents' },
            { to: '/student/achievements', label: 'Achievements' },
            { to: '/student/attendance', label: 'Attendance' },
            { to: '/student/notices', label: 'Notices' },
            { to: '/student/enrolled-subjects', label: 'Enrolled Subjects' },
            { to: '/student/timetable', label: 'Time Table' },
            { to: '/student/generate-resume', label: 'Generate Resume' },
            { to: '/student/projects', label: 'My Projects' },
        ],
        FACULTY: [
            { to: '/faculty/dashboard', label: 'Dashboard' },
            { to: '/faculty/profile', label: 'My Profile' },
            { to: '/faculty/attendance', label: 'Mark Attendance' },
            { to: '/faculty/toppers', label: 'View Toppers' },
            { to: '/faculty/notices', label: 'Notices' },
            { to: '/faculty/achievements', label: 'Achievements' },

        ],
        ADMIN: [
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/upload', label: 'Data Upload' },
            { to: '/admin/promote', label: 'Promotions' },
            { to: '/admin/marks', label: 'Marks Management' },
            { to: '/admin/schedules', label: 'Schedule Upload' },
            { to: '/admin/notice', label: 'Post Notice' },
        ]
    };

    const currentLinks = links[role] || [];

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            background: '#1e1b4b', // Very dark indigo
            color: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20
        }}>


            <div style={{ padding: '1.5rem', marginLeft: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                    src={vvitLogo}
                    alt="VVIT Logo"
                    style={{ height: '60px', width: '90px' }}
                />
            </div>


            <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        style={({ isActive }) => ({
                            display: 'block',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                            background: isActive ? 'var(--primary)' : 'transparent',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        })}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>© 2024 Smart Student Hub</div>
            </div>
        </aside>
    );
};
export default Sidebar;
