package com.helpbridge.repository;

import com.helpbridge.model.HelpPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HelpPostRepository extends JpaRepository<HelpPost, Long> {
    List<HelpPost> findByNgoId(Long ngoId);

    List<HelpPost> findByCity(String city);

    List<HelpPost> findByStatus(String status);
}
