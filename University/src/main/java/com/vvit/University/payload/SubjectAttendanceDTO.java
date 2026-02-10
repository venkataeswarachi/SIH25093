package com.vvit.University.payload;
public class SubjectAttendanceDTO {

    private String subjectCode;
    private int totalClasses;
    private int present;

    private double percentage;

    public SubjectAttendanceDTO() {
    }

    public SubjectAttendanceDTO(String subjectCode, int totalClasses, int present, double percentage) {
        this.subjectCode = subjectCode;
        this.totalClasses = totalClasses;
        this.present = present;
        this.percentage = percentage;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
    }

    public int getPresent() {
        return present;
    }

    public void setPresent(int present) {
        this.present = present;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

