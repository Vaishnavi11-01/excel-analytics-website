import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaUpload, 
  FaChartLine, 
  FaShieldAlt, 
  FaRocket, 
  FaUsers, 
  FaArrowRight
} from 'react-icons/fa';

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }

  .dark & {
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
    color: var(--gray-100);
  }

  @media (max-width: 600px) {
    padding: 3rem 0 2rem 0;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 600px) {
    padding: 0 var(--spacing-sm);
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  font-family: var(--font-family-heading);
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  @media (max-width: 600px) {
    font-size: 1.7rem;
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &.primary {
    background: white;
    color: var(--primary-600);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: var(--primary-600);
      transform: translateY(-2px);
    }
  }
  @media (max-width: 600px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: white;
  .dark & {
    background: var(--gray-900);
  }
  @media (max-width: 600px) {
    padding: 2.5rem 0 1.5rem 0;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--gray-900);
  font-family: var(--font-family-heading);
  .dark & {
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.125rem;
  color: var(--gray-600);
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  .dark & {
    color: var(--gray-300);
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
  .dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    padding: 1.1rem;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--gray-900);
  .dark & {
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }
`;

const FeatureDescription = styled.p`
  color: var(--gray-600);
  line-height: 1.6;
  .dark & {
    color: var(--gray-300);
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const StatsSection = styled.section`
  background: var(--gray-50);
  padding: 4rem 0;
  .dark & {
    background: var(--gray-900);
  }
  @media (max-width: 600px) {
    padding: 1.5rem 0 1rem 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
  @media (max-width: 600px) {
    gap: 0.7rem;
  }
`;

const StatCard = styled(motion.div)`
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: 0.5rem;
    .dark & {
      color: var(--primary-400);
    }
    @media (max-width: 600px) {
      font-size: 1.3rem;
      margin-bottom: 0.2rem;
    }
  }
  
  p {
    color: var(--gray-600);
    font-weight: 500;
    .dark & {
      color: var(--gray-300);
    }
    @media (max-width: 600px) {
      font-size: 0.85rem;
    }
  }
`;

const CtaSection = styled.section`
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  .dark & {
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    padding: 2rem 0 1.2rem 0;
  }
`;

const CtaTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: var(--font-family-heading);
  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const CtaSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: var(--primary-600);
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  @media (max-width: 600px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
`;

const Home = () => {
  const features = [
    {
      icon: <FaUpload />,
      title: 'Easy File Upload',
      description: 'Drag and drop your Excel files or browse to upload. Supports .xlsx, .xls, and .csv formats.'
    },
    {
      icon: <FaChartBar />,
      title: 'Powerful Analytics',
      description: 'Advanced data analysis with statistical insights, trend detection, and pattern recognition.'
    },
    {
      icon: <FaChartLine />,
      title: 'Interactive Charts',
      description: 'Create beautiful, interactive charts and graphs with Chart.js integration.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information with third parties.'
    },
    {
      icon: <FaRocket />,
      title: 'Lightning Fast',
      description: 'Optimized for speed with real-time processing and instant chart generation.'
    },
    {
      icon: <FaUsers />,
      title: 'Team Collaboration',
      description: 'Share insights with your team and collaborate on data analysis projects.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Files Analyzed' },
    { number: '50K+', label: 'Charts Created' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Excel Data Into
            <br />
            <span style={{ color: 'var(--secondary-300)' }}>Actionable Insights</span>
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upload, analyze, and visualize your Excel data with our professional analytics platform. 
            Create stunning charts and gain valuable insights in minutes.
          </HeroSubtitle>
          
          <HeroButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <HeroButton to="/register" className="primary">
              Get Started Free
              <FaArrowRight />
            </HeroButton>
            <HeroButton to="/login" className="secondary">
              Sign In
            </HeroButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to analyze and visualize your Excel data professionally
          </SectionSubtitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </SectionContainer>
      </FeaturesSection>

      <StatsSection>
        <SectionContainer>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </StatCard>
            ))}
          </StatsGrid>
        </SectionContainer>
      </StatsSection>

      <CtaSection>
        <SectionContainer>
          <CtaTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </CtaTitle>
          
          <CtaSubtitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of users who trust ExcelAnalytics for their data analysis needs
          </CtaSubtitle>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <CtaButton to="/register">
              Start Analyzing Now
              <FaArrowRight />
            </CtaButton>
          </motion.div>
        </SectionContainer>
      </CtaSection>
    </>
  );
};

export default Home; 