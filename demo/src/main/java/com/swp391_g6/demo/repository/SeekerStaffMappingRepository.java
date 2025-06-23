package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.SeekerStaffMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeekerStaffMappingRepository extends JpaRepository<SeekerStaffMapping, String> {
    SeekerStaffMapping findBySeekerId(String seekerId);
    List<SeekerStaffMapping> findByStaffId(String staffId);
    void deleteBySeekerId(String seekerId);
}