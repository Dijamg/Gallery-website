import { MediaItem } from "../types";

interface VideoCardProps {
  video: MediaItem;
  onVideoClick: (video: MediaItem) => void;
}

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_BASE_URL;

const VideoCard = ({ video, onVideoClick }: VideoCardProps) => {
  return (
    <div
      className="flex flex-col bg-gray-950 shadow-sm border border-gray-700 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl relative"
      onClick={() => onVideoClick(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative overflow-hidden rounded-t-lg">
        <video 
          className="w-full h-48 object-cover" 
          src={`${API_BASE_URL}${video.url}`} 
          muted
          preload="metadata"
          poster=""
        />
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