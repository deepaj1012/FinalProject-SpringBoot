package com.helpbridge.controller;

import com.helpbridge.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Allow frontend to access
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @GetMapping("/key")
    public ResponseEntity<Map<String, String>> getKey() {
        return ResponseEntity.ok(Map.of("key", razorpayKeyId));
    }

    // 1. Create Order
    @PostMapping("/create-order/{campaignId}")
    public ResponseEntity<?> createOrder(@PathVariable Long campaignId, @RequestBody Map<String, Double> payload) {
        try {
            Double amount = payload.get("amount");
            if (amount == null || amount <= 0) {
                return ResponseEntity.badRequest().body("Invalid amount");
            }
            // Return the full Order object as string (JSON)
            String order = paymentService.createOrder(campaignId, amount);
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(order);

        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    // 2. Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> data,
            @RequestParam(required = false) Long userId) {
        boolean isSuccess = paymentService.verifyPayment(data, userId);
        if (isSuccess) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified and recorded"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "failed", "message", "Signature verification failed"));
        }
    }
}
