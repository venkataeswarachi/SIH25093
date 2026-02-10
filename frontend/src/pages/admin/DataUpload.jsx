import React from 'react';
import FileUploadView from './FileUploadView';

const DataUpload = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <FileUploadView 
                title="Add Users" 
                endpoint="/admin/upload-users" 
                extraParams={[{ name: 'role', label: 'User Role', type: 'select', options: ['STUDENT', 'FACULTY', 'ADMIN'] }]} 
            />
            <FileUploadView 
                title="Academic Records" 
                endpoint="/admin/upload-academics" 
            />
            <FileUploadView 
                title="Enroll Subjects" 
                endpoint="/admin/enroll/subjects" 
                description="Upload subjects for the upcoming semester."
            />
            <FileUploadView 
                title="Detained List" 
                endpoint="/admin/update-detainedlist" 
            />
        </div>
    );
};
export default DataUpload;