import React, { useState, useRef } from 'react';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeGenerator = () => {

    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);

    const resumeRef = useRef();

    // Fetch resume from backend
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


    // Download PDF
    const handleDownloadPDF = async () => {

        const element = resumeRef.current;

        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        const fileName =
            resumeData.student.name.replace(/\s+/g, "_") + "_Resume.pdf";

        pdf.save(fileName);

    };


    // Styling
    const styles = {

        page: {
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            margin: '20px auto',
            backgroundColor: '#fff',
            color: '#000',
            fontFamily: '"Times New Roman", Times, serif',
            lineHeight: '1.5',
            border: '1px solid #ddd',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        },

        header: {
            textAlign: 'center',
            marginBottom: '15px'
        },

        name: {
            fontSize: '22pt',
            fontWeight: 'bold',
            margin: '0',
            textTransform: 'uppercase'
        },

        contact: {
            fontSize: '10.5pt',
            margin: '3px 0'
        },

        sectionTitle: {
            fontSize: '12pt',
            fontWeight: 'bold',
            borderBottom: '1.5px solid #000',
            marginTop: '15px',
            marginBottom: '8px',
            textTransform: 'uppercase'
        },

        content: {
            fontSize: '11pt',
            marginBottom: '8px',
            textAlign: 'justify'
        },

        list: {
            paddingLeft: '20px',
            marginBottom: '10px',
            fontSize: '11pt'
        },

        link: {
            color: '#000',
            textDecoration: 'none',
            fontWeight: 'bold'
        }

    };


    return (

        <div style={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>


            {/* Buttons */}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>

                {!resumeData ? (

                    <button
                        className="btn btn-primary"
                        onClick={fetchResume}
                        disabled={loading}
                    >
                        {loading ? "Generating Resume..." : "Generate Resume"}

                    </button>

                ) : (

                    <button
                        className="btn btn-success"
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </button>

                )}

            </div>


            {/* Resume */}

            {resumeData && (

                <div ref={resumeRef} style={styles.page}>

                    {/* Header */}

                    <div style={styles.header}>

                        <h1 style={styles.name}>
                            {resumeData.student.name}
                        </h1>

                        <p style={styles.contact}>
                            {resumeData.student.email}
                            {" | "}
                            {resumeData.student.mobile}
                        </p>


                        {/* Links */}

                        <div style={styles.contact}>

                            {resumeData.student.gitlink && (

                                <>
                                    <a
                                        href={resumeData.student.gitlink}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.link}
                                    >
                                        GitHub
                                    </a>
                                </>

                            )}

                            {resumeData.student.portfolio && (

                                <>
                                    {" | "}
                                    <a
                                        href={resumeData.student.portfolio}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.link}
                                    >
                                        Portfolio
                                    </a>
                                </>

                            )}

                        </div>

                    </div>


                    {/* Summary */}

                    <div style={styles.sectionTitle}>
                        Professional Summary
                    </div>

                    <div style={styles.content}>
                        {resumeData.summary}
                    </div>



                    {/* Education */}

                    <div style={styles.sectionTitle}>
                        Education
                    </div>

                    <div style={styles.content}>

                        <strong>
                            {resumeData.academics.course}
                            {" in "}
                            {resumeData.academics.branch}
                            {", Year "}
                            {resumeData.academics.year}
                        </strong>

                    </div>



                    {/* Skills */}

                    {resumeData.student.skills?.length > 0 && (

                        <>

                            <div style={styles.sectionTitle}>
                                Skills
                            </div>

                            <div style={styles.content}>
                                {resumeData.student.skills.join(", ")}
                            </div>

                        </>

                    )}



                    {/* Projects */}

                    {resumeData.projects?.length > 0 && (

                        <>

                            <div style={styles.sectionTitle}>
                                Projects
                            </div>

                            <ul style={styles.list}>

                                {resumeData.projects.map((project, index) => (

                                    <li key={index}>

                                        <strong>
                                            {project.title}
                                        </strong>

                                        {project.role &&
                                            ` — ${project.role}`
                                        }

                                        {project.description && (

                                            <div>
                                                {project.description}
                                            </div>

                                        )}

                                        {(project.gitlink ||
                                            project.deploylink) && (

                                                <div>

                                                    {project.gitlink && (

                                                        <a
                                                            href={project.gitlink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            GitHub
                                                        </a>

                                                    )}

                                                    {project.gitlink &&
                                                        project.deploylink &&
                                                        " | "}

                                                    {project.deploylink && (

                                                        <a
                                                            href={project.deploylink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Live Demo
                                                        </a>

                                                    )}

                                                </div>

                                            )}

                                    </li>

                                ))}

                            </ul>

                        </>

                    )}



                    {/* Achievements */}
                    {resumeData.achievements?.length > 0 && (

                        <>
                            <div style={styles.sectionTitle}>
                                Achievements
                            </div>

                            <ul style={styles.list}>

                                {resumeData.achievements.map((ach, index) => (

                                    <li key={index} style={{ marginBottom: "8px" }}>

                                        {/* Title and Category in one row */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontWeight: "bold"
                                        }}>

                                            <span>{ach.title}</span>

                                            <span style={{
                                                fontStyle: "italic",
                                                fontWeight: "normal"
                                            }}>
                                                {ach.category}
                                            </span>

                                        </div>

                                        {/* Description */}
                                        {ach.description && (
                                            <div>
                                                {ach.description}
                                            </div>
                                        )}

                                    </li>

                                ))}

                            </ul>
                        </>
                    )}




                    {/* Footer */}

                    <div style={{
                        marginTop: '30px',
                        borderTop: '1px solid #eee',
                        paddingTop: '10px',
                        textAlign: 'center'
                    }}>

                        <small style={{
                            color: '#999',
                            fontStyle: 'italic'
                        }}>
                            End of Resume
                        </small>

                    </div>

                </div>

            )}

        </div>

    );

};

export default ResumeGenerator;
