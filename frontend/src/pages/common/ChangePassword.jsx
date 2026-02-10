import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        password: '',
        newpassword: '',
        confirmPassword: ''
    });
    
    const [status, setStatus] = useState({ type: '', message: '' });
    
    // Visibility states
    const [showPass, setShowPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newpassword !== formData.confirmPassword) {
            setStatus({ type: 'danger', message: 'New passwords do not match' });
            return;
        }

        try {
            // Note: endpoint matches your @PostMapping("/changepassword")
            const response = await api.post('/changepassword', {
                email: formData.email,
                password: formData.password,
                newpassword: formData.newpassword
            });

            if (response.status === 200) {
                alert("Password updated successfully! Please login with your new password.");
                navigate('/login');
            }
        } catch (err) {
            // Display exact error message from backend (e.g., "Contact Admin")
            const msg = err.response?.data || "An error occurred";
            setStatus({ type: 'danger', message: msg });
        }
    };

    // Helper to render password input with toggle
    const PasswordInput = ({ label, value, onChange, isVisible, toggleVisible }) => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type={isVisible ? "text" : "password"}
                    className="form-input"
                    required
                    style={{ paddingRight: '40px' }}
                    value={value}
                    onChange={onChange}
                />
                <button 
                    type="button"
                    onClick={toggleVisible}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {isVisible ? "🙈" : "👀"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="heading-md" style={{ color: 'var(--primary)' }}>Setup New Password</h1>
                <p style={{ color: 'var(--text-muted)' }}>Required for your first login.</p>
            </div>

            {status.message && (
                <div style={{ 
                    padding: '0.75rem', 
                    background: status.type === 'danger' ? 'var(--danger-bg)' : 'var(--success-bg)', 
                    color: status.type === 'danger' ? 'var(--danger)' : 'var(--success)', 
                    borderRadius: 'var(--radius)', 
                    marginBottom: '1rem' 
                }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <PasswordInput 
                    label="Current Password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    isVisible={showPass}
                    toggleVisible={() => setShowPass(!showPass)}
                />

                <PasswordInput 
                    label="New Password"
                    value={formData.newpassword}
                    onChange={e => setFormData({ ...formData, newpassword: e.target.value })}
                    isVisible={showNewPass}
                    toggleVisible={() => setShowNewPass(!showNewPass)}
                />

                <PasswordInput 
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    isVisible={showNewPass} // Shared toggle for new password fields
                    toggleVisible={() => setShowNewPass(!showNewPass)}
                />

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;