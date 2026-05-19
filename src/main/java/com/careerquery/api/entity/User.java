package com.careerquery.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role = "ROLE_USER"; // Defolt olaraq hər kəs sadə istifadəçidir

    // Bir istifadəçinin çoxlu iş elanı ola bilər
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Job> jobs;
}