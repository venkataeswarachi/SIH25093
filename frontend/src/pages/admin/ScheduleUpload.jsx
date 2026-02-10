import React from 'react';
import FileUploadView from './FileUploadView';

const ScheduleUpload = () => {
    return (
        <FileUploadView 
            title="Class Schedule & Timetable"
            endpoint="/admin/upload/schedule"
            extraParams={[
                { name: 'title', label: 'Schedule Title', type: 'text' },
                { name: 'branch', label: 'Branch', type: 'select', options: ['CSE', 'ECE', 'IT', 'CSM'] },
                { name: 'year', label: 'Year', type: 'number' },
                { name: 'semester', label: 'Semester', type: 'number' },
                { name: 'section', label: 'Section', type: 'text' }
            ]}
        />
    );
};
export default ScheduleUpload;