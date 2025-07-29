package com.dijam.mediaapp.media

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import org.apache.logging.log4j.util.StringMap

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "media")
open class Media(

    @Column(nullable = false)
    var filename: String,

    @Column(nullable = false)
    var description: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var filetype: FileType,

    @Column(nullable = false)
    var mime_type: String,

    var size: Long? = null,

    @Column(nullable = false)
    var url: String,

    @Column(nullable = false)
    var views: Int = 0,

    @Column(nullable = false)
    var uploaded_at: Instant = Instant.now(),

    @Column(nullable = false)
    var uploaded_by: String,

    @Column(nullable = false)
    var revision_date: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
)

@Entity
@Table(name = "comments")
open class Comment(

    @Column(name = "media_id", nullable = false)
    var mediaId: Long,

    @Column(nullable = false)
    var content: String,

    @Column(nullable = false)
    var created_at: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
)