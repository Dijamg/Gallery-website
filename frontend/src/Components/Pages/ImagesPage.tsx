import React, { useState } from 'react';
import ImageCard from '../ImageCard';
import ImageModal from '../ImageModal';
import { MediaItem, Comment } from '../../types';

interface ImagesPageProps {
  images: MediaItem[];
  comments: Comment[];
  fetchData: () => void;
  setImages: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

const ImagesPage = ({ images, comments, fetchData, setImages }: ImagesPageProps) => {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (image: MediaItem) => {
    const mediaItem = images.find(i => i.id === image.id);
    if (mediaItem) {
      setSelectedImage(mediaItem);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Update selectedImage when images state changes
  React.useEffect(() => {
    if (selectedImage) {
      const updatedImage = images.find(i => i.id === selectedImage.id);
      if (updatedImage) {
        setSelectedImage(updatedImage);
      }
    }
  }, [images, selectedImage]);

  const imageItems = images.filter(item => item.filetype === 'image');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Images</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageItems.map((image) => (
          <ImageCard 
            key={`image-${image.id}`} 
            image={image}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedImage}
        comments={comments}
        onDelete={fetchData}
        onCommentAdded={fetchData}
        setImages={setImages}
      />
    </div>
  );
};

export default ImagesPage; 