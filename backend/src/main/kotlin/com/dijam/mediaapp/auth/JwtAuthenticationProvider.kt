package com.dijam.mediaapp.auth

import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import java.util.*

@Component
class JwtAuthenticationProvider(
    @Value("\${jwt.secret}") private val jwtSecret: String,
    @Value("\${tpx.auth.url}") private val verifyTokenUrl: String,
    private val restTemplate: RestTemplate
) : AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication {
        val token = authentication.credentials as? String
            ?: throw BadCredentialsException("Missing token")

        if (!validateWithTpxBackend(token)) {
            throw BadCredentialsException("Token invalid or user deleted")
        }

        val claims = try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret.toByteArray())
                .build()
                .parseClaimsJws(token)
                .body
        } catch (ex: Exception) {
            throw BadCredentialsException("Invalid JWT structure or signature")
        }

        val username = claims["username"] as? String ?: throw BadCredentialsException("Missing username in token")
        val isAdmin = claims["isAdmin"] as? Boolean ?: false

        val authorities: List<GrantedAuthority> = if (isAdmin) {
            listOf(SimpleGrantedAuthority("ROLE_ADMIN"))
        } else {
            listOf(SimpleGrantedAuthority("ROLE_USER"))
        }

        return UsernamePasswordAuthenticationToken(username, token, authorities)
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication == UsernamePasswordAuthenticationToken::class.java
    }

    private fun validateWithTpxBackend(token: String): Boolean {
        return try {
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_JSON
            headers.setBearerAuth(token)

            val entity = HttpEntity<Void>(headers)

            val response = restTemplate.postForEntity(
                verifyTokenUrl,
                entity,
                Map::class.java
            )


            response.statusCode == HttpStatus.OK && response.body?.get("message") == "Token verified"
        } catch (ex: Exception) {
            println("Error ${ex.message}")
            false
        }
    }
}