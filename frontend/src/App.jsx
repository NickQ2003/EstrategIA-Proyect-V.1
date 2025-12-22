import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';
import Dashboard from './pages/EventFlow/Dashboard';
import Participants from './pages/EventFlow/Participants';
import Attendance from './pages/EventFlow/Attendance';
import TalentScoutDashboard from './pages/TalentScout/Dashboard';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Public Landing Page */}
          <Route path="/" element={<MainMenu />} />

          {/* Protected Routes (Layout wrapper) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/talent-scout" element={<TalentScoutDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
