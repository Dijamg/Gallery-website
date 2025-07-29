import React, { useState } from 'react';
import VideoCard from '../VideoCard';
import VideoModal from '../VideoModal';
import { MediaItem, Comment } from '../../types';

interface VideosPageProps {
  videos: MediaItem[];
  comments: Comment[];
  fetchData: () => void;
}

const VideosPage = ({ videos, comments, fetchData }: VideosPageProps) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Filter videos only
  const videoItems = videos.filter(item => item.filetype === 'video');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Videos</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoItems.map((video) => (
          <VideoCard 
            key={`video-${video.id}`} 
            video={video}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
        comments={comments}
        onDelete={fetchData}
      />
    </div>
  );
};

export default VideosPage; 