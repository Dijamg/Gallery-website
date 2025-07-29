package com.dijam.mediaapp.auth

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/authentication")
open class AuthController {

    @GetMapping("/ping")
    open fun ping(): ResponseEntity<String> {
        return try {
            ResponseEntity.ok("Pong from Kotlin!")
        } catch (e: Exception) {
            ResponseEntity.status(500).body("Error: ${e.message}")
        }
    }

    @GetMapping("/pingauth")
    open fun pingauth(): ResponseEntity<String> {
        return try {
            ResponseEntity.ok("Pong auth from Kotlin!")
        } catch (e: Exception) {
            ResponseEntity.status(500).body("Error: ${e.message}")
        }
    }

    @GetMapping("/pingadmin")
    open fun pingadmin(): ResponseEntity<String> {
        return try {
            ResponseEntity.ok("Pong admin from Kotlin!")
        } catch (e: Exception) {
            ResponseEntity.status(500).body("Error: ${e.message}")
        }
    }
}