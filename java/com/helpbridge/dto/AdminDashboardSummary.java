package com.helpbridge.dto;

public class AdminDashboardSummary {
    private RoleStats students;
    private RoleStats volunteers;
    private RoleStats ngos;
    private RoleStats donors;

    public AdminDashboardSummary(RoleStats students, RoleStats volunteers, RoleStats ngos, RoleStats donors) {
        this.students = students;
        this.volunteers = volunteers;
        this.ngos = ngos;
        this.donors = donors;
    }

    public RoleStats getStudents() {
        return students;
    }

    public void setStudents(RoleStats students) {
        this.students = students;
    }

    public RoleStats getVolunteers() {
        return volunteers;
    }

    public void setVolunteers(RoleStats volunteers) {
        this.volunteers = volunteers;
    }

    public RoleStats getNgos() {
        return ngos;
    }

    public void setNgos(RoleStats ngos) {
        this.ngos = ngos;
    }

    public RoleStats getDonors() {
        return donors;
    }

    public void setDonors(RoleStats donors) {
        this.donors = donors;
    }

    public static class RoleStats {
        private long total;
        private long approved;
        private long pending;

        public RoleStats(long total, long approved, long pending) {
            this.total = total;
            this.approved = approved;
            this.pending = pending;
        }

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public long getApproved() {
            return approved;
        }

        public void setApproved(long approved) {
            this.approved = approved;
        }

        public long getPending() {
            return pending;
        }

        public void setPending(long pending) {
            this.pending = pending;
        }
    }
}
