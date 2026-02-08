package com.helpbridge.repository;

import com.helpbridge.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    java.util.List<Volunteer> findByCity(String city);
}
