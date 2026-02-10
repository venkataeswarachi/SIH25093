package com.vvit.University.controllers;


import com.vvit.University.models.Faculty;
import com.vvit.University.models.Projects;
import com.vvit.University.models.Students;
import com.vvit.University.models.Subject;
import com.vvit.University.payload.*;
import com.vvit.University.services.AchievementService;
import com.vvit.University.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;
    @Autowired
    private AchievementService achievementService;
    @PostMapping("/editprofile")
    @PreAuthorize("hasRole('STUDENT')")
    ResponseEntity<String> editProfile(@RequestBody StudentDTO studentDTO, Authentication authentication){
        String email = authentication.getName();
        return studentService.updateProfile(studentDTO,email);
    }

    @GetMapping("/profile")
    ResponseEntity<Students> getProfile(Authentication authentication){
        return studentService.getProfile(authentication.getName());
    }
    @GetMapping("/academics")
    ResponseEntity<AcademicDTO> getAcademicInfo(Authentication authentication){
        return studentService.getAcademicDetails(authentication.getName());
    }
    @GetMapping("/internalmarks/{semester}")
    List<InternalResultDTO> getInternalmarks(Authentication authentication, @PathVariable int semester){
        return studentService.getInternalResults(authentication.getName(), semester);
    }
    @GetMapping("/externalmarks/{semester}")
    List<ExternalResultDTO> getExternalResult(Authentication authentication,@PathVariable int semester){
        return studentService.getExternalResults(authentication.getName(),semester);
    }
    @PostMapping("/upload/document")
    public ResponseEntity<String> uploadDocument(Authentication authentication, @RequestParam String documenttype, @RequestParam String title, @RequestParam MultipartFile file) throws IOException {
        return studentService.uploadDocument(authentication.getName(), documenttype,title,file);
    }
    @GetMapping("/get/documents")
    public ResponseEntity<List<StudentDocumentDTO>> listDocuments( Authentication authentication) {
        return ResponseEntity.ok(studentService.getDocumentMetadata(authentication.getName()));
    }
    @GetMapping("document/{id}/view")
    public ResponseEntity<Resource> viewDocument(
            @PathVariable Long id,
            Authentication authentication
    ) throws IOException {
        return studentService.viewDocument(id, authentication.getName());
    }
    @GetMapping("/schedule/view")
    public ResponseEntity<Resource> viewForStudent(
            @RequestParam String branch,
            @RequestParam int year,
            @RequestParam int semester,
            @RequestParam String section
    ) throws IOException {
        return studentService.viewStudentTimetable(
                branch, year, semester, section
        );
    }
    @GetMapping("/semester/subjects")
    public List<Subject> getEnrolledSubjects(Authentication authentication){
        return studentService.viewEnrolledSubjects(authentication.getName());
    }
    @GetMapping("/get/info")
    public Faculty getFacultyInfo(@RequestParam String username){
        return studentService.getFacultyInfo(username);
    }
    @GetMapping("/view/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttendanceSummaryDTO> view(
            Authentication authentication,@RequestParam int year,@RequestParam int semester) {

        return ResponseEntity.ok(studentService.getStudentAttendance(authentication.getName(),year,semester));
    }
    @PostMapping("/post-achievement")
    public ResponseEntity<String> addAchievement(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam MultipartFile file,
            Authentication authentication
    ) throws IOException {

        return achievementService.addAchievement(
                title,
                category,
                description,
                file,
                authentication.getName()   // email from JWT
        );
    }
    @GetMapping("/achievement")
    public List<AchievementDTO> getMyAchievements(
            Principal principal
    ) {
        return achievementService
                .getStudentAchievements(principal.getName());
    }

    // 🖼 View Achievement Image (inline)
    @GetMapping("/achievement/view/{id}")
    public ResponseEntity<Resource> viewAchievement(
            @PathVariable Long id
    ) throws IOException {

        return achievementService.viewAchievement(id);
    }
    @PostMapping("/post/project")
    public ResponseEntity<String> postProject(@RequestBody ProjectDTO projectDTO,Authentication authentication){
        String res = studentService.addProject(projectDTO, authentication.getName());
        return ResponseEntity.ok(res);
    }
    @GetMapping("/projects")
    public List<Projects> getMyProjects(Authentication authentication){
        return studentService.getProjectDetails(authentication.getName());
    }
}
