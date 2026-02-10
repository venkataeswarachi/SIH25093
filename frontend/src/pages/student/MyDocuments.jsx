import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [docType, setDocType] = useState('CERTIFICATE');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch documents on component mount
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/student/get/documents');
            setDocuments(data);
        } catch (e) {
            console.error("Error fetching documents", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Handle File Upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('documenttype', docType);

        try {
            await api.post('/student/upload/document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Document uploaded successfully!");
            setTitle('');
            setFile(null);
            fetchDocuments(); // Refresh the list
        } catch (error) {
            console.error("Upload Error:", error.response);
            alert("Upload failed: " + (error.response?.status === 403 ? "Access Denied" : "Error"));
        } finally {
            setUploading(false);
        }
    };

    // Handle View (Opens in new tab)
    const handleView = async (id) => {
        try {
            const response = await api.get(`/student/document/${id}/view`, {
                responseType: 'blob', // Fetch as binary data
            });

            // Create a local URL for the binary data
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);

            // Open the local URL in a new tab
            window.open(fileURL, '_blank');

            // Clean up the URL object after a delay to save memory
            setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
        } catch (error) {
            console.error("View failed", error);
            alert("Could not load the document. You may not have permission.");
        }
    };
    // Handle Download (Triggers browser download)
    const handleDownload = async (id, originalFilename) => {
        try {
            const response = await api.get(`/student/document/${id}/view`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalFilename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Could not download file.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="heading-lg" style={{ margin: 0 }}>My Documents</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload and manage your academic certifications and records</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>

                {/* Left Side: Styled Upload Form */}
                <div>
                    <div className="card" style={{ borderTop: '4px solid var(--primary)', position: 'sticky', top: '20px' }}>
                        <h3 className="heading-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Upload New
                        </h3>
                        <form onSubmit={handleUpload}>
                            <div style={{ marginBottom: '1.3rem' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem', color: '#334155' }}>
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Resume"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{
                                        padding: '8px 10px',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        width: '100%'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '0.85rem' }}>Category</label>
                                <select
                                    className="form-select"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    style={{ padding: '8px' }}
                                >
                                    <option value="RESUME">Resume (Auto-replaces old)</option>
                                    <option value="CERTIFICATE">Certificate</option>
                                    <option value="MARKSHEET">Marksheet</option>
                                    <option value="ID_PROOF">ID Proof</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '0.85rem' }}>File Attachment</label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    backgroundColor: '#f8fafc'
                                }}>
                                    <input
                                        type="file"
                                        style={{ fontSize: '0.85rem', width: '100%' }}
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={uploading}
                                style={{ width: '100%', padding: '12px', fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                {uploading ? '⌛ Uploading...' : '📤 Confirm Upload'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Documents List */}
                <div>
                    <div className="card" style={{ minHeight: '450px' }}>
                        <h3 className="heading-md" style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Documents</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table table-hover">
                                <thead style={{ backgroundColor: '#f8fafc' }}>
                                    <tr>
                                        <th>Document Details</th>
                                        <th>Type</th>
                                        <th>Upload Date</th>
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>Loading documents...</td></tr>
                                    ) : documents.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No documents found. Upload your first one!</td></tr>
                                    ) : (
                                        documents.map((doc) => (
                                            <tr key={doc.documentId}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{doc.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.originalFilename}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${doc.documentType === 'RESUME' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.7rem', padding: '5px 10px' }}>
                                                        {doc.documentType}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                                                    {new Date(doc.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{ backgroundColor: '#f1f5f9', color: 'var(--primary)', border: '1px solid #cbd5e1' }}
                                                            onClick={() => handleView(doc.documentId)}
                                                            title="View in browser"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}
                                                            onClick={() => handleDownload(doc.documentId, doc.originalFilename)}
                                                            title="Download to computer"
                                                        >
                                                            Download
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyDocuments;