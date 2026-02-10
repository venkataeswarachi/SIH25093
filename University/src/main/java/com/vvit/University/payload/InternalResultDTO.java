package com.vvit.University.payload;

public class InternalResultDTO {
    private Integer semester;
    private String subjectName;
    private Integer seminar1 = 0;
    private Integer openbook1 = 0;
    private Integer descriptive1 = 0;
    private Integer objective1 = 0;
    private Integer seminar2 = 0;
    private Integer openbook2 = 0;
    private Integer descriptive2 = 0;
    private Integer objective2 = 0;
    private Integer total1;
    private Integer total2;
    private Integer finalInternalMarks;

    public InternalResultDTO() {
    }

    public InternalResultDTO(Integer semester, String subjectName, Integer seminar1, Integer openbook1, Integer descriptive1, Integer objective1, Integer seminar2, Integer openbook2, Integer descriptive2, Integer objective2, Integer total1, Integer total2, Integer finalInternalMarks) {
        this.semester = semester;
        this.subjectName = subjectName;
        this.seminar1 = seminar1;
        this.openbook1 = openbook1;
        this.descriptive1 = descriptive1;
        this.objective1 = objective1;
        this.seminar2 = seminar2;
        this.openbook2 = openbook2;
        this.descriptive2 = descriptive2;
        this.objective2 = objective2;
        this.total1 = total1;
        this.total2 = total2;
        this.finalInternalMarks = finalInternalMarks;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getSeminar1() {
        return seminar1;
    }

    public void setSeminar1(Integer seminar1) {
        this.seminar1 = seminar1;
    }

    public Integer getOpenbook1() {
        return openbook1;
    }

    public void setOpenbook1(Integer openbook1) {
        this.openbook1 = openbook1;
    }

    public Integer getDescriptive1() {
        return descriptive1;
    }

    public void setDescriptive1(Integer descriptive1) {
        this.descriptive1 = descriptive1;
    }

    public Integer getObjective1() {
        return objective1;
    }

    public void setObjective1(Integer objective1) {
        this.objective1 = objective1;
    }

    public Integer getSeminar2() {
        return seminar2;
    }

    public void setSeminar2(Integer seminar2) {
        this.seminar2 = seminar2;
    }

    public Integer getOpenbook2() {
        return openbook2;
    }

    public void setOpenbook2(Integer openbook2) {
        this.openbook2 = openbook2;
    }

    public Integer getDescriptive2() {
        return descriptive2;
    }

    public void setDescriptive2(Integer descriptive2) {
        this.descriptive2 = descriptive2;
    }

    public Integer getObjective2() {
        return objective2;
    }

    public void setObjective2(Integer objective2) {
        this.objective2 = objective2;
    }

    public Integer getTotal1() {
        return total1;
    }

    public void setTotal1(Integer total1) {
        this.total1 = total1;
    }

    public Integer getTotal2() {
        return total2;
    }

    public void setTotal2(Integer total2) {
        this.total2 = total2;
    }

    public Integer getFinalInternalMarks() {
        return finalInternalMarks;
    }

    public void setFinalInternalMarks(Integer finalInternalMarks) {
        this.finalInternalMarks = finalInternalMarks;
    }
}
