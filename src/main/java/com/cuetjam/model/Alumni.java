package com.cuetjam.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alumni")
@PrimaryKeyJoinColumn(name = "user_id")
public class Alumni extends User {
    
    @Column(name = "research_areas", columnDefinition = "TEXT")
    private String researchAreas;
    
    @Column(name = "current_working_place", length = 200)
    private String currentWorkingPlace;
    
    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;
    
    @Column(name = "proof_url", length = 500)
    private String proofUrl;
    
    @Column(name = "is_approved")
    private Boolean isApproved = false;
    
    @Column(name = "approved_by", length = 50)
    private String approvedBy;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    // Constructors
    public Alumni() {
        super();
        setUserType(UserType.ALUMNI);
    }
    
    public Alumni(String userId, String name, String email, String password, String researchAreas, String currentWorkingPlace, String shortDescription, String proofUrl) {
        super(userId, name, email, password, UserType.ALUMNI);
        this.researchAreas = researchAreas;
        this.currentWorkingPlace = currentWorkingPlace;
        this.shortDescription = shortDescription;
        this.proofUrl = proofUrl;
    }
    
    // Getters and Setters
    public String getResearchAreas() { return researchAreas; }
    public void setResearchAreas(String researchAreas) { this.researchAreas = researchAreas; }
    
    public String getCurrentWorkingPlace() { return currentWorkingPlace; }
    public void setCurrentWorkingPlace(String currentWorkingPlace) { this.currentWorkingPlace = currentWorkingPlace; }
    
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    
    public String getProofUrl() { return proofUrl; }
    public void setProofUrl(String proofUrl) { this.proofUrl = proofUrl; }
    
    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }
    
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}