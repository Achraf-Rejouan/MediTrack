package com.meditrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private Long totalUsers;
    private Long totalAppointments;
    private Long pendingAppointments;
    private Long approvedAppointments;
    private Long rejectedAppointments;
    private Long cancelledAppointments;
    private Long totalDoctors;
    private Long totalPatients;
}

