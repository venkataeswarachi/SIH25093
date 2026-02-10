package com.vvit.University.repository;

import com.vvit.University.models.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks,Long> {
    Optional<Marks> findBySidAndSemester(Long sid, int semester);
    @Query(value = """
    SELECT 
        s.rno,
        s.firstname,
        s.lastname,
        a.branch,
        m.semester,
        m.cgpa
    FROM marks m
    JOIN academics a ON m.academic_id = a.academic_id
    JOIN students s ON a.sid = s.sid
    WHERE a.batch = :batch
          AND m.branch = :branch
          AND m.semester = :semester
          ORDER BY m.cgpa DESC
    """, nativeQuery = true)
    List<Object[]> findToppers(
            String batch,
            String branch,
            int semester
    );
}
