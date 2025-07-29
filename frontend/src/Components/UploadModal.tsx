import React, { useState, useEffect } from 'react';
import mediaService from '../Services/mediaService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, fetchData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filetype, setFiletype] = useState<'video' | 'image'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset function to clear all form fields and error messages
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFiletype('video');
    setSelectedFile(null);
    setIsSubmitting(false);
    setErrorMessage('');
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setErrorMessage(''); // Clear error when user changes file
  };

  const handleFiletypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiletype = e.target.value as 'video' | 'image';
    setFiletype(newFiletype);
    setSelectedFile(null); // Clear selected file when filetype changes
    setErrorMessage(''); // Clear any error messages
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous errors
    console.log('Form submitted:', { title, description, filetype, selectedFile });
    if (selectedFile) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('filetype', filetype);
      formData.append('file', selectedFile);

      try {
        const response = await mediaService.addMedia(formData);
        console.log('Media uploaded successfully:', response);
        fetchData();
        onClose();
      } catch (error: any) {
        console.error('Error uploading media:', error);
        setErrorMessage(error.response?.data?.message || error.message || 'Failed to upload media. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getFileAcceptType = () => {
    if (filetype === 'video') {
      return '.mp4,.webm';
    } else {
      return '.png,.jpg,.jpeg,.gif,.webp';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-black p-4 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">Upload Media</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-black bg-opacity-50 hover:bg-opacity-75 hover:text-gray-300 text-white rounded-full p-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="bg-gray-950 rounded-b-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-white text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter title"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Enter description"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Filetype Radio Buttons */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                File Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="filetype"
                    value="video"
                    checked={filetype === 'video'}
                    onChange={handleFiletypeChange}
                    className="mr-2 text-purple-500 focus:ring-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                  <span className="text-white">Video</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="filetype"
                    value="image"
                    checked={filetype === 'image'}
                    onChange={handleFiletypeChange}
                    className="mr-2 text-purple-500 focus:ring-purple-500"
                    required
                    disabled={isSubmitting}
                  />
                  <span className="text-white">Image</span>
                </label>
              </div>
            </div>

            {/* File Selection */}
            <div>
              <label htmlFor="file" className="block text-white text-sm font-medium mb-2">
                File *
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept={getFileAcceptType()}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-400 mt-1">
                {filetype === 'video' ? 'Accepted formats: MP4, WebM' : 'Accepted formats: PNG, JPG, JPEG, GIF, WebP'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 