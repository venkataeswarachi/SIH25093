package com.vvit.University.repository;

import com.vvit.University.models.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentDocumentRepository extends JpaRepository<StudentDocument,Long> {
    Optional<StudentDocument> findBySrnoAndDocumentType(String srno,String documentType);
    List<StudentDocument> findBySrno(String srno);
}
