package com.vvit.University.payload;
public class AchievementInfo {

    private String title;
    private String category;
    private String description;

    public AchievementInfo() {
    }

    public AchievementInfo(String title, String category, String description) {
        this.title = title;
        this.category = category;
        this.description = description;
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
}

