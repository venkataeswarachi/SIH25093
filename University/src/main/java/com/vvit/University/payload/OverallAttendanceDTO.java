package com.vvit.University.payload;
public class OverallAttendanceDTO {

    private int totalClasses;
    private int present;
    private double percentage;

    public OverallAttendanceDTO() {
    }

    public OverallAttendanceDTO(int totalClasses, int present, double percentage) {
        this.totalClasses = totalClasses;
        this.present = present;
        this.percentage = percentage;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
    }

    public int getPresent() {
        return present;
    }

    public void setPresent(int present) {
        this.present = present;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

