package com.vvit.University.repository;

import com.vvit.University.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject,Long> {
    List<Subject> findByBatchAndBranchAndYearAndSemester(String batch,String branch,int year,int semester);
}
