package com.helpbridge.repository;

import com.helpbridge.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository extends JpaRepository<Donor, Long> {
}
