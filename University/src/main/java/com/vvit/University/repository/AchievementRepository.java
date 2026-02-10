package com.vvit.University.repository;


import com.vvit.University.models.Achievements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementRepository
        extends JpaRepository<Achievements, Long> {

    List<Achievements> findByCategory(String category);

    List<Achievements> findByStudentEmail(String email);
}
