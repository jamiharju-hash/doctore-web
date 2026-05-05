import React, { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import { AuthPage } from './components/AuthPage';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/Dashboard';
import { SignalsPage } from './components/features/signals/SignalsPage';
import { SignalDetailPage } from './components/features/signals/SignalDetailPage';
import { SettingsPage } from './components/SettingsPage';
import { GameLogPage } from './components/GameLogPage';
import { AnalyticsPage } from './components/AnalyticsPage';

import { LeaderboardPage } from './components/features/leaderboard/LeaderboardPage';
import { PublicProfilePage } from './components/features/profile/PublicProfilePage';

function AppContent() {
  const { firebaseUser, user, setFirebaseUser, setUser, setLoading, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        const userDoc = await getDoc(doc(db, 'users', fUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: fUser.uid, ...userDoc.data() } as any);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-base">
        <div className="w-12 h-12 border-4 border-accent-default border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth Guard
  const isAuthenticated = !!firebaseUser;
  const isAuthPath = location.pathname === '/auth';

  if (!isAuthenticated && !isAuthPath) {
    return <Navigate to="/auth" replace />;
  }

  if (isAuthenticated && isAuthPath) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/*" 
        element={
          <AppShell>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signals" element={<SignalsPage />} />
              <Route path="/signals/:id" element={<SignalDetailPage />} />
              <Route path="/game-log" element={<GameLogPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<PublicProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppShell>
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
