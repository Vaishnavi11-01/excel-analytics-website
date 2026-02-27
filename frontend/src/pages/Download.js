import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem var(--spacing-md);
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 2rem;
  html.dark & { color: var(--gray-100); }
`;
const FileList = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  html.dark & { background: var(--gray-800); border-color: var(--gray-700); }
`;
const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--gray-100);
  html.dark & { border-bottom: 1px solid var(--gray-700); }
  &:last-child { border-bottom: none; }
`;
const FileName = styled.div`
  font-weight: 600;
  color: var(--gray-900);
  html.dark & { color: var(--gray-100); }
`;
const DownloadButton = styled.button`
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  &:hover { background: var(--primary-600); }
`;

const Download = () => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/excel/files`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFiles(res.data.files);
      } catch (err) { /* handle error */ }
    };
    fetchFiles();
  }, []);
  const handleDownload = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/excel/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { /* handle error */ }
  };
  return (
    <Container>
      <Title>Download Your Files</Title>
      <FileList>
        {files.map(file => (
          <FileRow key={file._id}>
            <FileName>{file.originalName}</FileName>
            <DownloadButton onClick={() => handleDownload(file._id, file.originalName)}>
              <FaDownload /> Download
            </DownloadButton>
          </FileRow>
        ))}
      </FileList>
    </Container>
  );
};
export default Download; 