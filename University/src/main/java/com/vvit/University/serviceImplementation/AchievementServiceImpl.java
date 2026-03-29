package com.vvit.University.serviceImplementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vvit.University.models.Achievements;
import com.vvit.University.payload.AchievementDTO;
import com.vvit.University.repository.AchievementRepository;
import com.vvit.University.repository.StudentRepository;
import com.vvit.University.services.AchievementService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AchievementServiceImpl implements AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private StudentRepository studentRepository;

    // 🔥 Cloudinary
    @Autowired
    private Cloudinary cloudinary;

    // ================= ADD ACHIEVEMENT =================

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

        String srno = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getRno();

        // 🔥 Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")
        );

        String fileUrl = uploadResult.get("secure_url").toString();

        Achievements achievement = new Achievements();
        achievement.setTitle(title);
        achievement.setCategory(category);
        achievement.setDescription(description);
        achievement.setFileName(file.getOriginalFilename());
        achievement.setStoredFileName(file.getOriginalFilename());
        achievement.setFilePath(fileUrl); // ✅ Cloud URL
        achievement.setContentType(file.getContentType());
        achievement.setStudentEmail(studentEmail);
        achievement.setSrno(srno);

        achievementRepository.save(achievement);

        return ResponseEntity.ok("Achievement added successfully");
    }

    // ================= GET ALL =================

    @Override
    public List<AchievementDTO> getAllAchievements() {
        return achievementRepository.findAll().stream().map(a -> {
            AchievementDTO dto = new AchievementDTO();
            dto.setAchievementId(a.getAchievementId());
            dto.setTitle(a.getTitle());
            dto.setCategory(a.getCategory());
            dto.setDescription(a.getDescription());
            dto.setPostedAt(a.getPostedAt());
            dto.setSrno(a.getSrno());
            return dto;
        }).toList();
    }

    // ================= FILTER =================

    @Override
    public List<AchievementDTO> getAchievementsByCategory(String category) {
        return achievementRepository.findByCategory(category).stream().map(a -> {
            AchievementDTO dto = new AchievementDTO();
            dto.setAchievementId(a.getAchievementId());
            dto.setTitle(a.getTitle());
            dto.setCategory(a.getCategory());
            dto.setDescription(a.getDescription());
            dto.setPostedAt(a.getPostedAt());
            dto.setSrno(a.getSrno());
            return dto;
        }).toList();
    }

    // ================= STUDENT =================

    @Override
    public List<AchievementDTO> getStudentAchievements(String email) {
        return achievementRepository.findByStudentEmail(email).stream().map(a -> {
            AchievementDTO dto = new AchievementDTO();
            dto.setAchievementId(a.getAchievementId());
            dto.setTitle(a.getTitle());
            dto.setCategory(a.getCategory());
            dto.setDescription(a.getDescription());
            dto.setPostedAt(a.getPostedAt());
            dto.setSrno(a.getSrno());
            return dto;
        }).toList();
    }

    // ================= VIEW =================

    @Override
    public ResponseEntity<?> viewAchievement(Long achievementId) {

        Achievements achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        // 🔥 Redirect to Cloudinary URL
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, achievement.getFilePath())
                .build();
    }
}