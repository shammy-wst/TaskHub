import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { useInactivityTimeout } from "./hooks/useInactivityTimeout";
import InactivityModal from "./components/InactivityModal";
import { useLastVisit } from "./hooks/useLastVisit";
import WelcomeScreen from "./components/WelcomeScreen";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { showModal, timeLeft, resetTimer } = useInactivityTimeout();
  const { showWelcome, updateLastVisit } = useLastVisit();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (showWelcome) {
    return <WelcomeScreen onComplete={updateLastVisit} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      {showModal && !isLoginPage && (
        <InactivityModal onClose={resetTimer} timeLeft={timeLeft} />
      )}
    </div>
  );
};

export default App;
