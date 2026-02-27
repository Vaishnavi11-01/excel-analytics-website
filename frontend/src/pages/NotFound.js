import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft, FaChartBar } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  padding: 2rem 1rem;
`;

const NotFoundCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  padding: 4rem 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-600);
  
  .logo-icon {
    font-size: 2rem;
    color: var(--secondary-500);
  }
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  color: var(--primary-500);
  margin-bottom: 1rem;
  font-family: var(--font-family-heading);
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-family: var(--font-family-heading);
`;

const Message = styled.p`
  color: var(--gray-600);
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &.primary {
    background: var(--primary-500);
    color: white;
    
    &:hover {
      background: var(--primary-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--primary-600);
    border: 2px solid var(--primary-500);
    
    &:hover {
      background: var(--primary-50);
      transform: translateY(-1px);
    }
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <FaChartBar className="logo-icon" />
          ExcelAnalytics
        </Logo>
        
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Message>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </Message>
        
        <ButtonsContainer>
          <Button to="/" className="primary">
            <FaHome />
            Go Home
          </Button>
          <Button to="/dashboard" className="secondary">
            <FaArrowLeft />
            Back to Dashboard
          </Button>
        </ButtonsContainer>
      </NotFoundCard>
    </NotFoundContainer>
  );
};

export default NotFound; 