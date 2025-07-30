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
        onCommentAdded={fetchData}
        setVideos={setVideos}
      />
    </div>
  );
};

export default VideosPage; 