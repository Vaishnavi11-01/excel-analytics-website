import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChartBar } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DarkBodyStyle = createGlobalStyle`
  html.dark body {
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%) !important;
  }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  padding: 2rem 1rem;
  html.dark & {
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%) !important;
  }
`;

const LoginCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
  }
  html.dark & {
    background: var(--gray-900);
    color: var(--gray-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  }
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

const Title = styled.h1`
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-family: var(--font-family-heading);
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &.error {
    border-color: var(--error-500);
    box-shadow: 0 0 0 3px var(--error-100);
  }
  html.dark & {
    background: var(--gray-800);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: var(--gray-600);
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-600);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  p {
    color: var(--gray-600);
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--primary-600);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DarkBodyStyle />
      <LoginContainer>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo>
            <FaChartBar className="logo-icon" />
            ExcelAnalytics
          </Logo>
          
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <InputContainer>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                  disabled={isLoading}
                />
              </InputContainer>
              {errors.email && (
                <ErrorMessage>
                  {errors.email}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputContainer>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </InputContainer>
              {errors.password && (
                <ErrorMessage>
                  {errors.password}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </SubmitButton>
          </Form>
          
          <RegisterLink>
            <p>Don't have an account?</p>
            <Link to="/register">Create a new account</Link>
          </RegisterLink>
        </LoginCard>
      </LoginContainer>
    </>
  );
};

export default Login; 