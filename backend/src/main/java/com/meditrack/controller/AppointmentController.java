package com.meditrack.controller;

import com.meditrack.dto.AppointmentRequest;
import com.meditrack.dto.DoctorResponse;
import com.meditrack.model.Appointment;
import com.meditrack.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getDoctors() {
        List<DoctorResponse> doctors = appointmentService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Appointment appointment = appointmentService.createAppointment(request, username);
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }
}
