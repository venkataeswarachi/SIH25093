package com.vvit.University.services;

import com.vvit.University.models.Faculty;
import com.vvit.University.models.Projects;
import com.vvit.University.models.Students;
import com.vvit.University.models.Subject;
import com.vvit.University.payload.*;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;


public interface StudentService {
    ResponseEntity<String> updateProfile(StudentDTO studentDTO,String email);
    ResponseEntity<Students> getProfile(String email);
    ResponseEntity<AcademicDTO> getAcademicDetails(String srno);
    List<InternalResultDTO>  getInternalResults(String email,int semester);
    List<ExternalResultDTO>  getExternalResults(String email,int semester);
    ResponseEntity<String> uploadDocument(
            String srno,
            String documentType,
            String title,
            MultipartFile file
    ) throws IOException;
    List<StudentDocumentDTO> getDocumentMetadata(String email);
     ResponseEntity<Resource> viewDocument(
            Long documentId,
            String email
    ) throws MalformedURLException;
    ResponseEntity<Resource> viewStudentTimetable(
            String branch,
            int year,
            int semester,
            String section
    ) throws IOException;
    List<Subject> viewEnrolledSubjects(String email);
    Faculty getFacultyInfo(String username);
    AttendanceSummaryDTO getStudentAttendance(String rno, int year, int semester);
    List<Projects> getProjectDetails(String email);
    String addProject(ProjectDTO projectDTO,String email);
}
