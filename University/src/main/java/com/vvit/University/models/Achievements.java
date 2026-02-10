package com.vvit.University.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Achievements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    private String title;

    private String category; // INTERNSHIP, HACKATHON, OPEN_SOURCE, etc.

    @Column(length = 2000)
    private String description;

    private String fileName;        // original image name
    private String storedFileName;  // UUID file name
    private String filePath;
    private String contentType;

    private String studentEmail;
    private String srno;
    private LocalDateTime postedAt = LocalDateTime.now();

    public Achievements() {
    }

    public Achievements(Long achievementId, String title, String category, String description, String fileName, String storedFileName, String filePath, String contentType, String studentEmail, LocalDateTime postedAt,String srno) {
        this.achievementId = achievementId;
        this.title = title;
        this.category = category;
        this.description = description;
        this.fileName = fileName;
        this.storedFileName = storedFileName;
        this.filePath = filePath;
        this.srno = srno;
        this.contentType = contentType;
        this.studentEmail = studentEmail;
        this.postedAt = postedAt;
    }

    public Long getAchievementId() {
        return achievementId;
    }

    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
    }
}
