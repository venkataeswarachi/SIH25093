package com.vvit.University.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "external_marks")

public class ExternalMarks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long externalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marks_id", nullable = false)
    @JsonBackReference
    private Marks marks;

    @Column(nullable = false)
    private String subjectName;
    private String srno;
    private Integer total;
    private String grade;
    private int year;
    private int semester;
    private String finalGrade;
    private Double sgpa;
    private LocalDate releaseDate;

    public ExternalMarks() {
    }

    public ExternalMarks(Long externalId, Marks marks, String subjectName, String srno, Integer total, String grade, int year, int semester, String finalGrade, Double sgpa, LocalDate releaseDate) {
        this.externalId = externalId;
        this.marks = marks;
        this.subjectName = subjectName;
        this.srno = srno;
        this.total = total;
        this.grade = grade;
        this.year = year;
        this.semester = semester;
        this.finalGrade = finalGrade;
        this.sgpa = sgpa;
        this.releaseDate = LocalDate.now();
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public Marks getMarks() {
        return marks;
    }

    public void setMarks(Marks marks) {
        this.marks = marks;
    }

    public String getSubject() {
        return subjectName;
    }

    public void setSubject(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getFinalGrade() {
        return finalGrade;
    }

    public void setFinalGrade(String finalGrade) {
        this.finalGrade = finalGrade;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Double getSgpa() {
        return sgpa;
    }

    public void setSgpa(Double sgpa) {
        this.sgpa = sgpa;
    }

    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
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

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate() {
        this.releaseDate = LocalDate.now();
    }
}

