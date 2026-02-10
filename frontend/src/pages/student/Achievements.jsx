import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Workshop',
        description: '',
        file: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data } = await api.get('/student/achievement');
            // Log this to see if the ID is 'id' or '_id'
            console.log("Fetched Achievements:", data);
            setAchievements(data);
        } catch (e) {
            console.error("Error fetching achievements:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) return alert("Please select a file proof");

        setUploading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('file', formData.file);

        try {
            await api.post('/student/post-achievement', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Achievement Uploaded!');
            setShowForm(false);
            setFormData({ title: '', category: 'Workshop', description: '', file: null });
            fetchAchievements();
        } catch (err) {
            console.error(err);
            alert('Upload Failed');
        } finally {
            setUploading(false);
        }
    };

    const viewPDF = async (id) => {
        // Prevent request if ID is missing/undefined
        if (!id) {
            console.error("Cannot view PDF: Achievement ID is undefined");
            alert("Error: Achievement ID not found.");
            return;
        }

        try {
            const response = await api.get(`/student/achievement/view/${id}`, {
                responseType: 'blob'
            });

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
        } catch (err) {
            console.error("View Error:", err);
            // If it still returns 403, it's a Backend Security Configuration issue
            alert("Access Denied (403). Ensure you are logged in and your backend allows this download.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="heading-lg">My Achievements</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Achievement'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Upload Achievement</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" required
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Workshop</option>
                                    <option>Internship</option>
                                    <option>Competition</option>
                                    <option>Certification</option>
                                    <option>Sports</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" rows="3" required
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Proof Document (PDF)</label>
                                <input type="file" className="form-input" onChange={handleFileChange} accept=".pdf" required />
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Submit Achievement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : achievements.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No achievements found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {achievements.map((ach, index) => {
                        // Helper to find the correct ID field
                        const achId = ach.id || ach._id || ach.achievementId;
                        
                        return (
                            <div key={achId || index} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="badge badge-info">{ach.category}</span>
                                        <span style={{ fontSize: '0.75rem', color: ach.verified ? 'var(--success)' : 'var(--text-muted)' }}>
                                            {ach.verified ? '✓ VERIFIED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <h3 className="heading-md">{ach.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        {ach.description}
                                    </p>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <button 
                                        onClick={() => viewPDF(achId)}
                                        className="btn btn-primary" 
                                        style={{ width: '100%' }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentAchievements;