package com.cuetjam.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty")
@PrimaryKeyJoinColumn(name = "user_id")
public class Faculty extends User {
    
    @Column(length = 100)
    private String designation;
    
    @Column(name = "research_areas", columnDefinition = "TEXT")
    private String researchAreas;
    
    // Constructors
    public Faculty() {
        super();
        setUserType(UserType.FACULTY);
    }
    
    public Faculty(String userId, String name, String email, String password, String designation, String researchAreas) {
        super(userId, name, email, password, UserType.FACULTY);
        this.designation = designation;
        this.researchAreas = researchAreas;
    }
    
    // Getters and Setters
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getResearchAreas() { return researchAreas; }
    public void setResearchAreas(String researchAreas) { this.researchAreas = researchAreas; }
}