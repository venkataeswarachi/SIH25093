package com.vvit.University.repository;

import com.vvit.University.models.InternalMarks;
import com.vvit.University.models.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface InternalMarksRepository extends JpaRepository<InternalMarks,Long> {
    Optional<InternalMarks> findByMarksAndSubjectName(Marks marks, String subjectName);


    List<InternalMarks> findBySrnoAndSemester(String Srno,int semester);

}
