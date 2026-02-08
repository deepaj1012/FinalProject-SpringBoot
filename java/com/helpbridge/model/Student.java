package com.helpbridge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student extends User {

    private String disabilityCertificatePath;

    public String getDisabilityCertificatePath() {
        return disabilityCertificatePath;
    }

    public void setDisabilityCertificatePath(String path) {
        this.disabilityCertificatePath = path;
    }
}
