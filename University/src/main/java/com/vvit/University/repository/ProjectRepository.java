package com.vvit.University.repository;

import com.vvit.University.models.Projects;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Projects,Long> {
    List<Projects> findByEmail(String email);
}
