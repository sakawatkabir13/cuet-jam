package com.cuetjam.repository;

import com.cuetjam.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, String> {
    @Query("SELECT f FROM Faculty f WHERE f.department.id = :departmentId")
    List<Faculty> findByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT f FROM Faculty f WHERE f.designation LIKE %:designation%")
    List<Faculty> findByDesignationContaining(@Param("designation") String designation);
    
    @Query("SELECT f FROM Faculty f WHERE f.researchAreas LIKE %:keyword%")
    List<Faculty> findByResearchAreasContaining(@Param("keyword") String keyword);
}