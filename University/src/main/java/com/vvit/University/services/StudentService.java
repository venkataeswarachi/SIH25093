package com.vvit.University.services;

import com.vvit.University.models.*;
import com.vvit.University.payload.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StudentService {

    // ================= PROFILE =================
    ResponseEntity<String> updateProfile(StudentDTO studentDTO, String email);
    ResponseEntity<Students> getProfile(String email);

    // ================= ACADEMICS =================
    ResponseEntity<AcademicDTO> getAcademicDetails(String email);

    // ================= RESULTS =================
    List<InternalResultDTO> getInternalResults(String email, int semester);
    List<ExternalResultDTO> getExternalResults(String email, int semester);

    // ================= DOCUMENT =================
    ResponseEntity<String> uploadDocument(
            String email,
            String documentType,
            String title,
            MultipartFile file
    ) throws IOException;

    List<StudentDocumentDTO> getDocumentMetadata(String email);

    ResponseEntity<?> viewDocument(
            Long documentId,
            String email
    );

    // ================= TIMETABLE =================
    ResponseEntity<?> viewStudentTimetable(
            String branch,
            int year,
            int semester,
            String section
    );

    // ================= SUBJECT =================
    List<Subject> viewEnrolledSubjects(String email);

    // ================= FACULTY =================
    Faculty getFacultyInfo(String username);

    // ================= ATTENDANCE =================
    AttendanceSummaryDTO getStudentAttendance(
            String email,
            int year,
            int semester
    );

    // ================= PROJECT =================
    List<Projects> getProjectDetails(String email);
    String addProject(ProjectDTO projectDTO, String email);
}