package com.vvit.University.repository;

import com.vvit.University.models.Notices;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notices,Long> {

}
