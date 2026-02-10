import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [notices, setNotices] = useState([]);
    const [academics, setAcademics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching only what's necessary for the welcome and notices
                const [profRes, noticeRes, acadRes] = await Promise.allSettled([
                    api.get('/student/profile'),
                    api.get('/comm/get/notices'),
                    api.get('/student/academics') // Matches your working notice route
                ]);

                if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
                if (noticeRes.status === 'fulfilled') setNotices(noticeRes.value.data.slice(0, 5));
                if (acadRes.status === 'fulfilled') setAcademics(acadRes.value.data);
            } catch (e) {
                console.error("Dashboard fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your workspace...</div>;

    const stats = [
        { label: 'Attendance', path: '/student/attendance', icon: '📅', color: '#4f46e5' },
        { label: 'Enrolled Subjects', path: '/student/enrolled-subjects', icon: '📚', color: '#0ea5e9' },
        { label: 'My Academics', path: '/student/academics', icon: '🎓', color: '#10b981' },
        { label: 'Achievements', path: '/student/achievements', icon: '🏆', color: '#f59e0b' },
    ];
    

    return (
        <div style={{ padding: '10px' }}>
            {/* Welcome Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)', 
                padding: '2.5rem', 
                borderRadius: '16px', 
                color: 'white', 
                marginBottom: '2rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Welcome back, {profile?.firstname || 'Student'}! 👋</h1>
                <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>
                    You are currently in <strong>Semester {academics?.semester || 'N/A'}</strong>. Here is your overview.
                </p>
            </div>

            {/* Quick Access Grid */}
            <h2 className="heading-md" style={{ marginBottom: '1.5rem' }}>Quick Access</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem', 
                marginBottom: '3rem' 
            }}>
                {stats.map((item, idx) => (
                    <Link key={idx} to={item.path} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ 
                            textAlign: 'center', 
                            transition: 'transform 0.2s', 
                            cursor: 'pointer',
                            borderTop: `4px solid ${item.color}`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>{item.label}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Notice Board Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="heading-md" style={{ margin: 0 }}>Latest Notices</h2>
                        <Link to="/student/notices" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>View All</Link>
                    </div>
                    <div className="card" style={{ padding: '0.5rem' }}>
                        {notices.length === 0 ? (
                            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent notices.</p>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice.noticeId} style={{ 
                                    padding: '1rem', 
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notice.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(notice.postedAt).toLocaleDateString()}</div>
                                    </div>
                                    <Link to="/student/notices" className="btn btn-sm btn-secondary">Read</Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Profile Summary Section */}
                <div>
                    <h2 className="heading-md" style={{ marginBottom: '1rem' }}>My Profile</h2>
                    <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--bg-light)', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            fontSize: '2rem',
                            border: '2px solid var(--border)'
                        }}>
                            {profile?.firstname?.charAt(0) || 'S'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0 }}>{profile?.firstname} {profile?.lastname}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '5px 0', fontSize: '0.9rem' }}>{profile?.email}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <span className="badge badge-info">Roll: {profile?.rno}</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;