package com.careerquery.api.service;

import com.careerquery.api.entity.User;
import com.careerquery.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        // Əgər eyni email ilə istifadəçi varsa, xəta verək ki, bazada dublikat olmasın
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Bu email artıq istifadə olunub!");
        }

        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }

    // ARQUMENT ADINI 'email' ETDİK
    public User login(String email, String password) {
        // BURADA findByUsername YOX, findByEmail ÇAĞIRILMALIDIR
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Email və ya şifrə yanlışdır!"));
    }
}