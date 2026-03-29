import React from 'react';
import { Outlet } from 'react-router-dom';
import vvitLogo from '../assets/vvit-logo.png';

const FloatingOrb = ({ style }) => (
    <div style={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        ...style,
    }} />
);

const AuthLayout = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
        }}>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33%  { transform: translateY(-18px) rotate(2deg); }
                    66%  { transform: translateY(-8px) rotate(-1deg); }
                }
                @keyframes gradientShift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .auth-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(255,255,255,0.08);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.12);
                    font-size: 0.875rem;
                    color: rgba(255,255,255,0.85);
                    backdrop-filter: blur(6px);
                    animation: fadeSlideIn 0.5s ease both;
                }
            `}</style>

            {/* ── Left Branding Panel ── */}
            <div style={{
                width: '45%',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 12s ease infinite',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem',
                overflow: 'hidden',
            }}>
                {/* Floating decorative orbs */}
                <FloatingOrb style={{ width: 250, height: 250, top: '-80px', left: '-80px', animationDelay: '0s' }} />
                <FloatingOrb style={{ width: 180, height: 180, bottom: '60px', right: '-50px', animationDelay: '2s' }} />
                <FloatingOrb style={{ width: 120, height: 120, bottom: '200px', left: '40px', animationDelay: '4s' }} />
                <FloatingOrb style={{ width: 80, height: 80, top: '30%', right: '80px', animationDelay: '1s' }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '380px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px', margin: '0 auto 1.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                    }}>
                        <img src={vvitLogo} alt="VVIT Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    </div>

                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                        Smart Student Hub
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Your all-in-one university portal for academics, achievements, and career growth.
                    </p>

                    {/* Feature highlights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                        {[
                            { icon: '🎓', label: 'Track academics & attendance in real-time' },
                            { icon: '🤖', label: 'AI-powered resume & skills analysis'       },
                            { icon: '🏆', label: 'Showcase achievements and projects'        },
                        ].map((f, i) => (
                            <div key={i} className="auth-feature-item" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                                {f.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom watermark */}
                <div style={{ position: 'absolute', bottom: '1.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>
                    © 2025 VVIT — Smart Student Hub
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8faff',
                padding: '2rem',
                backgroundImage: 'radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.06) 0%, transparent 60%)',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    animation: 'fadeSlideIn 0.5s ease both',
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
