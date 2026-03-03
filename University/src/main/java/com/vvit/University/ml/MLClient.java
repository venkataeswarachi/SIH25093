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

    // -----------------------------------------------------------------------
    // Additional helpers corresponding to new ml-service endpoints
    // -----------------------------------------------------------------------
    public Object rankProjectsFromML(Object request) {
        return postForObject("/rank-projects", request);
    }

    public Object classifySkillsFromML(Object request) {
        return postForObject("/classify-skills", request);
    }

    public Map<String, Object> atsScoreFromML(Object request) {
        return postForMap("/ats-score", request);
    }
    public Object scoreAchievements(Object reqBody) {
        return postForObject("/score-achievements", reqBody);
    }



    public Map<String, Object> summary(Object reqBody) {
        return postForMap("/summary", reqBody);
    }

    public Map<String, Object> enhanceProject(Object reqBody) {
        return postForMap("/enhance-project", reqBody);
    }

    public Map<String, Object> enhanceAchievement(Object reqBody) {
        return postForMap("/enhance-achievement", reqBody);
    }

    // generic helpers
    public Map<String, Object> postForMap(String path, Object body) {
        String url = "http://localhost:8000" + path;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);
        return response.getBody();
    }

    public Object postForObject(String path, Object body) {
        String url = "http://localhost:8000" + path;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Object> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Object.class);
        return response.getBody();
    }
}
