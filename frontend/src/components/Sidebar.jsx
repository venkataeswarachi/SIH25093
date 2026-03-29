import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import vvitLogo from '../assets/vvit-logo.png';

// ── SVG Icon Set ──────────────────────────────────────────────────────────────
const icons = {
    dashboard:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    profile:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    academics:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    documents:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    trophy:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>,
    attendance: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>,
    notice:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    subjects:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    timetable:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    resume:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    projects:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    mltools:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    upload:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    promote:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>,
    marks:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    schedule:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    postnotice: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    toppers:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
    logout:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const roleColors = { STUDENT: '#10b981', FACULTY: '#6366f1', ADMIN: '#f59e0b' };

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role || 'STUDENT';

    const links = {
        STUDENT: [
            { to: '/student/dashboard',        label: 'Dashboard',        icon: icons.dashboard  },
            { to: '/student/profile',           label: 'My Profile',       icon: icons.profile    },
            { to: '/student/academics',         label: 'Academics',        icon: icons.academics  },
            { to: '/student/my-documents',      label: 'My Documents',     icon: icons.documents  },
            { to: '/student/achievements',      label: 'Achievements',     icon: icons.trophy     },
            { to: '/student/attendance',        label: 'Attendance',       icon: icons.attendance },
            { to: '/student/notices',           label: 'Notices',          icon: icons.notice     },
            { to: '/student/enrolled-subjects', label: 'Enrolled Subjects',icon: icons.subjects   },
            { to: '/student/timetable',         label: 'Time Table',       icon: icons.timetable  },
            { to: '/student/generate-resume',   label: 'Generate Resume',  icon: icons.resume     },
            { to: '/student/projects',          label: 'My Projects',      icon: icons.projects   },
            { to: '/student/ml-tools',          label: 'ML Tools',         icon: icons.mltools    },
        ],
        FACULTY: [
            { to: '/faculty/dashboard', label: 'Dashboard',     icon: icons.dashboard   },
            { to: '/faculty/profile',   label: 'My Profile',    icon: icons.profile     },
            { to: '/faculty/attendance',label: 'Mark Attendance',icon: icons.attendance },
            { to: '/faculty/toppers',   label: 'View Toppers',  icon: icons.toppers     },
            { to: '/faculty/notices',   label: 'Notices',       icon: icons.notice      },
            { to: '/faculty/achievements',label: 'Achievements',icon: icons.trophy      },
        ],
        ADMIN: [
            { to: '/admin/dashboard', label: 'Dashboard',      icon: icons.dashboard  },
            { to: '/admin/upload',    label: 'Data Upload',    icon: icons.upload     },
            { to: '/admin/promote',   label: 'Promotions',     icon: icons.promote    },
            { to: '/admin/marks',     label: 'Marks Mgmt.',    icon: icons.marks      },
            { to: '/admin/schedules', label: 'Schedules',      icon: icons.schedule   },
            { to: '/admin/notice',    label: 'Post Notice',    icon: icons.postnotice },
        ],
    };

    const currentLinks = links[role] || [];
    const displayName = user?.firstname || user?.name || user?.email?.split('@')[0] || role;

    return (
        <>
        <style>{`
            .sidebar-link {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.65rem 1rem;
                border-radius: 10px;
                color: rgba(255,255,255,0.55);
                text-decoration: none;
                font-size: 0.84rem;
                font-weight: 500;
                transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
                position: relative;
                user-select: none;
            }
            .sidebar-link:hover {
                color: rgba(255,255,255,0.9);
                background: rgba(255,255,255,0.08);
                transform: translateX(3px);
            }
            .sidebar-link.active {
                color: #fff;
                background: linear-gradient(90deg, rgba(99,102,241,0.8), rgba(139,92,246,0.6));
                box-shadow: 0 4px 14px rgba(99,102,241,0.35);
                font-weight: 600;
            }
            .sidebar-link.active::before {
                content: '';
                position: absolute;
                left: 0; top: 20%; bottom: 20%;
                width: 3px;
                border-radius: 0 3px 3px 0;
                background: #fff;
            }
            .sidebar-logout-btn {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.65rem 1rem;
                border-radius: 10px;
                color: rgba(255,255,255,0.5);
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 0.84rem;
                font-weight: 500;
                font-family: inherit;
                transition: all 0.22s;
            }
            .sidebar-logout-btn:hover {
                color: #f87171;
                background: rgba(239,68,68,0.12);
            }
        `}</style>

        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 55%, #24243e 100%)',
            color: 'white',
            position: 'fixed',
            left: 0, top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20,
            boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
            overflowY: 'auto',
            overflowX: 'hidden',
        }}>
            {/* Logo & App Name */}
            <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={vvitLogo} alt="VVIT Logo" style={{ height: '46px', width: '46px', borderRadius: '10px', objectFit: 'contain', background: 'rgba(255,255,255,0.08)', padding: '4px' }} />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Smart Hub</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '1px' }}>University Portal</div>
                    </div>
                </div>

                {/* User chip */}
                <div style={{
                    marginTop: '1rem',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${roleColors[role]}, ${roleColors[role]}88)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                    }}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {displayName}
                        </div>
                        <div style={{
                            fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
                            color: roleColors[role], textTransform: 'uppercase'
                        }}>{role}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ padding: '0.875rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', padding: '0.25rem 1rem', marginBottom: '0.25rem' }}>
                    Navigation
                </div>
                {currentLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                    >
                        <span style={{ flexShrink: 0, opacity: 0.9 }}>{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <button className="sidebar-logout-btn" onClick={() => { logout(); navigate('/login'); }}>
                    {icons.logout}
                    Sign Out
                </button>
                <div style={{ fontSize: '0.65rem', opacity: 0.3, padding: '0.5rem 1rem 0.25rem', textAlign: 'center' }}>
                    © 2025 Smart Student Hub
                </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
