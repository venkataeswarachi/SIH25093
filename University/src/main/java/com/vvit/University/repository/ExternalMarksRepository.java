package com.vvit.University.repository;

import com.vvit.University.models.ExternalMarks;
import com.vvit.University.models.InternalMarks;
import com.vvit.University.models.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExternalMarksRepository extends JpaRepository<ExternalMarks,Long> {
    Optional<ExternalMarks> findByMarksAndSubjectName(Marks marks, String subjectName);
    @Query("""
    SELECT DISTINCT em.sgpa
    FROM ExternalMarks em
    WHERE em.srno = :srno
      AND em.semester = :semester
    """)
    Double findSgpaBySrnoAndSemester(
            @Param("srno") String srno,
            @Param("semester") int semester
    );

    List<ExternalMarks> findBySrnoAndSemester(String Srno,int semester);
}
