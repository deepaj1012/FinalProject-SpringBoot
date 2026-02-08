package com.helpbridge.model;

import com.helpbridge.enums.RequestStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private NGO ngo;

    private String description;
    private LocalDate requestDate; // "on 10th"
    private LocalTime requestTime; // "10 AM"

    private String city; // "Pune"
    private String location; // Specific address if needed

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private String feedback;

    private Double fundsAllocated = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public NGO getNgo() {
        return ngo;
    }

    public void setNgo(NGO ngo) {
        this.ngo = ngo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public LocalTime getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(LocalTime requestTime) {
        this.requestTime = requestTime;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Double getFundsAllocated() {
        return fundsAllocated;
    }

    public void setFundsAllocated(Double fundsAllocated) {
        this.fundsAllocated = fundsAllocated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
