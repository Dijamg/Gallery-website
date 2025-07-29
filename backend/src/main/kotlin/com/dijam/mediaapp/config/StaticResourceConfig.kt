package com.dijam.mediaapp.config

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.nio.file.Paths

@Configuration
class StaticResourceConfig : WebMvcConfigurer {

    private val logger = LoggerFactory.getLogger(StaticResourceConfig::class.java)

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        val uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString()
        logger.info("Serving static files from: $uploadPath")

        registry.addResourceHandler("/assets/**")
            .addResourceLocations(uploadPath)
    }
}