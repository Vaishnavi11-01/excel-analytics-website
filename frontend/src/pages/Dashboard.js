import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaUpload, 
  FaFileExcel, 
  FaChartBar, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaDownload,
  FaPlus,
  FaCalendar,
  FaClock,
  FaUser
} from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem var(--spacing-md);
  @media (max-width: 600px) {
    padding: 1rem var(--spacing-sm);
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
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
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
  }
`;

const Subtitle = styled.p`
  color: var(--gray-600);
  font-size: 1.125rem;
  html.dark & {
    color: var(--gray-400);
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    margin-bottom: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: between;
    margin-bottom: 1rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.25rem;
    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
  
  .stat-label {
    color: var(--gray-600);
    font-weight: 500;
    @media (max-width: 600px) {
      font-size: 0.85rem;
    }
  }

  html.dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
    .stat-number {
      color: var(--gray-100);
    }
    .stat-label {
      color: var(--gray-400);
    }
  }
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const ActionsSection = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  padding: 2rem;
  margin-bottom: 2rem;
  html.dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
  }
  @media (max-width: 600px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const ActionsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  html.dark & {
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 0.7rem;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--primary-50);
  color: var(--primary-700);
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: all var(--transition-fast);
  border: 1px solid var(--primary-200);
  
  &:hover {
    background: var(--primary-100);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .action-icon {
    font-size: 1.25rem;
  }
  html.dark & {
    background: var(--gray-900);
    color: var(--primary-200);
    border-color: var(--gray-700);
    &:hover {
      background: var(--gray-700);
      color: var(--primary-100);
    }
  }
  @media (max-width: 600px) {
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
  }
`;

const FilesSection = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  html.dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
  }
  @media (max-width: 600px) {
    border-radius: var(--radius-lg);
  }
`;

const FilesHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  html.dark & {
    border-bottom-color: var(--gray-700);
    background: var(--gray-900);
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    gap: 0.5rem;
  }
`;

const FilesTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  html.dark & {
    color: var(--gray-100);
  }
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  html.dark & {
    background: var(--gray-900);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
  }
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.6rem 0.9rem 0.6rem 2.1rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
`;

const FilesList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  background: white;
  html.dark & {
    background: var(--gray-800);
  }
  @media (max-width: 600px) {
    max-height: 300px;
  }
`;

const FileItem = styled(motion.div)`
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--gray-50);
  }
  
  &:last-child {
    border-bottom: none;
  }
  html.dark & {
    &:hover {
      background: var(--gray-700); // medium gray for dark mode
    }
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem 1rem;
    gap: 0.5rem;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--primary-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 1.25rem;
  @media (max-width: 600px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

const FileDetails = styled.div`
  flex: 1;
  
  .file-name {
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.25rem;
    html.dark & {
      color: var(--gray-100);
    }
    @media (max-width: 600px) {
      font-size: 0.98rem;
    }
  }
  
  .file-meta {
    font-size: 0.875rem;
    color: var(--gray-600);
    display: flex;
    align-items: center;
    gap: 1rem;
    html.dark & {
      color: var(--gray-400);
    }
    @media (max-width: 600px) {
      font-size: 0.8rem;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 600px) {
    gap: 0.3rem;
  }
`;

const ActionIcon = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: var(--gray-100);
  color: var(--gray-600);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-100);
    color: var(--primary-600);
  }
  
  &.delete:hover {
    background: var(--error-100);
    color: var(--error-600);
  }
  html.dark & {
    background: var(--gray-900);
    color: var(--gray-400);
    &:hover {
      background: var(--gray-700);
      color: var(--primary-100);
    }
  }
  @media (max-width: 600px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-500);
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
    html.dark & {
      color: var(--gray-100);
    }
    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }
  
  p {
    margin-bottom: 1.5rem;
    html.dark & {
      color: var(--gray-400);
    }
    @media (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 600px) {
    padding: 1.5rem 0.7rem;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    recentUploads: 0
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/excel/files`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(response.data.files);
      
      // Calculate stats
      const totalSize = response.data.files.reduce((sum, file) => sum + file.fileSize, 0);
      const recentUploads = response.data.files.filter(file => {
        const uploadDate = new Date(file.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return uploadDate > weekAgo;
      }).length;
      
      setStats({
        totalFiles: response.data.files.length,
        totalSize: totalSize,
        recentUploads: recentUploads
      });
    } catch (error) {
      console.error('Error fetching files:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/excel/files/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFiles(files.filter(file => file._id !== fileId));
        fetchFiles(); // Refresh stats
      } catch (error) {
        console.error('Error deleting file:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Manage and analyze your Excel files</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'var(--primary-500)' }}>
              <FaFileExcel />
            </div>
          </div>
          <div className="stat-number">{stats.totalFiles}</div>
          <div className="stat-label">Total Files</div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'var(--secondary-500)' }}>
              <FaChartBar />
            </div>
          </div>
          <div className="stat-number">{formatFileSize(stats.totalSize)}</div>
          <div className="stat-label">Total Size</div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'var(--success-500)' }}>
              <FaUpload />
            </div>
          </div>
          <div className="stat-number">{stats.recentUploads}</div>
          <div className="stat-label">Recent Uploads</div>
        </StatCard>
      </StatsGrid>

      <ActionsSection>
        <ActionsTitle>Quick Actions</ActionsTitle>
        <ActionsGrid>
          <ActionButton to="/upload">
            <FaPlus className="action-icon" />
            Upload New File
          </ActionButton>
          <ActionButton to="/analytics">
            <FaChartBar className="action-icon" />
            Create Chart
          </ActionButton>
          <ActionButton to="/download">
            <FaDownload className="action-icon" />
            Export Data
          </ActionButton>
        </ActionsGrid>
      </ActionsSection>

      <FilesSection>
        <FilesHeader>
          <FilesTitle>Your Files</FilesTitle>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </FilesHeader>

        <FilesList>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <LoadingSpinner />
            </div>
          ) : filteredFiles.length === 0 ? (
            <EmptyState>
              <FaFileExcel className="empty-icon" />
              <h3>No files found</h3>
              <p>Upload your first Excel file to get started</p>
              <ActionButton to="/upload">
                <FaPlus className="action-icon" />
                Upload File
              </ActionButton>
            </EmptyState>
          ) : (
            filteredFiles.map((file, index) => (
              <FileItem
                key={file._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FileInfo>
                  <FileIcon>
                    <FaFileExcel />
                  </FileIcon>
                  <FileDetails>
                    <div className="file-name">{file.originalName}</div>
                    <div className="file-meta">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>•</span>
                      <span>{file.sheets?.length || 0} sheets</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                    </div>
                  </FileDetails>
                </FileInfo>
                <FileActions>
                  <ActionIcon as={Link} to={`/files/${file._id}`}>
                    <FaEye />
                  </ActionIcon>
                  <ActionIcon as={Link} to={`/files/${file._id}/analysis`} title="Analyze">
                    <FaChartBar />
                  </ActionIcon>
                  {/* Add more actions here if needed */}
                </FileActions>
              </FileItem>
            ))
          )}
        </FilesList>
      </FilesSection>
    </DashboardContainer>
  );
};

export default Dashboard; 