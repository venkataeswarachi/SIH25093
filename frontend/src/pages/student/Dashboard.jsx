import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ label, path, icon, color, gradient }) => (
    <Link to={path} style={{ textDecoration: 'none' }}>
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(99,102,241,0.1)',
            border: '1px solid rgba(226,232,240,0.8)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 16px 32px rgba(99,102,241,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(99,102,241,0.1)'; }}
        >
            {/* Top colour bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradient }} />
            {/* Icon */}
            <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: '1rem',
                boxShadow: `0 4px 12px ${color}44`,
            }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{label}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View details
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
        </div>
    </Link>
);

const NoticeRow = ({ notice }) => (
    <div style={{
        padding: '0.875rem 1rem',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        transition: 'background 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background='#f8faff'}
    onMouseLeave={e => e.currentTarget.style.background='transparent'}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1',
                flexShrink: 0, marginTop: '5px',
            }} />
            <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {notice.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    {new Date(notice.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>
        </div>
        <Link to="/student/notices" style={{
            flexShrink: 0, fontSize: '0.72rem', fontWeight: 700,
            color: '#6366f1', background: '#eef2ff',
            padding: '4px 10px', borderRadius: '6px',
            whiteSpace: 'nowrap',
        }}>Read →</Link>
    </div>
);

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [notices, setNotices] = useState([]);
    const [academics, setAcademics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profRes, noticeRes, acadRes] = await Promise.allSettled([
                    api.get('/student/profile'),
                    api.get('/comm/get/notices'),
                    api.get('/student/academics'),
                ]);
                if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
                if (noticeRes.status === 'fulfilled') setNotices(noticeRes.value.data.slice(0, 5));
                if (acadRes.status === 'fulfilled') setAcademics(acadRes.value.data);
            } catch (e) {
                console.error('Dashboard fetch error', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ padding: '2rem' }}>
            {[1,2,3].map(i => (
                <div key={i} style={{ height: '80px', borderRadius: '16px', marginBottom: '1rem' }} className="skeleton" />
            ))}
        </div>
    );

    const statCards = [
        { label: 'Attendance',       path: '/student/attendance',        icon: '📅', color: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
        { label: 'Enrolled Subjects',path: '/student/enrolled-subjects',  icon: '📚', color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' },
        { label: 'My Academics',     path: '/student/academics',          icon: '🎓', color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
        { label: 'Achievements',     path: '/student/achievements',       icon: '🏆', color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
        { label: 'Generate Resume',  path: '/student/generate-resume',    icon: '📄', color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
        { label: 'My Projects',      path: '/student/projects',           icon: '🚀', color: '#ec4899', gradient: 'linear-gradient(135deg,#ec4899,#db2777)' },
        { label: 'ML Tools',         path: '/student/ml-tools',           icon: '🤖', color: '#14b8a6', gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
        { label: 'My Documents',     path: '/student/my-documents',       icon: '📁', color: '#f97316', gradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
    ];

    const displayName = profile?.firstname || 'Student';
    const initials = `${profile?.firstname?.charAt(0) || 'S'}${profile?.lastname?.charAt(0) || ''}`;

    return (
        <div style={{ padding: '0 0 2rem', animation: 'fadeSlideIn 0.4s ease both' }}>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* ── Welcome Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
                backgroundSize: '200% 200%',
                padding: '2.5rem',
                borderRadius: '20px',
                color: 'white',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(99,102,241,0.3)',
            }}>
                {/* Decorative circles */}
                <div style={{ position:'absolute', top:'-40px', right:'-40px', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
                <div style={{ position:'absolute', bottom:'-30px', right:'120px', width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

                <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                        <span style={{ fontSize:'1.75rem' }}>👋</span>
                        <h1 style={{ fontSize:'1.75rem', fontWeight:800, letterSpacing:'-0.03em', margin:0 }}>
                            Welcome back, {displayName}!
                        </h1>
                    </div>
                    <p style={{ opacity:0.8, fontSize:'0.95rem', margin:0 }}>
                        You are in <strong>Semester {academics?.semester || 'N/A'}</strong>. Here's your overview today.
                    </p>
                    <div style={{ marginTop:'1.25rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                        {[
                            { label:'Roll No', value: profile?.rno || '—' },
                            { label:'Branch',  value: academics?.branch || '—' },
                        ].map(item => (
                            <div key={item.label} style={{
                                background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
                                padding:'0.4rem 0.9rem', borderRadius:'8px',
                                border:'1px solid rgba(255,255,255,0.2)',
                                fontSize:'0.8rem', fontWeight:600,
                            }}>
                                {item.label}: <span style={{ fontWeight:800 }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Quick Access Grid ── */}
            <div style={{ marginBottom:'2rem' }}>
                <h2 style={{ fontWeight:800, fontSize:'1.1rem', color:'#1e293b', marginBottom:'1.1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <span style={{ width:'4px', height:'18px', borderRadius:'4px', background:'linear-gradient(180deg,#6366f1,#8b5cf6)', display:'inline-block' }} />
                    Quick Access
                </h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'1rem' }}>
                    {statCards.map((item, idx) => <StatCard key={idx} {...item} />)}
                </div>
            </div>

            {/* ── Bottom Row ── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                {/* Latest Notices */}
                <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.875rem' }}>
                        <h2 style={{ fontWeight:800, fontSize:'1.1rem', color:'#1e293b', display:'flex', alignItems:'center', gap:'0.5rem', margin:0 }}>
                            <span style={{ width:'4px', height:'18px', borderRadius:'4px', background:'linear-gradient(180deg,#6366f1,#8b5cf6)', display:'inline-block' }} />
                            Latest Notices
                        </h2>
                        <Link to="/student/notices" style={{ fontSize:'0.78rem', fontWeight:700, color:'#6366f1' }}>View all →</Link>
                    </div>
                    <div style={{ background:'white', borderRadius:'16px', boxShadow:'0 4px 16px rgba(99,102,241,0.08)', border:'1px solid rgba(226,232,240,0.8)', overflow:'hidden' }}>
                        {notices.length === 0
                            ? <p style={{ padding:'1.5rem', textAlign:'center', color:'#94a3b8', fontSize:'0.875rem' }}>No recent notices.</p>
                            : notices.map(n => <NoticeRow key={n.noticeId} notice={n} />)
                        }
                    </div>
                </div>

                {/* Profile Summary */}
                <div>
                    <h2 style={{ fontWeight:800, fontSize:'1.1rem', color:'#1e293b', marginBottom:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <span style={{ width:'4px', height:'18px', borderRadius:'4px', background:'linear-gradient(180deg,#10b981,#059669)', display:'inline-block' }} />
                        My Profile
                    </h2>
                    <div style={{ background:'white', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 4px 16px rgba(99,102,241,0.08)', border:'1px solid rgba(226,232,240,0.8)' }}>
                        <div style={{ display:'flex', gap:'1.25rem', alignItems:'center', marginBottom:'1.25rem' }}>
                            <div style={{
                                width:'64px', height:'64px', borderRadius:'50%',
                                background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'1.5rem', fontWeight:800, color:'white', flexShrink:0,
                                boxShadow:'0 0 0 3px white, 0 0 0 5px #eef2ff',
                            }}>
                                {initials}
                            </div>
                            <div>
                                <div style={{ fontWeight:800, fontSize:'1.05rem', color:'#1e293b' }}>
                                    {profile?.firstname} {profile?.lastname}
                                </div>
                                <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginTop:'2px' }}>{profile?.email}</div>
                                <div style={{ display:'flex', gap:'6px', marginTop:'8px', flexWrap:'wrap' }}>
                                    <span style={{ background:'#eef2ff', color:'#6366f1', padding:'2px 8px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:700 }}>
                                        Roll: {profile?.rno}
                                    </span>
                                    <span style={{ background:'#ecfdf5', color:'#10b981', padding:'2px 8px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:700 }}>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link to="/student/profile" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', textDecoration:'none', display:'flex' }}>
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;