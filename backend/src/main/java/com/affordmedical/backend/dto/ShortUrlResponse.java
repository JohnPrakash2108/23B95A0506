package com.affordmedical.backend.dto;

public class ShortUrlResponse {
    private String shortLink;
    private String expiry;

    public ShortUrlResponse() {}
    public ShortUrlResponse(String shortLink, String expiry) {
        this.shortLink = shortLink;
        this.expiry = expiry;
    }

    public String getShortLink() { return shortLink; }
    public void setShortLink(String shortLink) { this.shortLink = shortLink; }

    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }
} 