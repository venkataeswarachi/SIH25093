package com.vvit.University.repository;

import com.vvit.University.models.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {

    @Query("""
        SELECT t FROM TimeTable t
        WHERE t.branch = :branch
          AND t.year = :year
          AND t.semester = :semester
          AND (t.section = :section OR t.section IS NULL)
        ORDER BY t.section DESC
    """)
    Optional<TimeTable> findForStudent(
            String branch,
            int year,
            int semester,
            String section
    );
}

