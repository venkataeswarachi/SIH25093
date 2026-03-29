import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// ── Circular SVG Progress Ring ─────────────────────────────────────────────
const CircleRing = ({ percentage }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(Math.max(percentage || 0, 0), 100);
    const offset = circumference - (pct / 100) * circumference;
    const color = pct >= 75 ? '#10b981' : pct >= 65 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="65" cy="65" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                    cx="65" cy="65" r={radius} fill="none"
                    stroke={color} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{pct.toFixed(1)}<span style={{ fontSize:'0.9rem' }}>%</span></div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Overall</div>
            </div>
        </div>
    );
};

// ── Mini Progress Bar ──────────────────────────────────────────────────────
const MiniBar = ({ value }) => {
    const color = value >= 75 ? '#10b981' : value >= 65 ? '#f59e0b' : '#ef4444';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: '99px', transition: 'width 1s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color, minWidth: '42px', textAlign: 'right' }}>
                {value.toFixed(1)}%
            </span>
        </div>
    );
};

const StudentAttendance = () => {
    const [year, setYear] = useState(2);
    const [semester, setSemester] = useState(3);
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        setAttendanceData(null);
        try {
            const { data } = await api.get('/student/view/attendance', { params: { year, semester } });
            setAttendanceData(data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAttendance(); }, [year, semester]);

    const overall = attendanceData?.overall;
    const pct = overall?.percentage || 0;
    const statusLabel = pct >= 75 ? 'Good Standing' : pct >= 65 ? 'Needs Attention' : 'Critical — Below 65%';
    const statusBadge = pct >= 75 ? { bg: '#ecfdf5', color: '#10b981' } : pct >= 65 ? { bg: '#fffbeb', color: '#f59e0b' } : { bg: '#fef2f2', color: '#ef4444' };

    return (
        <div style={{ padding: '0 0 2rem', animation: 'fadeSlideIn 0.4s ease both' }}>
            <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* ── Header ── */}
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: '#1e293b', letterSpacing: '-0.03em', margin: 0 }}>Attendance Record</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Track your class attendance across semesters.</p>
            </div>

            {/* ── Filter Bar ── */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem',
                boxShadow: '0 4px 16px rgba(99,102,241,0.08)', border: '1px solid rgba(226,232,240,0.8)',
                display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap',
                marginBottom: '1.75rem',
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Year</label>
                    <select className="form-select" value={year} onChange={e => setYear(e.target.value)} style={{ width: '140px' }}>
                        {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semester</label>
                    <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)} style={{ width: '140px' }}>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={fetchAttendance} style={{ height: '42px', padding: '0 1.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '2rem' }}>
                    {[1,2,3].map(i => <div key={i} style={{ height: '60px', borderRadius: '12px', marginBottom: '1rem' }} className="skeleton" />)}
                </div>
            ) : attendanceData ? (
                <>
                    {/* ── Overall Summary ── */}
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '2rem',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.1)', border: '1px solid rgba(226,232,240,0.8)',
                        marginBottom: '1.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
                            <CircleRing percentage={pct} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b', margin: 0 }}>Overall Summary</h3>
                                    <span style={{ background: statusBadge.bg, color: statusBadge.color, padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700 }}>
                                        {statusLabel}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {[
                                        { label: 'Total Classes', value: overall.totalClasses, color: '#6366f1' },
                                        { label: 'Present', value: overall.present, color: '#10b981' },
                                        { label: 'Absent', value: overall.totalClasses - overall.present, color: '#ef4444' },
                                    ].map(s => (
                                        <div key={s.label} style={{
                                            background: '#f8faff', borderRadius: '12px', padding: '1rem',
                                            border: '1px solid #f1f5f9',
                                        }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{s.label}</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Subject Table ── */}
                    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(99,102,241,0.1)', border: '1px solid rgba(226,232,240,0.8)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', margin: 0 }}>Subject-wise Breakdown</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Total</th>
                                        <th>Present</th>
                                        <th>Absent</th>
                                        <th style={{ minWidth: '180px' }}>Attendance</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.subjects.map((sub, index) => {
                                        const absents = sub.totalClasses - sub.present;
                                        const isLow = sub.percentage < 75;
                                        return (
                                            <tr key={index} style={{ background: isLow ? '#fef9f9' : 'transparent' }}>
                                                <td style={{ fontWeight: 700, color: '#1e293b' }}>{sub.subjectCode}</td>
                                                <td style={{ color: '#64748b' }}>{sub.totalClasses}</td>
                                                <td style={{ fontWeight: 600, color: '#10b981' }}>{sub.present}</td>
                                                <td style={{ fontWeight: 600, color: '#ef4444' }}>{absents}</td>
                                                <td><MiniBar value={sub.percentage} /></td>
                                                <td>
                                                    <span style={{
                                                        background: sub.percentage >= 75 ? '#ecfdf5' : '#fef2f2',
                                                        color: sub.percentage >= 75 ? '#10b981' : '#ef4444',
                                                        padding: '3px 10px', borderRadius: '99px',
                                                        fontSize: '0.72rem', fontWeight: 700,
                                                    }}>
                                                        {sub.percentage >= 75 ? '✓ Good' : '⚠ Low'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '20px', color: '#94a3b8', boxShadow: '0 4px 16px rgba(99,102,241,0.08)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                    No records found for Year {year} Semester {semester}.
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;