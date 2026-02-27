import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaChartBar, 
  FaUser, 
  FaSignOutAlt, 
  FaSun, 
  FaMoon, 
  FaUpload,
  FaHome
} from 'react-icons/fa';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all var(--transition-normal);
  
  &.dark {
    background: rgba(31, 41, 55, 0.95);
    border-bottom-color: var(--gray-700);
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-600);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary-700);
  }
  
  .logo-icon {
    font-size: 2rem;
    color: var(--secondary-500);
  }
  &:focus, &:active {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
  
  &:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }
  
  &.active {
    color: var(--primary-600);
    background: var(--primary-100);
  }
  
  .dark & {
    color: var(--gray-300);
    
    &:hover {
      color: var(--primary-400);
      background: var(--gray-800);
    }
    
    &.active {
      color: var(--primary-400);
      background: var(--gray-800);
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  padding: 0.5rem;
  color: var(--gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--gray-100);
    color: var(--primary-600);
    border-color: var(--primary-300);
  }
  
  .dark & {
    border-color: var(--gray-600);
    color: var(--gray-400);
    
    &:hover {
      background: var(--gray-800);
      color: var(--primary-400);
      border-color: var(--primary-600);
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: var(--z-dropdown);
  
  .dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--gray-700);
  text-decoration: none;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--gray-100);
    color: var(--primary-600);
  }
  
  &:first-child {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    border-top: 1px solid var(--gray-200);
  }
  
  .dark & {
    color: var(--gray-300);
    
    &:hover {
      background: var(--gray-700);
      color: var(--primary-400);
    }
    
    &:last-child {
      border-top-color: var(--gray-700);
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--error-600);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  
  &:hover {
    background: var(--error-50);
    color: var(--error-700);
  }
  
  .dark & {
    color: var(--error-400);
    
    &:hover {
      background: var(--gray-700);
      color: var(--error-300);
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &.primary {
    background: var(--primary-500);
    color: white;
    
    &:hover {
      background: var(--primary-600);
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--primary-600);
    border: 1px solid var(--primary-500);
    
    &:hover {
      background: var(--primary-50);
    }
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Nav className={isDarkMode ? 'dark' : ''}>
      <NavContainer>
        <Logo to="/">
          <FaChartBar className="logo-icon" />
          ExcelAnalytics
        </Logo>

        {isAuthenticated && (
          <NavLinks>
            <NavLink to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              <FaHome /> Dashboard
            </NavLink>
            <NavLink to="/upload" className={isActive('/upload') ? 'active' : ''}>
              <FaUpload /> Upload
            </NavLink>
          </NavLinks>
        )}

        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>

          {isAuthenticated ? (
            <UserMenu>
              <UserButton onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}>
                <FaUser />
                {user?.username}
              </UserButton>
              
              <AnimatePresence>
                {showUserMenu && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem to="/profile">
                      <FaUser /> Profile
                    </DropdownItem>
                    <LogoutButton onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </LogoutButton>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </UserMenu>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" className="secondary">
                Login
              </AuthButton>
              <AuthButton to="/register" className="primary">
                Sign Up
              </AuthButton>
            </AuthButtons>
          )}
        </NavActions>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 