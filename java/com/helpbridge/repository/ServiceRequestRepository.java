package com.helpbridge.repository;

import com.helpbridge.enums.RequestStatus;
import com.helpbridge.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByStudentId(Long studentId);
    List<ServiceRequest> findByVolunteerId(Long volunteerId);
    List<ServiceRequest> findByCityAndStatus(String city, RequestStatus status);
}
