import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const EnrolledSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/student/semester/subjects');
            if (Array.isArray(data)) {
                setSubjects(data);
            } else if (data && Array.isArray(data.subjects)) {
                setSubjects(data.subjects);
            } else {
                setSubjects([]);
            }
        } catch (err) {
            console.error("Error fetching subjects:", err);
            setError(err.message || "Failed to load subjects");
        } finally {
            setLoading(false);
        }
    };

    const fetchFacultyInfo = async (username) => {
        if (!username) return alert("Faculty username not found");
        setModalLoading(true);
        try {
            const { data } = await api.get('/student/get/info', {
                params: { username }
            });
            console.log("Fetched faculty data:", data);
            setSelectedFaculty(data);
        } catch (err) {
            alert("Could not fetch faculty information.");
            console.error("Error fetching faculty info:", err);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Enrolled Subjects</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your curriculum...</div>
            ) : error ? (
                <div className="card" style={{ color: 'var(--danger)', textAlign: 'center' }}>
                    Error: {error}. Please check if the backend is running.
                </div>
            ) : subjects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No enrolled subjects found for your profile.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {subjects.map((sub) => (
                        <div key={sub.subjectId} className="card" style={{ borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span className="badge badge-info">{sub.subjectCode}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credits: {sub.credits}</span>
                                </div>

                                <h3 className="heading-md" style={{ margin: '10px 0' }}>{sub.subjectName}</h3>

                                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    <p style={{ margin: '5px 0' }}><strong>Semester:</strong> {sub.semester} | <strong>Year:</strong> {sub.year}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Branch:</strong> {sub.branch} ({sub.batch})</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ overflow: 'hidden' }}>
                                    <small style={{ display: 'block', color: 'var(--text-muted)' }}>Faculty In-charge</small>
                                    <strong style={{ fontSize: '0.9rem' }}>{sub.facultyName || 'Not Assigned'}</strong>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => fetchFacultyInfo(sub.facultyUsername)}
                                    disabled={!sub.facultyUsername}
                                >
                                    {modalLoading ? '...' : 'Profile'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Faculty Modal */}
            {selectedFaculty && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{
                        width: '90%',
                        maxWidth: '450px',
                        position: 'relative',
                        padding: '2.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderTop: '6px solid var(--primary)'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedFaculty(null)}
                            style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>

                        {/* Profile Header */}
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                backgroundColor: 'var(--primary)', color: 'white',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem', margin: '0 auto 15px',
                                fontWeight: 'bold', textTransform: 'uppercase'
                            }}>
                                {selectedFaculty.firstname ? selectedFaculty.firstname.charAt(0) : 'F'}
                            </div>
                            <h3 className="heading-md" style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>
                                {selectedFaculty.firstname} {selectedFaculty.lastname}
                            </h3>
                            <span className="badge badge-info" style={{ fontSize: '0.9rem' }}>
                                {selectedFaculty.position || 'Faculty Member'}
                            </span>
                        </div>

                        {/* Detailed Info Grid */}
                        <div style={{
                            fontSize: '0.95rem',
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: '1.5rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>📧 Email:</span>
                                <strong style={{ color: '#1e293b' }}>{selectedFaculty.email}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>📱 Mobile:</span>
                                <strong style={{ color: '#1e293b' }}>{selectedFaculty.mobile || 'N/A'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>🏢 Department:</span>
                                <strong style={{ color: '#1e293b' }}>{selectedFaculty.branch}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>⏳ Experience:</span>
                                <strong style={{ color: '#1e293b' }}>{selectedFaculty.workexperience}</strong>
                            </div>
                           

                            {/* About/Bio Section */}
                            <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontStyle: 'italic',
                                color: '#475569',
                                borderLeft: '3px solid #cbd5e1'
                            }}>
                                "{selectedFaculty.about || 'No bio available.'}"
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => setSelectedFaculty(null)}
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrolledSubjects;