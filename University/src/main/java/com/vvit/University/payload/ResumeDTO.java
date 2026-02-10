package com.vvit.University.payload;

import com.vvit.University.models.Projects;

import java.util.List;

public class ResumeDTO {
    //from students table filter by srno or email
    private String srno;
    private String firstname;
    private String lastname;
    private String email;
    private String gitlink;
    private String resumelink;
    private String portfolio;
    private Long mobile;
    private List<String> skills;
    //from academic table filter by sid or srno
    private String branch;
    private String course;
    private int year;
    //from achievement table filter by srno
    private List<AchievementDTO> achievementDTOS;
    private List<Projects> projects;
    public ResumeDTO() {
    }

    public ResumeDTO(String srno, String firstname, String lastname, String email, String gitlink, String resumelink, String portfolio, Long mobile, List<String> skills, String branch, String course, int year, List<AchievementDTO> achievementDTOS, List<Projects> projects) {
        this.srno = srno;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.gitlink = gitlink;
        this.resumelink = resumelink;
        this.portfolio = portfolio;
        this.mobile = mobile;
        this.skills = skills;
        this.branch = branch;
        this.course = course;
        this.year = year;
        this.achievementDTOS = achievementDTOS;
        this.projects = projects;
    }

    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGitlink() {
        return gitlink;
    }

    public void setGitlink(String gitlink) {
        this.gitlink = gitlink;
    }

    public String getResumelink() {
        return resumelink;
    }

    public void setResumelink(String resumelink) {
        this.resumelink = resumelink;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public Long getMobile() {
        return mobile;
    }

    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public List<AchievementDTO> getAchievementDTOS() {
        return achievementDTOS;
    }

    public void setAchievementDTOS(List<AchievementDTO> achievementDTOS) {
        this.achievementDTOS = achievementDTOS;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<Projects> getProjects() {
        return projects;
    }

    public void setProjects(List<Projects> projects) {
        this.projects = projects;
    }
}