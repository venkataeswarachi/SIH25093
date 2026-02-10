import React, { useState, useEffect } from 'react';
import FileUploadView from './FileUploadView';
import api from '../../services/api';

const PostNotice = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isFetchingImage, setIsFetchingImage] = useState(false);

    // Helper to format ISO string to "Date | Time"
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

    const fetchNotices = async () => {
        try {
            const response = await api.get('/comm/get/notices');
            // Reverse the array so the newest notice (index n) becomes index 0
            setNotices([...response.data].reverse());
        } catch (err) {
            console.error("Failed to fetch notices", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    const handleViewNotice = async (id) => {
        setIsFetchingImage(true);
        try {
            const response = await api.get(`/comm/notice/${id}/view`, {
                responseType: 'blob'
            });
            const contentType = response.headers['content-type'] || '';

            if (contentType.includes('image')) {
                const fileURL = URL.createObjectURL(response.data);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(fileURL);
            } else {
                const file = new Blob([response.data], { type: contentType });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
                setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
            }
        } catch (err) {
            console.error("Error viewing notice:", err);
            alert("Could not load attachment.");
        } finally {
            setIsFetchingImage(false);
        }
    };

    return (
        <div>
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Notice Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: Upload Form */}
                <div style={{ position: 'sticky', top: 'var(--header-height)' }}>
                    <FileUploadView
                        title="Post New Notice"
                        endpoint="/comm/post/notice"
                        onSuccess={fetchNotices}
                        extraParams={[
                            { name: 'title', label: 'Notice Title', type: 'text' },
                            { name: 'description', label: 'Description', type: 'text' }
                        ]}
                    />
                </div>

                {/* RIGHT: List & Preview */}
                <div className="card" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <h3 className="heading-md">{previewUrl ? 'Notice Preview' : 'Recent Notices'}</h3>
                        {previewUrl ? (
                            <button className="btn btn-secondary" onClick={() => setPreviewUrl(null)}>← Back to List</button>
                        ) : (
                            <button className="btn btn-secondary" onClick={fetchNotices} style={{ fontSize: '0.75rem' }}>🔄 Refresh</button>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {isFetchingImage ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading image...</div>
                        ) : previewUrl ? (
                            <div style={{ textAlign: 'center' }}>
                                <img src={previewUrl} alt="Notice Content" style={{ maxWidth: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)' }} />
                            </div>
                        ) : (
                            <div>
                                {loading ? <p>Loading...</p> : notices.map((notice) => (
                                    <div key={notice.noticeId} style={{ padding: '1rem', border: '1px solid var(--border)', marginBottom: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, color: 'var(--primary)' }}>{notice.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '4px 0' }}>{notice.description}</p>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                                                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                    📅 {formatDateTime(notice.postedAt)}
                                                </small>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={() => handleViewNotice(notice.noticeId)}>View</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostNotice;