import React, { useState } from 'react';
import VideoCard from '../VideoCard';
import VideoModal from '../VideoModal';
import { MediaItem, Comment } from '../../types';

interface VideosPageProps {
  videos: MediaItem[];
  comments: Comment[];
  fetchData: () => void;
  setVideos: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const VideosPage = ({ videos, comments, fetchData, setVideos }: VideosPageProps) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleVideoClick = (video: MediaItem) => {
    const mediaItem = videos.find(v => v.id === video.id);
    if (mediaItem) {
      setSelectedVideo(mediaItem);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Update selectedVideo when videos state changes
  React.useEffect(() => {
    if (selectedVideo) {
      const updatedVideo = videos.find(v => v.id === selectedVideo.id);
      if (updatedVideo) {
        setSelectedVideo(updatedVideo);
      }
    }
  }, [videos, selectedVideo]);

  // Reset to page 1 when videos are deleted
  React.useEffect(() => {
    const videoItems = videos.filter(item => item.filetype === 'video');
    const totalPages = Math.ceil(videoItems.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [videos, currentPage, itemsPerPage]);

  // Filter videos only
  const videoItems = videos.filter(item => item.filetype === 'video');
  
  // Calculate pagination
  const totalPages = Math.ceil(videoItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = videoItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate which dots to show (max 4)
  const getVisiblePages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3, 4];
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Videos</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentVideos.map((video) => (
          <VideoCard 
            key={`video-${video.id}`} 
            video={video}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>

      {/* Pagination with Arrows and Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 space-x-4">
          {/* Previous Arrow */}
          <button
            onClick={handlePreviousPage}
            className="text-white hover:text-gray-300 transition-colors duration-200"
            aria-label="Previous page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`transition-colors duration-200 ${
                  currentPage === page
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
                aria-label={`Go to page ${page}`}
              >
                {totalPages <= 4 ? (
                  <div className={`w-3 h-3 rounded-full ${
                    currentPage === page
                      ? 'bg-white'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`} />
                ) : (
                  <span className="text-sm font-medium">{page}</span>
                )}
              </button>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNextPage}
            className="text-white hover:text-gray-300 transition-colors duration-200"
            aria-label="Next page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
        comments={comments}
        onDelete={fetchData}
        onCommentAdded={fetchData}
        setVideos={setVideos}
      />
    </div>
  );
};

export default VideosPage; 