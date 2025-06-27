package com.affordmedical.backend.repository;

import com.affordmedical.backend.modal.ShortUrl;
import com.affordmedical.backend.modal.ShortUrlClick;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShortUrlClickRepository extends JpaRepository<ShortUrlClick, Long> {
    List<ShortUrlClick> findAllByShortUrl(ShortUrl shortUrl);
} 