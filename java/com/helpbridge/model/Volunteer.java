package com.helpbridge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "volunteers")
public class Volunteer extends User {

    private String idProofPath;
    private String availability;
    private String interests;

    public String getIdProofPath() {
        return idProofPath;
    }

    public void setIdProofPath(String path) {
        this.idProofPath = path;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }
}
