package com.cuetjam.dto;

import jakarta.validation.constraints.*;

public class FacultyRegistrationRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(regexp = "[a-zA-Z0-9.]+@cuet\\.ac\\.bd", message = "Must be a valid CUET faculty email")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    @Size(max = 100, message = "Designation must not exceed 100 characters")
    private String designation;
    
    @Size(max = 1000, message = "Research areas must not exceed 1000 characters")
    private String researchAreas;
    
    // Constructors
    public FacultyRegistrationRequest() {}
    
    public FacultyRegistrationRequest(String name, String email, String password, String department, String designation, String researchAreas) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.designation = designation;
        this.researchAreas = researchAreas;
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
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getResearchAreas() { return researchAreas; }
    public void setResearchAreas(String researchAreas) { this.researchAreas = researchAreas; }
}