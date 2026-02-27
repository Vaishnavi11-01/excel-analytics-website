import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSearch, FiFilter, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import axios from 'axios';

const FileViewContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  html.dark & {
    background: rgba(31, 41, 55, 0.95);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  html.dark & {
    color: var(--gray-100);
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const FileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  transition: background 0.2s, color 0.2s;
  &:hover {
    filter: brightness(0.97);
  }
  html.dark & {
    background: linear-gradient(135deg, #232946 0%, #3a3f5a 100%);
    color: var(--gray-100);
    border: 1px solid var(--gray-700);
  }
  html.dark &:hover {
    background: linear-gradient(135deg, #232946 0%, #232946 100%);
    filter: none;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
  html.dark & {
    color: var(--gray-300);
    opacity: 1;
  }
`;

const InfoValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  html.dark & {
    color: var(--gray-100);
  }
`;

const Controls = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  border: 1px solid #e2e8f0;
  html.dark body & {
    background: var(--gray-900) !important;
    border: 1px solid var(--gray-700) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  body.dark & {
    background: var(--gray-800);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  body.dark & {
    background: var(--gray-800);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  body.dark & {
    background: var(--gray-800);
    color: var(--gray-100);
    border-color: var(--gray-700);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  &.danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    &:hover {
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }
  }
  body.dark & {
    background: var(--gray-800);
    color: var(--gray-100);
    border: 1px solid var(--gray-700);
    &:hover {
      background: var(--gray-700);
      color: var(--primary-100);
    }
    &.danger {
      background: var(--error-800);
      color: var(--error-100);
      &:hover {
        background: var(--error-700);
      }
    }
  }
`;

const TableContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 100px;
  body.dark & {
    background: var(--gray-900) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  @media (max-width: 900px) {
    width: 100%;
    -webkit-overflow-scrolling: touch;
    border-radius: 0 0 20px 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
  body.dark & {
    background: var(--gray-800);
    color: var(--gray-100);
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: #f1f5f9;
    color: #2d3748;
  }
  html.dark body & {
    border-bottom: 1px solid var(--gray-700);
    color: var(--gray-100);
    &:hover {
      background-color: var(--gray-700) !important;
      color: var(--gray-100) !important;
    }
  }
`;

const Tr = styled.tr`
  transition: all 0.3s ease;
  &:hover {
    background-color: #f1f5f9;
  }
  html.dark body & {
    &:hover {
      background-color: var(--gray-700) !important;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 20px 20px;
  border-bottom: 1px solid #e2e8f0;
  html.dark body & {
    background: var(--gray-900) !important;
    border-top: 1px solid var(--gray-700) !important;
    border-bottom: 1px solid var(--gray-700) !important;
  }
`;

const PageButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#2d3748'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover:enabled {
    background: #f1f5f9;
    color: #2d3748;
  }
  &:disabled {
    opacity: 1;
    color: #cbd5e1;
    background: #f8fafc;
    border-color: #e2e8f0;
    cursor: not-allowed;
  }
  html.dark body & {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'var(--gray-800)'} !important;
    color: ${props => props.active ? 'white' : 'var(--gray-100)'} !important;
    border-color: ${props => props.active ? 'transparent' : 'var(--gray-700)'} !important;
    &:hover:enabled {
      background: var(--gray-700) !important;
      color: var(--gray-100) !important;
    }
    &:disabled {
      color: var(--gray-500) !important;
      background: var(--gray-900) !important;
      border-color: var(--gray-800) !important;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #667eea;
`;

const FileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const tableScrollRef = useRef(null);

  useEffect(() => {
    fetchFileData();
  }, [id]);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;
    const onDown = (e) => {
      isDown = true;
      el.classList.add('dragging');
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches ? e.touches[0].pageX : e.pageX;
      const walk = x - startX;
      el.scrollLeft = scrollLeft - walk;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove('dragging');
    };
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchmove', onMove);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('touchend', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchend', onUp);
    };
  }, []);

  const fetchFileData = async () => {
    if (!id) {
      toast.error('File ID is missing');
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view files');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/excel/${id}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileData(response.data);
    } catch (error) {
      console.error('Error fetching file data:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('File not found');
        navigate('/dashboard');
      } else {
        toast.error('Failed to load file data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/excel/files/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('File deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting file:', error);
        if (error.response?.status === 401) {
          toast.error('Please login again');
          navigate('/login');
        } else {
          toast.error('Failed to delete file');
        }
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/excel/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileData?.filename || 'file.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Error downloading file:', error);
    }
  };

  const filteredData = fileData?.data?.filter(row => {
    const matchesSearch = Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterColumn === 'all') return matchesSearch;
    
    const columnValue = row[filterColumn];
    return columnValue && String(columnValue).toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const columns = fileData?.data?.[0] ? Object.keys(fileData.data[0]) : [];
  // Debug log
  console.log('FileView headers:', columns);
  // Show warning if all headers are numbers
  const allNumericHeaders = columns.length > 0 && columns.every(h => !isNaN(Number(h)));

  if (loading) {
    return (
      <FileViewContainer>
        <Content>
          <LoadingSpinner>Loading file data...</LoadingSpinner>
        </Content>
      </FileViewContainer>
    );
  }

  return (
    <FileViewContainer>
      <Content>
        {allNumericHeaders && (
          <div style={{color:'#e53e3e',marginBottom:'1rem',fontWeight:'bold',fontSize:'1.1rem'}}>
            Warning: All column headers are numbers. Please check your Excel file headers.
          </div>
        )}
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </BackButton>
          
          <Title>
            <FiEye />
            {fileData?.filename || 'File View'}
          </Title>

          <FileInfo>
            <InfoCard>
              <InfoLabel>Total Rows</InfoLabel>
              <InfoValue>{fileData?.data?.length || 0}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Columns</InfoLabel>
              <InfoValue>{columns.length}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>File Size</InfoLabel>
              <InfoValue>{fileData?.size ? `${(fileData.size / 1024).toFixed(1)} KB` : 'N/A'}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Upload Date</InfoLabel>
              <InfoValue>{fileData?.uploadDate ? new Date(fileData.uploadDate).toLocaleDateString() : 'N/A'}</InfoValue>
            </InfoCard>
          </FileInfo>
        </Header>

        <Controls
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchInput>
            <SearchIcon />
            <Input
              type="text"
              placeholder="Search in data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>

          <FilterSelect
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
          >
            <option value="all">All Columns</option>
            {columns.map(column => (
              <option key={column} value={column}>{column}</option>
            ))}
          </FilterSelect>

          <ActionButton onClick={handleDownload}>
            <FiDownload /> Download
          </ActionButton>

          <ActionButton className="danger" onClick={handleDelete}>
            <FiTrash2 /> Delete
          </ActionButton>
        </Controls>

        <TableContainer
          ref={tableScrollRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Table>
            <thead>
              <tr>
                {columns.map(column => (
                  <Th key={column}>{column}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <Tr key={index}>
                  {columns.map(column => (
                    <Td key={column}>{row[column] !== undefined && row[column] !== null ? row[column] : ''}</Td>
                  ))}
                </Tr>
              ))}
            </tbody>
            {totalPages > 1 && (
              <tfoot>
                <tr>
                  <Td colSpan={columns.length} style={{ padding: 0, background: 'transparent' }}>
                    <Pagination>
                      <PageButton
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </PageButton>
                      <PageButton
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </PageButton>
                    </Pagination>
                  </Td>
                </tr>
              </tfoot>
            )}
          </Table>
        </TableContainer>
      </Content>
    </FileViewContainer>
  );
};

export default FileView; 