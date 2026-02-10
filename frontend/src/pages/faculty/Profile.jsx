import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FacultyProfile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/faculty/profile');
                setProfile(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/faculty/edit-profile', profile);
            alert('Profile Updated');
        } catch (e) { alert('Failed to update'); }
        finally { setSaving(false); }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Faculty Profile</h1>
            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                </div>
                {/* Add other fields based on FacultyDTO if known, else dynamic */}
                <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
            </form>
        </div>
    );
};
export default FacultyProfile;
