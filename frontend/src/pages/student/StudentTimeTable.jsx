import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentTimetable = () => {
    const [timetableUrl, setTimetableUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudentDetailsAndSchedule();
    }, []);

    const fetchStudentDetailsAndSchedule = async () => {
        try {
            setLoading(true);
            // 1. First get student profile to know their branch, year, sem, section
            const profileRes = await api.get('/student/academics');
            const { branch, year, semester, section } = profileRes.data;

            if (!branch || !section) {
                setError("Profile information (Branch/Section) is missing.");
                setLoading(false);
                return;
            }

            // 2. Fetch the schedule image using profile data
            const response = await api.get('/student/schedule/view', {
                params: { branch, year, semester, section },
                responseType: 'blob' // Important for images/files
            });

            const imageObjectURL = URL.createObjectURL(response.data);
            setTimetableUrl(imageObjectURL);
        } catch (err) {
            console.error("Error loading timetable:", err);
            setError("Timetable not found for your section.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="heading-lg">Class Timetable</h1>
                <button className="btn btn-secondary" onClick={fetchStudentDetailsAndSchedule}>
                    🔄 Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loader"></div>
                    <p>Fetching your schedule...</p>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '5px solid var(--danger)' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>⚠️ {error}</p>
                    <p style={{ color: 'var(--text-muted)' }}>Please contact the HOD if your schedule isn't uploaded yet.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => window.open(timetableUrl, '_blank')}
                        >
                            🔎 Enlarge / Open in New Tab
                        </button>
                        <a 
                            href={timetableUrl} 
                            download="timetable.png" 
                            className="btn btn-sm btn-primary"
                        >
                            📥 Download Image
                        </a>
                    </div>

                    <div style={{ 
                        overflow: 'auto', 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        padding: '10px',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                    }}>
                        <img 
                            src={timetableUrl} 
                            alt="Class Timetable" 
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto', 
                                display: 'block', 
                                margin: '0 auto' 
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTimetable;