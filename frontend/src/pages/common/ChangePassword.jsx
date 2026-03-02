import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

/* ✅ MOVE THIS OUTSIDE */
const PasswordInput = ({
    label,
    value,
    onChange,
    isVisible,
    toggleVisible
}) => {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type={isVisible ? 'text' : 'password'}
                    className="form-input"
                    required
                    value={value}
                    onChange={onChange}
                    style={{ paddingRight: '40px' }}
                />
                <button
                    type="button"
                    onClick={toggleVisible}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {isVisible ? '🙈' : '👀'}
                </button>
            </div>
        </div>
    );
};

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

    const [showPass, setShowPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newpassword !== formData.confirmPassword) {
            setStatus({ type: 'danger', message: 'New passwords do not match' });
            return;
        }

        try {
            const response = await api.post('/auth/changepassword', {
                email: formData.email,
                password: formData.password,
                newpassword: formData.newpassword
            });

            if (response.status === 200) {
                alert('Password updated successfully! Please login again.');
                navigate('/login');
            }
        } catch (err) {
            const msg = err.response?.data || 'An error occurred';
            console.error('Password change error:', err);
            setStatus({ type: 'danger', message: msg });
        }
    };

    return (
        <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="heading-md">Setup New Password</h1>
                <p>Required for your first login.</p>
            </div>

            {status.message && (
                <div style={{ marginBottom: '1rem', color: 'red' }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <PasswordInput
                    label="Current Password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    isVisible={showPass}
                    toggleVisible={() => setShowPass(!showPass)}
                />

                <PasswordInput
                    label="New Password"
                    value={formData.newpassword}
                    onChange={(e) =>
                        setFormData({ ...formData, newpassword: e.target.value })
                    }
                    isVisible={showNewPass}
                    toggleVisible={() => setShowNewPass(!showNewPass)}
                />

                <PasswordInput
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value
                        })
                    }
                    isVisible={showConfirmPass}
                    toggleVisible={() =>
                        setShowConfirmPass(!showConfirmPass)
                    }
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;