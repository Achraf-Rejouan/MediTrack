package com.meditrack.repository;

import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
import com.meditrack.model.Role;
import com.meditrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT d FROM Doctor d")
    List<Doctor> findAllDoctors();

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") Role role);

    @Query("SELECT p FROM Patient p WHERE p.username = :username")
    Optional<Patient> findPatientByUsername(@Param("username") String username);

    @Query("SELECT d FROM Doctor d WHERE d.username = :username")
    Optional<Doctor> findDoctorByUsername(@Param("username") String username);
}
