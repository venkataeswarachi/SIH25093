import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // Toggle State

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const result = await login(formData.email, formData.password);

        if (result.success) {
            window.location.href = '/';
        } else {
            if (result.status === 'CHANGE_PASSWORD_REQUIRED') {
                navigate('/change-password', { state: { email: formData.email } });
            } else {
                setError(result.error);
            }
        }
    };

    return (
        <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="heading-md" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-muted)' }}>Sign in to Smart Student Hub</p>
            </div>

            {error && (
                <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            required
                            style={{ paddingRight: '40px' }}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            {showPassword ? "🙈" : "👀"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Sign In
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                Don't have an account? <Link to="/signup" style={{ fontWeight: 500 }}>Register now</Link>
            </div>
        </div>
    );
};

export default Login;