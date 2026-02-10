package com.vvit.University.serviceImplementation;

import com.vvit.University.ml.MLClient;

import com.vvit.University.ml.ResumeSectionParser;
import com.vvit.University.ml.ResumeTextCleaner;
import com.vvit.University.models.Academics;
import com.vvit.University.models.Achievements;
import com.vvit.University.models.Projects;
import com.vvit.University.models.Students;
import com.vvit.University.payload.AchievementDTO;
import com.vvit.University.payload.ResumeDTO;
import com.vvit.University.repository.AcademicRepository;
import com.vvit.University.repository.AchievementRepository;
import com.vvit.University.repository.ProjectRepository;
import com.vvit.University.repository.StudentRepository;
import com.vvit.University.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class MlServiceImpl implements MLService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AcademicRepository academicRepository;
    @Autowired
    private AchievementRepository achievementRepository;
    @Autowired
    private MLClient mlClient;
    @Autowired
    private ResumeTextCleaner cleaner;
    @Autowired
    private ProjectRepository projectRepository;
    @Override
    public Map<String, Object> generateResumeFromML(String email) {

        // 1️⃣ Build DTO from DB
        ResumeDTO dto = buildResumeDTO(email);

        // 2️⃣ Generate ONLY summary using ML
        String prompt = generateSummaryPrompt(dto);

        String rawSummary = mlClient.generateResumeText(prompt);
        if (rawSummary == null || rawSummary.isBlank()) {
            throw new RuntimeException("ML returned empty summary");
        }

        String summary = cleaner.clean(rawSummary);

        // 3️⃣ Build STRUCTURED resume (NO ML here)
        Map<String, Object> response = new java.util.LinkedHashMap<>();
        response.put("name",dto.getFirstname()+" "+dto.getLastname());
        response.put("email",dto.getEmail());
        response.put("mobile",dto.getMobile());
        response.put("summary", summary);
        response.put("education",
                dto.getCourse() + " in " + dto.getBranch() +
                        ", Year " + dto.getYear());

        response.put("achievements",
                dto.getAchievementDTOS() == null
                        ? List.of()
                        : dto.getAchievementDTOS()
                        .stream()
                        .map(AchievementDTO::getTitle)
                        .toList()
        );
        response.put("projects",
                dto.getProjects() == null
                ? List.of()
                :dto.getProjects()
                        .stream()
                        .map(Projects :: getTitle)
                .toList());
        List<String> links = new java.util.ArrayList<>();
        if (dto.getGitlink() != null && !dto.getGitlink().isEmpty()) {
            links.add(dto.getGitlink());
        }
        if (dto.getPortfolio() != null && !dto.getPortfolio().isEmpty()) {
            links.add(dto.getPortfolio());
        }

        response.put("links", links);

        return response;
    }

    // ---------------- HELPERS ----------------

    private ResumeDTO buildResumeDTO(String email) {

        Students student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Academics academics = academicRepository.findBySrno(student.getRno())
                .orElseThrow(() -> new RuntimeException("Academics not found"));

        List<Achievements> achievements =
                achievementRepository.findByStudentEmail(email);
        List<Projects> projects = projectRepository.findByEmail(email);
        ResumeDTO dto = new ResumeDTO();

        dto.setSrno(student.getRno());
        dto.setFirstname(student.getFirstname());
        dto.setLastname(student.getLastname());
        dto.setEmail(student.getEmail());
        dto.setGitlink(student.getGitlink());
        dto.setPortfolio(student.getPortfolio());
        dto.setMobile(student.getSmobile());
        dto.setSkills(student.getSkills());
        dto.setCourse(academics.getCourse());
        dto.setBranch(academics.getBranch());
        dto.setYear(academics.getYear());
        dto.setProjects(projects);

        if (achievements != null && !achievements.isEmpty()) {
            dto.setAchievementDTOS(
                    achievements.stream().map(a -> {
                        AchievementDTO ad = new AchievementDTO();
                        ad.setTitle(a.getTitle());
                        ad.setCategory(a.getCategory());
                        ad.setDescription(a.getDescription());
                        return ad;
                    }).toList()
            );
        }

        return dto;
    }

    private String generateSummaryPrompt(ResumeDTO dto) {

        StringBuilder details = new StringBuilder();

        details.append(dto.getCourse())
                .append(" ")
                .append(dto.getBranch())
                .append(" student, year ")
                .append(dto.getYear())
                .append(". ");

        if (dto.getAchievementDTOS() != null && !dto.getAchievementDTOS().isEmpty()) {
            details.append("Achievements include ");
            details.append(
                    dto.getAchievementDTOS().stream()
                            .limit(3)
                            .map(AchievementDTO::getTitle)
                            .collect(Collectors.joining(", "))
            ).append(". ");
        }

        if (dto.getGitlink() != null) {
            details.append("GitHub profile available. ");
        }

        if (dto.getPortfolio() != null) {
            details.append("Portfolio available. ");
        }

        // 🔥 T5-friendly task prefix
        return "resume_summary: " + details.toString();
    }
}
