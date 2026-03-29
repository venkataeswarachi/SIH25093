package com.vvit.University.serviceImplementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vvit.University.models.*;
import com.vvit.University.payload.*;
import com.vvit.University.repository.*;
import com.vvit.University.services.StudentService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    // 🔥 Cloudinary
    @Autowired
    private Cloudinary cloudinary;

    // ================= PROFILE =================

    @Override
    public ResponseEntity<String> updateProfile(StudentDTO studentDTO, String email) {

        Students students = studentRepository.findByEmail(email).orElse(new Students());

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
        return ResponseEntity.ok("Profile updated successfully");
    }

    @Override
    public ResponseEntity<Students> getProfile(String email) {
        return ResponseEntity.ok(studentRepository.findByEmail(email).orElse(null));
    }

    // ================= DOCUMENT UPLOAD =================

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

        String srno = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getRno();

        // Replace resume
        if ("RESUME".equalsIgnoreCase(documentType)) {
            documentRepository.findBySrnoAndDocumentType(srno, "RESUME")
                    .ifPresent(documentRepository::delete);
        }

        // 🔥 Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")
        );

        String fileUrl = uploadResult.get("secure_url").toString();

        StudentDocument doc = new StudentDocument();
        doc.setSrno(srno);
        doc.setDocumentType(documentType);
        doc.setTitle(title);
        doc.setOriginalFilename(file.getOriginalFilename());
        doc.setStoredFilename(file.getOriginalFilename());
        doc.setFilePath(fileUrl); // ✅ URL
        doc.setContentType(file.getContentType());
        doc.setFileSize(file.getSize());

        documentRepository.save(doc);

        return ResponseEntity.ok("Document uploaded successfully");
    }

    // ================= VIEW DOCUMENT =================

    @Override
    public ResponseEntity<?> viewDocument(Long documentId, String email) {

        String srno = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getRno();

        StudentDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!doc.getSrno().equals(srno)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // 🔥 Redirect to Cloudinary URL
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, doc.getFilePath())
                .build();
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

    // ================= DOCUMENT LIST =================

    @Override
    public List<StudentDocumentDTO> getDocumentMetadata(String email) {

        String srno = studentRepository.findByEmail(email).orElseThrow().getRno();

        return documentRepository.findBySrno(srno).stream().map(doc -> {
            StudentDocumentDTO dto = new StudentDocumentDTO();
            dto.setDocumentId(doc.getDocumentId());
            dto.setDocumentType(doc.getDocumentType());
            dto.setTitle(doc.getTitle());
            dto.setOriginalFilename(doc.getOriginalFilename());
            dto.setUploadedAt(doc.getUploadedAt());
            return dto;
        }).toList();
    }

    // ================= TIMETABLE VIEW =================

    public ResponseEntity<?> viewStudentTimetable(
            String branch,
            int year,
            int semester,
            String section
    ) {

        TimeTable tt = timeTableRepository.findForStudent(branch, year, semester, section)
                .orElseThrow(() -> new RuntimeException("Timetable not available"));

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, tt.getFilePath())
                .build();
    }

    // ================= OTHER METHODS (UNCHANGED) =================

    @Override
    public List<Subject> viewEnrolledSubjects(String email) {
        String rno = studentRepository.findByEmail(email).orElseThrow().getRno();
        Academics academics = academicRepository.findBySrno(rno).orElse(new Academics());

        return subjectRepository.findByBatchAndBranchAndYearAndSemester(
                academics.getBatch(),
                academics.getBranch(),
                academics.getYear(),
                academics.getSemester()
        );
    }

    @Override
    public Faculty getFacultyInfo(String username) {
        return facultyRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    @Override
    public List<Projects> getProjectDetails(String email) {
        return projectRepository.findByEmail(email);
    }

    @Override
    public String addProject(ProjectDTO projectDTO, String email) {
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