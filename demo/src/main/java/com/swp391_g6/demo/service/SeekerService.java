package com.swp391_g6.demo.service;

import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.repository.SeekerRepository;

@Service
public class SeekerService {

    private final SeekerRepository seekerRepository;

    public SeekerService(SeekerRepository seekerRepository) {
        this.seekerRepository = seekerRepository;
    }

    public void createSeekerProfile(User user) {
        if (seekerRepository.findByUser(user) == null) {
            Seeker seeker = new Seeker();
            seeker.setUser(user);
            seekerRepository.save(seeker);
        }
    }

    public Seeker findByUser(User user) {
        return seekerRepository.findByUser(user);
    }

}
