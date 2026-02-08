package com.helpbridge.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor; // or specifically Donor if you have a separate entity class, but User is
                        // usually base

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private HelpPost campaign;

    private Double amount;

    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String status; // SUCCESS, FAILED

    private LocalDateTime donationDate = LocalDateTime.now();

    // Constructors
    public Donation() {
    }

    public Donation(User donor, HelpPost campaign, Double amount, String razorpayPaymentId, String razorpayOrderId,
            String status) {
        this.donor = donor;
        this.campaign = campaign;
        this.amount = amount;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public HelpPost getCampaign() {
        return campaign;
    }

    public void setCampaign(HelpPost campaign) {
        this.campaign = campaign;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDateTime donationDate) {
        this.donationDate = donationDate;
    }
}
