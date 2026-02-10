import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FacultyAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [category, setCategory] = useState(""); // empty means 'All'
    const [loading, setLoading] = useState(true);
    const [previewImages, setPreviewImages] = useState({}); // Stores blob URLs

    // List of categories based on your backend logic
    const categories = [
        { label: "All Categories", value: "" },
        { label: "Open Source", value: "OPEN_SOURCE" },
        { label: "Hackathons", value: "HACKATHON" },
        { label: "Certifications", value: "CERTIFICATION" },
        { label: "Sports", value: "SPORTS" }
    ];

    useEffect(() => {
        fetchAchievements();
    }, [category]); // Refresh when category changes

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            // endpoint: /faculty/achievements?category=...
            const { data } = await api.get('/faculty/achievements', {
                params: category ? { category } : {}
            });
            setAchievements(data);
        } catch (err) {
            console.error("Error fetching achievements:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleImagePreview = async (id) => {
        if (previewImages[id]) {
            URL.revokeObjectURL(previewImages[id]);
            setPreviewImages(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            return;
        }

        try {
            const response = await api.get(`/faculty/achievement/view/${id}`, {
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            setPreviewImages(prev => ({ ...prev, [id]: url }));
        } catch (err) {
            alert("Could not load achievement image.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="heading-lg">Student Achievements</h1>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Filter:</label>
                    <select 
                        className="form-select" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '200px', marginBottom: 0 }}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading achievements...</div>
            ) : achievements.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No achievements found for category: {category || 'All'}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {achievements.map((ach) => (
                        <div key={ach.achievementId} className="card" style={{ borderLeft: '5px solid #f59e0b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{ach.category}</span>
                                    <h3 className="heading-md" style={{ margin: '5px 0' }}>{ach.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Student SR No: <strong>{ach.srno}</strong> • Posted on {new Date(ach.postedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button 
                                    className={`btn ${previewImages[ach.achievementId] ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => toggleImagePreview(ach.achievementId)}
                                >
                                    {previewImages[ach.achievementId] ? 'Hide Certificate' : 'View Certificate'}
                                </button>
                            </div>

                            <p style={{ marginTop: '1rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                                {ach.description}
                            </p>

                            {previewImages[ach.achievementId] && (
                                <div style={{ marginTop: '1.5rem', textAlign: 'center', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <img 
                                        src={previewImages[ach.achievementId]} 
                                        alt="Achievement Certificate" 
                                        style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyAchievements;