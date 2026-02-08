package com.helpbridge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "donors")
public class Donor extends User { // Assuming Donor table exists or mapping is done via User
    private String idProofPath;

    public String getIdProofPath() {
        return idProofPath;
    }

    public void setIdProofPath(String path) {
        this.idProofPath = path;
    }
}
