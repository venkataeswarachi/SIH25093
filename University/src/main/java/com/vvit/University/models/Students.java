package com.vvit.University.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Students {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sid;
    @Column(nullable = false,unique = true)
    private String rno;
    @Column(nullable = false,unique = true)
    private String email;
    private String firstname;
    private String lastname;
    private String fathername;
    private String mothername;
    private String religion;
    private String caste;
    private Long smobile;
    private Long fmobile;
    private String bloodgroup;
    private String mothertongue;
    private String martialstatus;
    private String permanantAddress;
    private String presentAddress;
    private String gitlink;
    private String resumelink;
    private String portfolio;
    private boolean verfied;
    private String verfiedBy;
    private List<String> skills;
    public Students() {
    }

    public Students(Long sid, String rno, String email, String firstname, String lastname, String fathername, String mothername, String religion, String caste, Long smobile, Long fmobile, String bloodgroup, String mothertongue, String martialstatus, String permanantAddress, String presentAddress, String gitlink, String resumelink, String portfolio, boolean verfied, String verfiedBy,List<String> skills) {
        this.sid = sid;
        this.rno = rno;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.fathername = fathername;
        this.mothername = mothername;
        this.religion = religion;
        this.caste = caste;
        this.smobile = smobile;
        this.fmobile = fmobile;
        this.bloodgroup = bloodgroup;
        this.mothertongue = mothertongue;
        this.martialstatus = martialstatus;
        this.permanantAddress = permanantAddress;
        this.presentAddress = presentAddress;
        this.gitlink = gitlink;
        this.resumelink = resumelink;
        this.portfolio = portfolio;
        this.skills = skills;
        this.verfied = verfied;
        this.verfiedBy = verfiedBy;
    }

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public String getRno() {
        return rno;
    }

    public void setRno(String rno) {
        this.rno = rno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getFathername() {
        return fathername;
    }

    public void setFathername(String fathername) {
        this.fathername = fathername;
    }

    public String getMothername() {
        return mothername;
    }

    public void setMothername(String mothername) {
        this.mothername = mothername;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getCaste() {
        return caste;
    }

    public void setCaste(String caste) {
        this.caste = caste;
    }

    public Long getSmobile() {
        return smobile;
    }

    public void setSmobile(Long smobile) {
        this.smobile = smobile;
    }

    public Long getFmobile() {
        return fmobile;
    }

    public void setFmobile(Long fmobile) {
        this.fmobile = fmobile;
    }

    public String getBloodgroup() {
        return bloodgroup;
    }

    public void setBloodgroup(String bloodgroup) {
        this.bloodgroup = bloodgroup;
    }

    public String getMothertongue() {
        return mothertongue;
    }

    public void setMothertongue(String mothertongue) {
        this.mothertongue = mothertongue;
    }

    public String getMartialstatus() {
        return martialstatus;
    }

    public void setMartialstatus(String martialstatus) {
        this.martialstatus = martialstatus;
    }

    public String getPermanantAddress() {
        return permanantAddress;
    }

    public void setPermanantAddress(String permanantAddress) {
        this.permanantAddress = permanantAddress;
    }

    public String getPresentAddress() {
        return presentAddress;
    }

    public void setPresentAddress(String presentAddress) {
        this.presentAddress = presentAddress;
    }

    public String getGitlink() {
        return gitlink;
    }

    public void setGitlink(String gitlink) {
        this.gitlink = gitlink;
    }

    public String getResumelink() {
        return resumelink;
    }

    public void setResumelink(String resumelink) {
        this.resumelink = resumelink;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public boolean isVerfied() {
        return verfied;
    }

    public void setVerfied(boolean verfied) {
        this.verfied = verfied;
    }

    public List<String> getSkills() {return skills;}

    public void setSkills(List<String> skills) {this.skills = skills;}

    public String getVerfiedBy() {
        return verfiedBy;
    }

    public void setVerfiedBy(String verfiedBy) {
        this.verfiedBy = verfiedBy;
    }
}
