package com.vvit.University.payload;

import java.time.LocalDate;
import java.util.Map;

public class AttendanceRequestDTO {

    private String subjectCode;
    private LocalDate date;
    private int period;

    private int year;
    private int semester;
    private String branch;
    private String section;

    // rollNo -> PRESENT / ABSENT
    private Map<String, String> studentStatus;

    public AttendanceRequestDTO() {
    }

    public AttendanceRequestDTO(String subjectCode, LocalDate date, int period, int year, int semester, String branch, String section, Map<String, String> studentStatus) {
        this.subjectCode = subjectCode;
        this.date = date;
        this.period = period;
        this.year = year;
        this.semester = semester;
        this.branch = branch;
        this.section = section;
        this.studentStatus = studentStatus;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Map<String, String> getStudentStatus() {
        return studentStatus;
    }

    public void setStudentStatus(Map<String, String> studentStatus) {
        this.studentStatus = studentStatus;
    }
}


