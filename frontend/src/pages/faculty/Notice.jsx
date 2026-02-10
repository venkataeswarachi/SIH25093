import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FacultyNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewMap, setPreviewMap] = useState({}); // Stores blob URLs for images

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const { data } = await api.get('/comm/get/notices');
            setNotices(data);
        } catch (err) {
            console.error("Error fetching notices:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAction = async (id) => {
        // If already previewing this image, toggle it off
        if (previewMap[id]) {
            const newMap = { ...previewMap };
            URL.revokeObjectURL(newMap[id]);
            delete newMap[id];
            setPreviewMap(newMap);
            return;
        }

        try {
            const response = await api.get(`/comm/notice/${id}/view`, {
                responseType: 'blob'
            });

            const contentType = response.headers['content-type'] || '';
            const file = new Blob([response.data], { type: contentType });
            const fileURL = URL.createObjectURL(file);

            if (contentType.includes('image')) {
                // It's an image: Show it inside the card
                setPreviewMap(prev => ({ ...prev, [id]: fileURL }));
            } else {
                // It's a PDF: Open in new tab
                window.open(fileURL, '_blank');
                setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
            }
        } catch (err) {
            alert("Could not load attachment.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Campus Notices</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {notices.map((notice) => (
                        <div key={notice.noticeId} className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 className="heading-md" style={{ color: 'var(--primary)', margin: 0 }}>{notice.title}</h3>
                                <small style={{ color: 'var(--text-muted)' }}>
                                    {new Date(notice.postedAt).toLocaleDateString()}
                                </small>
                            </div>
                            
                            <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{notice.description}</p>

                            {/* Inline Image Preview */}
                            {previewMap[notice.noticeId] && (
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
                                    <img 
                                        src={previewMap[notice.noticeId]} 
                                        alt="Notice Content" 
                                        style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                                    />
                                </div>
                            )}

                            <button 
                                onClick={() => handleViewAction(notice.noticeId)}
                                className="btn btn-outline-primary"
                                style={{ width: 'fit-content' }}
                            >
                                {previewMap[notice.noticeId] ? 'Hide Preview' : '📎 View Full Notice'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyNotices;