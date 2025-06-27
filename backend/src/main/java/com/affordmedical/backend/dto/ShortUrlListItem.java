package com.affordmedical.backend.dto;

public class ShortUrlListItem {
    private String shortcode;
    private String originalUrl;
    private String createdAt;
    private String expiry;
    private int totalClicks;

    public ShortUrlListItem() {}
    public ShortUrlListItem(String shortcode, String originalUrl, String createdAt, String expiry, int totalClicks) {
        this.shortcode = shortcode;
        this.originalUrl = originalUrl;
        this.createdAt = createdAt;
        this.expiry = expiry;
        this.totalClicks = totalClicks;
    }
    public String getShortcode() { return shortcode; }
    public void setShortcode(String shortcode) { this.shortcode = shortcode; }
    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }
    public int getTotalClicks() { return totalClicks; }
    public void setTotalClicks(int totalClicks) { this.totalClicks = totalClicks; }
} 