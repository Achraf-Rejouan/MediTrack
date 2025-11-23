package com.meditrack.dto;

import com.meditrack.model.Appointment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private DoctorResponse doctor;
    private PatientResponse patient;
    private LocalDateTime appointmentDateTime;
    private String reason;
    private String status;
    private Long version;

    public static AppointmentResponse fromAppointment(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .doctor(DoctorResponse.builder()
                        .id(appointment.getDoctor().getId())
                        .firstName(appointment.getDoctor().getFirstName())
                        .lastName(appointment.getDoctor().getLastName())
                        .specialization(appointment.getDoctor().getSpecialty())
                        .build())
                .patient(PatientResponse.builder()
                        .id(appointment.getPatient().getId())
                        .username(appointment.getPatient().getUsername())
                        .build())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .reason(appointment.getReason())
                .status(appointment.getStatus().toString())
                .version(appointment.getVersion())
                .build();
    }
}

