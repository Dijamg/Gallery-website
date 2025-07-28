import React, { useState } from 'react';
import VideoCard from '../VideoCard';
import VideoModal from '../VideoModal';

const VideosPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: number;
    title: string;
    description: string;
    url: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  const videos = [
    { id: 1, title: "Derp vs Bzi", description: "Description 1", url: "/assets/Derpvsbzi.mp4" },
    { id: 2, title: "Dharok Gameplay", description: "Description 2", url: "/assets/dharok.mp4" },
    { id: 3, title: "Derp vs Bzi", description: "Description 3", url: "/assets/Derpvsbzi.mp4" },
    { id: 4, title: "Dharok Gameplay", description: "Description 4", url: "/assets/dharok.mp4" },
    { id: 5, title: "Derp vs Bzi", description: "Description 5", url: "/assets/Derpvsbzi.mp4" },
    { id: 6, title: "Dharok Gameplay", description: "Description 6", url: "/assets/dharok.mp4" },
  ];


  const handleVideoClick = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Videos</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
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
      />
    </div>
  );
};

export default VideosPage; 