import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LevelPage from './pages/LevelPage';
import TheoryPage from './pages/TheoryPage';
import ChallengePage from './pages/ChallengePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CodeBattlePage from './pages/CodeBattlePage';
import AchievementsPage from './pages/AchievementsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CommunityPage from './pages/CommunityPage';
import BuildWorkspace from './pages/BuildWorkspace';

const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const hideNavbarPaths = ['/', '/login', '/signup'];
  // Also hide navbar for build workspace (full-screen editor)
  const isBuildPage = location.pathname.endsWith('/build');
  const showNavbar = user && !hideNavbarPaths.includes(location.pathname) && !isBuildPage;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        <PageTransition>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/:courseId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/course/:courseId" element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
            <Route path="/course/:courseId/level/:levelNum/theory" element={<ProtectedRoute><TheoryPage /></ProtectedRoute>} />
            <Route path="/course/:courseId/level/:levelNum/challenge/:challengeId" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/level/:courseId/:levelNum" element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
            <Route path="/challenge/:id" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseCatalogPage /></ProtectedRoute>} />
            <Route path="/battle" element={<ProtectedRoute><CodeBattlePage /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/projects/:id/build" element={<ProtectedRoute><BuildWorkspace /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </main>
      {/* AI Chatbot floats on all pages except home/login/signup */}
      {showNavbar && <AIChatbot />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1a1a2e', border: '1px solid #334155', color: '#e2e8f0' },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
