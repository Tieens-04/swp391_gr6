package com.swp391_g6.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391_g6.demo.entity.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {

    VerificationToken findByEmail(String email);

}