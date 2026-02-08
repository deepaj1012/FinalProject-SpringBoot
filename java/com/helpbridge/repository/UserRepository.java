package com.helpbridge.repository;

import com.helpbridge.enums.RoleType;
import com.helpbridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(RoleType role);

    List<User> findByRoleAndCityIgnoreCase(RoleType role, String city);

    long countByRole(RoleType role);

    long countByRoleAndStatus(RoleType role, com.helpbridge.enums.UserStatus status);
}
