import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './components/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import StudentList from './pages/admin/StudentList';
import VolunteerList from './pages/admin/VolunteerList';
import NGOList from './pages/admin/NGOList';
import DonorList from './pages/admin/DonorList';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import StudentDashboard from './pages/student/StudentDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import DonorDashboard from './pages/donor/DonorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="students" element={<StudentList />} />
                <Route path="volunteers" element={<VolunteerList />} />
                <Route path="ngos" element={<NGOList />} />
                <Route path="donors" element={<DonorList />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="student" element={<StudentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
              <Route path="volunteer" element={<VolunteerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ngo']} />}>
              <Route path="ngo" element={<NGODashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
              <Route path="donor" element={<DonorDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
