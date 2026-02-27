import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem var(--spacing-md);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-family: var(--font-family-heading);
  html.dark & {
    color: var(--gray-100);
  }
`;

const Subtitle = styled.p`
  color: var(--gray-600);
  font-size: 1.125rem;
  html.dark & {
    color: var(--gray-400);
  }
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  padding: 3rem;
  border: 1px solid var(--gray-200);
  html.dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1rem;
  font-weight: 700;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  html.dark & {
    color: var(--gray-100);
  }
`;

const UserRole = styled.span`
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  html.dark & {
    background: var(--gray-900);
    color: var(--primary-200);
  }
`;

const FormSection = styled.div`
  margin-top: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  html.dark & {
    color: var(--gray-100);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
  html.dark & {
    color: var(--gray-300);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-fast);
  color: var(--gray-900);
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &:disabled {
    background: var(--gray-50);
    color: var(--gray-500);
  }
  html.dark & {
    background: var(--gray-900);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
    &:disabled {
      background: var(--gray-800);
      color: var(--gray-500);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  
  &.primary {
    background: var(--primary-500);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--gray-600);
    border: 2px solid var(--gray-300);
    
    &:hover:not(:disabled) {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const InfoSection = styled.div`
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  html.dark & {
    background: var(--gray-900);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .info-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-100);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    html.dark & {
      background: var(--gray-800);
      color: var(--primary-200);
    }
  }
  
  .info-content {
    flex: 1;
    
    .info-label {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 0.25rem;
      html.dark & {
        color: var(--gray-300);
      }
    }
    
    .info-value {
      font-weight: 600;
      color: var(--gray-900);
      html.dark & {
        color: var(--gray-100);
      }
    }
  }
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProfileContainer>
      <Header>
        <Title>Profile</Title>
        <Subtitle>Manage your account settings and preferences</Subtitle>
      </Header>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AvatarSection>
          <Avatar>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <UserName>{user?.username}</UserName>
          <UserRole>{user?.role}</UserRole>
        </AvatarSection>

        <InfoSection>
          <InfoItem>
            <div className="info-icon">
              <FaUser />
            </div>
            <div className="info-content">
              <div className="info-label">Username</div>
              <div className="info-value">{user?.username}</div>
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <div className="info-label">Email</div>
              <div className="info-value">{user?.email}</div>
            </div>
          </InfoItem>
          
          <InfoItem>
            <div className="info-icon">
              <FaCalendar />
            </div>
            <div className="info-content">
              <div className="info-label">Member Since</div>
              <div className="info-value">{formatDate(user?.createdAt)}</div>
            </div>
          </InfoItem>
        </InfoSection>

        <FormSection>
          <FormTitle>
            <FaEdit />
            Edit Profile
          </FormTitle>
          
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter username"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter email"
            />
          </FormGroup>

          <ButtonGroup>
            {!isEditing ? (
              <Button 
                className="primary" 
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  className="primary" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  className="secondary" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <FaTimes />
                  Cancel
                </Button>
              </>
            )}
          </ButtonGroup>
        </FormSection>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile; 