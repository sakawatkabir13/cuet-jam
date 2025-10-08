package com.cuetjam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
    
    public void sendVerificationCode(String toEmail, String name, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CUET Jam - Email Verification");
            message.setText("Dear " + name + ",\n\n" +
                           "Your verification code is: " + verificationCode + 
                           "\n\nPlease use this code to verify your email address." +
                           "\n\nThis code will expire in 10 minutes." +
                           "\n\nBest regards,\nCUET Jam Community");
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }
    
    public void sendPasswordResetCode(String toEmail, String name, String resetCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CUET Jam - Password Reset");
            message.setText("Dear " + name + ",\n\n" +
                           "Your password reset code is: " + resetCode + 
                           "\n\nPlease use this code to reset your password." +
                           "\n\nThis code will expire in 10 minutes." +
                           "\n\nIf you didn't request this, please ignore this email." +
                           "\n\nBest regards,\nCUET Jam Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }
    
    public void sendPasswordResetOTP(String toEmail, String name, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CUET Jam - Password Reset OTP");
            message.setText("Dear " + name + ",\n\n" +
                           "You have requested to reset your password for CUET Jam.\n\n" +
                           "Your password reset OTP is: " + otp + 
                           "\n\nPlease use this OTP to reset your password." +
                           "\n\nThis OTP will expire in 10 minutes." +
                           "\n\nIf you didn't request this, please ignore this email and your password will remain unchanged." +
                           "\n\nFor security reasons, never share this OTP with anyone." +
                           "\n\nBest regards,\nCUET Jam Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset OTP email: " + e.getMessage());
        }
    }
    
    public void sendAlumniApprovalNotification(String toEmail, String name, boolean approved, String adminName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CUET Jam - Alumni Registration " + (approved ? "Approved" : "Rejected"));
            
            String messageText;
            if (approved) {
                messageText = "Dear " + name + ",\n\n" +
                            "Congratulations! Your alumni registration has been approved by " + 
                            (adminName != null ? adminName + " from our admin team" : "our admin team") + ".\n" +
                            "You can now log in to CUET Jam and access all features.\n\n" +
                            "Welcome to the CUET Jam community!\n\n" +
                            "Best regards,\nCUET Jam Team";
            } else {
                messageText = "Dear " + name + ",\n\n" +
                            "We regret to inform you that your alumni registration has been rejected by " +
                            (adminName != null ? adminName + " from our admin team" : "our admin team") + ".\n" +
                            "Please ensure you have provided valid proof documents and try again.\n\n" +
                            "If you have any questions, please contact our support team.\n\n" +
                            "Best regards,\nCUET Jam Team";
            }
            
            message.setText(messageText);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send alumni approval notification: " + e.getMessage());
        }
    }
    
    public void sendAdminAlumniRegistrationNotification(String[] adminEmails, String alumniName, String alumniEmail, String department, String proofUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmails);
            message.setSubject("CUET Jam - New Alumni Registration Pending Approval");
            
            String messageText = "Dear Admin,\n\n" +
                               "A new alumni registration request has been submitted and requires your approval.\n\n" +
                               "Alumni Details:\n" +
                               "Name: " + alumniName + "\n" +
                               "Email: " + alumniEmail + "\n" +
                               "Department: " + department + "\n" +
                               "Proof Document: " + (proofUrl != null ? proofUrl : "Not provided") + "\n\n" +
                               "Please log in to the CUET Jam admin panel to review and approve/reject this request.\n\n" +
                               "Note: The alumni account will remain inactive until approved by an admin.\n\n" +
                               "Best regards,\nCUET Jam System";
            
            message.setText(messageText);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send admin notification email: " + e.getMessage());
            // Don't throw exception as this is not critical for user registration
        }
    }
}