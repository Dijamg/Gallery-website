import { MediaItem } from "../types";

interface ImageCardProps {
  image: MediaItem;
  onImageClick: (image: MediaItem) => void;
}

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_BASE_URL;

const ImageCard = ({ image, onImageClick }: ImageCardProps) => {
  return (
    <div
      className="flex flex-col bg-gray-950 shadow-sm border border-gray-700 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl relative"
      onClick={() => onImageClick(image)}
    >
      {/* Image Thumbnail */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          className="w-full h-48 object-cover" 
          src={`${API_BASE_URL}${image.url}`} 
          alt={image.filename}
        />
        {/* Add zoom icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>
      
      {/* Image Title */}
      <div className="p-3">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {image.filename}
        </h3>
      </div>
    </div>
  )
}

export default ImageCard; 