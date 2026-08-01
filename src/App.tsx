import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Trainings from './pages/Trainings'
import TrainingDetail from './pages/TrainingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OAuthCallback from './pages/OAuthCallback'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import CandidateDashboard from './pages/dashboards/CandidateDashboard'
import CompanyDashboard from './pages/dashboards/CompanyDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import AdminRhDashboard from './pages/dashboards/AdminRhDashboard'
import AgencyDashboard from './pages/dashboards/AgencyDashboard'
import FreelanceDashboard from './pages/dashboards/FreelanceDashboard'
import CVDatabase from './pages/dashboards/CVDatabase'
import Messages from './pages/dashboards/Messages'
import PostJob from './pages/dashboards/PostJob'
import CandidateProfile from './pages/dashboards/CandidateProfile'
import UsersManagement from './pages/dashboards/UsersManagement'
import PlatformSettings from './pages/dashboards/PlatformSettings'
import BillingPage from './pages/dashboards/BillingPage'
import AgencyResources from './pages/dashboards/AgencyResources'
import JobAlerts from './pages/dashboards/JobAlerts'
import Notifications from './pages/dashboards/Notifications'
import AnalyticsPage from './pages/dashboards/AnalyticsPage'
import CompanyJobs from './pages/dashboards/CompanyJobs'
import CompanyApplications from './pages/dashboards/CompanyApplications'
import CompanyAnalytics from './pages/dashboards/CompanyAnalytics'
import CompanySettings from './pages/dashboards/CompanySettings'
import CandidateApplications from './pages/dashboards/CandidateApplications'
import CandidateTrainings from './pages/dashboards/CandidateTrainings'
import CandidateRecommendedJobs from './pages/dashboards/CandidateRecommendedJobs'
import AgencyJobs from './pages/dashboards/AgencyJobs'
import AdminRhCandidates from './pages/dashboards/AdminRhCandidates'
import AdminBilling from './pages/dashboards/AdminBilling'
import AdminRhCvDatabase from './pages/dashboards/AdminRhCvDatabase'
import AdminRhJobs from './pages/dashboards/AdminRhJobs'
import AdminRhTrainings from './pages/dashboards/AdminRhTrainings'
import AdminRhSettings from './pages/dashboards/AdminRhSettings'
import FreelanceJobs from './pages/dashboards/FreelanceJobs'
import FreelanceProposals from './pages/dashboards/FreelanceProposals'
import FreelanceProfile from './pages/dashboards/FreelanceProfile'
import FreelanceTrainings from './pages/dashboards/FreelanceTrainings'
import FreelanceBilling from './pages/dashboards/FreelanceBilling'
import AgencyAnalytics from './pages/dashboards/AgencyAnalytics'
import AgencyBilling from './pages/dashboards/AgencyBilling'
import AgencyTrainings from './pages/dashboards/AgencyTrainings'
import AgencySettings from './pages/dashboards/AgencySettings'
import Legal from './pages/Legal'
import Support from './pages/Support'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/layout/ScrollToTop'
import Preloader from './components/layout/Preloader'
import { ToastProvider } from './components/ui/Toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <ToastProvider>
      <AuthProvider>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* Candidate Dashboard */}
        <Route element={<ProtectedRoute roles={['candidate']} />}>
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/dashboard/candidate/profile" element={<CandidateProfile />} />
          <Route path="/dashboard/candidate/applications" element={<CandidateApplications />} />
          <Route path="/dashboard/candidate/trainings" element={<CandidateTrainings />} />
          <Route path="/dashboard/candidate/messages" element={<Messages role="candidate" />} />
          <Route path="/dashboard/candidate/alerts" element={<JobAlerts />} />
          <Route path="/dashboard/candidate/notifications" element={<Notifications role="candidate" />} />
          <Route path="/dashboard/candidate/jobs" element={<CandidateRecommendedJobs />} />
          <Route path="/dashboard/candidate/*" element={<CandidateDashboard />} />
        </Route>

        {/* Company Dashboard */}
        <Route element={<ProtectedRoute roles={['company']} />}>
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/dashboard/company/jobs" element={<CompanyJobs />} />
          <Route path="/dashboard/company/jobs/new" element={<PostJob />} />
          <Route path="/dashboard/company/applications" element={<CompanyApplications />} />
          <Route path="/dashboard/company/cv-database" element={<CVDatabase role="company" />} />
          <Route path="/dashboard/company/messages" element={<Messages role="company" />} />
          <Route path="/dashboard/company/billing" element={<BillingPage role="company" />} />
          <Route path="/dashboard/company/analytics" element={<CompanyAnalytics />} />
          <Route path="/dashboard/company/settings" element={<CompanySettings />} />
          <Route path="/dashboard/company/notifications" element={<Notifications role="company" />} />
          <Route path="/dashboard/company/*" element={<CompanyDashboard />} />
        </Route>

        {/* Freelance Dashboard */}
        <Route element={<ProtectedRoute roles={['freelance']} />}>
          <Route path="/dashboard/freelance" element={<FreelanceDashboard />} />
          <Route path="/dashboard/freelance/jobs" element={<FreelanceJobs />} />
          <Route path="/dashboard/freelance/proposals" element={<FreelanceProposals />} />
          <Route path="/dashboard/freelance/profile" element={<FreelanceProfile />} />
          <Route path="/dashboard/freelance/trainings" element={<FreelanceTrainings />} />
          <Route path="/dashboard/freelance/billing" element={<FreelanceBilling />} />
          <Route path="/dashboard/freelance/messages" element={<Messages role="freelance" />} />
          <Route path="/dashboard/freelance/notifications" element={<Notifications role="freelance" />} />
          <Route path="/dashboard/freelance/*" element={<FreelanceDashboard />} />
        </Route>

        {/* Agency Dashboard (Cabinet RH) */}
        <Route element={<ProtectedRoute roles={['agency']} />}>
          <Route path="/dashboard/agency" element={<AgencyDashboard />} />
          <Route path="/dashboard/agency/resources" element={<AgencyResources />} />
          <Route path="/dashboard/agency/jobs" element={<AgencyJobs />} />
          <Route path="/dashboard/agency/messages" element={<Messages role="agency" />} />
          <Route path="/dashboard/agency/billing" element={<AgencyBilling />} />
          <Route path="/dashboard/agency/analytics" element={<AgencyAnalytics />} />
          <Route path="/dashboard/agency/trainings" element={<AgencyTrainings />} />
          <Route path="/dashboard/agency/settings" element={<AgencySettings />} />
          <Route path="/dashboard/agency/notifications" element={<Notifications role="agency" />} />
          <Route path="/dashboard/agency/*" element={<AgencyDashboard />} />
        </Route>

        {/* Internal Admin RH Dashboard */}
        <Route element={<ProtectedRoute roles={['admin_rh']} />}>
          <Route path="/dashboard/admin-rh" element={<AdminRhDashboard />} />
          <Route path="/dashboard/admin-rh/cv-database" element={<AdminRhCvDatabase />} />
          <Route path="/dashboard/admin-rh/candidates" element={<AdminRhCandidates />} />
          <Route path="/dashboard/admin-rh/jobs" element={<AdminRhJobs />} />
          <Route path="/dashboard/admin-rh/trainings" element={<AdminRhTrainings />} />
          <Route path="/dashboard/admin-rh/messages" element={<Messages role="admin-rh" />} />
          <Route path="/dashboard/admin-rh/settings" element={<AdminRhSettings />} />
          <Route path="/dashboard/admin-rh/notifications" element={<Notifications role="admin-rh" />} />
          <Route path="/dashboard/admin-rh/*" element={<AdminRhDashboard />} />
        </Route>

        {/* Super Admin Dashboard */}
        <Route element={<ProtectedRoute roles={['super_admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<UsersManagement />} />
          <Route path="/dashboard/admin/settings" element={<PlatformSettings />} />
          <Route path="/dashboard/admin/cv-database" element={<CVDatabase role="admin" />} />
          <Route path="/dashboard/admin/billing" element={<AdminBilling />} />
          <Route path="/dashboard/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/admin/notifications" element={<Notifications role="admin" />} />
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* System */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}
