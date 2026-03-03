import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSearch from './admin/AdminSearch';
import AdminLogin from './auth/AdminLogin';
import AdminNavbar from './admin/AdminNavbar';
import AdminHome from './admin/AdminHome';
import BookManagement from './admin/BookManagement';
import IssueBook from './admin/IssueBook';
import BorrowedList from './admin/BorrowedList';
import MemberDirectory from './admin/MemberDirectory';
import ProtectedRoute from './auth/ProtectedRoute';
import BookSearch from './public/BookSearch';
import PublicNavbar from './public/PublicNavbar';
import StaffLogin from "./auth/StaffLogin";
import StaffDashboard from "./public/StaffDashboard";
import StaffLeave from "./public/StaffLeave";
import StaffHistory from "./public/StaffHistory";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isPublicPage = location.pathname === '/';
  
  // ⭐ ADD THIS (Detect Staff Pages)
  const isStaffPage =
    location.pathname.startsWith('/staff-dashboard') ||
    location.pathname.startsWith('/staff-leave') ||
    location.pathname.startsWith('/staff-history') ||
    location.pathname.startsWith('/staff-login');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* ⭐ UPDATED NAVBAR LOGIC */}
      {!isLoginPage && !isStaffPage && (
        isPublicPage ? <PublicNavbar /> : <AdminNavbar />
      )}

      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Optional: Hide footer in staff pages for cleaner UI */}
      {!isStaffPage && (
        <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          SmartLib &copy; {new Date().getFullYear()}
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<BookSearch />} />
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><BookManagement /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><MemberDirectory /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><AdminSearch /></ProtectedRoute>} />
          <Route path="/issue" element={<ProtectedRoute><IssueBook /></ProtectedRoute>} />
          <Route path="/borrowed" element={<ProtectedRoute><BorrowedList /></ProtectedRoute>} />

          {/* 👔 Staff Routes (Now NO Admin Navbar will show) */}
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/staff-leave" element={<StaffLeave />} />
          <Route path="/staff-history" element={<StaffHistory />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;