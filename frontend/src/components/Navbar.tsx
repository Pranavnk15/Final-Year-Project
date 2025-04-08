import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-violet-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-200">
              ZeroPatch AI
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-violet-400' 
                  : 'text-gray-300 hover:text-violet-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/analyzer" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/analyzer' 
                  ? 'text-violet-400' 
                  : 'text-gray-300 hover:text-violet-400'
              }`}
            >
              Analyzer
            </Link>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-300 hover:text-violet-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;