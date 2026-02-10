package com.vvit.University.repository;

import com.vvit.University.models.Academics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AcademicRepository extends JpaRepository<Academics,Long> {
    Optional<Academics> findBySrno(String srno);
    List<Academics> findByBatchAndStatus(String batch, String status);
    @Query("""
    SELECT a.srno 
    FROM Academics a 
    WHERE a.branch = :branch 
      AND a.section = :section 
      AND a.year = :year 
      AND a.semester = :semester
""")
    List<String> findSrnosByBranchAndSectionAndYearAndSemester(
        @Param("branch") String branch,
        @Param("section") String section,
        @Param("year") int year,
        @Param("semester") int semester);

}
