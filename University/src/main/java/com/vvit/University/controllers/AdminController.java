package com.vvit.University.controllers;


import com.vvit.University.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

        @Autowired
        private AdminService adminService;


        @PostMapping("/upload-users")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<String> upload(@RequestParam MultipartFile file,@RequestParam String role){
                return adminService.uploadUsers(file,role);
        }
        @PostMapping("/upload-academics")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<String> uploadAcademics(@RequestParam MultipartFile file){
                return adminService.uploadAcademics(file);
        }
        @PostMapping("/promote/{batch}")
        public ResponseEntity<String> promoteBatch(@PathVariable String batch) {

                int count = adminService.promoteStudents(batch);
                return ResponseEntity.ok(
                        "Batch " + batch + " promoted successfully. Students updated: " + count
                );
        }
        @PostMapping ("/update-detainedlist")
        public ResponseEntity<String > updateDetainedStudents(@RequestParam MultipartFile file){
                return adminService.uploadDetainList(file);
        }

        @PostMapping("/internalmarks")
        public  ResponseEntity<String> uploadIntermals(@RequestParam MultipartFile file){
                return adminService.uploadInternalMarks(file);
        }
        @PostMapping("/externalmarks")
        public ResponseEntity<String> uploadExternalMarks(@RequestParam MultipartFile file){
                return adminService.uploadExternalMarks(file);
        }
        @PostMapping("/upload/schedule")
        public ResponseEntity<String> uploadTimeTable(
                @RequestParam String branch,
                @RequestParam int year,
                @RequestParam int semester,
                @RequestParam String section,
                @RequestParam String title,
                @RequestParam MultipartFile file,
                Authentication authentication
        ) throws IOException {
                return adminService.uploadTimetable(
                        branch, year, semester, section, title, file, authentication.getName()
                );
        }
        @PostMapping("/enroll/subjects")
        public ResponseEntity<String> enrollsemSub(@RequestParam MultipartFile file){
                return adminService.enrollSemSubjects(file);
        }

        @GetMapping("/details")
        public ResponseEntity<Map> getDetails(){
               Map<String,Integer> details = new HashMap<>();
               details.put("students", adminService.NoOfStudents());
               details.put("faculty", adminService.NoOfFaculty());
               details.put("dept", adminService.NoOfDept());
               return ResponseEntity.ok(details);
        }
}
