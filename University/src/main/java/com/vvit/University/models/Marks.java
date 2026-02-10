package com.vvit.University.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long marksId;
    private Long academicId;
    private Long sid;
    private int year;
    private int semester;
    private String branch;
    private double cgpa;
    private String grade;
    @OneToMany(mappedBy = "marks", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<InternalMarks> internalMarks = new ArrayList<>();

    @OneToMany(mappedBy = "marks", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExternalMarks> externalMarks =  new ArrayList<>();

    public Marks() {
    }

    public Marks(Long marksId, Long academicId, Long sid, int year, int semester, String branch, double cgpa, List<InternalMarks> internalMarks, List<ExternalMarks> externalMarks,String grade) {
        this.marksId = marksId;
        this.academicId = academicId;
        this.sid = sid;
        this.year = year;
        this.semester = semester;
        this.branch = branch;
        this.cgpa = cgpa;
        this.grade = grade;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
    }

    public Long getMarksId() {
        return marksId;
    }

    public void setMarksId(Long marksId) {
        this.marksId = marksId;
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

    public double getCgpa() {
        return cgpa;
    }

    public void setCgpa(double cgpa) {
        this.cgpa = cgpa;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public List<InternalMarks> getInternalMarks() {
        return internalMarks;
    }

    public void setInternalMarks(List<InternalMarks> internalMarks) {
        this.internalMarks = internalMarks;
    }

    public List<ExternalMarks> getExternalMarks() {
        return externalMarks;
    }

    public void setExternalMarks(List<ExternalMarks> externalMarks) {
        this.externalMarks = externalMarks;
    }
}
