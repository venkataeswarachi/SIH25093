package com.vvit.University.serviceImplementation;

import com.mysql.cj.protocol.x.Notice;
import com.vvit.University.models.*;
import com.vvit.University.repository.*;
import com.vvit.University.services.AdminService;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private static final int MAX_SEMESTER = 8;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AcademicRepository academicRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private MarksRepository marksRepository;
    @Autowired
    private InternalMarksRepository internalMarksRepository;
    @Autowired
    private ExternalMarksRepository externalMarksRepository;
    private static final String DIR = "timetables/";
    @Autowired
    private TimeTableRepository timeTableRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    private static final List<String> EXPECTED_HEADERS = List.of(
            "roll_no",
            "firstname",
            "lastname",
            "email",
            "department",
            "year"
    );


    private void validateHeaders(Row headerRow) {

        if (headerRow == null) {
            throw new RuntimeException("Excel file is empty");
        }

        for (int i = 0; i < EXPECTED_HEADERS.size(); i++) {
            Cell cell = headerRow.getCell(i);
            String actual = cell == null ? "" : cell.getStringCellValue().trim();

            if (!EXPECTED_HEADERS.get(i).equalsIgnoreCase(actual)) {
                throw new RuntimeException(
                        "Invalid Excel format. Expected column '" +
                                EXPECTED_HEADERS.get(i) +
                                "' but found '" + actual + "'"
                );
            }
        }
    }

    public ResponseEntity<String> uploadUsers(MultipartFile file, String role) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        if (!file.getOriginalFilename().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body("Only .xlsx files are allowed");
        }

        int createdCount = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);
                if (row == null) continue;

                // ================= COMMON =================
                Cell emailCell = row.getCell(3);
                if (emailCell == null) continue;

                String email = emailCell.getStringCellValue().trim();
                if (email.isEmpty()) continue;

                if (userRepository.existsByEmail(email)) continue;

                // ================= USERS TABLE =================
                Users user = new Users();
                user.setEmail(email);

                String tempPassword = UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8);

                user.setPassword(encoder.encode(tempPassword));
                user.setRole(role);
                user.setFirstlogin(true);

                userRepository.save(user);

                // ================= ROLE SPECIFIC =================
                if ("FACULTY".equalsIgnoreCase(role)) {

                    String department = row.getCell(0).getStringCellValue().trim();
                    String firstname  = row.getCell(1).getStringCellValue().trim();
                    String lastname   = row.getCell(2).getStringCellValue().trim();
                    String position   = row.getCell(4).getStringCellValue().trim();

                    if (facultyRepository.existsByEmail(email)) continue;

                    Faculty faculty = new Faculty();
                    faculty.setEmail(email);
                    faculty.setFirstname(firstname);
                    faculty.setLastname(lastname);
                    faculty.setBranch(department);
                    faculty.setPosition(position);


                    String username = generateUniqueUsername(firstname, lastname);
                    faculty.setUsername(username);

                    facultyRepository.save(faculty);
                }

                else if ("STUDENT".equalsIgnoreCase(role)) {

                    String rno       = row.getCell(0).getStringCellValue().trim();
                    String firstname = row.getCell(1).getStringCellValue().trim();
                    String lastname  = row.getCell(2).getStringCellValue().trim();

                    if (studentRepository.existsByEmail(email) ||
                            studentRepository.existsByRno(rno)) {
                        continue;
                    }

                    Students student = new Students();
                    student.setRno(rno);
                    student.setEmail(email);
                    student.setFirstname(firstname);
                    student.setLastname(lastname);
                    student.setVerfied(false);

                    studentRepository.save(student);
                }

                createdCount++;
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing file: " + e.getMessage());
        }

        return ResponseEntity.ok(createdCount + " users uploaded successfully");
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

    private String getStringValue(Cell cell) {
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }
    @Override
    public ResponseEntity<String> uploadAcademics(MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.status(403).body("File is empty");
        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);
            List<Academics> academicList = new ArrayList<>();

            for (Row row : sheet) {


                if (row.getRowNum() == 0) {
                    continue;
                }

                Academics academic = new Academics();
                academic.setSrno(getStringValue(row.getCell(0)));

                Optional<Students> studentOpt = studentRepository.findByRno(getStringValue(row.getCell(0)));

                if (studentOpt.isEmpty()) {
                    throw new RuntimeException("Student not found for RNO: " + getStringValue(row.getCell(0))+" ROW"+row.getRowNum());
                }

                Long sid = studentOpt.get().getSid();

                academic.setSid(sid);
                academic.setBranch(getStringValue(row.getCell(1)));
                academic.setBatch(getStringValue(row.getCell(2)));
                academic.setCourse(getStringValue(row.getCell(3)));
                academic.setYear((int) row.getCell(4).getNumericCellValue());
                academic.setSemester((int) row.getCell(5).getNumericCellValue());
                academic.setSection(getStringValue(row.getCell(6)));
                academic.setType(getStringValue(row.getCell(7)));
                academic.setAdmissiondate(
                        row.getCell(8).getLocalDateTimeCellValue().toLocalDate()
                );
                academic.setStatus(getStringValue(row.getCell(9)));

                academicList.add(academic);
            }

            academicRepository.saveAll(academicList);

            return ResponseEntity.ok("Academic data uploaded successfully. Total records: " + academicList.size());

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload academic data", e);
        }
    }

    @Transactional
    public int promoteStudents(String batch) {

        List<Academics> students =
                academicRepository.findByBatchAndStatus(batch, "ACTIVE");

        int promotedCount = 0;

        for (Academics a : students) {

            int currentSem = a.getSemester();
            int currentYear = a.getYear();
            String srno = a.getSrno();
            Long sid = a.getSid();

            //  Fetch SGPA for current semester
            Double sgpa = externalMarksRepository
                    .findSgpaBySrnoAndSemester(srno, currentSem);
            System.out.println(sgpa+"line 208");
            if (sgpa == null) {
                throw new RuntimeException(
                        "SGPA not found for SRNO " + srno + " semester " + currentSem
                );
            }

            // Fetch Marks record for current semester
            Marks marks = marksRepository
                    .findBySidAndSemester(sid, currentSem)
                    .orElseThrow(() ->
                            new RuntimeException("Marks not found for SID " + sid +
                                    " semester " + currentSem));


            //  Calculate CGPA
            int completedSemesters = currentSem; // assuming semester starts from 1

            System.out.println("line224,225 : "+" "+completedSemesters);
            double newCgpa;
            if (completedSemesters == 1) {
                newCgpa = sgpa;
            } else {
                Marks prevmarks = marksRepository
                        .findBySidAndSemester(sid, currentSem-1)
                        .orElseThrow(() ->
                                new RuntimeException("Marks not found for SID " + sid +
                                        " semester " + (currentSem-1)));
                double prevCgpa = prevmarks.getCgpa();
                System.out.println("line 237 prev cgpa:"+prevCgpa+" sem"+prevmarks.getSemester() );
                newCgpa = ((prevCgpa * (completedSemesters - 1)) + sgpa)
                        / completedSemesters;
                System.out.println("line 232: "+newCgpa);
            }

            //  Update CGPA
            marks.setCgpa(newCgpa);
            marksRepository.save(marks);

            // If final semester → mark completed
            if (currentSem >= MAX_SEMESTER) {
                a.setStatus("COMPLETED");
                academicRepository.save(a);
                promotedCount++;
                continue;
            }

            // increase year if semester is even
            if (currentSem % 2 == 0) {
                a.setYear(currentYear + 1);
            }

            // Promote semester
            a.setSemester(currentSem + 1);
            a.setStatus("ACTIVE");

            academicRepository.save(a);
            promotedCount++;
        }

        return promotedCount;
    }


    @Override
    public ResponseEntity<String> uploadDetainList(MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(403).body("File is empty");
        }
        int count =0;
        try(Workbook workbook = new XSSFWorkbook(file.getInputStream())){
            Sheet sheet = workbook.getSheetAt(0);
            List<Academics> detainedList = new ArrayList<>();
            for(Row row : sheet){
                if(row.getRowNum() == 0) continue;
                String rno = getStringValue(row.getCell(0));
                Academics academic = academicRepository.findBySrno(rno).orElseThrow(()->new RuntimeException("Record not found with roll no : "+rno));
                academic.setStatus("INACTIVE");
                detainedList.add(academic);
                count++;
            }
            academicRepository.saveAll(detainedList);
            return ResponseEntity.ok("Updated detained list succesfully. Updated Records Count : "+count);

        } catch (RuntimeException | IOException e) {
            throw new RuntimeException(e);
        }
    }




    @Override
    public ResponseEntity<String> uploadInternalMarks(MultipartFile file) {

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0) continue;

                String rno = getStringValue(row.getCell(0));
                int year = (int) row.getCell(1).getNumericCellValue();
                int semester = (int) row.getCell(2).getNumericCellValue();
                String branch = getStringValue(row.getCell(3));
                String subject = getStringValue(row.getCell(4));
                int seminar1 = (int) row.getCell(5).getNumericCellValue();
                int openbook1 = (int) row.getCell(6).getNumericCellValue();
                int descriptive1 = (int) row.getCell(7).getNumericCellValue();
                int objective1 = (int) row.getCell(8).getNumericCellValue();
                int seminar2 = (int) row.getCell(9).getNumericCellValue();
                int openbook2 = (int) row.getCell(10).getNumericCellValue();
                int descriptive2 = (int) row.getCell(11).getNumericCellValue();
                int objective2 = (int) row.getCell(12).getNumericCellValue();
                int total1 = (int) row.getCell(13).getNumericCellValue();
                int total2 = (int) row.getCell(14).getNumericCellValue();
                int finalInternalMarks = (int) row.getCell(15).getNumericCellValue();
                Academics academic = academicRepository.findBySrno(rno)
                        .orElseThrow(() -> new RuntimeException("Academic record not found for RNO: " + rno));

                Long sid = academic.getSid();

                //  Check if Marks already exists for semester
                Marks marks = marksRepository
                        .findBySidAndSemester(sid, semester)
                        .orElseGet(() -> {
                            Marks m = new Marks();
                            m.setSid(sid);
                            m.setAcademicId(academic.getAcademicId());
                            m.setYear(year);
                            m.setSemester(semester);
                            m.setBranch(branch);
                            m.setCgpa(0.0);

                            return marksRepository.save(m);
                        });


                InternalMarks internal = internalMarksRepository
                        .findByMarksAndSubjectName(marks, subject)
                        .orElse(new InternalMarks());
                internal.setMarks(marks);
                internal.setSubjectName(subject);
                internal.setSemester(semester);
                internal.setSeminar1(seminar1);
                internal.setOpenbook1(openbook1);
                internal.setDescriptive1(descriptive1);
                internal.setObjective1(objective1);
                internal.setTotal1(total1);
                internal.setSeminar2(seminar2);
                internal.setOpenbook2(openbook2);
                internal.setDescriptive2(descriptive2);
                internal.setObjective2(objective2);
                internal.setTotal2(total2);
                internal.setSrno(rno);
                internal.setFinalInternalMarks(finalInternalMarks);
                marks.getInternalMarks().add(internal);
                internal.setMarks(marks);


                marksRepository.save(marks);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to create marks details", e);
        }
        return ResponseEntity.ok("Internal Marks Updated Successfully");
    }

    @Override
    public ResponseEntity<String> uploadExternalMarks(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0) continue;

                String rno = getStringValue(row.getCell(0));
                int year = (int) row.getCell(1).getNumericCellValue();
                int semester = (int) row.getCell(2).getNumericCellValue();
                String branch = getStringValue(row.getCell(3));
                String subjectName = getStringValue(row.getCell(4));
                int total = (int)row.getCell(5).getNumericCellValue();
                String grade = getStringValue(row.getCell(6));
                String finalGrade = getStringValue(row.getCell(7));
                double sgpa = row.getCell(8).getNumericCellValue();

                Academics academic = academicRepository.findBySrno(rno)
                        .orElseThrow(() -> new RuntimeException("Academic record not found for RNO: " + rno));

                Long sid = academic.getSid();
                String srno = academic.getSrno();
                //  Check if Marks already exists for semester
                Marks marks = marksRepository
                        .findBySidAndSemester(sid, semester)
                        .orElseGet(() -> {
                            Marks m = new Marks();
                            m.setSid(sid);
                            m.setAcademicId(academic.getAcademicId());
                            m.setYear(year);
                            m.setSemester(semester);
                            m.setBranch(branch);
                            m.setCgpa(0.0);
                            m.setGrade(finalGrade);
                            return marksRepository.save(m);
                        });
                ExternalMarks external = externalMarksRepository
                        .findByMarksAndSubjectName(marks,subjectName)
                        .orElse(new ExternalMarks());
                external.setSubject(subjectName);
                external.setTotal(total);
                external.setGrade(grade);
                external.setYear(year);
                external.setSemester(semester);
                external.setReleaseDate();
                external.setSrno(srno);
                external.setSgpa(sgpa);
                external.setFinalGrade(finalGrade);
                marks.getExternalMarks().add(external);
                external.setMarks(marks);
                marksRepository.save(marks);
            }
        } catch (RuntimeException | IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("External Marks Released Successfully.");
    }
    @Transactional
    public ResponseEntity<String> uploadTimetable(
            String branch,
            int year,
            int semester,
            String section,
            String title,
            MultipartFile file,
            String adminEmail
    ) throws IOException {

        Files.createDirectories(Paths.get(DIR));

        String storedFile =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path path = Paths.get(DIR + storedFile);
        Files.copy(file.getInputStream(), path,
                StandardCopyOption.REPLACE_EXISTING);

        TimeTable tt = new TimeTable();
        tt.setBranch(branch);
        tt.setYear(year);
        tt.setSemester(semester);
        tt.setSection(section);
        tt.setTitle(title);
        tt.setOriginalFilename(file.getOriginalFilename());
        tt.setStoredFilename(storedFile);
        tt.setFilePath(path.toString());
        tt.setContentType(file.getContentType());
        tt.setUploadedBy(adminEmail);

        timeTableRepository.save(tt);

        return ResponseEntity.ok("Timetable uploaded successfully");
    }

    @Override
    public ResponseEntity<String> enrollSemSubjects(MultipartFile file) {
        if(file.isEmpty()) return ResponseEntity.status(403).body("File is Empty!");
        try(Workbook workbook = new XSSFWorkbook(file.getInputStream())){
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet){
                if(row.getRowNum()==0) {
                    continue;
                }
                Subject subject = new Subject();
                String batch = getStringValue(row.getCell(0));
                String branch = getStringValue(row.getCell(1));
                int year = (int)row.getCell(2).getNumericCellValue();
                int semester = (int) row.getCell(3).getNumericCellValue();
                String subjectname = getStringValue(row.getCell(4));
                String subjectcode = getStringValue(row.getCell(5));
                String facultyname = getStringValue(row.getCell(6));
                String username = getStringValue(row.getCell(7));
                int credits = (int) row.getCell(8).getNumericCellValue();
                subject.setBatch(batch);
                subject.setBranch(branch);
                subject.setYear(year);
                subject.setSemester(semester);
                subject.setFacultyName(facultyname);
                subject.setFacultyUsername(username);
                subject.setSubjectCode(subjectcode);
                subject.setSubjectName(subjectname);
                subject.setCredits(credits);
                subjectRepository.save(subject);
            }
            return  ResponseEntity.ok("Enrollment sucessful");

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int NoOfStudents() {
        return studentRepository.findAll().size();
    }

    @Override
    public int NoOfFaculty() {
        return facultyRepository.findAll().size();
    }

    @Override
    public int NoOfDept() {
        return academicRepository.countDistinctDepartments();
    }


}



