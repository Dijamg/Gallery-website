package com.dijam.mediaapp.config

import com.dijam.mediaapp.auth.JwtAuthFilter
import com.dijam.mediaapp.auth.JwtAuthenticationProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.client.RestTemplate
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig(
    private val jwtAuthenticationProvider: JwtAuthenticationProvider
) {

    @Bean
    fun authenticationManager(): AuthenticationManager {
        return ProviderManager(jwtAuthenticationProvider)
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        val jwtAuthFilter = JwtAuthFilter(authenticationManager())

        http
            .cors { }
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers("/gallery/assets/**").permitAll()
                    .requestMatchers("/gallery/api/authentication/pingadmin", "/gallery/api/media/upload", "/gallery/api/media/*/delete", "/gallery/api/media/comments/*/delete").hasRole("ADMIN")
                    .requestMatchers("/gallery/api/authentication/pingauth", "/gallery/api/media/*/upload-comment").authenticated()
                    .anyRequest().permitAll()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("https://phantomphoenix.org","http://localhost:5174")
        configuration.allowCredentials = true
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}