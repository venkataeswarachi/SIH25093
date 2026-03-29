import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const FacultyStatCard = ({ title, desc, to, label, icon, gradient, shadow }) => (
    <div style={{
        background: 'white', borderRadius: '20px', padding: '1.75rem',
        boxShadow: shadow || '0 4px 16px rgba(99,102,241,0.1)',
        border: '1px solid rgba(226,232,240,0.8)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 32px rgba(99,102,241,0.18)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=shadow||'0 4px 16px rgba(99,102,241,0.1)'; }}
    >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradient }} />
        <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
        }}>{icon}</div>
        <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b', margin: '0 0 0.4rem' }}>{title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1rem' }}>{desc}</p>
            <Link to={to} className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
                {label} →
            </Link>
        </div>
    </div>
);

const FacultyDashboard = () => {
    const { user } = useAuth();
    const displayName = user?.firstname || user?.name || 'Faculty Member';

    const cards = [
        {
            title: 'Mark Attendance',
            desc: 'Record daily attendance for your scheduled classes quickly.',
            to: '/faculty/attendance', label: 'Open Attendance',
            icon: '📅', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            shadow: '0 4px 16px rgba(99,102,241,0.12)',
        },
        {
            title: 'Student Performance',
            desc: 'View top performers and batch academic statistics.',
            to: '/faculty/toppers', label: 'View Toppers',
            icon: '🏆', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
            shadow: '0 4px 16px rgba(245,158,11,0.12)',
        },
        {
            title: 'Achievements',
            desc: 'Browse and manage student achievement records.',
            to: '/faculty/achievements', label: 'View Achievements',
            icon: '🌟', gradient: 'linear-gradient(135deg,#10b981,#059669)',
            shadow: '0 4px 16px rgba(16,185,129,0.12)',
        },
        {
            title: 'Notices Board',
            desc: 'Stay updated with the latest institutional notices.',
            to: '/faculty/notices', label: 'View Notices',
            icon: '🔔', gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
            shadow: '0 4px 16px rgba(14,165,233,0.12)',
        },
        {
            title: 'My Profile',
            desc: 'Update your contact information, designation, and details.',
            to: '/faculty/profile', label: 'Edit Profile',
            icon: '👤', gradient: 'linear-gradient(135deg,#ec4899,#db2777)',
            shadow: '0 4px 16px rgba(236,72,153,0.12)',
        },
    ];

    return (
        <div style={{ padding: '0 0 2rem', animation: 'fadeSlideIn 0.4s ease both' }}>
            <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* ── Welcome Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)',
                padding: '2.5rem', borderRadius: '20px', color: 'white',
                marginBottom: '2rem', position: 'relative', overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(99,102,241,0.3)',
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-30px', right: '100px', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Faculty Portal
                    </span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.375rem' }}>
                        Welcome, {displayName}! 👋
                    </h1>
                    <p style={{ opacity: 0.75, fontSize: '0.9rem', margin: 0 }}>Manage your classes, track performance, and stay informed.</p>
                </div>
            </div>

            {/* ── Stat Cards Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {cards.map((card, i) => <FacultyStatCard key={i} {...card} />)}
            </div>
        </div>
    );
};

export default FacultyDashboard;
