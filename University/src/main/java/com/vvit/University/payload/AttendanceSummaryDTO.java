package com.vvit.University.payload;

import java.util.List;

public class AttendanceSummaryDTO {

    private OverallAttendanceDTO overall;
    private List<SubjectAttendanceDTO> subjects;

    public AttendanceSummaryDTO() {
    }

    public AttendanceSummaryDTO(OverallAttendanceDTO overall, List<SubjectAttendanceDTO> subjects) {
        this.overall = overall;
        this.subjects = subjects;
    }

    public OverallAttendanceDTO getOverall() {
        return overall;
    }

    public void setOverall(OverallAttendanceDTO overall) {
        this.overall = overall;
    }

    public List<SubjectAttendanceDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectAttendanceDTO> subjects) {
        this.subjects = subjects;
    }
}

