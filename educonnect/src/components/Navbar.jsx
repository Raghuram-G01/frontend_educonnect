import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'teacher': return '/teacher/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer group">
            <div className="flex flex-col gap-1">
              <div className="w-8 h-2 rounded-full bg-red-500"></div>
              <div className="w-8 h-2 rounded-full bg-cyan-500"></div>
              <div className="w-8 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              EduConnect
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate(getDashboardLink())}>Dashboard</Button>
                <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({user.role})</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <FiLogOut className="inline mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Register</Button>
              </>
            )}
            <button onClick={toggleDarkMode} className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-indigo-600 text-white shadow-lg hover:scale-110 transition-all">
              {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleDarkMode} className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-indigo-600 text-white shadow-lg">
              {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="w-full" onClick={() => { navigate(getDashboardLink()); setMobileMenuOpen(false); }}>Dashboard</Button>
                <div className="text-sm text-center py-2 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{user.name}</span>
                  <span className="text-gray-500"> ({user.role})</span>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <FiLogOut className="inline mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
                <Button className="w-full" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Register</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
