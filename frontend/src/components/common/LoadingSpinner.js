import React from 'react';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9999;
  `}
`;

const Spinner = styled.div`
  border: 3px solid var(--gray-200);
  border-radius: 50%;
  border-top-color: var(--primary-500);
  animation: spin 1s ease-in-out infinite;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          width: 20px;
          height: 20px;
          border-width: 2px;
        `;
      case 'medium':
        return `
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
      case 'large':
        return `
          width: 48px;
          height: 48px;
          border-width: 4px;
        `;
      default:
        return `
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
    }
  }}
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.875rem;
  font-weight: 500;
`;

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  className 
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={className}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 