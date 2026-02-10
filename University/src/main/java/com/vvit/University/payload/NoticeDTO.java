package com.vvit.University.payload;

import java.time.LocalDateTime;

public class NoticeDTO {
    private Long noticeId;
    private String title;
    private String description;
    private LocalDateTime postedAt;

    public NoticeDTO() {
    }

    public NoticeDTO(Long noticeId, String title, String description, LocalDateTime postedAt) {
        this.noticeId = noticeId;
        this.title = title;
        this.description = description;
        this.postedAt = postedAt;
    }

    public Long getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(Long noticeId) {
        this.noticeId = noticeId;
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

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }
}

