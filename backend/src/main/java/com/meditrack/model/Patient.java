package com.meditrack.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "patients")
public class Patient extends User {
    @Column(nullable = false)
    private String phone;

    public Patient() {
        super();
        setRole(Role.PATIENT);
    }
}
