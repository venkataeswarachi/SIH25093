import React, { useState } from 'react';
import api from '../../services/api';

const FacultyAttendance = () => {
    const [step, setStep] = useState(1);
    const [params, setParams] = useState({
        subjectCode: '',
        date: new Date().toISOString().split('T')[0],
        period: 1,
        year: 1,
        semester: 1,
        branch: 'CSE',
        section: 'A'
    });
    
    // students will now be an array of Strings (roll numbers)
    const [students, setStudents] = useState([]); 
    const [attendance, setAttendance] = useState({}); // Mapping: RollNo -> STATUS
    const [submitting, setSubmitting] = useState(false);

    const fetchStudentsList = async (e) => {
        e.preventDefault();
        try {
            // Calling your new endpoint: /faculty/students
            const { data } = await api.get('/faculty/students', {
                params: {
                    branch: params.branch,
                    section: params.section,
                    year: params.year,
                    semester: params.semester
                }
            });

            if (data.length === 0) {
                alert('No students found for the selected criteria.');
                return;
            }

            setStudents(data);

            // Initialize all fetched roll numbers as PRESENT
            const initialStatus = {};
            data.forEach(rollNo => {
                initialStatus[rollNo] = 'PRESENT';
            });
            setAttendance(initialStatus);
            setStep(2);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch students. Please check your connection and parameters.');
        }
    };

    const toggleAttendance = (rollNo) => {
        setAttendance(prev => ({
            ...prev,
            [rollNo]: prev[rollNo] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
        }));
    };

    const submitAttendance = async () => {
        setSubmitting(true);
        try {
            const payload = {
                ...params,
                studentStatus: attendance // Matches Map<String, String> in Java
            };
            
            const response = await api.post('/faculty/mark/attendance', payload);
            alert(response.data || 'Attendance Saved Successfully');
            
            // Reset state
            setStep(1);
            setStudents([]);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data || 'Failed to save attendance';
            alert(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="attendance-container">
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Faculty Attendance Portal</h1>

            {/* STEP 1: SELECT CLASS DETAILS */}
            {step === 1 && (
                <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <form onSubmit={fetchStudentsList}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Branch</label>
                                <select className="form-select" value={params.branch} onChange={e => setParams({ ...params, branch: e.target.value })}>
                                    <option>CSE</option><option>CSM</option><option>ECE</option>
                                    <option>IT</option><option>EEE</option><option>MECH</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <input className="form-input" placeholder="e.g. A" required value={params.section} onChange={e => setParams({ ...params, section: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input className="form-input" type="number" min="1" max="4" value={params.year} onChange={e => setParams({ ...params, year: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Semester</label>
                                <input className="form-input" type="number" min="1" max="8" value={params.semester} onChange={e => setParams({ ...params, semester: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject Code</label>
                                <input className="form-input" required placeholder="CS301" value={params.subjectCode} onChange={e => setParams({ ...params, subjectCode: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Period</label>
                                <input className="form-input" type="number" value={params.period} onChange={e => setParams({ ...params, period: parseInt(e.target.value) })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Date</label>
                                <input className="form-input" type="date" required value={params.date} onChange={e => setParams({ ...params, date: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                            Get Student List
                        </button>
                    </form>
                </div>
            )}

            {/* STEP 2: MARKING ATTENDANCE */}
            {step === 2 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 className="heading-md">Class: {params.branch}-{params.section} (Period {params.period})</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Subject: {params.subjectCode} | Date: {params.date}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                        <table className="table">
                            <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(rollNo => (
                                    <tr key={rollNo} style={{ background: attendance[rollNo] === 'ABSENT' ? '#fff5f5' : 'transparent' }}>
                                        <td style={{ fontWeight: 'bold' }}>{rollNo}</td>
                                        <td>
                                            <span className={`badge ${attendance[rollNo] === 'PRESENT' ? 'badge-success' : 'badge-danger'}`}>
                                                {attendance[rollNo]}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => toggleAttendance(rollNo)}
                                                className={`btn ${attendance[rollNo] === 'PRESENT' ? 'btn-danger' : 'btn-success'}`}
                                                style={{ padding: '0.4rem 1rem' }}
                                            >
                                                Mark {attendance[rollNo] === 'PRESENT' ? 'Absent' : 'Present'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={submitAttendance} 
                            className="btn btn-primary btn-lg" 
                            disabled={submitting}
                            style={{ padding: '0.8rem 2.5rem' }}
                        >
                            {submitting ? 'Saving...' : 'Final Submit Attendance'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyAttendance;