import React, { useState, useContext } from 'react';
import { Comment } from '../types';
import { MediaItem } from '../types';
import mediaService from '../Services/mediaService';
import { AuthContext } from '../context/authContext';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: MediaItem | null;
  comments: Comment[];
  onDelete?: () => void; // Callback to refresh the media list after deletion
}

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_BASE_URL;

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image, comments, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token, isAdmin } = useContext(AuthContext);
  
  if (!isOpen || !image) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get comments for this image
  const imageComments = comments.filter(comment => comment.mediaId === image.id);

  const handleCommentsClick = () => {
    setShowComments(!showComments);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    
    if (confirmed) {
      try {
        setIsDeleting(true);
        await mediaService.deleteMedia(image.id);
        console.log('Image deleted successfully');
        onClose();
        // Call the onDelete callback to refresh the media list
        if (onDelete) {
          onDelete();
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl mx-4 my-8">
        {/* Title and close button row */}
        <div className="sticky top-0 flex justify-between items-center bg-black p-4 rounded-t-lg z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-white text-2xl font-semibold">{image.filename}</h2>
            {/* Delete Button - Only visible to authenticated admins */}
            {token && isAdmin && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="bg-black bg-opacity-50 hover:bg-opacity-75 hover:text-gray-300 text-white rounded-full p-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image container */}
        <div className="relative bg-gray-950 rounded-b-lg overflow-hidden">
          {/* Image display */}
          <div className="flex justify-center bg-gray-950">
            <img
              className="w-full h-auto max-h-[80vh] object-contain"
              src={`${API_BASE_URL}${image.url}`}
              alt={image.filename}
            />
          </div>
          
          {/* Description, Comments, Likes etc*/}
          <div className="p-4 bg-black">
            <div className="bg-gray-950 rounded-lg p-4">
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                {image.description}
              </p>
              {/* Additional content can be added here */}
              <div className="flex items-center space-x-4 text-gray-400 text-xs">
                <span>Uploaded 2 days ago</span>
                <span>•</span>
                <span>0 views</span>
                <span>•</span>
                <span 
                  className="text-white hover:text-gray-600 cursor-pointer transition-colors duration-200"
                  onClick={handleCommentsClick}
                >
                  {imageComments.length} comments
                </span>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h3 className="text-white font-semibold mb-4">Comments</h3>
                  <div className="space-y-4">
                    {imageComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 