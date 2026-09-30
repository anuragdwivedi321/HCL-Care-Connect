package com.careconnect.ehr.dto;

public class DashboardStatsDto {
    private long totalPatients;
    private long openEncounters;
    private long pendingOrders;
    private long activePrescriptions;
    private long abnormalResultsCount;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalPatients, long openEncounters, long pendingOrders, long activePrescriptions, long abnormalResultsCount) {
        this.totalPatients = totalPatients;
        this.openEncounters = openEncounters;
        this.pendingOrders = pendingOrders;
        this.activePrescriptions = activePrescriptions;
        this.abnormalResultsCount = abnormalResultsCount;
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getOpenEncounters() { return openEncounters; }
    public void setOpenEncounters(long openEncounters) { this.openEncounters = openEncounters; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getActivePrescriptions() { return activePrescriptions; }
    public void setActivePrescriptions(long activePrescriptions) { this.activePrescriptions = activePrescriptions; }

    public long getAbnormalResultsCount() { return abnormalResultsCount; }
    public void setAbnormalResultsCount(long abnormalResultsCount) { this.abnormalResultsCount = abnormalResultsCount; }
}
