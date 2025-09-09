
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';

function App(){
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <div className="header">
        <h2>MERN Intern Assignment</h2>
        <div>
          {user ? (
            <>
              <span style={{marginRight:12}}>Hi, {user.name} ({user.role})</span>
              <button className="button" onClick={logout}>Logout</button>
            </>
          ): (
            <>
              <Link to="/login"><button className="button">Login</button></Link>
              <Link to="/signup" style={{marginLeft:8}}><button className="button">Signup</button></Link>
            </>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardRouter/>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function DashboardRouter(){
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminDashboard/>;
  return <StudentDashboard/>;
}

export default App;
