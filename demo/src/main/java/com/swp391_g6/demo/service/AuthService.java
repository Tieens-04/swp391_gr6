package com.swp391_g6.demo.service;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.entity.User;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public void createUser(String full_name, String email, String password, String role) {
        String user_id = idGeneratorService.generateId("USER", false, 10);
        String password_hash = passwordEncoder.encode(password);
        User user = new User();
        user.setUserId(user_id);
        user.setFullName(full_name);
        user.setEmail(email);
        user.setPasswordHash(password_hash);
        user.setRole(role);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            return user;
        }
        return null;
    }

}
