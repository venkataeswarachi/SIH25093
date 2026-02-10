package com.vvit.University.serviceImplementation;

import com.vvit.University.models.Achievements;
import com.vvit.University.models.Students;
import com.vvit.University.payload.AchievementDTO;
import com.vvit.University.repository.AchievementRepository;
import com.vvit.University.repository.StudentRepository;
import com.vvit.University.services.AchievementService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class AchievementServiceImpl implements AchievementService {

    private static final String ACHIEVEMENT_DIR = "achievements/";

    @Autowired
    private AchievementRepository achievementRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Override
    @Transactional
    public ResponseEntity<String> addAchievement(
            String title,
            String category,
            String description,
            MultipartFile file,
            String studentEmail
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Image is empty");
        }
        String srno = studentRepository.findByEmail(studentEmail).orElseThrow(()->new RuntimeException("Student not found in Achievement")).getRno();
        Files.createDirectories(Paths.get(ACHIEVEMENT_DIR));

        String storedFileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(ACHIEVEMENT_DIR + storedFileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Achievements achievement = new Achievements();
        achievement.setTitle(title);
        achievement.setCategory(category);
        achievement.setDescription(description);
        achievement.setFileName(file.getOriginalFilename());
        achievement.setStoredFileName(storedFileName);
        achievement.setFilePath(filePath.toString());
        achievement.setContentType(file.getContentType());
        achievement.setStudentEmail(studentEmail);
        achievement.setSrno(srno);
        achievementRepository.save(achievement);

        return ResponseEntity.ok("Achievement added successfully");
    }

    @Override
    public List<AchievementDTO> getAllAchievements() {

        return achievementRepository.findAll()
                .stream()
                .map(a -> {
                    AchievementDTO dto = new AchievementDTO();
                    dto.setAchievementId(a.getAchievementId());
                    dto.setTitle(a.getTitle());
                    dto.setCategory(a.getCategory());
                    dto.setDescription(a.getDescription());
                    dto.setPostedAt(a.getPostedAt());
                    dto.setSrno(a.getSrno());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<AchievementDTO> getAchievementsByCategory(String category) {

        return achievementRepository.findByCategory(category)
                .stream()
                .map(a -> {
                    AchievementDTO dto = new AchievementDTO();
                    dto.setAchievementId(a.getAchievementId());
                    dto.setTitle(a.getTitle());
                    dto.setCategory(a.getCategory());
                    dto.setDescription(a.getDescription());
                    dto.setPostedAt(a.getPostedAt());
                    dto.setSrno(a.getSrno());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<AchievementDTO> getStudentAchievements(String email) {

        return achievementRepository.findByStudentEmail(email)
                .stream()
                .map(a -> {
                    AchievementDTO dto = new AchievementDTO();
                    dto.setAchievementId(a.getAchievementId());
                    dto.setTitle(a.getTitle());
                    dto.setSrno(a.getSrno());
                    dto.setCategory(a.getCategory());
                    dto.setDescription(a.getDescription());
                    dto.setPostedAt(a.getPostedAt());
                    return dto;
                })
                .toList();
    }

    @Override
    public ResponseEntity<Resource> viewAchievement(Long achievementId)
            throws IOException {

        Achievements achievement =
                achievementRepository.findById(achievementId)
                        .orElseThrow(() ->
                                new RuntimeException("Achievement not found"));

        Path path = Paths.get(achievement.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                achievement.getContentType()
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                achievement.getFileName() + "\""
                )
                .body(resource);
    }
}
