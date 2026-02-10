import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StudentAttendance = () => {
    const [year, setYear] = useState(2);
    const [semester, setSemester] = useState(3);
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/student/view/attendance`, {
                params: { year, semester }
            });
            setAttendanceData(data);
        } catch (err) {
            console.error("Error fetching attendance:", err);
            setAttendanceData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [year, semester]);

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Attendance Record</h1>

            {/* Selection Filters - Aligned in one line */}
            <div className="card" style={{ 
                marginBottom: '2rem', 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'flex-end', 
                gap: '1.5rem',
                flexWrap: 'wrap' 
            }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>Academic Year</label>
                    <select 
                        className="form-select" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        style={{ width: '140px' }}
                    >
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>Semester</label>
                    <select 
                        className="form-select" 
                        value={semester} 
                        onChange={(e) => setSemester(e.target.value)}
                        style={{ width: '140px' }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>

                <button 
                    className="btn btn-primary" 
                    onClick={fetchAttendance}
                    style={{ height: '38px', padding: '0 20px' }}
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading attendance data...</div>
            ) : attendanceData ? (
                <>
                    {/* Overall Summary Card */}
                    <div className="card" style={{ marginBottom: '2rem', borderLeft: '5px solid var(--success)' }}>
                        <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Overall Summary</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL CLASSES</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{attendanceData.overall.totalClasses}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PRESENT</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{attendanceData.overall.present}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ABSENT</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                                    {attendanceData.overall.totalClasses - attendanceData.overall.present}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PERCENTAGE</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {attendanceData.overall.percentage.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject Wise Details */}
                    <div className="card">
                        <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Subject Wise Attendance</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Total Classes</th>
                                        <th>Attended</th>
                                        <th>Absent</th>
                                        <th>Percentage</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.subjects.map((sub, index) => {
                                        const absents = sub.totalClasses - sub.present;
                                        return (
                                            <tr key={index}>
                                                <td style={{ fontWeight: 'bold' }}>{sub.subjectCode}</td>
                                                <td>{sub.totalClasses}</td>
                                                <td style={{ color: 'var(--success)', fontWeight: '500' }}>{sub.present}</td>
                                                <td style={{ color: 'var(--danger)' }}>{absents}</td>
                                                <td>{sub.percentage.toFixed(2)}%</td>
                                                <td>
                                                    <span className={`badge ${sub.percentage >= 75 ? 'badge-success' : 'badge-danger'}`}>
                                                        {sub.percentage >= 75 ? 'Good' : 'Low'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No records found for Year {year} Semester {semester}.
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;