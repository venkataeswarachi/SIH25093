import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudentAcademics = () => {
    const [summary, setSummary] = useState(null);
    const [semester, setSemester] = useState(1);
    const [internals, setInternals] = useState([]);
    const [externals, setExternals] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const reportRef = useRef();

    // Grade Color Helper
    const getGradeColor = (grade) => {
        if (!grade) return '#666';
        if (grade.startsWith('A') || grade === 'O' || grade === 'P') return '#22c55e'; // Green
        if (grade.startsWith('B')) return '#3b82f6'; // Blue
        if (grade.startsWith('C')) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await api.get('/student/academics');
                setSummary(data);
                if (data.semester) setSemester(data.semester);
            } catch (e) { console.error(e); }
        };
        fetchSummary();
    }, []);

    useEffect(() => {
        const fetchMarks = async () => {
            setLoading(true);
            try {
                const [intRes, extRes] = await Promise.allSettled([
                    api.get(`/student/internalmarks/${semester}`),
                    api.get(`/student/externalmarks/${semester}`)
                ]);
                setInternals(intRes.status === 'fulfilled' ? intRes.value.data : []);
                setExternals(extRes.status === 'fulfilled' ? extRes.value.data : []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchMarks();
    }, [semester]);

    const overallFinalGrade = externals.length > 0 ? externals[0].finalGrade : null;

    const handleDownloadPDF = async () => {
        const element = reportRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Marksheet_Sem${semester}.pdf`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="heading-lg" style={{ margin: 0 }}>Academic Performance</h1>
                <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={loading || (!internals.length && !externals.length)}>
                    📥 Download Report
                </button>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="heading-md">Select Semester:</span>
                <select className="form-select" value={semester} onChange={e => setSemester(Number(e.target.value))} style={{ width: '150px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
            </div>

            <div ref={reportRef} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid var(--primary)', paddingBottom: '15px' }}>
                    <h2 style={{ color: 'var(--primary)', margin: '0 0 5px 0' }}>ACADEMIC RECORD</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Semester {semester}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    {summary && (
                        <div className="card" style={{ borderLeft: '5px solid var(--primary)', margin: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div><strong>Branch:</strong> {summary.branch}</div>
                                <div><strong>Batch:</strong> {summary.batch}</div>
                                <div><strong>Section:</strong> {summary.section}</div>
                                <div><strong>Status:</strong> <span className="badge badge-success">{summary.status}</span></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Final Grade Box with Green Styling */}
                    {overallFinalGrade && (
                        <div className="card" style={{ 
                            textAlign: 'center', 
                            margin: 0, 
                            background: '#f0fdf4', // Light green bg
                            borderColor: getGradeColor(overallFinalGrade), 
                            borderWidth: '2px' 
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 'bold' }}>FINAL GRADE</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: getGradeColor(overallFinalGrade) }}>
                                {overallFinalGrade}
                            </div>
                        </div>
                    )}
                </div>

                {/* Internal Marks Table */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 className="heading-md" style={{ marginBottom: '1.25rem', color: 'var(--primary)' }}>Internal Assessment</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table table-bordered" style={{ fontSize: '0.8rem' }}>
                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                <tr>
                                    <th rowSpan="2" style={{ verticalAlign: 'middle' }}>Subject</th>
                                    <th colSpan="5" style={{ textAlign: 'center' }}>Midterm 1</th>
                                    <th colSpan="5" style={{ textAlign: 'center' }}>Midterm 2</th>
                                    <th rowSpan="2" style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: '#eef2ff' }}>Final</th>
                                </tr>
                                <tr style={{ fontSize: '0.7rem' }}>
                                    <th>Sem</th><th>OB</th><th>Des</th><th>Obj</th><th>Total</th>
                                    <th>Sem</th><th>OB</th><th>Des</th><th>Obj</th><th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internals.map((m, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{m.subjectName}</td>
                                        <td>{m.seminar1}</td><td>{m.openbook1}</td><td>{m.descriptive1}</td><td>{m.objective1}</td><td>{m.total1}</td>
                                        <td>{m.seminar2}</td><td>{m.openbook2}</td><td>{m.descriptive2}</td><td>{m.objective2}</td><td>{m.total2}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f0f4ff' }}>{m.finalInternalMarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* External Marks Table with Green Grade Pills */}
                <div className="card">
                    <h3 className="heading-md" style={{ marginBottom: '1.25rem', color: 'var(--success)' }}>Semester End Results</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Subject Name</th>
                                    <th>Internal</th>
                                    <th>External</th>
                                    <th>Total</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {externals.map((m, i) => {
                                    const intMarks = internals.find(int => int.subjectName === m.subjectName)?.finalInternalMarks || 0;
                                    return (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 500 }}>{m.subjectName}</td>
                                            <td>{intMarks}</td>
                                            <td>{m.total}</td>
                                            <td style={{ fontWeight: 'bold' }}>{m.total + intMarks}</td>
                                            <td><span className="badge badge-info">{m.grade}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAcademics;