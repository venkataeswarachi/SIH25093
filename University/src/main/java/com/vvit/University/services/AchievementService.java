package com.vvit.University.services;

import com.vvit.University.payload.AchievementDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AchievementService {

    ResponseEntity<String> addAchievement(
            String title,
            String category,
            String description,
            MultipartFile file,
            String studentEmail
    ) throws IOException;

    List<AchievementDTO> getAllAchievements();

    List<AchievementDTO> getAchievementsByCategory(String category);

    List<AchievementDTO> getStudentAchievements(String email);

    ResponseEntity<?> viewAchievement(Long achievementId)
            throws IOException;
}
