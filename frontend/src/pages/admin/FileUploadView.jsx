import React, { useState } from 'react';
import api from '../../services/api';

const FileUploadView = ({ title, endpoint, extraParams = [], description, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [dynamicParams, setDynamicParams] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ msg: '', type: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append('file', file);
        Object.keys(dynamicParams).forEach(key => formData.append(key, dynamicParams[key]));

        setLoading(true);
        setStatus({ msg: 'Uploading...', type: 'info' });

        try {
            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ msg: response.data, type: 'success' });
            if (onSuccess) onSuccess();
        } catch (err) {
            setStatus({ msg: err.response?.data || 'Upload failed', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="heading-md">{title}</h3>
            {description && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{description}</p>}
            <form onSubmit={handleUpload}>
                {extraParams.map(p => (
                    <div className="form-group" key={p.name}>
                        <label className="form-label">{p.label}</label>
                        {p.type === 'select' ? (
                            <select className="form-select" required onChange={e => setDynamicParams({...dynamicParams, [p.name]: e.target.value})}>
                                <option value="">Select {p.label}</option>
                                {p.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ) : (
                            <input className="form-input" type={p.type} required onChange={e => setDynamicParams({...dynamicParams, [p.name]: e.target.value})} />
                        )}
                    </div>
                ))}
                <div className="form-group">
                    <input type="file" className="form-input" onChange={e => setFile(e.target.files[0])} />
                </div>
                {status.msg && <div className={`badge badge-${status.type}`} style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem' }}>{status.msg}</div>}
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Processing...' : 'Upload'}</button>
            </form>
        </div>
    );
};
export default FileUploadView;