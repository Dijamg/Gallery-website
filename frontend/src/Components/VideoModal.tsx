import React, { useState, useContext, useEffect, useRef } from 'react';
import { Comment } from '../types';
import { MediaItem } from '../types';
import mediaService from '../Services/mediaService';
import commentService from '../Services/commentService';
import { AuthContext } from '../context/authContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: MediaItem | null;
  comments: Comment[];
  onDelete?: () => void;
  onCommentAdded?: () => void;
  setVideos?: React.Dispatch<React.SetStateAction<MediaItem[]>>; // To update view count immediately
}

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_BASE_URL;

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, video, comments, onDelete, onCommentAdded, setVideos }) => {
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const hasIncrementedView = useRef(false);
  const { token, isAdmin } = useContext(AuthContext);
  
  // Reset the increment flag when modal opens
  useEffect(() => {
    if (isOpen) {
      hasIncrementedView.current = false;
    }
  }, [isOpen]);
  
  // Increment view count when modal opens
  useEffect(() => {
    if (isOpen && video && !hasIncrementedView.current) {
      hasIncrementedView.current = true;
      
      // Update view count immediately in state
      if (setVideos) {
        setVideos(prevVideos => 
          prevVideos.map(vid => 
            vid.id === video.id 
              ? { ...vid, views: (vid.views || 0) + 1 }
              : vid
          )
        );
      }
      
      // Call API to persist the increment
      mediaService.incrementViewCount(video.id).catch(error => {
        console.error('Error incrementing view count:', error);
      });
    }
  }, [isOpen, video, setVideos]);
  
  // Format upload time
  const formatUploadTime = (uploadedAt: string) => {
    const uploadDate = new Date(uploadedAt);
    const now = new Date();
    const diffInMs = now.getTime() - uploadDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    
    if (diffInDays < 1) {
      const hours = Math.floor(diffInHours);
      const minutes = Math.floor((diffInHours - hours) * 60);
      if (hours === 0) {
        return `Uploaded ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `Uploaded ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInDays);
      return `Uploaded ${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };
  
  if (!isOpen || !video) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get comments for this video
  const videoComments = comments.filter(comment => comment.mediaId === video.id);

  const handleCommentsClick = () => {
    setShowComments(!showComments);
  };

  const handleAddCommentClick = () => {
    setShowAddComment(!showAddComment);
    if (showAddComment) {
      // When closing, clear error and comment
      setCommentError('');
      setNewComment('');
    }
  };

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        setIsSubmittingComment(true);
        setCommentError('');
        const formData = new FormData();
        formData.append('content', newComment.trim());
        
        await commentService.addComment(video.id, formData);
        console.log('Comment added successfully');
        setNewComment('');
        setShowAddComment(false);
        setCommentError('');
        if(onDelete) {
          onDelete();
        }
        if(onCommentAdded) {
          onCommentAdded();
        }
      } catch (error: any) {
        console.error('Error adding comment:', error);
        if (error.response?.status === 400) {
          setCommentError('Use appropriate language');
        } else {
          setCommentError(error.response?.data?.message || 'Failed to add comment. Please try again.');
        }
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitComment();
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this video? This action cannot be undone.');
    
    if (confirmed) {
      try {
        setIsDeleting(true);
        await mediaService.deleteMedia(video.id);
        console.log('Video deleted successfully');
        onClose();
        // Call the onDelete callback to refresh the media list
        if (onDelete) {
          onDelete();
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    
    if (confirmed) {
      try {
        setDeletingCommentId(commentId);
        await commentService.deleteComment(commentId);
        console.log('Comment deleted successfully');
        if (onCommentAdded) {
          onCommentAdded();
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      } finally {
        setDeletingCommentId(null);
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
            <h2 className="text-white text-2xl font-semibold">{video.filename}</h2>
            {/* Delete Button - Only visible to authenticated admins */}
            {token && isAdmin && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete video"
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

        {/* Video container */}
        <div className="relative bg-gray-950 rounded-b-lg overflow-hidden">
          {/* Video player */}
          <video
            className="w-full h-auto max-h-[80vh]"
            src={`${API_BASE_URL}${video.url}`}
            controls
            autoPlay
            muted={false}
          />
          
          {/* Description, Comments, Likes etc*/}
          <div className="p-4 bg-black">
            <div className="bg-gray-950 rounded-lg p-4">
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                {video.description}
              </p>
              {/* Additional content can be added here */}
              <div className="flex items-center space-x-4 text-gray-400 text-xs">
                <span>{formatUploadTime(video.uploaded_at)}</span>
                <span>•</span>
                <span>{video.views || 0} views</span>
                <span>•</span>
                <span 
                  className="text-white hover:text-gray-600 cursor-pointer transition-colors duration-200"
                  onClick={handleCommentsClick}
                >
                  {videoComments.length} comments
                </span>
                {token && (
                  <button
                    onClick={handleAddCommentClick}
                    className={`cursor-pointer transition-colors duration-200 text-xs ${
                      showAddComment 
                        ? "text-red-400 hover:text-red-300" 
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                  >
                    {showAddComment ? "- close" : "+ add comment"}
                  </button>
                )}
              </div>

              {/* Add Comment Section */}
              {showAddComment && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={isSubmittingComment}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? 'Adding...' : 'Enter'}
                    </button>
                  </div>
                  {commentError && (
                    <p className="text-red-500 text-xs mt-2">{commentError}</p>
                  )}
                </div>
              )}

              {/* Comments Section */}
              {showComments && (
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h3 className="text-white font-semibold mb-4">Comments</h3>
                  <div className="space-y-4">
                    {videoComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          {token && isAdmin && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deletingCommentId === comment.id}
                              className="text-red-500 hover:text-red-300 text-xs ml-2"
                              title="Delete comment"
                            >
                              {deletingCommentId === comment.id ? 'Deleting...' : 'X'}
                            </button>
                          )}
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

export default VideoModal; 