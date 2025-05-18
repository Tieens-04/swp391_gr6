package com.swp391_g6.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391_g6.demo.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

    User findByEmail(String email);

}
