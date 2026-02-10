import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentProjects = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        role: '',
        gitlink: '',
        deploylink: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/student/projects');
            setProjects(data || []);
        } catch (e) {
            console.error("Failed to fetch projects", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewProject({ ...newProject, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/student/post/project', newProject);
            setNewProject({ title: '', description: '', role: '', gitlink: '', deploylink: '' });
            setShowForm(false);
            fetchProjects(); // Refresh the list
        } catch (e) {
            alert("Failed to save project");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Projects...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#1e293b' }}>My Projects</h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Showcase your technical work and contributions.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: showForm ? '#ef4444' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ Add New Project'}
                </button>
            </div>

            {/* Project Addition Form */}
            {showForm && (
                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    marginBottom: '2rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Project Details</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Project Title</label>
                            <input name="title" required className="form-input" style={inputStyle} value={newProject.title} onChange={handleChange} placeholder="e.g. E-Commerce Backend" />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                            <textarea name="description" required className="form-input" style={{...inputStyle, height: '80px'}} value={newProject.description} onChange={handleChange} placeholder="What does this project do?" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Your Role</label>
                            <input name="role" className="form-input" style={inputStyle} value={newProject.role} onChange={handleChange} placeholder="e.g. Lead Developer" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>GitHub Link</label>
                            <input name="gitlink" className="form-input" style={inputStyle} value={newProject.gitlink} onChange={handleChange} placeholder="https://github.com/..." />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Live Deployment Link</label>
                            <input name="deploylink" className="form-input" style={inputStyle} value={newProject.deploylink} onChange={handleChange} placeholder="https://myproject.vercel.app" />
                        </div>
                        <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                            <button type="submit" disabled={submitting} style={submitBtnStyle}>
                                {submitting ? 'Saving...' : 'Save Project'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects Display Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.5rem' 
            }}>
                {projects.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No projects added yet. Start by clicking "Add New Project"!</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.25rem' }}>{project.title}</h3>
                                <span style={roleBadgeStyle}>{project.role || 'Contributor'}</span>
                            </div>
                            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', minHeight: '60px' }}>
                                {project.description}
                            </p>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                {project.gitlink && (
                                    <a href={project.gitlink} target="_blank" rel="noreferrer" style={linkStyle}>
                                        Code 🔗
                                    </a>
                                )}
                                {project.deploylink && (
                                    <a href={project.deploylink} target="_blank" rel="noreferrer" style={{...linkStyle, backgroundColor: '#10b981'}}>
                                        Live Demo 🌐
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Internal Styles
const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box'
};

const submitBtnStyle = {
    padding: '12px 25px',
    backgroundColor: '#0f172a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const roleBadgeStyle = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
};

const linkStyle = {
    flex: 1,
    textAlign: 'center',
    padding: '8px',
    backgroundColor: '#334155',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500'
};

export default StudentProjects;