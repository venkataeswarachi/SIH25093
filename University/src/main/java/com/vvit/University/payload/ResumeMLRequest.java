package com.vvit.University.payload;

import java.util.List;

public class ResumeMLRequest {

    private StudentInfo student;
    private AcademicsInfo academics;
    private List<ProjectInfo> projects;
    private List<AchievementInfo> achievements;

    private String target_role;
    private String template;

    public ResumeMLRequest() {
    }

    public ResumeMLRequest(StudentInfo student, AcademicsInfo academics, List<ProjectInfo> projects, List<AchievementInfo> achievements, String target_role, String template) {
        this.student = student;
        this.academics = academics;
        this.projects = projects;
        this.achievements = achievements;
        this.target_role = target_role;
        this.template = template;
    }

    public StudentInfo getStudent() {
        return student;
    }

    public void setStudent(StudentInfo student) {
        this.student = student;
    }

    public AcademicsInfo getAcademics() {
        return academics;
    }

    public void setAcademics(AcademicsInfo academics) {
        this.academics = academics;
    }

    public List<ProjectInfo> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectInfo> projects) {
        this.projects = projects;
    }

    public List<AchievementInfo> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<AchievementInfo> achievements) {
        this.achievements = achievements;
    }

    public String getTarget_role() {
        return target_role;
    }

    public void setTarget_role(String target_role) {
        this.target_role = target_role;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }
}

