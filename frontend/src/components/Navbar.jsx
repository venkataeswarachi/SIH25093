import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLocation } from 'react-router-dom';

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);

const PAGE_TITLES = {
    '/student/dashboard':        'Dashboard',
    '/student/profile':          'My Profile',
    '/student/academics':        'Academics',
    '/student/my-documents':     'My Documents',
    '/student/achievements':     'Achievements',
    '/student/attendance':       'Attendance',
    '/student/notices':          'Notices',
    '/student/enrolled-subjects':'Enrolled Subjects',
    '/student/timetable':        'Time Table',
    '/student/generate-resume':  'Resume Generator',
    '/student/projects':         'My Projects',
    '/student/ml-tools':         'ML Tools',
    '/faculty/dashboard':        'Faculty Dashboard',
    '/faculty/profile':          'My Profile',
    '/faculty/attendance':       'Mark Attendance',
    '/faculty/toppers':          'View Toppers',
    '/faculty/notices':          'Notices',
    '/faculty/achievements':     'Achievements',
    '/admin/dashboard':          'Admin Dashboard',
    '/admin/upload':             'Data Upload',
    '/admin/promote':            'Batch Promotions',
    '/admin/marks':              'Marks Management',
    '/admin/schedules':          'Schedule Upload',
    '/admin/notice':             'Post Notice',
};

const ROLE_COLORS = { STUDENT: '#10b981', FACULTY: '#6366f1', ADMIN: '#f59e0b' };

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const pageTitle = PAGE_TITLES[location.pathname] || 'Portal';
    const displayName = user?.firstname || user?.name || user?.email?.split('@')[0] || 'User';
    const role = user?.role || 'STUDENT';
    const roleColor = ROLE_COLORS[role] || '#6366f1';

    return (
        <nav style={{
            height: 'var(--header-height)',
            background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(226,232,240,0.7)',
            boxShadow: scrolled ? '0 4px 24px rgba(99,102,241,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-width)',
            right: 0,
            zIndex: 10,
            transition: 'all 0.3s ease',
        }}>
            {/* Left: Page title */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '4px', height: '20px', borderRadius: '4px',
                        background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    }} />
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                        {pageTitle}
                    </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '12px', marginTop: '1px' }}>
                    {getGreeting()}, {displayName} 👋
                </div>
            </div>

            {/* Right: Notification + User avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Notification bell */}
                <button style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'var(--secondary-light)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)',
                    transition: 'all 0.2s', position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--primary-light)'; e.currentTarget.style.color='var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--secondary-light)'; e.currentTarget.style.color='var(--text-muted)'; }}
                title="Notifications"
                >
                    <BellIcon />
                    <span style={{
                        position: 'absolute', top: '7px', right: '7px',
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#ef4444', border: '1.5px solid white',
                    }} />
                </button>

                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {displayName}
                        </div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: roleColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {role}
                        </div>
                    </div>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: 'white',
                        boxShadow: `0 0 0 2px white, 0 0 0 4px ${roleColor}44`,
                        flexShrink: 0,
                    }}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
