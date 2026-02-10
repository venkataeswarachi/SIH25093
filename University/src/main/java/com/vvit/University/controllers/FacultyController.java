package com.vvit.University.controllers;


import com.vvit.University.payload.AchievementDTO;
import com.vvit.University.payload.AttendanceRequestDTO;
import com.vvit.University.payload.FacultyDTO;
import com.vvit.University.payload.TopperDTO;
import com.vvit.University.services.AchievementService;
import com.vvit.University.services.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;
    @Autowired
    private AchievementService achievementService;
    @PostMapping("/edit-profile")
    public ResponseEntity<String> editProfile(@RequestBody FacultyDTO facultyDTO){
        return facultyService.editProfile(facultyDTO);
    }

    @GetMapping("/profile")
    public FacultyDTO getProfile(Authentication authentication){
        return facultyService.getFacultyProfile(authentication.getName());
    }
    @GetMapping("/toppers")
    public ResponseEntity<List<TopperDTO>> viewToppers(
            @RequestParam String batch,
            @RequestParam String branch,
            @RequestParam int semester) {

        return ResponseEntity.ok(
                facultyService.getToppers(batch, branch, semester)
        );
    }
    @PostMapping("/mark/attendance")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<String> mark(
            Authentication authentication,
            @RequestBody AttendanceRequestDTO dto) {

        facultyService.markAttendance(
                authentication.getName(), dto);
        return ResponseEntity.ok("Attendance saved");
    }
    @GetMapping("/students")
    public List<String> getStudentsForAttendace(@RequestParam String branch,@RequestParam String section,@RequestParam int year ,@RequestParam int semester){
        return facultyService.fetchStudents(branch, section, year, semester);
    }
    @GetMapping("/achievements")
    public List<AchievementDTO> getAchievements(
            @RequestParam(required = false) String category
    ) {

        if (category != null) {
            return achievementService
                    .getAchievementsByCategory(category);
        }

        return achievementService.getAllAchievements();
    }

    // 🖼 View Achievement Image (inline)
    @GetMapping("/achievement/view/{id}")
    public ResponseEntity<Resource> viewAchievement(
            @PathVariable Long id
    ) throws IOException {

        return achievementService.viewAchievement(id);
    }

}
