package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.repository.ScholarshipRepository;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ScholarshipService {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

}
