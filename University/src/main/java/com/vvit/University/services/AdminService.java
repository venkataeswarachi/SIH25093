package com.vvit.University.services;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AdminService {
    public ResponseEntity<String> uploadUsers(MultipartFile file,String role);
    public ResponseEntity<String> uploadAcademics(MultipartFile file);
    public int promoteStudents(String batch);
    public ResponseEntity<String> uploadDetainList(MultipartFile file);
    public ResponseEntity<String> uploadInternalMarks(MultipartFile file);
    public ResponseEntity<String> uploadExternalMarks(MultipartFile file);
    public ResponseEntity<String> uploadTimetable(
            String branch,
            int year,
            int semester,
            String section,
            String title,
            MultipartFile file,
            String adminEmail
    ) throws IOException;
    public ResponseEntity<String > enrollSemSubjects(MultipartFile file);
    int NoOfStudents();
    int NoOfFaculty();
    int NoOfDept();
}
