import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentProfile = () => {
    const [profile, setProfile] = useState({
        rno: '', email: '', firstname: '', lastname: '',
        fathername: '', mothername: '', religion: '', caste: '',
        smobile: '', fmobile: '', bloodgroup: '', mothertongue: '',
        martialstatus: '', permanantAddress: '', presentAddress: '',
        gitlink: '', resumelink: '', portfolio: '', skills: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/student/profile');
            setProfile({ ...data, skills: data.skills || [] });
        } catch (e) {
            console.error("Fetch profile failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSkillsKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value && !profile.skills.includes(value)) {
                setProfile({ ...profile, skills: [...profile.skills, value] });
                e.target.value = '';
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.post('/student/editprofile', profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="heading-lg">Edit Profile</h1>
                <p style={{ color: '#64748b' }}>Complete your profile to enhance your visibility to recruiters.</p>
            </div>

            {message && (
                <div style={{
                    padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    border: '1px solid currentColor'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Section 1: Identity */}
                <div className="card" style={{ padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '5px solid #3b82f6' }}>
                    <h3 style={{ marginTop: 0, color: '#3b82f6', marginBottom: '0.6rem' }}>Identity & Basic Info</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Registration No</label>
                            <input name="rno" className="form-input" value={profile.rno || ''} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email (Read Only)</label>
                            <input className="form-input" value={profile.email || ''} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input name="firstname" className="form-input" value={profile.firstname || ''} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input name="lastname" className="form-input" value={profile.lastname || ''} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Family & Background */}
                <div className="card" style={{ padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginTop: 0 }}>Family & Social Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group"><label>Father's Name</label><input name="fathername" className="form-input" value={profile.fathername || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Mother's Name</label><input name="mothername" className="form-input" value={profile.mothername || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Religion</label><input name="religion" className="form-input" value={profile.religion || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Caste</label><input name="caste" className="form-input" value={profile.caste || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Mother Tongue</label><input name="mothertongue" className="form-input" value={profile.mothertongue || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Marital Status</label><input name="martialstatus" className="form-input" value={profile.martialstatus || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Blood Group</label><input name="bloodgroup" className="form-input" value={profile.bloodgroup || ''} onChange={handleChange} /></div>
                    </div>
                </div>

                {/* Section 3: Contact */}
                <div className="card" style={{ padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginTop: 0 }}>Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group"><label>Student Mobile</label><input type="number" name="smobile" className="form-input" value={profile.smobile || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Parent Mobile</label><input type="number" name="fmobile" className="form-input" value={profile.fmobile || ''} onChange={handleChange} /></div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Present Address</label><textarea name="presentAddress" className="form-input" value={profile.presentAddress || ''} onChange={handleChange} /></div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Permanent Address</label><textarea name="permanantAddress" className="form-input" value={profile.permanantAddress || ''} onChange={handleChange} /></div>
                    </div>
                </div>

                {/* Section 4: Professional */}
                <div className="card" style={{ padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginTop: 0 }}>Professional Links & Skills</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group"><label>GitHub Link</label><input name="gitlink" className="form-input" value={profile.gitlink || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Resume Link</label><input name="resumelink" className="form-input" value={profile.resumelink || ''} onChange={handleChange} /></div>
                        <div className="form-group"><label>Portfolio Link</label><input name="portfolio" className="form-input" value={profile.portfolio || ''} onChange={handleChange} /></div>
                    </div>
                    
                    <div className="form-group">
                        <label>Skills</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', minHeight: '0px', background: '#fff' }}>
                            {profile.skills.map(s => (
                                <span key={s} style={{ background: '#955a02', color: '#fff', padding: '4px 10px', borderRadius: '12px' }}>
                                    {s} <button type="button" onClick={() => removeSkill(s)} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
                                </span>
                            ))}
                        </div>
                        <input className="form-input" style={{ marginTop: '5px' }} onKeyDown={handleSkillsKeyDown} placeholder="Add skill..." />
                    </div>
                </div>

                <div style={{ textAlign: 'right', paddingBottom: '40px' }}>
                    <button type="submit" disabled={saving} style={{ padding: '12px 30px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {saving ? 'Processing...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfile;