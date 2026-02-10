package com.vvit.University.services;


import java.util.Map;

public interface MLService {
    public Map<String, Object> generateResumeFromML(String email);
}
