import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiBarChart2, FiPieChart, FiTrendingUp, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AnalysisContainer = styled.div`
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

const PageTitle = styled.h1`
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  html.dark & {
    background: rgba(31, 41, 55, 0.95);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
  html.dark & {
    background: var(--gray-800);
    border-color: var(--gray-700);
    color: var(--gray-100);
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
  html.dark & {
    background: linear-gradient(135deg, #232946 0%, #232946 100%);
    color: var(--gray-100);
    border: 1px solid var(--gray-700);
  }
  html.dark &:hover {
    background: linear-gradient(135deg, #232946 0%, #232946 100%);
    filter: none;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  html.dark & {
    background: rgba(31, 41, 55, 0.95);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  html.dark & {
    color: var(--gray-100);
  }
`;

const ChartContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  html.dark & {
    background: rgba(31, 41, 55, 0.95);
    color: var(--gray-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
  html.dark & {
    color: var(--gray-100);
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
  html.dark & {
    color: var(--gray-300);
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

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-size: 1.1rem;
`;

const StatBox = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-top: 2.5rem;
  html.dark & {
    background: rgba(31, 41, 55, 0.95);
    color: var(--gray-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
`;
const StatTitle = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  html.dark & {
    color: var(--gray-100);
  }
`;
const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const FileAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [statColumn, setStatColumn] = useState('');

  useEffect(() => {
    fetchFileData();
  }, [id]);

  useEffect(() => {
    if (fileData?.data) {
      generateAnalysis();
      // Set default numerical column for statistics
      if (numericalColumns.length > 0 && !statColumn) {
        setStatColumn(numericalColumns[0]);
      }
    }
  }, [fileData, xAxis, yAxis, generateAnalysis, numericalColumns, statColumn]);

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

  const generateAnalysis = useCallback(async () => {
    if (!fileData?.data || !xAxis || !yAxis) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/excel/${id}/analyze`, {
        xAxis,
        yAxis,
        chartType: selectedChart
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisData(response.data);
    } catch (error) {
      toast.error('Failed to generate analysis');
      console.error('Error generating analysis:', error);
    }
  }, [fileData?.data, xAxis, yAxis, selectedChart, id]);

  const handleRefresh = () => {
    generateAnalysis();
    toast.success('Analysis refreshed');
  };

  const handleDownloadChart = () => {
    if (!analysisData) return;
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${fileData?.filename || 'chart'}-analysis.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Chart downloaded successfully');
    }
  };

  const columns = fileData?.data?.[0] ? Object.keys(fileData.data[0]) : [];
  
  // Get only numerical columns for statistics
  const numericalColumns = useMemo(() => {
    if (!fileData?.data?.[0]) return [];
    return columns.filter(col => {
      return fileData.data.some(row => {
        const value = row[col];
        return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
      });
    });
  }, [columns, fileData?.data]);

  const getChartData = () => {
    if (!analysisData) return null;

    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
      '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];

    return {
      labels: analysisData.labels,
      datasets: [{
        label: yAxis,
        data: analysisData.data,
        backgroundColor: colors.slice(0, analysisData.data.length),
        borderColor: colors.slice(0, analysisData.data.length),
        borderWidth: 2,
        tension: 0.4
      }]
    };
  };

  const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: '600'
          },
          color: '#2d3748'
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: '700'
        },
        color: '#2d3748'
      }
    },
    scales: selectedChart === 'bar' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          color: '#718096'
        }
      },
      x: {
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          color: '#718096'
        }
      }
    } : undefined
  });

function getColumnStats(col) {
  if (!col || !fileData?.data) return null;
  
  const values = fileData.data
    .map(row => {
      const val = row[col];
      if (val === null || val === undefined || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .filter(val => val !== null);
    
  if (values.length === 0) return null;
  
  const sum = values.reduce((a,b) => a+b, 0);
  const avg = sum / values.length;
  const sorted = [...values].sort((a,b) => a-b);
  const mid = Math.floor(sorted.length/2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const count = values.length;
  const stddev = Math.sqrt(values.reduce((a,b)=>a+Math.pow(b-avg,2),0)/values.length);
  
  // Mode
  const freq = {};
  let mode = values[0], maxFreq = 0;
  values.forEach(v => { 
    freq[v]=(freq[v]||0)+1; 
    if(freq[v]>maxFreq){
      mode=v;maxFreq=freq[v];
    } 
  });
  
  return { avg, median, min, max, count, stddev, mode };
}

  if (loading) {
    return (
      <AnalysisContainer>
        <Content>
          <LoadingSpinner>Loading analysis...</LoadingSpinner>
        </Content>
      </AnalysisContainer>
    );
  }

  return (
    <AnalysisContainer>
      <Content>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </BackButton>
          
          <PageTitle>
            <FiBarChart2 />
            {fileData?.filename || 'File Analysis'}
          </PageTitle>

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
          </FileInfo>
        </Header>

        <Controls
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </Select>

          <Select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
          >
            <option value="">Select X-Axis</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </Select>

          <Select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
          >
            <option value="">Select Y-Axis</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </Select>

          <ActionButton onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </ActionButton>

          <ActionButton onClick={handleDownloadChart} disabled={!analysisData}>
            <FiDownload /> Download Chart
          </ActionButton>
        </Controls>
        {/* Chart Section */}
        {xAxis && yAxis && analysisData ? (
          <ChartsGrid>
            <ChartCard
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ChartTitle>
                {selectedChart === 'bar' && <FiBarChart2 />}
                {selectedChart === 'pie' && <FiPieChart />}
                {selectedChart === 'line' && <FiTrendingUp />}
                {selectedChart === 'bar' ? 'Bar Chart' : selectedChart === 'pie' ? 'Pie Chart' : 'Line Chart'}
              </ChartTitle>
              
              <ChartContainer>
                {selectedChart === 'bar' && (
                  <Bar data={getChartData()} options={getChartOptions(`${yAxis} by ${xAxis}`)} />
                )}
                {selectedChart === 'pie' && (
                  <Pie data={getChartData()} options={getChartOptions(`${yAxis} Distribution`)} />
                )}
                {selectedChart === 'line' && (
                  <Line data={getChartData()} options={getChartOptions(`${yAxis} Trend`)} />
                )}
              </ChartContainer>
            </ChartCard>
          </ChartsGrid>
        ) : (
          <ChartCard
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <NoDataMessage>
              Select X-Axis and Y-Axis columns to generate charts and analysis
            </NoDataMessage>
          </ChartCard>
        )}
        {/* Column Statistics Box */}
        <StatBox>
          <StatTitle>Column Statistics</StatTitle>
          <Select value={statColumn} onChange={e => setStatColumn(e.target.value)}>
            <option value="">Select Column</option>
            {numericalColumns.length > 0 ? (
              numericalColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))
            ) : (
              <option value="" disabled>No numerical columns available</option>
            )}
          </Select>
          {statColumn ? (
            getColumnStats(statColumn) ? (
              <div style={{marginTop:'1rem'}}>
                {Object.entries(getColumnStats(statColumn)).map(([k,v]) => (
                  <StatRow key={k}><span style={{textTransform:'capitalize'}}>{k}</span><span>{typeof v==='number'?v.toFixed(3):v}</span></StatRow>
                ))}
              </div>
            ) : (
              <div style={{marginTop:'1rem',color:'#e53e3e'}}>Cannot give stats about this column (not a numerical column)</div>
            )
          ) : numericalColumns.length === 0 ? (
            <div style={{marginTop:'1rem',color:'#718096'}}>No numerical columns found in the data. Statistics are only available for numerical data.</div>
          ) : (
            <div style={{marginTop:'1rem',color:'#718096'}}>Select a numerical column to see statistics</div>
          )}
        </StatBox>
      </Content>
    </AnalysisContainer>
  );
};

export default FileAnalysis; 