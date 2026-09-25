import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

// Public pages
import Home from '@/pages/Home';
import Browse from '@/pages/Browse';
import Match from '@/pages/Match';
import Saved from '@/pages/Saved';
import HowItWorks from '@/pages/HowItWorks';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Stories from '@/pages/Stories';
import Organizations from '@/pages/Organizations';
import OpportunityDetail from '@/pages/OpportunityDetail';
import OrganizationProfile from '@/pages/OrganizationProfile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Protected pages
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Impact from '@/pages/Impact';
import Achievements from '@/pages/Achievements';
import Crews from '@/pages/Crews';
import CheckIn from '@/pages/CheckIn';
import Onboarding from '@/pages/Onboarding';
import OrganizationDashboard from '@/pages/OrganizationDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/match" element={<Match />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/opportunity/:id" element={<OpportunityDetail />} />
        <Route path="/organization/:id" element={<OrganizationProfile />} />
        <Route path="/organization" element={<OrganizationProfile />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected */}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/crews" element={<Crews />} />
          <Route path="/check-in/:id" element={<CheckIn />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/org-dashboard" element={<OrganizationDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App