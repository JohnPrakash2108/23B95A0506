package com.affordmedical.backend.modal;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "short_urls", uniqueConstraints = @UniqueConstraint(columnNames = "shortcode"))
public class ShortUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalUrl;

    @Column(nullable = false, unique = true)
    private String shortcode;

    @Column(nullable = false)
    private Instant expiry;

    @Column(nullable = false)
    private Instant createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortcode() { return shortcode; }
    public void setShortcode(String shortcode) { this.shortcode = shortcode; }

    public Instant getExpiry() { return expiry; }
    public void setExpiry(Instant expiry) { this.expiry = expiry; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
} 