package com.vvit.University.repository;

import com.vvit.University.models.Students;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Students,Long> {
    Optional<Students> findByEmail(String email);
    Optional<Students> findByRno(String srno);

    boolean existsByEmail(String email);

    boolean existsByRno(String rno);
    //List<Students> findByVerifiedFalse();
}
