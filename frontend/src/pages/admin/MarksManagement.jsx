import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadView from './FileUploadView';

const MarksManagement = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Examination Management</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <FileUploadView 
                    title="Internal Marks" 
                    endpoint="/admin/internalmarks" 
                    description="Upload mid-term and internal assessment marks."
                />
                <FileUploadView 
                    title="External Marks" 
                    endpoint="/admin/externalmarks" 
                    description="After success, you will be redirected to promote students."
                    onSuccess={() => {
                        if(window.confirm("External marks uploaded. Proceed to Batch Promotions?")) {
                            navigate('/admin/promote');
                        }
                    }}
                />
            </div>
        </div>
    );
};
export default MarksManagement;