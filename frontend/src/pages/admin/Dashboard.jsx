import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to format ISO string to "Date | Time"
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const stats = [
        { label: 'Total Students', value: '1,240', color: 'var(--primary)', icon: '🎓' },
        { label: 'Total Faculty', value: '86', color: 'var(--success)', icon: '👨‍🏫' },
        { label: 'Departments', value: '12', color: 'var(--info)', icon: '🏢' }
    ];

    const quickActions = [
        { title: 'Upload Users', desc: 'Manage accounts', path: '/admin/users', icon: '👥', color: 'var(--primary-light)' },
        { title: 'Release Marks', desc: 'Internal/External', path: '/admin/marks', icon: '📊', color: 'var(--success-bg)' },
        { title: 'Update Timetable', desc: 'Class schedules', path: '/admin/schedules', icon: '📅', color: 'var(--info-bg)' },
        { title: 'Post Notice', desc: 'Broadcast updates', path: '/admin/notices', icon: '📢', color: 'var(--warning-bg)' }
    ];

    useEffect(() => {
        const fetchRecentNotices = async () => {
            try {
                const response = await api.get('/comm/get/notices');
                // 1. Reverse to get newest first, 2. Slice to get top 5
                const latestNotices = [...response.data].reverse().slice(0, 5);
                setNotices(latestNotices);
            } catch (err) {
                console.error("Failed to fetch notices", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentNotices();
    }, []);
    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* 1. Greeting Section */}
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="heading-lg">Welcome back, {user?.email?.split('@')[0] || 'Admin'}! 👋</h1>
                <p style={{ color: 'var(--text-muted)' }}>Overview of the university portal management.</p>
            </header>

            {/* 2. Stat Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ fontSize: '2.2rem' }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: s.color }}>{s.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Quick Access Grid */}
            <section style={{ marginBottom: '3rem' }}>
                <h3 className="heading-md" style={{ marginBottom: '1.25rem' }}>Quick Access</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {quickActions.map(action => (
                        <div
                            key={action.title}
                            className="card"
                            onClick={() => navigate(action.path)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: '45px', height: '45px', backgroundColor: action.color,
                                borderRadius: '10px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem'
                            }}>
                                {action.icon}
                            </div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{action.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{action.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Recent Notices Table */}
            <section className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 className="heading-md">Recent Notices</h3>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/notices')} style={{ fontSize: '0.75rem' }}>
                        View All
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Notice Title</th>
                                <th>Description</th>
                                <th>Posted Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3">Loading notices...</td></tr>
                            ) : notices.length === 0 ? (
                                <tr><td colSpan="3">No notices found.</td></tr>
                            ) : (
                                notices.map(notice => (
                                    <tr key={notice.noticeId || notice.id}>
                                        <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{notice.title}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{notice.description}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            <span style={{ fontSize: '0.85rem' }}>
                                                📅 {formatDateTime(notice.postedAt)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;