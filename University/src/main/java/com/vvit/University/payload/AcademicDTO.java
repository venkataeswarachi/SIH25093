package com.vvit.University.payload;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Date;

public class AcademicDTO {

    private String srno;
    private String branch;
    private String batch;
    private String course;
    private int year;
    private int semester;
    private String section;
    private String type;
    private LocalDate admissionDate;
    private String status;

    public AcademicDTO() {
    }

    public AcademicDTO( String srno, String branch, String batch, String course, int year, int semester, String section, String type, LocalDate admissionDate, String status) {

        this.srno = srno;
        this.branch = branch;
        this.batch = batch;
        this.course = course;
        this.year = year;
        this.semester = semester;
        this.section = section;
        this.type = type;
        this.admissionDate = admissionDate;
        this.status = status;
    }



    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
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

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
