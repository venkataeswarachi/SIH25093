package com.vvit.University.payload;

import java.time.LocalDateTime;

public class StudentDocumentDTO {

    private Long documentId;
    private String documentType;
    private String title;
    private String originalFilename;
    private LocalDateTime uploadedAt;

    public StudentDocumentDTO() {
    }

    public StudentDocumentDTO(Long documentId, String documentType, String title, String originalFilename, LocalDateTime uploadedAt) {
        this.documentId = documentId;
        this.documentType = documentType;
        this.title = title;
        this.originalFilename = originalFilename;
        this.uploadedAt = uploadedAt;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
