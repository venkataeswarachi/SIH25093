package com.vvit.University.payload;

import java.time.LocalDateTime;

public class AchievementDTO {

    private Long achievementId;
    private String title;
    private String category;
    private String description;
    private LocalDateTime postedAt;
    private String srno;
    public AchievementDTO() {
    }

    public AchievementDTO(Long achievementId, String title, String category, String description, LocalDateTime postedAt,String srno) {
        this.achievementId = achievementId;
        this.title = title;
        this.category = category;
        this.description = description;
        this.postedAt = postedAt;
        this.srno = srno;
    }

    public Long getAchievementId() {
        return achievementId;
    }

    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
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

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }
}
