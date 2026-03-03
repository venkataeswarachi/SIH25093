package com.vvit.University.serviceImplementation;

import com.vvit.University.ml.MLClient;

import com.vvit.University.ml.ResumeSectionParser;
import com.vvit.University.ml.ResumeTextCleaner;
import com.vvit.University.models.Academics;
import com.vvit.University.models.Achievements;
import com.vvit.University.models.Projects;
import com.vvit.University.models.Students;
import com.vvit.University.payload.*;
import com.vvit.University.repository.AcademicRepository;
import com.vvit.University.repository.AchievementRepository;
import com.vvit.University.repository.ProjectRepository;
import com.vvit.University.repository.StudentRepository;
import com.vvit.University.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
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
    private ProjectRepository projectRepository;

    @Autowired
    private MLClient mlClient;

    @Override
    public Map<String, Object> generateResumeFromML(String email) {

        // 1. Build DTO from DB
        ResumeDTO dto = buildResumeDTO(email);

        // 2. Convert DTO → ML Request
        ResumeMLRequest mlRequest = buildMLRequest(dto);

        // 3. Call ML
        Map<String, Object> mlResponse =
                mlClient.generateResumeFromDTO(mlRequest);

        // 4. Extract summary
        String summary = mlResponse.get("summary").toString();

        // 5. Return structured response
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("student", mlRequest.getStudent());
        response.put("academics", mlRequest.getAcademics());
        response.put("projects", mlRequest.getProjects());
        response.put("achievements", mlRequest.getAchievements());
        response.put("summary", summary);

        return response;
    }

    // -----------------------------------------------------------------------
    // wrappers for newly added ml-service features
    // -----------------------------------------------------------------------

    @Override
    public Object classifySkillsFromDB(String email) {

        ResumeDTO dto = buildResumeDTO(email);
        ResumeMLRequest mlRequest = buildMLRequest(dto);

        return mlClient.postForObject("/classify-skills", mlRequest);
    }

    @Override
    public Object rankProjectsFromDB(String email, String role) {

        ResumeDTO dto = buildResumeDTO(email);
        ResumeMLRequest mlRequest = buildMLRequest(dto);
        mlRequest.setTarget_role(role);

        return mlClient.postForObject("/rank-projects", mlRequest);
    }

    @Override
    public Map<String, Object> atsScoreFromDB(String email, String role) {

        ResumeDTO dto = buildResumeDTO(email);
        ResumeMLRequest mlRequest = buildMLRequest(dto);
        mlRequest.setTarget_role(role);

        return mlClient.postForMap("/ats-score", mlRequest);
    }



    private ResumeMLRequest buildMLRequest(ResumeDTO dto) {

        ResumeMLRequest request = new ResumeMLRequest();

        // student
        StudentInfo student = new StudentInfo();
        student.setName(dto.getFirstname() + " " + dto.getLastname());
        student.setEmail(dto.getEmail());
        student.setMobile(dto.getMobile());
        student.setSkills(dto.getSkills());
        student.setGitlink(dto.getGitlink());
        student.setPortfolio(dto.getPortfolio());

        request.setStudent(student);

        // academics
        AcademicsInfo academics = new AcademicsInfo();
        academics.setCourse(dto.getCourse());
        academics.setBranch(dto.getBranch());
        academics.setYear(dto.getYear());

        request.setAcademics(academics);

        // projects
        if (dto.getProjects() != null) {
            List<ProjectInfo> projects = dto.getProjects().stream().map(p -> {
                ProjectInfo pi = new ProjectInfo();
                pi.setTitle(p.getTitle());
                pi.setDescription(p.getDescription());
                pi.setRole(p.getRole());
                pi.setGitlink(p.getGitlink());
                pi.setDeploylink(p.getDeploylink());
                return pi;
            }).toList();

            request.setProjects(projects);
        }

        // achievements
        if (dto.getAchievementDTOS() != null) {
            List<AchievementInfo> achievements = dto.getAchievementDTOS()
                    .stream()
                    .map(a -> {
                        AchievementInfo ai = new AchievementInfo();
                        ai.setTitle(a.getTitle());
                        ai.setCategory(a.getCategory());
                        ai.setDescription(a.getDescription());
                        return ai;
                    }).toList();

            request.setAchievements(achievements);
        }

        request.setTarget_role("Full Stack Developer");
        request.setTemplate("professional");

        return request;
    }

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
}