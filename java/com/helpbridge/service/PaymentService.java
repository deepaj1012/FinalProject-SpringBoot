package com.helpbridge.service;

import com.helpbridge.model.Donation;
import com.helpbridge.model.HelpPost;
import com.helpbridge.model.User;
import com.helpbridge.repository.DonationRepository;
import com.helpbridge.repository.HelpPostRepository;
import com.helpbridge.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    // Ideally, these should be in application.properties
    // Using placeholder Test Credentials for demonstration
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private HelpPostRepository helpPostRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    public String createOrder(Long campaignId, Double amount) throws RazorpayException {
        // MOCK MODE: If keys are default, return a mock order immediately
        if (keyId == null || keyId.contains("YourKeyHere") || keySecret.contains("YourSecretHere")) {
            System.out.println("⚠️ Razorpay Keys missing. Using MOCK mode.");
            JSONObject mockOrder = new JSONObject();
            mockOrder.put("id", "order_mock_" + System.currentTimeMillis());
            mockOrder.put("entity", "order");
            mockOrder.put("amount", (int) (amount * 100));
            mockOrder.put("currency", "INR");
            mockOrder.put("status", "created");
            mockOrder.put("mock", true); // Flag for frontend
            return mockOrder.toString();
        }

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + campaignId + "_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1); // Auto capture

        Order order = razorpay.orders.create(orderRequest);
        return order.toString();
    }

    @Transactional
    public boolean verifyPayment(Map<String, Object> data, Long userId) {
        String orderId = (String) data.get("razorpay_order_id");
        String paymentId = (String) data.get("razorpay_payment_id");
        String signature = (String) data.get("razorpay_signature");
        Long campaignId = ((Number) data.get("campaign_id")).longValue();
        Double amount = ((Number) data.get("amount")).doubleValue();

        try {
            boolean isValid;

            // MOCK MODE VERIFICATION
            if (orderId != null && orderId.startsWith("order_mock_")) {
                isValid = true;
            } else {
                // REAL MODE VERIFICATION
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_signature", signature);
                isValid = Utils.verifyPaymentSignature(options, keySecret);
            }

            if (isValid) {
                // 2. Prevent Duplicate Processing
                if (donationRepository.findByRazorpayOrderId(orderId) != null) {
                    return true; // Already processed
                }

                // 3. Save Donation
                HelpPost campaign = helpPostRepository.findById(campaignId)
                        .orElseThrow(() -> new RuntimeException("Campaign not found"));

                User donor = null;
                if (userId != null) {
                    donor = userRepository.findById(userId).orElse(null);
                }

                Donation donation = new Donation();
                donation.setCampaign(campaign);
                donation.setDonor(donor);
                donation.setAmount(amount);
                donation.setRazorpayOrderId(orderId);
                donation.setRazorpayPaymentId(paymentId);
                donation.setStatus("SUCCESS");

                donationRepository.save(donation);

                // 4. Update Campaign Collected Amount
                double current = campaign.getCollectedAmount() == null ? 0 : campaign.getCollectedAmount();
                campaign.setCollectedAmount(current + amount);
                helpPostRepository.save(campaign);

                return true;
            } else {
                return false;
            }

        } catch (RazorpayException e) {
            e.printStackTrace();
            return false;
        }
    }
}
