package com.affordmedical.backend.dto;

public class ShortUrlRequest {
    private String url;
    private Integer validity;
    private String shortcode;

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getValidity() { return validity; }
    public void setValidity(Integer validity) { this.validity = validity; }

    public String getShortcode() { return shortcode; }
    public void setShortcode(String shortcode) { this.shortcode = shortcode; }
} 