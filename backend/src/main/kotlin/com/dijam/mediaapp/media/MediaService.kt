package com.dijam.mediaapp.media

import org.springframework.stereotype.Service

@Service
class MediaService(
    private val mediaRepository: MediaRepository,
    private val commentRepository: CommentRepository
) {

    fun getAll(): List<Media> = mediaRepository.findAll()

    fun getById(id: Long): Media? = mediaRepository.findById(id).orElse(null)

    fun getByFileType(fileType: FileType): List<Media> =
        mediaRepository.findAllByFiletype(fileType)

    fun addMedia(media: Media): Media = mediaRepository.save(media)

    fun updateMedia(media: Media): Media = mediaRepository.save(media)

    fun deleteMedia(id: Long) {
        if (mediaRepository.existsById(id)) {
            mediaRepository.deleteById(id)
        }
    }

    fun getAllComments(): List<Comment> = commentRepository.findAll()
    fun getComments(mediaId: Long): List<Comment> =
        commentRepository.findAllByMediaId(mediaId)

    fun addComment(comment: Comment): Comment = commentRepository.save(comment)
}