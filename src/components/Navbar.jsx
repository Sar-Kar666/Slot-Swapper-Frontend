import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Store, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SlotSwapper</span>
          </Link>

          {user && (
            <div className="flex items-center gap-1 md:gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Calendar</span>
              </Link>
              <Link
                to="/marketplace"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Store className="w-5 h-5" />
                <span className="hidden sm:inline">Marketplace</span>
              </Link>
              <Link
                to="/notifications"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Requests</span>
              </Link>

              <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden md:inline">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
