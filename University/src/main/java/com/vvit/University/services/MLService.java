package com.vvit.University.services;

import java.util.Map;

public interface MLService {

    Map<String, Object> generateResumeFromML(String email);

    Object rankProjectsFromDB(String email, String role);

    Map<String, Object> atsScoreFromDB(String email, String role);

    Object classifySkillsFromDB(String email);

}