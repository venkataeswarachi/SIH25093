import React, { useState } from 'react';
import api from '../../services/api';

const MLTools = () => {

    const userEmail = localStorage.getItem("userEmail") || "student@gmail.com";

    const [role, setRole] = useState("Full Stack Developer");

    const [skillsResult, setSkillsResult] = useState(null);
    const [projectsResult, setProjectsResult] = useState(null);
    const [achResult, setAchResult] = useState(null);
    const [atsResult, setAtsResult] = useState(null);
    const [summaryResult, setSummaryResult] = useState(null);
    const [projEnhResult, setProjEnhResult] = useState(null);
    const [achEnhResult, setAchEnhResult] = useState(null);

    const callEndpoint = async (path, body, setResult) => {
        try {
            const { data } = await api.post(`/api/ml/${path}`, body);
            setResult(data);
        } catch (err) {
            console.error(path, err);
            setResult({
                error: err.response?.data?.detail || err.message
            });
        }
    };

    const basePayload = {
        email: userEmail,
        target_role: role
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>ML Service Tools</h2>

            <div style={{ marginBottom: "1rem" }}>
                <label>Target Role: </label>
                <input
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{ padding: "5px", width: "300px" }}
                />
            </div>

            {/* Classify Skills */}
            <section className="card">
                <h3>Classify Skills</h3>
                <button onClick={() =>
                    callEndpoint('classify-skills', basePayload, setSkillsResult)
                }>
                    Run
                </button>
                <pre>{skillsResult && JSON.stringify(skillsResult, null, 2)}</pre>
            </section>

            {/* Rank Projects */}
            <section className="card">
                <h3>Rank Projects</h3>
                <button onClick={() =>
                    callEndpoint('rank-projects', basePayload, setProjectsResult)
                }>
                    Run
                </button>
                <pre>{projectsResult && JSON.stringify(projectsResult, null, 2)}</pre>
            </section>

            {/* Score Achievements */}
            <section className="card">
                <h3>Score Achievements</h3>
                <button onClick={() =>
                    callEndpoint('score-achievements', basePayload, setAchResult)
                }>
                    Run
                </button>
                <pre>{achResult && JSON.stringify(achResult, null, 2)}</pre>
            </section>

            {/* ATS Score */}
            <section className="card">
                <h3>ATS Score</h3>
                <button onClick={() =>
                    callEndpoint('ats-score', basePayload, setAtsResult)
                }>
                    Compute
                </button>
                <pre>{atsResult && JSON.stringify(atsResult, null, 2)}</pre>
            </section>

            {/* Generate Summary */}
            <section className="card">
                <h3>Generate Summary</h3>
                <button onClick={() =>
                    callEndpoint('summary', basePayload, setSummaryResult)
                }>
                    Generate
                </button>
                <pre>{summaryResult && JSON.stringify(summaryResult, null, 2)}</pre>
            </section>

            {/* Enhance Project */}
            <section className="card">
                <h3>Enhance Project</h3>
                <button onClick={() =>
                    callEndpoint('enhance-project', basePayload, setProjEnhResult)
                }>
                    Enhance
                </button>
                <pre>{projEnhResult && JSON.stringify(projEnhResult, null, 2)}</pre>
            </section>

            {/* Enhance Achievement */}
            <section className="card">
                <h3>Enhance Achievement</h3>
                <button onClick={() =>
                    callEndpoint('enhance-achievement', basePayload, setAchEnhResult)
                }>
                    Enhance
                </button>
                <pre>{achEnhResult && JSON.stringify(achEnhResult, null, 2)}</pre>
            </section>

        </div>
    );
};

export default MLTools;