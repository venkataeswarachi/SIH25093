import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const EyeIcon = ({ open }) => open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);
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
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid rgba(226,232,240,0.8)',
        }}>
            <style>{`
                .login-input-wrap { position: relative; }
                .login-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    background: #fafbff;
                    font-size: 0.9rem;
                    font-family: inherit;
                    color: #1e293b;
                    transition: all 0.2s;
                    outline: none;
                }
                .login-input:focus {
                    border-color: #6366f1;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .login-input::placeholder { color: #b0bec5; }
                .login-btn {
                    width: 100%; padding: 0.85rem;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; font-weight: 700; font-size: 0.95rem;
                    border: none; border-radius: 12px; cursor: pointer;
                    transition: all 0.25s; letter-spacing: 0.02em;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    font-family: inherit;
                }
                .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
                .login-btn:active { transform: scale(0.98); }
                .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner {
                    width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
            `}</style>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 1rem',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
                    Welcome back
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Sign in to Smart Student Hub</p>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '0.75rem 1rem', background: '#fef2f2', color: '#dc2626',
                    borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem',
                    border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="login-input"
                        placeholder="you@university.edu"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* Password */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Password
                    </label>
                    <div className="login-input-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="login-input"
                            placeholder="••••••••"
                            required
                            style={{ paddingRight: '44px' }}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                                padding: '2px', display: 'flex', alignItems: 'center',
                            }}
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <><div className="spinner" />Signing in...</> : 'Sign In'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ fontWeight: 700, color: '#6366f1' }}>Register now</Link>
            </div>
        </div>
    );
};

export default Login;