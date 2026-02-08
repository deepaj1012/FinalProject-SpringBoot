package com.helpbridge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "ngos")
public class NGO extends User {

    private String registrationDocumentPath;

    public String getRegistrationDocumentPath() {
        return registrationDocumentPath;
    }

    public void setRegistrationDocumentPath(String path) {
        this.registrationDocumentPath = path;
    }
}
