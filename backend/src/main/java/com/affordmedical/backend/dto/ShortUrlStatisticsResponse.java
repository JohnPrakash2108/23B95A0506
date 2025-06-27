package com.affordmedical.backend.dto;

import java.util.List;

public class ShortUrlStatisticsResponse {
    private String originalUrl;
    private String shortcode;
    private String createdAt;
    private String expiry;
    private int totalClicks;
    private List<ClickDetail> clicks;

    public static class ClickDetail {
        private String timestamp;
        private String referrer;
        private String location;

        public ClickDetail() {}
        public ClickDetail(String timestamp, String referrer, String location) {
            this.timestamp = timestamp;
            this.referrer = referrer;
            this.location = location;
        }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getReferrer() { return referrer; }
        public void setReferrer(String referrer) { this.referrer = referrer; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    public String getShortcode() { return shortcode; }
    public void setShortcode(String shortcode) { this.shortcode = shortcode; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }
    public int getTotalClicks() { return totalClicks; }
    public void setTotalClicks(int totalClicks) { this.totalClicks = totalClicks; }
    public List<ClickDetail> getClicks() { return clicks; }
    public void setClicks(List<ClickDetail> clicks) { this.clicks = clicks; }
} 