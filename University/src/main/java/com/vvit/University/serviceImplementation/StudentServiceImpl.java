package com.vvit.University.serviceImplementation;

import com.vvit.University.models.*;
import com.vvit.University.payload.*;
import com.vvit.University.repository.*;
import com.vvit.University.services.StudentService;
import java.io.IOException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AcademicRepository academicRepository;
    @Autowired
    private InternalMarksRepository internalMarksRepository;
    @Autowired
    private ExternalMarksRepository externalMarksRepository;
    @Autowired
    private StudentDocumentRepository documentRepository;
    @Autowired
    private TimeTableRepository timeTableRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private AttendanceRepository attendanceRepo;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private AttendanceRecordRepository recordRepo;
    @Override
    public ResponseEntity<String> updateProfile(StudentDTO studentDTO,String email) {
        Students students = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (students == null) {
            students = new Students();
        }

        students.setEmail(email);
        students.setRno(studentDTO.getRno());
        students.setFirstname(studentDTO.getFirstname());
        students.setLastname(studentDTO.getLastname());
        students.setSmobile(studentDTO.getSmobile());
        students.setFmobile(studentDTO.getFmobile());
        students.setReligion(studentDTO.getReligion());
        students.setMothertongue(studentDTO.getMothertongue());
        students.setMartialstatus(studentDTO.getMartialstatus());
        students.setPermanantAddress(studentDTO.getPermanantAddress());
        students.setPresentAddress(studentDTO.getPresentAddress());
        students.setBloodgroup(studentDTO.getBloodgroup());
        students.setCaste(studentDTO.getCaste());
        students.setFathername(studentDTO.getFathername());
        students.setMothername(studentDTO.getMothername());
        students.setGitlink(studentDTO.getGitlink());
        students.setResumelink(studentDTO.getResumelink());
        students.setPortfolio(studentDTO.getPortfolio());
        students.setSkills(studentDTO.getSkills());

        students.setVerfied(false);
        studentRepository.save(students);
        try {
            studentRepository.save(students);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile");
        }
    }

    @Override
    public ResponseEntity<Students> getProfile(String email) {
        return ResponseEntity.ok(studentRepository.findByEmail(email).orElse(null));
    }
    @Override
    public ResponseEntity<AcademicDTO> getAcademicDetails(String email) {


        Students student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String srno = student.getRno();


        Academics report = academicRepository.findBySrno(srno).orElseThrow(()->new RuntimeException("Record Not found with roll no"+srno));
        if (report == null) {
            throw new RuntimeException("Academic record not found");
        }


        AcademicDTO reportDTO = new AcademicDTO();
        reportDTO.setBatch(report.getBatch());
        reportDTO.setBranch(report.getBranch());
        reportDTO.setCourse(report.getCourse());
        reportDTO.setSection(report.getSection());
        reportDTO.setSemester(report.getSemester());
        reportDTO.setAdmissionDate(report.getAdmissiondate());
        reportDTO.setYear(report.getYear());
        reportDTO.setType(report.getType());
        reportDTO.setStatus(report.getStatus());
        reportDTO.setSrno(report.getSrno());

        return ResponseEntity.ok(reportDTO);
    }

    @Override
    public List<InternalResultDTO> getInternalResults(String email,int semester) {

        String rno = studentRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User should change password")).getRno();
        List<InternalMarks> marksList =
                internalMarksRepository.findBySrnoAndSemester(rno,semester);
        return marksList.stream().map(im -> {
            InternalResultDTO dto = new InternalResultDTO();
            dto.setSubjectName(im.getSubjectName());
            dto.setSemester(im.getSemester());
            dto.setSeminar1(im.getSeminar1());
            dto.setOpenbook1(im.getOpenbook1());
            dto.setDescriptive1(im.getDescriptive1());
            dto.setObjective1(im.getObjective1());
            dto.setTotal1(im.getTotal1());
            dto.setSeminar2(im.getSeminar2());
            dto.setOpenbook2(im.getOpenbook2());
            dto.setDescriptive2(im.getDescriptive2());
            dto.setObjective2(im.getObjective2());
            dto.setTotal2(im.getTotal2());
            dto.setFinalInternalMarks(im.getFinalInternalMarks());
            return dto;
        }).toList();
    }

    @Override
    public List<ExternalResultDTO> getExternalResults(String email,int semester) {
        String rno = studentRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not found in getExternalResult Method")).getRno();
        List<ExternalMarks> externalMarksList =
                externalMarksRepository.findBySrnoAndSemester(rno,semester);
        return externalMarksList.stream().map(em -> {
            ExternalResultDTO dto = new ExternalResultDTO();
            dto.setSrno(em.getSrno());
            dto.setSubjectName(em.getSubjectName());
            dto.setSemester(em.getSemester());
            dto.setYear(em.getYear());
            dto.setTotal(em.getTotal());
            dto.setGrade(em.getGrade());
            dto.setFinalGrade(em.getFinalGrade());
            return dto;
        }).toList();
    }
    @Transactional
    public ResponseEntity<String> uploadDocument(
            String email,
            String documentType,
            String title,
            MultipartFile file
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        String srno = studentRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Student not found : upload document")).getRno();
        // Handle resume replacement
        if ("RESUME".equalsIgnoreCase(documentType)) {

            documentRepository.findBySrnoAndDocumentType(srno, "RESUME")
                    .ifPresent(existing -> {
                        // optionally delete old file from disk
                        documentRepository.delete(existing);
                    });
        }


        String storedFilename =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path path = Paths.get("uploads/" + srno);
        Files.createDirectories(path);

        Path filePath = path.resolve(storedFilename);
        Files.copy(file.getInputStream(), filePath);

        StudentDocument doc = new StudentDocument();
        doc.setSrno(srno);
        doc.setDocumentType(documentType);
        doc.setTitle(title);
        doc.setOriginalFilename(file.getOriginalFilename());
        doc.setStoredFilename(storedFilename);
        doc.setFilePath(filePath.toString());
        doc.setContentType(file.getContentType());
        doc.setFileSize(file.getSize());

        documentRepository.save(doc);

        return ResponseEntity.ok("Document uploaded successfully");
    }
    @Override
    public List<StudentDocumentDTO> getDocumentMetadata(String email) {
        String srno = studentRepository.findByEmail(email).orElseThrow().getRno();
        List<StudentDocument> docs =
                documentRepository.findBySrno(srno);

        return docs.stream().map(doc -> {
            StudentDocumentDTO dto = new StudentDocumentDTO();
            dto.setDocumentId(doc.getDocumentId());
            dto.setDocumentType(doc.getDocumentType());
            dto.setTitle(doc.getTitle());
            dto.setOriginalFilename(doc.getOriginalFilename());
            dto.setUploadedAt(doc.getUploadedAt());
            return dto;
        }).toList();
    }
    @Override
    public ResponseEntity<Resource> viewDocument(
            Long documentId,
            String email
    ) throws MalformedURLException {
        String loggedInSrno = studentRepository.findByEmail(email).orElseThrow().getRno();
        StudentDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        // 🔐 Security check
        if (!doc.getSrno().equals(loggedInSrno)) {
            throw new RuntimeException("Access denied");
        }

        Path path = Paths.get(doc.getFilePath());
        if (!Files.exists(path)) {
            throw new RuntimeException("File missing on server");
        }

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + doc.getOriginalFilename() + "\""
                )
                .body(resource);
    }
    public ResponseEntity<Resource> viewStudentTimetable(
            String branch,
            int year,
            int semester,
            String section
    ) throws IOException {

        TimeTable tt = timeTableRepository.findForStudent(
                branch, year, semester, section
        ).orElseThrow(() ->
                new RuntimeException("Timetable not available"));

        Path path = Paths.get(tt.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(tt.getContentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                tt.getOriginalFilename() + "\""
                )
                .body(resource);
    }

    @Override
    public List<Subject> viewEnrolledSubjects(String email) {
        String rno = studentRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not found : viewEnrolledsubject()")).getRno();
        Academics academics = academicRepository.findBySrno(rno).orElse(new Academics());
        String batch = academics.getBatch();
        String branch = academics.getBranch();
        int year = academics.getYear();
        int semester = academics.getSemester();
        List<Subject> subjects = subjectRepository.findByBatchAndBranchAndYearAndSemester(batch,branch,year,semester);

        return subjects;
    }

    @Override
    public Faculty getFacultyInfo(String username) {
        return facultyRepository.findByUsername(username).orElseThrow(()->new RuntimeException("Faculty Not found : view faculty info() : student"));
    }
    @Override
    public AttendanceSummaryDTO getStudentAttendance(
            String email, int year, int semester) {

        // 1️⃣ Get student roll number
        String rno = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getRno();

        // 2️⃣ Fetch attendance records (DB filtered)
        List<AttendanceRecord> records =
                recordRepo.findByStudentRnoAndYearAndSemester(
                        rno, year, semester);

        // 3️⃣ Group by subject
        Map<String, List<AttendanceRecord>> bySubject =
                records.stream().collect(
                        Collectors.groupingBy(
                                r -> r.getAttendance().getSubjectCode()
                        )
                );

        List<SubjectAttendanceDTO> subjectList = new ArrayList<>();

        int overallTotal = 0;
        int overallPresent = 0;

        // 4️⃣ Subject-wise calculation
        for (Map.Entry<String, List<AttendanceRecord>> entry : bySubject.entrySet()) {

            String subjectCode = entry.getKey();
            List<AttendanceRecord> list = entry.getValue();

            long presentCount = list.stream()
                    .filter(r -> r.getStatus() ==
                            AttendanceRecord.Status.PRESENT)
                    .count();

            SubjectAttendanceDTO dto = new SubjectAttendanceDTO();
            dto.setSubjectCode(subjectCode);
            dto.setTotalClasses(list.size());
            dto.setPresent((int) presentCount);
            dto.setPercentage(
                    list.isEmpty() ? 0 :
                            (presentCount * 100.0) / list.size()
            );

            subjectList.add(dto);

            overallTotal += list.size();
            overallPresent += presentCount;
        }

        // 5️⃣ Overall attendance
        OverallAttendanceDTO overall = new OverallAttendanceDTO();
        overall.setTotalClasses(overallTotal);
        overall.setPresent(overallPresent);
        overall.setPercentage(
                overallTotal == 0 ? 0 :
                        (overallPresent * 100.0) / overallTotal
        );

        // 6️⃣ Final response
        AttendanceSummaryDTO summary = new AttendanceSummaryDTO();
        summary.setOverall(overall);
        summary.setSubjects(subjectList);

        return summary;
    }

    @Override
    public List<Projects> getProjectDetails(String email) {
        return projectRepository.findByEmail(email);
    }

    @Override
    public String addProject(ProjectDTO projectDTO,String email) {
        Projects project = new Projects();
        project.setEmail(email);
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setRole(projectDTO.getRole());
        project.setGitlink(projectDTO.getGitlink());
        project.setDeploylink(projectDTO.getDeploylink());
        projectRepository.save(project);
        return "Project saved successfully.";
    }


}





