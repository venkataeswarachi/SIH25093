package com.vvit.University.serviceImplementation;

import com.vvit.University.models.*;
import com.vvit.University.payload.AttendanceRequestDTO;
import com.vvit.University.payload.FacultyDTO;

import com.vvit.University.payload.TopperDTO;
import com.vvit.University.repository.*;
import com.vvit.University.services.FacultyService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FacultyServiceImpl implements FacultyService {
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private MarksRepository marksRepository;
    @Autowired
    private AttendanceRepository attendanceRepo;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AttendanceRecordRepository recordRepo;
    @Autowired
    private AcademicRepository academicRepository;
    @Override
    @Transactional
    public ResponseEntity<String> editProfile(FacultyDTO facultyDTO) {

        Faculty faculty = facultyRepository
                .findByEmail(facultyDTO.getEmail())
                .orElse(new Faculty());

        if (faculty.getFid() == null) {
            faculty.setEmail(facultyDTO.getEmail());

            String username = generateUniqueUsername(
                    facultyDTO.getFirstname(),
                    facultyDTO.getLastname()
            );
            faculty.setUsername(username);
        }

        faculty.setFirstname(facultyDTO.getFirstname());
        faculty.setLastname(facultyDTO.getLastname());
        faculty.setGender(facultyDTO.getGender());
        faculty.setBranch(facultyDTO.getBranch());
        faculty.setPosition(facultyDTO.getPosition());
        faculty.setAddress(facultyDTO.getAddress());
        faculty.setWorkexperience(facultyDTO.getWorkexperience());
        faculty.setAbout(facultyDTO.getAbout());
        faculty.setMartialstatus(facultyDTO.getMartialstatus());
        faculty.setBloodgroup(facultyDTO.getBloodgroup());
        faculty.setContactemail(facultyDTO.getContactemail());
        faculty.setMobile(facultyDTO.getMobile());

        facultyRepository.save(faculty);

        return ResponseEntity.ok("Faculty profile saved successfully");
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String base = (firstName + "." + lastName)
                .toLowerCase()
                .replaceAll("\\s+", "");

        String username = base;
        int count = 1;

        while (facultyRepository.existsByUsername(username)) {
            username = base + count;
            count++;
        }
        return username;
    }

    @Override
    public FacultyDTO getFacultyProfile(String email) {

        Faculty faculty = facultyRepository.findByEmail(email)
                .orElse(null);
        FacultyDTO dto = new FacultyDTO();
        dto.setEmail(email);
        if(faculty == null) return dto;

        dto.setFirstname(faculty.getFirstname());
        dto.setLastname(faculty.getLastname());
        dto.setUsername(faculty.getUsername());
        dto.setGender(faculty.getGender());
        dto.setBranch(faculty.getBranch());
        dto.setPosition(faculty.getPosition());
        dto.setAddress(faculty.getAddress());
        dto.setWorkexperience(faculty.getWorkexperience());
        dto.setAbout(faculty.getAbout());
        dto.setMartialstatus(faculty.getMartialstatus());
        dto.setBloodgroup(faculty.getBloodgroup());
        dto.setContactemail(faculty.getContactemail());
        dto.setMobile(faculty.getMobile());

        return dto;
    }

    @Override
    public List<TopperDTO> getToppers(
            String batch,
            String branch,
            int semester) {

        List<Object[]> rows =
                marksRepository.findToppers(batch, branch, semester);

        List<TopperDTO> result = new ArrayList<>();
        int rank = 1;

        for (Object[] row : rows) {
            TopperDTO dto = new TopperDTO();
            dto.setRank(rank++);
            dto.setRollNo((String) row[0]);
            dto.setName(row[1] + " " + row[2]);
            dto.setBranch((String) row[3]);
            dto.setSemester((int) row[4]);
            dto.setCgpa((double) row[5]);
            result.add(dto);
        }
        return result;
    }

        @Override
        @Transactional
        public void markAttendance(String facultyUsername,
                                   AttendanceRequestDTO dto) {

            if (attendanceRepo.existsBySubjectCodeAndDateAndPeriodAndBranchAndSection(
                    dto.getSubjectCode(),
                    dto.getDate(),
                    dto.getPeriod(),
                    dto.getBranch(),
                    dto.getSection())) {

                throw new RuntimeException("Attendance already marked");
            }

            List<String> officialSrnos =
                    academicRepository.findSrnosByBranchAndSectionAndYearAndSemester(
                            dto.getBranch(),
                            dto.getSection(),
                            dto.getYear(),
                            dto.getSemester()
                    );

            if (officialSrnos.isEmpty()) {
                throw new RuntimeException("No students found");
            }

            Map<String, String> requestStatus = dto.getStudentStatus();

            for (String srno : officialSrnos) {
                if (!requestStatus.containsKey(srno)) {
                    throw new RuntimeException("Missing attendance for " + srno);
                }
            }

            Attendance attendance = new Attendance();
            attendance.setSubjectCode(dto.getSubjectCode());
            attendance.setFacultyEmail(facultyUsername);
            attendance.setDate(dto.getDate());
            attendance.setPeriod(dto.getPeriod());
            attendance.setYear(dto.getYear());
            attendance.setSemester(dto.getSemester());
            attendance.setBranch(dto.getBranch());
            attendance.setSection(dto.getSection());

            attendance = attendanceRepo.save(attendance);

            List<AttendanceRecord> records = new ArrayList<>();

            for (String srno : officialSrnos) {
                AttendanceRecord record = new AttendanceRecord();
                record.setAttendance(attendance);
                record.setStudentRno(srno);
                record.setStatus(
                        AttendanceRecord.Status.valueOf(requestStatus.get(srno))
                );
                records.add(record);
            }

            recordRepo.saveAll(records);
        }
    @Override
    public List<String> fetchStudents(String branch, String section, int year, int semester){
        return academicRepository.findSrnosByBranchAndSectionAndYearAndSemester(branch, section, year, semester);
    }


}






