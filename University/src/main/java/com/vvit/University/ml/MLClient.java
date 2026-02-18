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

    public Map<String, Object> generateResumeFromDTO(Object requestDTO) {

        String url = "http://localhost:8000/generate-resume";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity =
                new HttpEntity<>(requestDTO, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

        return response.getBody();
    }
}
