import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: number;
    title: string;
    description: string;
    url: string;
  } | null;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl mx-4">
        {/* Title and close button row */}
        <div className="flex justify-between items-center bg-black p-4 rounded-t-lg">
          <h2 className="text-white text-2xl font-semibold">{video.title}</h2>
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 hover:bg-opacity-75 hover:text-gray-300 text-white rounded-full p-2 transition-colors duration-200 cursor-pointer"
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
            src={video.url}
            controls
            autoPlay
            muted={false}
          />
          
          {/* Description, Comments, Likes etc*/}
          <div className="p-4 bg-black">
            <div className="bg-gray-950 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {video.description}
              </p>
              {/* Additional content can be added here */}
              <div className="mt-4 flex items-center space-x-4 text-gray-400 text-xs">
                <span>Uploaded 2 days ago</span>
                <span>•</span>
                <span>0 views</span>
                <span>•</span>
                <span>0 likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 