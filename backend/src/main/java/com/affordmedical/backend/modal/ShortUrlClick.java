package com.affordmedical.backend.modal;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "short_url_clicks")
public class ShortUrlClick {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_url_id", nullable = false)
    private ShortUrl shortUrl;

    @Column(nullable = false)
    private Instant timestamp;

    private String referrer;
    private String location;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ShortUrl getShortUrl() { return shortUrl; }
    public void setShortUrl(ShortUrl shortUrl) { this.shortUrl = shortUrl; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
} 