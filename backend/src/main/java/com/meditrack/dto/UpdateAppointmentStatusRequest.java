package com.meditrack.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentStatusRequest {
    @NotNull(message = "Status is required")
    private String status;

    @NotNull(message = "Version is required for optimistic locking")
    private Long version;
}

