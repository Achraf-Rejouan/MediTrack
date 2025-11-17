package com.meditrack.dto;

import com.meditrack.model.Appointment;
import lombok.Data;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment must be in the future")
    private LocalDateTime appointmentDateTime;

    private String reason;
}
