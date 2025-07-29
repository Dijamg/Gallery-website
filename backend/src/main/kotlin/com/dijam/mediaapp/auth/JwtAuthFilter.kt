package com.dijam.mediaapp.auth

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.AuthenticationException
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.web.filter.OncePerRequestFilter

class JwtAuthFilter(
    private val authenticationManager: AuthenticationManager
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        if (header != null && header.startsWith("Bearer ")) {
            val token = header.removePrefix("Bearer ").trim()
            val authRequest = UsernamePasswordAuthenticationToken(null, token)

            try {
                val authResult = authenticationManager.authenticate(authRequest)
                SecurityContextHolder.getContext().authentication = authResult
            } catch (ex: AuthenticationException) {
                response.status = HttpServletResponse.SC_UNAUTHORIZED
                response.contentType = "application/json"
                response.writer.write("""{ "error": "${ex.message}" }""")
                return
            }
        }

        filterChain.doFilter(request, response)
    }
}