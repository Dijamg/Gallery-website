package com.dijam.mediaapp.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.web.client.RestTemplate

@Configuration
class AppConfig {
    @Bean
    fun restTemplate(): RestTemplate {
        val factory = SimpleClientHttpRequestFactory()
        factory.setConnectTimeout(5000)
        factory.setReadTimeout(5000)
        return RestTemplate(factory)
    }
}