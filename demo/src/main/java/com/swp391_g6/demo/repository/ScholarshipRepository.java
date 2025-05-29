package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Scholarship;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ScholarshipRepository extends JpaRepository<Scholarship, String> {
    
}
