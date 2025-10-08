package com.cuetjam.dto;

import jakarta.validation.constraints.*;

public class StudentRegistrationRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(regexp = "u\\d{7}@student\\.cuet\\.ac\\.bd", message = "Must be a valid CUET student email")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotNull(message = "Batch is required")
    @Min(value = 2010, message = "Batch must be 2010 or later")
    @Max(value = 2030, message = "Batch must be 2030 or earlier")
    private Integer batch;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    // Constructors
    public StudentRegistrationRequest() {}
    
    public StudentRegistrationRequest(String name, String email, String password, Integer batch, String department) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.batch = batch;
        this.department = department;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Integer getBatch() { return batch; }
    public void setBatch(Integer batch) { this.batch = batch; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}