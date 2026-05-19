package com.careerquery.api.repository;

import com.careerquery.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Bu sətir AuthService-dəki qırmızı xətanı aradan qaldıracaq:
    Optional<User> findByEmail(String email);
}