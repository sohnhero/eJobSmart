import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Trainings from './pages/Trainings'
import TrainingDetail from './pages/TrainingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Companies from './pages/Companies'
import CandidateDashboard from './pages/dashboards/CandidateDashboard'
import CompanyDashboard from './pages/dashboards/CompanyDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import CVDatabase from './pages/dashboards/CVDatabase'
import Messages from './pages/dashboards/Messages'
import PostJob from './pages/dashboards/PostJob'
import CandidateProfile from './pages/dashboards/CandidateProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Dashboard */}
        <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
        <Route path="/dashboard/candidate/profile" element={<CandidateProfile />} />
        <Route path="/dashboard/candidate/messages" element={<Messages role="candidate" />} />
        <Route path="/dashboard/candidate/jobs" element={<Jobs />} />
        <Route path="/dashboard/candidate/*" element={<CandidateDashboard />} />

        {/* Company Dashboard */}
        <Route path="/dashboard/company" element={<CompanyDashboard />} />
        <Route path="/dashboard/company/jobs/new" element={<PostJob />} />
        <Route path="/dashboard/company/cv-database" element={<CVDatabase />} />
        <Route path="/dashboard/company/messages" element={<Messages role="company" />} />
        <Route path="/dashboard/company/*" element={<CompanyDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/cv-database" element={<CVDatabase />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
