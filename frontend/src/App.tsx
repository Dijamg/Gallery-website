import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Components/Layout'
import VideosPage from './Components/Pages/VideosPage'
import ImagesPage from './Components/Pages/ImagesPage'
import OtherPage from './Components/Pages/OtherPage'
import AuthProvider from './context/authProvider'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/videos" replace />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="images" element={<ImagesPage />} />
            <Route path="other" element={<OtherPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
