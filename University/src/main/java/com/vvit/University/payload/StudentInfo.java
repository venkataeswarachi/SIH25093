package com.vvit.University.payload;

import java.util.List;

public class StudentInfo {

    private String name;
    private String email;
    private Long mobile;
    private List<String> skills;
    private String gitlink;
    private String portfolio;

    public StudentInfo() {
    }

    public StudentInfo(String name, String email, Long mobile, List<String> skills, String gitlink, String portfolio) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.skills = skills;
        this.gitlink = gitlink;
        this.portfolio = portfolio;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getMobile() {
        return mobile;
    }

    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getGitlink() {
        return gitlink;
    }

    public void setGitlink(String gitlink) {
        this.gitlink = gitlink;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }
}

