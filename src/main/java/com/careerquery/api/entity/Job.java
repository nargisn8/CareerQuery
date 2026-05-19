package com.careerquery.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "İş başlığı boş ola bilməz")
    @Size(min = 3, max = 100, message = "Başlıq 3 ilə 100 simvol arasında olmalıdır")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Məkan qeyd edilməlidir")
    private String location;

    @NotBlank(message = "İş növü seçilməlidir")
    @Column(name = "job_type")
    private String jobType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    // Bu hissə JSON dövrünün qarşısını alır və owner məlumatını React-a ötürür
    @JsonIgnoreProperties({"password", "role", "jobs", "enabled", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User owner;
}