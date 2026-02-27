import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChartBar, FaUser } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DarkBodyStyle = createGlobalStyle`
  html.dark body {
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%) !important;
  }
`;

const RegisterContainer = styled.div`
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

const RegisterCard = styled(motion.div)`
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

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 0.25rem;
`;

const StrengthFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.strength === 'weak') return 'var(--error-500)';
    if (props.strength === 'medium') return 'var(--warning-500)';
    if (props.strength === 'strong') return 'var(--success-500)';
    return 'var(--gray-200)';
  }};
  width: ${props => {
    if (props.strength === 'weak') return '33%';
    if (props.strength === 'medium') return '66%';
    if (props.strength === 'strong') return '100%';
    return '0%';
  }};
  transition: all var(--transition-fast);
`;

const StrengthText = styled.span`
  color: ${props => {
    if (props.strength === 'weak') return 'var(--error-600)';
    if (props.strength === 'medium') return 'var(--warning-600)';
    if (props.strength === 'strong') return 'var(--success-600)';
    return 'var(--gray-500)';
  }};
  font-weight: 500;
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

const LoginLink = styled.div`
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return 'none';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong';
    return 'medium';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <DarkBodyStyle />
      <RegisterContainer>
        <RegisterCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo>
            <FaChartBar className="logo-icon" />
            ExcelAnalytics
          </Logo>
          
          <Title>Create Account</Title>
          <Subtitle>Join us and start analyzing your data</Subtitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <InputContainer>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={errors.username ? 'error' : ''}
                  disabled={isLoading}
                />
              </InputContainer>
              {errors.username && (
                <ErrorMessage>
                  {errors.username}
                </ErrorMessage>
              )}
            </FormGroup>
            
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
              {formData.password && (
                <PasswordStrength>
                  <StrengthText strength={passwordStrength}>
                    Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </StrengthText>
                  <StrengthBar>
                    <StrengthFill strength={passwordStrength} />
                  </StrengthBar>
                </PasswordStrength>
              )}
              {errors.password && (
                <ErrorMessage>
                  {errors.password}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputContainer>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
              </InputContainer>
              {errors.confirmPassword && (
                <ErrorMessage>
                  {errors.confirmPassword}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </SubmitButton>
          </Form>
          
          <LoginLink>
            <p>Already have an account?</p>
            <Link to="/login">Sign in to your account</Link>
          </LoginLink>
        </RegisterCard>
      </RegisterContainer>
    </>
  );
};

export default Register; 