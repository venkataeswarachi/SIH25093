import React, { useState } from 'react';
import api from '../../services/api';

const BatchPromoteView = () => {
    const [batch, setBatch] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePromote = async () => {
        if (!window.confirm(`Are you sure you want to promote the ${batch} batch? This changes academic status for all students.`)) return;
        
        setLoading(true);
        try {
            const res = await api.post(`/admin/promote/${batch}`);
            alert(res.data);
            setBatch('');
        } catch (err) {
            alert(err.response?.data || "Promotion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <h2 className="heading-md">Batch Promotion</h2>
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Admission Year (Batch)</label>
                <input className="form-input" placeholder="e.g. 2022" value={batch} onChange={e => setBatch(e.target.value)} />
            </div>
            <button onClick={handlePromote} disabled={loading || !batch} className="btn btn-primary" style={{ width: '100%', background: 'var(--danger)' }}>
                {loading ? 'Processing...' : 'Promote Batch'}
            </button>
        </div>
    );
};
export default BatchPromoteView;