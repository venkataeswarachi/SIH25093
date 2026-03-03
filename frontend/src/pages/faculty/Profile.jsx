import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FacultyProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        gender: '',
        branch: '',
        position: '',
        address: '',
        workexperience: '',
        about: '',
        martialstatus: '',
        bloodgroup: '',
        contactemail: '',
        mobile: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/faculty/profile');
                setProfile(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/faculty/edit-profile', {
                ...profile,
                mobile: profile.mobile ? Number(profile.mobile) : null
            });
            alert('Profile Updated Successfully');
        } catch (e) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>
                Faculty Profile
            </h1>

            <form onSubmit={handleSubmit} className="card">

                <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                        name="firstname"
                        className="form-input"
                        value={profile.firstname}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                        name="lastname"
                        className="form-input"
                        value={profile.lastname}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        name="username"
                        className="form-input"
                        value={profile.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="form-input"
                        value={profile.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                        name="contactemail"
                        type="email"
                        className="form-input"
                        value={profile.contactemail}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mobile</label>
                    <input
                        name="mobile"
                        type="number"
                        className="form-input"
                        value={profile.mobile}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                        name="gender"
                        className="form-input"
                        value={profile.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input
                        name="branch"
                        className="form-input"
                        value={profile.branch}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Position</label>
                    <input
                        name="position"
                        className="form-input"
                        value={profile.position}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Work Experience</label>
                    <input
                        name="workexperience"
                        className="form-input"
                        value={profile.workexperience}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Marital Status</label>
                    <input
                        name="martialstatus"
                        className="form-input"
                        value={profile.martialstatus}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <input
                        name="bloodgroup"
                        className="form-input"
                        value={profile.bloodgroup}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        className="form-input"
                        value={profile.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">About</label>
                    <textarea
                        name="about"
                        className="form-input"
                        value={profile.about}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
};

export default FacultyProfile;