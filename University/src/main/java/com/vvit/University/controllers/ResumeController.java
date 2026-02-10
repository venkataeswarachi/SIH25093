package com.vvit.University.controllers;

import com.vvit.University.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private MLService mlService;

    @PostMapping("/generate")
    public Map<String, Object> generateResume(Authentication authentication) {
        return mlService.generateResumeFromML(authentication.getName());
    }
}

