package com.dijam.mediaapp.media

import com.dijam.mediaapp.utils.ProfanityFilterService
import org.springframework.stereotype.Service

@Service
class MediaService(
    private val mediaRepository: MediaRepository,
    private val commentRepository: CommentRepository,
    private val profanityFilterService: ProfanityFilterService
) {

    fun getAll(): List<Media> = mediaRepository.findAll()

    fun getById(id: Long): Media? = mediaRepository.findById(id).orElse(null)

    fun getByFileType(fileType: FileType): List<Media> =
        mediaRepository.findAllByFiletypeOrderByIdAsc(fileType)

    fun addMedia(media: Media): Media = mediaRepository.save(media)

    fun updateMedia(media: Media): Media = mediaRepository.save(media)

    //not ideal but low load personal project so doesnt matter
    fun incrementViews(id: Long): Media {
        val media = mediaRepository.findById(id)
            .orElseThrow { NoSuchElementException("Media not found with id: $id") }

        media.views += 1
        return mediaRepository.save(media)
    }

    fun deleteMedia(id: Long) {
        if (mediaRepository.existsById(id)) {
            mediaRepository.deleteById(id)
        }
    }

    fun getAllComments(): List<Comment> = commentRepository.findAll()
    fun getComments(mediaId: Long): List<Comment> =
        commentRepository.findAllByMediaId(mediaId)
    fun getCommentById(id: Long): Comment? = commentRepository.findById(id).orElse(null)
    fun deleteComment(id: Long) {
        if(commentRepository.existsById(id)) {
            commentRepository.deleteById(id)
        }
    }

    fun addComment(comment: Comment): Comment {
        if (profanityFilterService.containsProfanity(comment.content)) {
            throw IllegalArgumentException("Comment contains inappropriate language.")
        }
        return commentRepository.save(comment)
    }
}