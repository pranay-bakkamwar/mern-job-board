import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform">
          <span className="text-yellow-300">Job</span>Board
        </Link>
        <div className="space-x-6 font-medium">
          <Link to="/jobs" className="hover:text-yellow-300 transition-colors duration-200">Find Jobs</Link>
          {user ? (
            <>
              <Link 
                to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} 
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition-colors duration-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-700 px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-xl hover:bg-yellow-300 transition-all duration-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;