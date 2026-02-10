import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const FacultyDashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>
                Welcome, {user?.name || 'Faculty Member'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your classes and students.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Attendance</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Mark daily attendance for your scheduled classes.
                    </p>
                    <Link to="/faculty/attendance" className="btn btn-secondary">Mark Attendance</Link>
                </div>

                <div className="card">
                    <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Performance</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        View top performing students and batch statistics.
                    </p>
                    <Link to="/faculty/toppers" className="btn btn-secondary">View Toppers</Link>
                </div>

                <div className="card">
                    <h3 className="heading-md" style={{ marginBottom: '1rem' }}>My Profile</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Update your contact information and details.
                    </p>
                    <Link to="/faculty/profile" className="btn btn-secondary">Edit Profile</Link>
                </div>
            </div>
        </div>
    );
};
export default FacultyDashboard;
