package com.careerquery.api.controller;

import com.careerquery.api.entity.User;
import com.careerquery.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(authService.register(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Xəta: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            // "username" yerinə "email" yazırıq!
            User user = authService.login(credentials.get("email"), credentials.get("password"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Xəta: " + e.getMessage());
        }
    }
}