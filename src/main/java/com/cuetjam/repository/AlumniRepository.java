package com.cuetjam.repository;

import com.cuetjam.model.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, String> {
    List<Alumni> findByIsApprovedTrue();
    List<Alumni> findByIsApprovedFalse();
    
    @Query("SELECT a FROM Alumni a WHERE a.isApproved = true AND a.department.id = :departmentId")
    List<Alumni> findApprovedByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT a FROM Alumni a WHERE a.currentWorkingPlace LIKE %:company%")
    List<Alumni> findByCurrentWorkingPlaceContaining(@Param("company") String company);
    
    @Query("SELECT a FROM Alumni a WHERE a.researchAreas LIKE %:keyword%")
    List<Alumni> findByResearchAreasContaining(@Param("keyword") String keyword);
}