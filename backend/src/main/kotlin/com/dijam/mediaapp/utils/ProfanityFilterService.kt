package com.dijam.mediaapp.utils

import org.springframework.stereotype.Service
import java.io.InputStreamReader
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

@Service
class ProfanityFilterService {

    //load once and cache for later use
    private val profaneWords: Set<String> by lazy {
        loadProfanityWords()
    }

    fun containsProfanity(text: String): Boolean {
        return profaneWords.any { word ->
            Regex("\\b${Regex.escape(word)}\\b", RegexOption.IGNORE_CASE).containsMatchIn(text)
        }
    }

    private fun loadProfanityWords(): Set<String> {
        val resource = this::class.java.classLoader.getResource("profanitywords.json")
            ?: throw RuntimeException("Profanity list not found")
        val mapper = jacksonObjectMapper()
        return mapper.readValue<List<String>>(InputStreamReader(resource.openStream())).toSet()
    }
}