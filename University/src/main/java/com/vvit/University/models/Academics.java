package com.vvit.University.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class Academics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long academicId;
    private Long sid;
    private String srno;
    private String branch;
    private String batch;
    private String course;
    private int year;
    private int semester;
    private String section;
    private String type;
    private String status;
    private LocalDate admissiondate;

    public Academics() {
    }

    public Academics(Long academicId, Long sid, String srno, String branch, String batch, String course, int year, int semester, String section, String type, String status, LocalDate admissiondate) {
        this.academicId = academicId;
        this.sid = sid;
        this.srno = srno;
        this.branch = branch;
        this.batch = batch;
        this.course = course;
        this.year = year;
        this.semester = semester;
        this.section = section;
        this.type = type;
        this.status = status;
        this.admissiondate = admissiondate;
    }

    public Long getAcademicId() {
        return academicId;
    }

    public void setAcademicId(Long academicId) {
        this.academicId = academicId;
    }

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getAdmissiondate() {
        return admissiondate;
    }

    public void setAdmissiondate(LocalDate admissiondate) {
        this.admissiondate = admissiondate;
    }
}
