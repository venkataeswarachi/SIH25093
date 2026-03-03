import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';
import ChangePassword from './pages/common/ChangePassword';
import { useAuth } from './auth/AuthContext';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentAcademics from './pages/student/Academics';
import StudentAchievements from './pages/student/Achievements';
import StudentAttendance from './pages/student/Attendance';
import StudentNotices from './pages/student/Notice';
import EnrolledSubjects from './pages/student/EnrolledSubjects';
import StudentTimeTable from './pages/student/StudentTimeTable';
import MyDocuments from './pages/student/MyDocuments';
import ResumeGenerator from './pages/student/ResumeGenerator';
import MLTools from './pages/student/MLTools';
import StudentProjects from './pages/student/StudentProjects';
// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyProfile from './pages/faculty/Profile';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyToppers from './pages/faculty/Toppers';
import FacultyAchievements from './pages/faculty/Achievements';
import FacultyNotices from './pages/faculty/Notice';

// Admin Pages
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import DataUpload from './pages/admin/DataUpload';
import MarksManagement from './pages/admin/MarksManagement';
import ScheduleUpload from './pages/admin/ScheduleUpload';
import BatchPromoteView from './pages/admin/BatchPromoteView';
import PostNotice from './pages/admin/PostNotice';


const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'FACULTY') return <Navigate to="/faculty/dashboard" />;
  return <Navigate to="/student/dashboard" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Student Routes */}
      <Route element={<MainLayout allowedRoles={['STUDENT']} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/academics" element={<StudentAcademics />} />
        <Route path="/student/my-documents" element={<MyDocuments />} />
        <Route path="/student/achievements" element={<StudentAchievements />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/notices" element={<StudentNotices />} />
        <Route path="/student/enrolled-subjects" element={<EnrolledSubjects />} />
        <Route path="/student/timetable" element={<StudentTimeTable />} />
        <Route path="/student/generate-resume" element={<ResumeGenerator/>}/>
        <Route path="/student/projects" element={<StudentProjects/>}/>
        
      </Route>

      {/* Faculty Routes */}
      <Route element={<MainLayout allowedRoles={['FACULTY']} />}>
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route path="/faculty/attendance" element={<FacultyAttendance />} />
        <Route path="/faculty/toppers" element={<FacultyToppers />} />
        <Route path="/faculty/achievements" element={<FacultyAchievements />} />
        <Route path="/faculty/notices" element={<FacultyNotices />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} /> {/* default /admin view */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="upload" element={<DataUpload />} />
        <Route path="academics" element={<DataUpload />} />
        <Route path="marks" element={<MarksManagement />} />
        <Route path="schedules" element={<ScheduleUpload />} />
        <Route path="promote" element={<BatchPromoteView />} />
        <Route path="notice" element={<PostNotice/>}/>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div style={{ padding: '2rem' }}>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
