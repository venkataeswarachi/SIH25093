package com.vvit.University.controllers;

import com.vvit.University.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MLApiController {

    @Autowired
    private MLService mlService;

    @PostMapping("/classify-skills")
    public Object classifySkills(Authentication authentication) {
        return mlService.classifySkillsFromDB(authentication.getName());
    }

    @PostMapping("/rank-projects")
    public Object rankProjects(Authentication authentication,
                               @RequestBody Map<String, String> body) {

        String role = body.get("target_role");
        return mlService.rankProjectsFromDB(authentication.getName(), role);
    }

    @PostMapping("/ats-score")
    public Map<String, Object> atsScore(Authentication authentication,
                                        @RequestBody Map<String, String> body) {

        String role = body.get("target_role");
        return mlService.atsScoreFromDB(authentication.getName(), role);
    }
}