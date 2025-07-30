import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Components/Layout'
import VideosPage from './Components/Pages/VideosPage'
import ImagesPage from './Components/Pages/ImagesPage'
import OtherPage from './Components/Pages/OtherPage'
import AuthProvider from './context/authProvider'
import mediaService from './Services/mediaService'
import commentService from './Services/commentService'
import { MediaItem } from './types'
import { Comment } from './types'

const App = () => {

  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchData = async () => {
    try {
      console.log("hellooo");
      const [videos, images, comments] = await Promise.all([mediaService.getVideos(), mediaService.getImages(), commentService.getAll()]);
      setVideos(videos);
      setImages(images);
      setComments(comments);
      console.log(comments);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout fetchData={fetchData} />}>
            <Route index element={<Navigate to="/videos" replace />} />
            <Route path="videos" element={<VideosPage videos={videos} setVideos={setVideos} comments={comments} fetchData={fetchData} />} />
            <Route path="images" element={<ImagesPage images={images} setImages={setImages} comments={comments} fetchData={fetchData} />} />
            <Route path="other" element={<OtherPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
