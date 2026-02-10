package com.vvit.University.payload;

public class ProjectDTO {
    private String title;
    private String email;
    private String description;
    private String gitlink;
    private String deploylink;
    private String role;
    public ProjectDTO() {
    }

    public ProjectDTO(String title, String email, String description, String gitlink, String deploylink, String role) {
        this.title = title;
        this.email = email;
        this.description = description;
        this.gitlink = gitlink;
        this.deploylink = deploylink;
        this.role = role;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
