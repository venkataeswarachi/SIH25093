package com.vvit.University.models;

import jakarta.persistence.*;

@Entity
public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String title;
    private String description;
    private String role;
    @Column(nullable = true)
    private String gitlink;
    @Column(nullable = true)
    private String deploylink;

    public Projects() {
    }

    public Projects(Long id, String email, String title, String description, String role, String gitlink, String deploylink) {
        this.id = id;

        this.email = email;
        this.title = title;
        this.description = description;
        this.role = role;
        this.gitlink = gitlink;
        this.deploylink = deploylink;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
