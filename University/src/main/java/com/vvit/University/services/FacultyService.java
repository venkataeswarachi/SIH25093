package com.vvit.University.services;

import com.vvit.University.payload.AttendanceRequestDTO;
import com.vvit.University.payload.FacultyDTO;
import com.vvit.University.payload.TopperDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Objects;

public interface FacultyService {
    ResponseEntity<String> editProfile(FacultyDTO facultyDTO);
    FacultyDTO getFacultyProfile(String email);
    List<TopperDTO> getToppers(String batch,String branch,int semester);
    void markAttendance(String facultyUsername, AttendanceRequestDTO dto);
    List<String> fetchStudents(String branch,String section,int year,int semester);
    //void verifyProfile(String email,boolean verified,String facemail);
}
