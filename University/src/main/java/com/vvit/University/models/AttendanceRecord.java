package com.vvit.University.models;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance_record")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @ManyToOne
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;

    private String studentRno;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        PRESENT, ABSENT
    }

    public AttendanceRecord() {
    }

    public AttendanceRecord(Long recordId, Attendance attendance, String studentRno, Status status) {
        this.recordId = recordId;
        this.attendance = attendance;
        this.studentRno = studentRno;
        this.status = status;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public Attendance getAttendance() {
        return attendance;
    }

    public void setAttendance(Attendance attendance) {
        this.attendance = attendance;
    }

    public String getStudentRno() {
        return studentRno;
    }

    public void setStudentRno(String studentRno) {
        this.studentRno = studentRno;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}


