import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaCloudUploadAlt, 
  FaFileExcel, 
  FaTimes, 
  FaCheck,
  FaSpinner
} from 'react-icons/fa';

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem var(--spacing-md);
`;

const Header = styled.div`
  text-align: center;
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

const UploadCard = styled(motion.div)`
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

const Dropzone = styled.div`
  border: 2px dashed ${props => props.isDragActive ? 'var(--primary-500)' : 'var(--gray-300)'};
  border-radius: var(--radius-xl);
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? 'var(--primary-50)' : 'var(--gray-50)'};
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary-400);
    background: var(--primary-50);
  }
  html.dark & {
    background: ${props => props.isDragActive ? 'var(--gray-900)' : 'var(--gray-800)'};
    border-color: var(--gray-700);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-500);
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
    html.dark & {
      color: var(--gray-100);
    }
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1rem;
    html.dark & {
      color: var(--gray-400);
    }
  }
`;

const FileTypes = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const FileType = styled.span`
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
`;

const FilePreview = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  html.dark & {
    background: var(--gray-900);
    border-color: var(--gray-700);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--success-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--success-600);
  font-size: 1.25rem;
  body.dark & {
    background: var(--success-900);
    color: var(--success-100);
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
  }
  
  .file-size {
    font-size: 0.875rem;
    color: var(--gray-600);
    html.dark & {
      color: var(--gray-400);
    }
  }
`;

const RemoveButton = styled.button`
  background: var(--error-100);
  color: var(--error-600);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--error-200);
  }
  body.dark & {
    background: var(--error-900);
    color: var(--error-100);
    &:hover {
      background: var(--error-700);
    }
  }
`;

const FormSection = styled.div`
  margin-top: 2rem;
  body.dark & {
    color: var(--gray-100);
  }
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
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
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  body.dark & {
    background: var(--gray-900);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  body.dark & {
    background: var(--gray-900);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &::placeholder {
      color: var(--gray-400);
    }
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .remove-tag {
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
      color: var(--error-600);
    }
  }
  body.dark & {
    background: var(--gray-900);
    color: var(--primary-200);
  }
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  min-width: 100px;
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const UploadButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles(prev => [...prev, ...acceptedFiles.filter(f => !prev.some(p => p.name === f.name && p.size === f.size))]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to upload files');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      files.forEach(file => formData.append('file', file));
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/excel/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('File uploaded successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.error || 'Upload failed');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UploadContainer>
      <Header>
        <Title>Upload Excel File</Title>
        <Subtitle>Upload your Excel file to start analyzing</Subtitle>
      </Header>

      <UploadCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Dropzone {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <UploadIcon>
            <FaCloudUploadAlt />
          </UploadIcon>
          <UploadText>
            <h3>Drop your Excel file here</h3>
            <p>or click to browse files</p>
          </UploadText>
          <FileTypes>
            <FileType>.xlsx</FileType>
            <FileType>.xls</FileType>
            <FileType>.csv</FileType>
          </FileTypes>
        </Dropzone>

        {files.length > 0 && (
          <FilePreview>
            {files.map((file, idx) => (
              <FileInfo key={file.name + file.size + idx}>
                <FileIcon>
                  <FaFileExcel />
                </FileIcon>
                <FileDetails>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </FileDetails>
                <RemoveButton onClick={() => handleRemoveFile(file)}>
                  <FaTimes />
                </RemoveButton>
              </FileInfo>
            ))}
          </FilePreview>
        )}

        {files.length > 0 && (
          <FormSection>
            <FormTitle>File Details</FormTitle>
            
            <FormGroup>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your file..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Tags (Optional)</Label>
              <TagsContainer>
                {tags.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                    <span 
                      className="remove-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </span>
                  </Tag>
                ))}
                <TagInput
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Add tag..."
                />
              </TagsContainer>
            </FormGroup>
          </FormSection>
        )}

        <UploadButton 
          onClick={handleUpload} 
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="fa-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FaCheck />
              Upload File
            </>
          )}
        </UploadButton>
      </UploadCard>
    </UploadContainer>
  );
};

export default FileUpload; 