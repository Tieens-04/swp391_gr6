package com.swp391_g6.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @GetMapping
    public List<String> getData() {
        return Arrays.asList("React", "Spring Boot", "MySQL", "Docker");
    }

}
