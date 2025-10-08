package com.cuetjam.repository;

import com.cuetjam.model.User;
import com.cuetjam.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);
    List<User> findByUserType(UserType userType);
    
    @Query("SELECT u FROM User u WHERE u.userType = :userType AND u.department.id = :departmentId")
    List<User> findByUserTypeAndDepartment(@Param("userType") UserType userType, @Param("departmentId") Long departmentId);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isVerified = true")
    Optional<User> findByEmailAndVerified(@Param("email") String email);
}