package com.meditrack.repository;

import com.meditrack.model.Doctor;
import com.meditrack.model.Role;
import com.meditrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT d FROM Doctor d")
    List<Doctor> findAllDoctors();
}
