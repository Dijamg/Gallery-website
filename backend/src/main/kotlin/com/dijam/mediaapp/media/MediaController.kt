package com.dijam.mediaapp.media

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.nio.file.Files
import java.time.Instant
import java.nio.file.Paths
import org.springframework.util.StringUtils
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

data class ErrorResponse(val error: String)

@RestController
@RequestMapping("/media")
open class MediaController(
    private val service: MediaService
) {

    @GetMapping("/")
    open fun getAll(): ResponseEntity<List<Media>> {
        return try {
            val mediaList = service.getAll()
            ResponseEntity.ok(mediaList)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(emptyList())
        }
    }

    @GetMapping("/{id}")
    open fun getById(@PathVariable id: Long): ResponseEntity<Media> {
        return try {
            val media = service.getById(id)
            ResponseEntity.ok(media)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(null)
        }
    }

    @GetMapping("/videos")
    open fun getAllVideos(): ResponseEntity<List<Media>> {
        return try {
            val mediaList = service.getByFileType(FileType.video)
            ResponseEntity.ok(mediaList)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(emptyList())
        }
    }

    @GetMapping("/images")
    open fun getAllImages(): ResponseEntity<List<Media>> {
        return try {
            val mediaList = service.getByFileType(FileType.image)
            ResponseEntity.ok(mediaList)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(emptyList())
        }
    }

    @GetMapping("/comments")
    open fun getAllComments(): ResponseEntity<List<Comment>> {
        return try {
            val commentList = service.getAllComments()
            ResponseEntity.ok(commentList)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(emptyList())
        }
    }

    @GetMapping("/comments/{id}")
    open fun getCommentsByMediaId(@PathVariable id: Long): ResponseEntity<List<Comment>> {
        return try {
            val commentList = service.getComments(id)
            ResponseEntity.ok(commentList)
        } catch (e: Exception) {
            ResponseEntity.status(500).body(emptyList())
        }
    }

    @PatchMapping("/{id}/increment-views")
    fun incrementViews(@PathVariable id: Long): ResponseEntity<Void> {
        service.incrementViews(id)
        return ResponseEntity.ok().build()
    }


    @PostMapping("/{id}/upload-comment", consumes = ["multipart/form-data"])
    open fun uploadComment(
        @PathVariable id: Long,
        @RequestParam("content") content: String
    ): ResponseEntity<Any> {
        return try {
            val comment = Comment(
                mediaId = id,
                content = content
            )
            service.addComment(comment)
            ResponseEntity.status(200).body(comment)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(400)
                .body(ErrorResponse("Comment rejected: ${e.message}"))
        } catch (e: Exception) {
            println("THE ERROR: " + e.message)
            ResponseEntity.status(500)
                .body(ErrorResponse("Internal server error"))
        }
    }

    @DeleteMapping("/comments/{id}/delete")
    fun deleteComment(@PathVariable id: Long): ResponseEntity<Any> {
        val comment = service.getCommentById(id) ?: return ResponseEntity.notFound().build()

        // Delete from database
        service.deleteComment(id)

        return ResponseEntity.noContent().build()
    }


    @PostMapping("/upload", consumes = ["multipart/form-data"])
    fun uploadMedia(
        @RequestParam("title") title: String,
        @RequestParam("description") description: String,
        @RequestParam("filetype") fileType: String,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Media> {
        return try {
            // The files are locally saved and metadata put in db
            val uploadDir = Paths.get("/app/uploads")
            Files.createDirectories(uploadDir)

            val filename = StringUtils.cleanPath(file.originalFilename ?: "upload")
            val filePath = uploadDir.resolve(filename)
            println("Uploading to: $filePath")
            file.transferTo(filePath)

            //save metadata
            val media = Media(
                filename = title,
                description = description,
                filetype = FileType.valueOf(fileType),
                mime_type = file.contentType ?: "unknown",
                size = file.size,
                uploaded_at = Instant.now(),
                uploaded_by = "admin",
                url = "/assets/$filename",
                revision_date = Instant.now(),
                views = 0
            )

            service.addMedia(media)

            ResponseEntity.status(200).body(media)
        } catch (e: Exception) {
            println("THE ERROR: " + e.message)
            ResponseEntity.status(500).body(null)
        }
    }

    @DeleteMapping("/{id}/delete")
    fun deleteMedia(@PathVariable id: Long): ResponseEntity<Any> {
        val media = service.getById(id) ?: return ResponseEntity.notFound().build()

        // remove the saved media file
        val uploadDir = Paths.get("uploads").toAbsolutePath()
        val filePath = uploadDir.resolve(media.filename)
        try {
            Files.deleteIfExists(filePath)
        } catch (e: IOException) {
            return ResponseEntity.status(500).body("Failed to delete file: ${e.message}")
        }

        // Delete from database
        service.deleteMedia(id)

        return ResponseEntity.noContent().build()
    }

}