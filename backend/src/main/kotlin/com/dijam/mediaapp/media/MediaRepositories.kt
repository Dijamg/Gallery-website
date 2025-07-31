package com.dijam.mediaapp.media

import org.springframework.data.repository.CrudRepository

interface MediaRepository : CrudRepository<Media, Long> {
    fun findAllByFiletypeOrderByIdAsc(fileType: FileType): List<Media>
    override fun findAll(): List<Media>
}

interface CommentRepository : CrudRepository<Comment, Long> {
    fun findAllByMediaId(mediaId: Long): List<Comment>
    override fun findAll(): List<Comment>
}