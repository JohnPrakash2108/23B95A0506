package com.affordmedical.backend.controller;

import com.affordmedical.backend.dto.ShortUrlRequest;
import com.affordmedical.backend.dto.ShortUrlResponse;
import com.affordmedical.backend.dto.ShortUrlStatisticsResponse;
import com.affordmedical.backend.service.ShortUrlService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.servlet.view.RedirectView;
import java.util.List;
import com.affordmedical.backend.dto.ShortUrlListItem;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/shorturls")
public class ShortUrlController {
    private final ShortUrlService shortUrlService;
    private static final Logger logger = LoggerFactory.getLogger(ShortUrlController.class);

    public ShortUrlController(ShortUrlService shortUrlService) {
        this.shortUrlService = shortUrlService;
    }

    @PostMapping
    public ResponseEntity<ShortUrlResponse> createShortUrl(@RequestBody ShortUrlRequest request) {
        ShortUrlResponse response = shortUrlService.createShortUrl(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{shortcode}")
    public ResponseEntity<ShortUrlStatisticsResponse> getStatistics(@PathVariable String shortcode) {
        // logger.info("GET /shorturls/{} called", shortcode);
        ShortUrlStatisticsResponse response = shortUrlService.getStatistics(shortcode);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/{shortcode}", method = RequestMethod.GET, produces = "text/html")
    public ResponseEntity<?> redirectToOriginalUrl(@PathVariable String shortcode, HttpServletRequest request) {
        logger.info("Redirect endpoint called for shortcode: {}", shortcode);
        try {
            String referrer = request.getHeader("Referer");
            String location = "unknown";
            String originalUrl = shortUrlService.handleRedirectAndLogClick(shortcode, referrer, location);
            logger.info("Redirecting to original URL: {}", originalUrl);
            return ResponseEntity.status(302).header("Location", originalUrl).build();
        } catch (IllegalArgumentException e) {
            logger.error("Redirection failed: {}", e.getMessage());
            return ResponseEntity.status(404).body(java.util.Map.of(
                "status", 404,
                "error", "Not Found",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ShortUrlListItem>> getAllShortUrls() {
        List<ShortUrlListItem> urls = shortUrlService.getAllShortUrls();
        return ResponseEntity.ok(urls);
    }
} 