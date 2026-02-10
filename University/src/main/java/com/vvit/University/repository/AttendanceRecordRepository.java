package com.vvit.University.repository;

import com.vvit.University.models.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceRecordRepository
        extends JpaRepository< AttendanceRecord, Long> {

    @Query("""
        SELECT ar
        FROM AttendanceRecord ar
        WHERE ar.studentRno = :rno
    """)
    List<AttendanceRecord> findByStudentRno(String rno);
    @Query("""
    SELECT ar
    FROM AttendanceRecord ar
    WHERE ar.studentRno = :rno
      AND ar.attendance.year = :year
      AND ar.attendance.semester = :semester
""")
    List<AttendanceRecord> findByStudentRnoAndYearAndSemester(
            String rno, int year, int semester);

}

