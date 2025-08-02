import { MediaItem } from "../types";
import { useState, useRef } from "react";

interface VideoCardProps {
  video: MediaItem;
  onVideoClick: (video: MediaItem) => void;
}

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_BASE_URL;

const VideoCard = ({ video, onVideoClick }: VideoCardProps) => {
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    setShowVideo(true);
    const videoElement = videoRef.current;
    if (videoElement) {
      // Force load first frame
      videoElement.currentTime = 0.1;
    }
  };

  const handleInteraction = () => {
    // On mobile, sometimes we need user interaction to show video
    const videoElement = videoRef.current;
    if (videoElement && !showVideo) {
      videoElement.load();
    }
  };

  return (
    <div
      className="flex flex-col bg-gray-950 shadow-sm border border-gray-700 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl relative"
      onClick={() => onVideoClick(video)}
    >
      {/* Video Thumbnail */}
      <div 
        className="relative overflow-hidden rounded-t-lg bg-gray-800"
        onTouchStart={handleInteraction}
        onMouseEnter={handleInteraction}
      >
        {!videoError ? (
          <>
            <video 
              ref={videoRef}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
              src={`${API_BASE_URL}${video.url}#t=0.1`} 
              muted
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
              onCanPlay={handleVideoLoad}
              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VmlkZW88L3RleHQ+PC9zdmc+"
            />
            {!showVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Error fallback
          <div className="w-full h-48 flex items-center justify-center bg-gray-800 text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p className="text-sm">Video Preview</p>
            </div>
          </div>
        )}
        {/* Add play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      
      {/* Video Title */}
      <div className="p-3">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {video.filename}
        </h3>
      </div>
    </div>
  )
}

export default VideoCard;