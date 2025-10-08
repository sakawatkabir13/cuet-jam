package com.cuetjam.dto;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

public class AlumniRegistrationRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @Size(max = 1000, message = "Research areas must not exceed 1000 characters")
    private String researchAreas;
    
    @Size(max = 200, message = "Current working place must not exceed 200 characters")
    private String currentWorkingPlace;
    
    @Size(max = 500, message = "Short description must not exceed 500 characters")
    private String shortDescription;
    
    @NotBlank(message = "Proof URL is required")
    @URL(message = "Invalid URL format")
    private String proofUrl;
    
    // Constructors
    public AlumniRegistrationRequest() {}
    
    public AlumniRegistrationRequest(String name, String email, String password, String department, String researchAreas, String currentWorkingPlace, String shortDescription, String proofUrl) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.researchAreas = researchAreas;
        this.currentWorkingPlace = currentWorkingPlace;
        this.shortDescription = shortDescription;
        this.proofUrl = proofUrl;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getResearchAreas() { return researchAreas; }
    public void setResearchAreas(String researchAreas) { this.researchAreas = researchAreas; }
    
    public String getCurrentWorkingPlace() { return currentWorkingPlace; }
    public void setCurrentWorkingPlace(String currentWorkingPlace) { this.currentWorkingPlace = currentWorkingPlace; }
    
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    
    public String getProofUrl() { return proofUrl; }
    public void setProofUrl(String proofUrl) { this.proofUrl = proofUrl; }
}