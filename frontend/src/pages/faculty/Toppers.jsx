import React, { useState } from 'react';
import api from '../../services/api';

const FacultyToppers = () => {
    const [params, setParams] = useState({ batch: '', branch: 'CSE', semester: 1 });
    const [toppers, setToppers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchToppers = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const { data } = await api.get('/faculty/toppers', { params });
            setToppers(data);
        } catch (e) {
            console.error(e);
            setToppers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>View Batch Performance</h1>

            <div className="card" style={{ marginBottom: '2rem', maxWidth: '800px' }}>
                <form onSubmit={fetchToppers} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Batch</label>
                        <input className="form-input" required placeholder="2022" value={params.batch} onChange={e => setParams({ ...params, batch: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Branch</label>
                        <select className="form-select" value={params.branch} onChange={e => setParams({ ...params, branch: e.target.value })}>
                            <option>CSE</option>
                            <option>ECE</option>
                            <option>IT</option>
                            <option>EEE</option>
                            <option>MECH</option>
                            <option>CSM</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Semester</label>
                        <input className="form-input" type="number" min="1" max="8" value={params.semester} onChange={e => setParams({ ...params, semester: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>

            {searched && (
                <div className="card">
                    <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Results</h3>
                    {loading ? <div>Loading...</div> : toppers.length === 0 ? <div>No data found.</div> : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Roll Number</th>
                                    <th>Percentage / CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {toppers.map((t, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{t.rno || t.rollNo || 'N/A'}</td>
                                        <td>{t.percentage || t.cgpa || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};
export default FacultyToppers;
