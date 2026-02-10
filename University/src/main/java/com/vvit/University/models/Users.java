package com.vvit.University.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;
    @Column(unique = true)
    private String email;
    private String password;
    private String role;
    private LocalDate createdAt;
    private boolean firstlogin;

    public Users(Long uid, String email, String password, String role, Date createdAt,boolean firstlogin) {
        this.uid = uid;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDate.now();
        this.firstlogin = firstlogin;
    }

    public Users() {
        createdAt = LocalDate.now();
    }

    public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isFirstlogin() {
        return firstlogin;
    }

    public void setFirstlogin(boolean firstlogin) {
        this.firstlogin = firstlogin;
    }
}
