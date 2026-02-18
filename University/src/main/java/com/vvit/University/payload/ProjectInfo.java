package com.vvit.University.payload;
public class ProjectInfo {

    private String title;
    private String description;
    private String role;
    private String gitlink;
    private String deploylink;

    public ProjectInfo() {
    }

    public ProjectInfo(String title, String description, String role, String gitlink, String deploylink) {
        this.title = title;
        this.description = description;
        this.role = role;
        this.gitlink = gitlink;
        this.deploylink = deploylink;

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getGitlink() {
        return gitlink;
    }

    public void setGitlink(String gitlink) {
        this.gitlink = gitlink;
    }

    public String getDeploylink() {
        return deploylink;
    }

    public void setDeploylink(String deploylink) {
        this.deploylink = deploylink;
    }
}

