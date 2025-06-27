package com.affordmedical.backend.repository;

import com.affordmedical.backend.modal.ShortUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    Optional<ShortUrl> findByShortcode(String shortcode);
} 