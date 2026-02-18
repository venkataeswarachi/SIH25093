package com.vvit.University.payload;
public class AcademicsInfo {

    private String course;
    private String branch;
    private int year;

    public AcademicsInfo() {
    }

    public AcademicsInfo(String course, String branch, int year) {
        this.course = course;
        this.branch = branch;
        this.year = year;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}

