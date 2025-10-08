package com.cuetjam.service;

import com.cuetjam.dto.*;
import com.cuetjam.model.*;
import com.cuetjam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private FacultyRepository facultyRepository;
    
    @Autowired
    private AlumniRepository alumniRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    public Student registerStudent(StudentRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Find department
        Department department = departmentRepository.findByCode(request.getDepartment())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        // Generate verification code
        String verificationCode = emailService.generateVerificationCode();
        
        // Create student
        Student student = new Student();
        student.setUserId(generateUserId("STU"));
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setBatch(request.getBatch());
        student.setDepartment(department);
        student.setVerificationCode(verificationCode);
        student.setIsVerified(false);
        
        // Save student
        Student savedStudent = studentRepository.save(student);
        
        // Send verification email
        emailService.sendVerificationCode(request.getEmail(), request.getName(), verificationCode);
        
        return savedStudent;
    }
    
    public Faculty registerFaculty(FacultyRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Find department
        Department department = departmentRepository.findByCode(request.getDepartment())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        // Generate verification code
        String verificationCode = emailService.generateVerificationCode();
        
        // Create faculty
        Faculty faculty = new Faculty();
        faculty.setUserId(generateUserId("FAC"));
        faculty.setName(request.getName());
        faculty.setEmail(request.getEmail());
        faculty.setPassword(passwordEncoder.encode(request.getPassword()));
        faculty.setDesignation(request.getDesignation());
        faculty.setResearchAreas(request.getResearchAreas());
        faculty.setDepartment(department);
        faculty.setVerificationCode(verificationCode);
        faculty.setIsVerified(false);
        
        // Save faculty
        Faculty savedFaculty = facultyRepository.save(faculty);
        
        // Send verification email
        emailService.sendVerificationCode(request.getEmail(), request.getName(), verificationCode);
        
        return savedFaculty;
    }
    
    public Alumni registerAlumni(AlumniRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Find department
        Department department = departmentRepository.findByCode(request.getDepartment())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        // Generate verification code
        String verificationCode = emailService.generateVerificationCode();
        
        // Create alumni
        Alumni alumni = new Alumni();
        alumni.setUserId(generateUserId("ALU"));
        alumni.setName(request.getName());
        alumni.setEmail(request.getEmail());
        alumni.setPassword(passwordEncoder.encode(request.getPassword()));
        alumni.setResearchAreas(request.getResearchAreas());
        alumni.setCurrentWorkingPlace(request.getCurrentWorkingPlace());
        alumni.setShortDescription(request.getShortDescription());
        alumni.setProofUrl(request.getProofUrl());
        alumni.setDepartment(department);
        alumni.setVerificationCode(verificationCode);
        alumni.setIsVerified(false);
        alumni.setIsApproved(false);
        
        // Save alumni
        Alumni savedAlumni = alumniRepository.save(alumni);
        
        // Send verification email
        emailService.sendVerificationCode(request.getEmail(), request.getName(), verificationCode);
        
        // Notify all admins about the new alumni registration
        try {
            String[] adminEmails = getAllAdminEmails();
            emailService.sendAdminAlumniRegistrationNotification(
                adminEmails, 
                request.getName(), 
                request.getEmail(), 
                department.getName(), 
                request.getProofUrl()
            );
        } catch (Exception e) {
            System.err.println("Failed to send admin notifications: " + e.getMessage());
            // Don't fail the registration if email notification fails
        }
        
        return savedAlumni;
    }
    
    public boolean verifyEmail(String verificationCode) {
        Optional<User> userOpt = userRepository.findByVerificationCode(verificationCode);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public User verifyEmailAndGetUser(String verificationCode) {
        Optional<User> userOpt = userRepository.findByVerificationCode(verificationCode);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return user;
        }
        return null;
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailAndVerified(email);
    }
    
    public Optional<User> findByEmailAny(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<Alumni> getPendingAlumniApprovals() {
        return alumniRepository.findByIsApprovedFalse();
    }
    
    public boolean approveAlumni(String alumniId, String adminId) {
        Optional<Alumni> alumniOpt = alumniRepository.findById(alumniId);
        if (alumniOpt.isPresent()) {
            Alumni alumni = alumniOpt.get();
            alumni.setIsApproved(true);
            alumni.setApprovedBy(adminId);
            alumni.setApprovedAt(LocalDateTime.now());
            alumniRepository.save(alumni);
            
            // Get admin name for email
            String adminName = getAdminNameById(adminId);
            
            // Send approval notification
            emailService.sendAlumniApprovalNotification(alumni.getEmail(), alumni.getName(), true, adminName);
            return true;
        }
        return false;
    }
    
    public boolean rejectAlumni(String alumniId, String adminId) {
        Optional<Alumni> alumniOpt = alumniRepository.findById(alumniId);
        if (alumniOpt.isPresent()) {
            Alumni alumni = alumniOpt.get();
            
            // Get admin name for email
            String adminName = getAdminNameById(adminId);
            
            // Send rejection notification
            emailService.sendAlumniApprovalNotification(alumni.getEmail(), alumni.getName(), false, adminName);
            
            // Delete the alumni record
            alumniRepository.delete(alumni);
            return true;
        }
        return false;
    }
    
    public List<Alumni> getApprovedAlumni() {
        return alumniRepository.findByIsApprovedTrue();
    }
    
    public List<Alumni> getApprovedAlumniByDepartment(Long departmentId) {
        return alumniRepository.findApprovedByDepartment(departmentId);
    }
    
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }
    
    public List<Faculty> getFacultyByDepartment(Long departmentId) {
        return facultyRepository.findByDepartment(departmentId);
    }
    
    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public boolean isAdmin(String userId) {
        Optional<Student> studentOpt = studentRepository.findById(userId);
        return studentOpt.isPresent() && studentOpt.get().getIsAdmin();
    }
    
    public boolean sendPasswordResetOTP(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Generate OTP
                String otp = emailService.generateVerificationCode();
                
                // Save OTP to user (reusing verification_code field for password reset)
                user.setVerificationCode(otp);
                userRepository.save(user);
                
                // Send OTP email
                emailService.sendPasswordResetOTP(email, user.getName(), otp);
                return true;
            }
            return false; // User not found, but don't reveal this for security
        } catch (Exception e) {
            System.err.println("Error sending password reset OTP: " + e.getMessage());
            return false;
        }
    }
    
    public boolean resetPasswordWithOTP(String email, String otp, String newPassword) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Verify OTP
                if (otp.equals(user.getVerificationCode())) {
                    // Reset password
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setVerificationCode(null); // Clear OTP
                    userRepository.save(user);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error resetting password: " + e.getMessage());
            return false;
        }
    }
    
    public String[] getAllAdminEmails() {
        try {
            // Find all students who are admins
            List<Student> adminStudents = studentRepository.findByIsAdminTrue();
            return adminStudents.stream()
                    .map(Student::getEmail)
                    .toArray(String[]::new);
        } catch (Exception e) {
            System.err.println("Error getting admin emails: " + e.getMessage());
            // Fallback to predefined admin emails
            return new String[]{
                "u2204069@student.cuet.ac.bd",
                "u2204072@student.cuet.ac.bd", 
                "u2204085@student.cuet.ac.bd",
                "u2204096@student.cuet.ac.bd",
                "u2204097@student.cuet.ac.bd"
            };
        }
    }
    
    private String getAdminNameById(String adminId) {
        try {
            Optional<User> adminOpt = userRepository.findById(adminId);
            if (adminOpt.isPresent()) {
                return adminOpt.get().getName();
            }
            return "Admin"; // Fallback name if admin not found
        } catch (Exception e) {
            System.err.println("Error getting admin name: " + e.getMessage());
            return "Admin"; // Fallback name on error
        }
    }
    
    private String generateUserId(String prefix) {
        return prefix + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
    }
}