package com.affordmedical.backend.service;

import com.affordmedical.backend.dto.ShortUrlRequest;
import com.affordmedical.backend.dto.ShortUrlResponse;
import com.affordmedical.backend.dto.ShortUrlStatisticsResponse;
import com.affordmedical.backend.dto.ShortUrlListItem;
import com.affordmedical.backend.modal.ShortUrl;
import com.affordmedical.backend.modal.ShortUrlClick;
import com.affordmedical.backend.repository.ShortUrlRepository;
import com.affordmedical.backend.repository.ShortUrlClickRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ShortUrlService {
    private final ShortUrlRepository repository;
    private final ShortUrlClickRepository clickRepository;
    private static final Logger logger = LoggerFactory.getLogger(ShortUrlService.class);

    @Value("${server.port}")
    private String serverPort;

    public ShortUrlService(ShortUrlRepository repository, ShortUrlClickRepository clickRepository) {
        this.repository = repository;
        this.clickRepository = clickRepository;
    }

    public ShortUrlResponse createShortUrl(ShortUrlRequest request) {
        if (request.getUrl() == null || request.getUrl().isEmpty()) {
            throw new IllegalArgumentException("URL is required");
        }
        String shortcode = request.getShortcode();
        if (shortcode != null && !shortcode.isEmpty()) {
            if (repository.findByShortcode(shortcode).isPresent()) {
                shortcode = generateShortcode();
            }
        } else {
            shortcode = generateShortcode();
        }
        int validity = request.getValidity() != null ? request.getValidity() : 30;
        Instant now = Instant.now();
        Instant expiry = now.plus(validity, ChronoUnit.MINUTES);
        ShortUrl shortUrl = new ShortUrl();
        shortUrl.setOriginalUrl(request.getUrl());
        shortUrl.setShortcode(shortcode);
        shortUrl.setCreatedAt(now);
        shortUrl.setExpiry(expiry);
        repository.save(shortUrl);
        String shortLink = "http://localhost:" + serverPort + "/shorturls/" + shortcode;
        return new ShortUrlResponse(shortLink, expiry.toString());
    }

    private String generateShortcode() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (repository.findByShortcode(code).isPresent());
        return code;
    }

    public ShortUrlStatisticsResponse getStatistics(String shortcode) {
        ShortUrl shortUrl = repository.findByShortcode(shortcode)
                .orElseThrow(() -> new IllegalArgumentException("Shortcode not found"));
        var clicks = clickRepository.findAllByShortUrl(shortUrl);
        ShortUrlStatisticsResponse response = new ShortUrlStatisticsResponse();
        response.setOriginalUrl(shortUrl.getOriginalUrl());
        response.setShortcode(shortUrl.getShortcode());
        response.setCreatedAt(shortUrl.getCreatedAt().toString());
        response.setExpiry(shortUrl.getExpiry().toString());
        response.setTotalClicks(clicks.size());
        response.setClicks(clicks.stream().map(click ->
            new ShortUrlStatisticsResponse.ClickDetail(
                click.getTimestamp().toString(),
                click.getReferrer(),
                click.getLocation()
            )
        ).collect(Collectors.toList()));
        return response;
    }

    public String handleRedirectAndLogClick(String shortcode, String referrer, String location) {
        logger.info("Handling redirect for shortcode: {}", shortcode);
        ShortUrl shortUrl = repository.findByShortcode(shortcode)
                .orElseThrow(() -> new IllegalArgumentException("Shortcode not found"));
        if (shortUrl.getExpiry().isBefore(java.time.Instant.now())) {
            logger.warn("Shortcode {} has expired", shortcode);
            throw new IllegalArgumentException("Shortcode has expired");
        }
        ShortUrlClick click = new ShortUrlClick();
        click.setShortUrl(shortUrl);
        click.setTimestamp(java.time.Instant.now());
        click.setReferrer(referrer);
        click.setLocation(location);
        clickRepository.save(click);
        logger.info("Click logged for shortcode: {}", shortcode);
        return shortUrl.getOriginalUrl();
    }

    public List<ShortUrlListItem> getAllShortUrls() {
        List<ShortUrl> urls = repository.findAll();
        return urls.stream().map(url -> {
            int totalClicks = clickRepository.findAllByShortUrl(url).size();
            return new ShortUrlListItem(
                url.getShortcode(),
                url.getOriginalUrl(),
                url.getCreatedAt().toString(),
                url.getExpiry().toString(),
                totalClicks
            );
        }).collect(Collectors.toList());
    }
} 