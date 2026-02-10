package com.vvit.University.repository;

import com.vvit.University.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance,Long> {

        boolean existsBySubjectCodeAndDateAndPeriodAndBranchAndSection(
                String subjectCode,
                LocalDate date,
                int period,
                String branch,
                String section
        );

}
