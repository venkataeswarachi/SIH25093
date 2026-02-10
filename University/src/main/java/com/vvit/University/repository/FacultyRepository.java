package com.vvit.University.repository;

import com.vvit.University.models.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty,Long> {
    Optional<Faculty> findByEmail(String email);
    Optional<Faculty> findByUsername(String username);
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
