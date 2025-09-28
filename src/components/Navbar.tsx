import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaSearch } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Turfs', href: '/turfs' },
    { label: 'My Booking', href: '/bookings' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="text-primary text-2xl">
                <MdSportsSoccer />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PlayNest
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`text-foreground hover:text-primary transition-colors font-medium relative group ${
                    location.pathname === item.href ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                  <motion.div
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    whileHover={{ width: '100%' }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FaSearch />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg hover:border-primary"
            >
              <FaUser className="text-sm" />
              <span className="font-medium">Sign In</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {menuItems.map((item, index) => (
              <Link key={item.label} to={item.href}>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{
                    x: isMenuOpen ? 0 : -20,
                    opacity: isMenuOpen ? 1 : 0,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`block text-foreground hover:text-primary transition-colors font-medium ${
                    location.pathname === item.href ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <button className="w-full text-left text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;