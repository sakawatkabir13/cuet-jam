package com.cuetjam.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {
    
    @Column(nullable = false)
    private Integer batch;
    
    @Column(name = "is_admin")
    private Boolean isAdmin = false;
    // Constructors
    public Student() {
        super();
        setUserType(UserType.STUDENT);
    }
    public Student(String userId, String name, String email, String password, Integer batch) {
        super(userId, name, email, password, UserType.STUDENT);
        this.batch = batch;
    }
    // Getters and Setters
    public Integer getBatch() { return batch; }
    public void setBatch(Integer batch) { this.batch = batch; }
    
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
}