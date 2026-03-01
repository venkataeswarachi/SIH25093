import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [stats, setStats] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);


    // Format date
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


    // Fetch dashboard data
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                // Fetch stats
                const statsRes = await api.get('/admin/details');

                const data = statsRes.data;

                setStats([
                    {
                        label: 'Total Students',
                        value: data.students,
                        color: 'var(--primary)',
                        icon: '🎓'
                    },
                    {
                        label: 'Total Faculty',
                        value: data.faculty,
                        color: 'var(--success)',
                        icon: '👨‍🏫'
                    },
                    {
                        label: 'Departments',
                        value: data.dept,
                        color: 'var(--info)',
                        icon: '🏢'
                    }
                ]);


                // Fetch notices
                const noticeRes = await api.get('/comm/get/notices');

                const latestNotices =
                    [...noticeRes.data].reverse().slice(0, 5);

                setNotices(latestNotices);

            }
            catch (error) {

                console.error("Dashboard load error:", error);

            }
            finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, []);



    const quickActions = [

        {
            title: 'Upload Users',
            desc: 'Manage accounts',
            path: '/admin/upload',
            icon: '👥',
            color: 'var(--primary-light)'
        },

        {
            title: 'Release Marks',
            desc: 'Internal/External',
            path: '/admin/marks',
            icon: '📊',
            color: 'var(--success-bg)'
        },

        {
            title: 'Update Timetable',
            desc: 'Class schedules',
            path: '/admin/schedules',
            icon: '📅',
            color: 'var(--info-bg)'
        },

        {
            title: 'Post Notice',
            desc: 'Broadcast updates',
            path: '/admin/notice',
            icon: '📢',
            color: 'var(--warning-bg)'
        }

    ];


    return (

        <div style={{ paddingBottom: '2rem' }}>


            {/* Greeting */}

            <header style={{ marginBottom: '2.5rem' }}>

                <h1 className="heading-lg">
                    Welcome back, {user?.email?.split('@')[0] || 'Admin'}! 👋
                </h1>

                <p style={{ color: 'var(--text-muted)' }}>
                    Overview of the university portal management.
                </p>

            </header>



            {/* Stats */}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>

                {loading ? (

                    <div>Loading stats...</div>

                ) : (

                    stats.map(stat => (

                        <div
                            key={stat.label}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem'
                            }}
                        >

                            <div style={{ fontSize: '2.2rem' }}>
                                {stat.icon}
                            </div>

                            <div>

                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: stat.color
                                }}>
                                    {stat.value}
                                </div>

                                <div style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem'
                                }}>
                                    {stat.label}
                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>



            {/* Quick Actions */}

            <section style={{ marginBottom: '3rem' }}>

                <h3 className="heading-md"
                    style={{ marginBottom: '1.25rem' }}>

                    Quick Access

                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem'
                }}>

                    {quickActions.map(action => (

                        <div
                            key={action.title}
                            className="card"
                            onClick={() => navigate(action.path)}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}

                            onMouseEnter={(e) =>
                                e.currentTarget.style.transform =
                                'translateY(-3px)'}

                            onMouseLeave={(e) =>
                                e.currentTarget.style.transform =
                                'translateY(0)'}

                        >

                            <div style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: action.color,
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                marginBottom: '1rem'
                            }}>
                                {action.icon}
                            </div>

                            <h4 style={{
                                fontSize: '1rem',
                                marginBottom: '0.25rem'
                            }}>
                                {action.title}
                            </h4>

                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)'
                            }}>
                                {action.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>



            {/* Notices */}

            <section className="card">

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>

                    <h3 className="heading-md">
                        Recent Notices
                    </h3>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/notices')}
                        style={{ fontSize: '0.75rem' }}
                    >
                        View All
                    </button>

                </div>


                <div className="table-container">

                    <table className="table">

                        <thead>

                            <tr>

                                <th>Notice Title</th>
                                <th>Description</th>
                                <th>Date & Time</th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="3">
                                        Loading notices...
                                    </td>
                                </tr>

                            ) :

                                notices.length === 0 ? (

                                    <tr>
                                        <td colSpan="3">
                                            No notices found
                                        </td>
                                    </tr>

                                ) :

                                    notices.map(notice => (

                                        <tr key={notice.noticeId || notice.id}>

                                            <td style={{
                                                fontWeight: '600',
                                                color: 'var(--primary)'
                                            }}>
                                                {notice.title}
                                            </td>

                                            <td style={{
                                                color: 'var(--text-muted)'
                                            }}>
                                                {notice.description}
                                            </td>

                                            <td>
                                                {formatDateTime(
                                                    notice.postedAt
                                                )}
                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

            </section>


        </div>

    );

};

export default AdminDashboard;
