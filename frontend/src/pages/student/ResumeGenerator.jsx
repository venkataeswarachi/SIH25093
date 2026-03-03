import React, { useState, useRef } from 'react';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeGenerator = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mlLoading, setMlLoading] = useState(false);
    const [role, setRole] = useState("Full Stack Developer");
    const [mlResults, setMlResults] = useState(null);
    const resumeRef = useRef();

    // ------------------ API Handlers ------------------
    const fetchResume = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/api/resume/generate');
            console.log("Resume Data:", data);
            setResumeData(data);
        } catch (error) {
            console.error("Error generating resume:", error);
        } finally {
            setLoading(false);
        }
    };

    const callML = async (endpoint) => {
        setMlLoading(true);
        try {
            const { data } = await api.post(`/api/ml/${endpoint}`, { target_role: role });
            setMlResults({ type: endpoint, data });
        } catch (error) {
            setMlResults({ type: 'error', data: error.message });
        } finally {
            setMlLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = resumeRef.current;
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save(`${resumeData?.student?.name || 'Resume'}.pdf`);
    };

    return (
        <div style={uiStyles.container}>
            {/* LEFT SIDE: AI CONTROL PANEL */}
            <div style={uiStyles.sidebar}>
                <h2 style={uiStyles.sidebarTitle}>VVITU AI Optimizer</h2>
                
                <div style={uiStyles.inputGroup}>
                    <label style={uiStyles.label}>Target Role</label>
                    <input 
                        style={uiStyles.input}
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                    />
                </div>

                <div style={uiStyles.buttonGrid}>
                    <button style={loading ? uiStyles.btnDisabled : uiStyles.primaryBtn} onClick={fetchResume} disabled={loading}>
                        {loading ? "Constructing..." : "⚡ Generate Professional Resume"}
                    </button>
                    
                    {resumeData && (
                        <>
                            <button style={uiStyles.mlBtn} onClick={() => callML("ats-score")} disabled={mlLoading}>
                                🎯 Calculate ATS Score
                            </button>
                            <button style={uiStyles.mlBtn} onClick={() => callML("classify-skills")} disabled={mlLoading}>
                                🔍 Skill Gap Analysis
                            </button>
                            <button style={uiStyles.successBtn} onClick={handleDownloadPDF}>
                                📥 Download A4 PDF
                            </button>
                        </>
                    )}
                </div>

                {mlResults && (
                    <div style={uiStyles.insightCard}>
                        <h4 style={{margin: '0 0 10px 0'}}>AI Feedback: {mlResults.type.toUpperCase()}</h4>
                        <pre style={uiStyles.pre}>{JSON.stringify(mlResults.data, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: PROFESSIONAL PREVIEW */}
            <div style={uiStyles.previewArea}>
                {!resumeData ? (
                    <div style={uiStyles.emptyState}>
                        <h3>Welcome, Eswar!</h3>
                        <p>Generate your Resume based on Your Profile And Records.</p>
                    </div>
                ) : (
                    <div ref={resumeRef} style={resumeStyles.page}>
                        {/* HEADER */}
                        <div style={resumeStyles.header}>
                            <h1 style={resumeStyles.name}>{resumeData.student.name}</h1>
                            <div style={resumeStyles.contactInfo}>
                                {resumeData.student.email} | {resumeData.student.mobile}
                            </div>
                            <div style={resumeStyles.links}>
                                <a href={resumeData.student.gitlink || "#"} target="_blank" rel="noreferrer" style={resumeStyles.linkItem}>GitHub</a> | 
                                <a href={resumeData.student.portfolio || "#"} target="_blank" rel="noreferrer" style={resumeStyles.linkItem}>Portfolio</a>
                            </div>
                        </div>

                        {/* PROFESSIONAL SUMMARY */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Professional Summary</div>
                            <p style={resumeStyles.text}>{resumeData.summary}</p>
                        </div>

                        {/* EDUCATION */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Education</div>
                            <div style={resumeStyles.subHeading}>
                                <strong>{resumeData.academics.course} in {resumeData.academics.branch}</strong>
                                <span>Year {resumeData.academics.year}</span>
                            </div>
                        </div>

                        {/* SKILLS */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Skills</div>
                            <p style={resumeStyles.text}><strong>Technical:</strong> {resumeData.student.skills?.join(", ")}</p>
                        </div>

                        {/* PROJECTS */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Projects</div>
                            {resumeData.projects?.map((p, i) => (
                                <div key={i} style={resumeStyles.entry}>
                                    <div style={resumeStyles.subHeading}>
                                        <strong>• {p.title} - {p.role || "Complete Development"}</strong>
                                    </div>
                                    <p style={resumeStyles.text}>{p.description}</p>
                                    <div style={resumeStyles.linksSmall}>
                                        <a href={p.gitlink || "#"} target="_blank" rel="noreferrer" style={resumeStyles.resumeLink}>GitHub</a> | 
                                        <a href={p.deploylink || "#"} target="_blank" rel="noreferrer" style={resumeStyles.resumeLink}> Live Demo</a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ACHIEVEMENTS */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Achievements & Open Source</div>
                            <ul style={resumeStyles.list}>
                                {resumeData.achievements?.map((a, i) => (
                                    <li key={i}><strong>{a.title}:</strong> {a.description}</li>
                                ))}
                                <li><strong>Open Source:</strong> Contribution in project completion with Wikimedia people.</li>
                            </ul>
                        </div>

                        {/* INTERNSHIPS */}
                        <div style={resumeStyles.section}>
                            <div style={resumeStyles.sectionTitle}>Internships</div>
                            <div style={resumeStyles.entry}>
                                <strong>Internship Completion - Eduskills</strong>
                                <p style={resumeStyles.text}>Java Full Stack Development Internship focused on building scalable services.</p>
                            </div>
                        </div>

                        <div style={{textAlign: 'center', marginTop: '20px', fontSize: '10pt', color: '#666'}}>
                            --- End of Resume ---
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ------------------ STYLES ------------------
const uiStyles = {
    container: { display: 'flex', height: '100vh', background: '#eef2f7', fontFamily: '"Segoe UI", sans-serif' },
    sidebar: { width: '380px', background: '#fff', padding: '30px', borderRight: '1px solid #d1d9e6', overflowY: 'auto' },
    sidebarTitle: { fontSize: '22px', fontWeight: 'bold', marginBottom: '25px', color: '#003366' },
    previewArea: { flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', justifyContent: 'center' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#444', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
    buttonGrid: { display: 'grid', gap: '10px' },
    primaryBtn: { background: '#003366', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    mlBtn: { background: '#fff', border: '1px solid #003366', color: '#003366', padding: '12px', borderRadius: '8px', cursor: 'pointer' },
    successBtn: { background: '#28a745', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    btnDisabled: { background: '#ccc', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'not-allowed' },
    insightCard: { marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #003366' },
    pre: { fontSize: '11px', background: '#222', color: '#0f0', padding: '10px', borderRadius: '5px', overflowX: 'auto' },
    emptyState: { textAlign: 'center', marginTop: '20%' }
};

const resumeStyles = {
    page: { width: '210mm', minHeight: '297mm', padding: '20mm', background: '#fff', fontFamily: '"Times New Roman", Times, serif', color: '#000', lineHeight: '1.4' },
    header: { textAlign: 'center', marginBottom: '15px', borderBottom: '2px solid #000', paddingBottom: '10px' },
    name: { fontSize: '24pt', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' },
    contactInfo: { fontSize: '11pt', margin: '5px 0' },
    links: { fontSize: '10pt' },
    linkItem: { textDecoration: 'none', color: '#000', fontWeight: 'bold' },
    resumeLink: { textDecoration: 'none', color: '#0056b3', fontWeight: 'normal' }, // Blue clickable links in resume
    section: { marginTop: '12px' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #000', marginBottom: '5px' },
    subHeading: { display: 'flex', justifyContent: 'space-between', fontSize: '11pt', fontWeight: 'bold' },
    text: { fontSize: '11pt', textAlign: 'justify', margin: '3px 0' },
    entry: { marginBottom: '10px' },
    linksSmall: { fontSize: '10pt', marginTop: '2px' },
    list: { paddingLeft: '20px', margin: '5px 0', fontSize: '11pt' }
};

export default ResumeGenerator;