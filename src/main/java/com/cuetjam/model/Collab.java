package com.cuetjam.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collab")
public class Collab {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "author_id", nullable = false, length = 50)
    private String authorId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", insertable = false, updatable = false)
    private User author;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "contact_info", nullable = false, length = 200)
    private String contactInfo;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CollabSection section;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CollabStatus status = CollabStatus.OPEN;
    
    @Column(name = "created_time")
    private LocalDateTime createdTime;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Collab() {}
    
    public Collab(String authorId, String title, String description, String contactInfo, CollabSection section) {
        this.authorId = authorId;
        this.title = title;
        this.description = description;
        this.contactInfo = contactInfo;
        this.section = section;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    
    public CollabSection getSection() { return section; }
    public void setSection(CollabSection section) { this.section = section; }
    
    public CollabStatus getStatus() { return status; }
    public void setStatus(CollabStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}