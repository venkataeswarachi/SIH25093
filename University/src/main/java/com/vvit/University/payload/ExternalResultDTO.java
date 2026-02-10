package com.vvit.University.payload;

public class ExternalResultDTO {
    private String srno;
    private String subjectName;
    private int semester;
    private int year;
    private Integer total;
    private String grade;
    private String finalGrade;

    public ExternalResultDTO() {

    }

    public ExternalResultDTO(String srno, String subjectName, int semester, int year, Integer total, String grade, String finalGrade) {
        this.srno = srno;
        this.subjectName = subjectName;
        this.semester = semester;
        this.year = year;
        this.total = total;
        this.grade = grade;
        this.finalGrade = finalGrade;
    }

    public String getSrno() {
        return srno;
    }

    public void setSrno(String srno) {
        this.srno = srno;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
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
}
