package com.vvit.University.ml;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class MLClient {

    private final RestTemplate restTemplate;

    public MLClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateResumeText(String prompt) {

        String url = "http://localhost:8000/generate-resume-legacy";

        Map<String, String> request = Map.of("prompt", prompt);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, request, Map.class);

        return response.getBody().get("resume_text").toString();
    }
}
