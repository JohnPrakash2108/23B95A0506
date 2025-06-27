package com.affordmedical.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
   
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        return new ResponseEntity<>(
            java.util.Map.of(
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
            ),
            HttpStatus.NOT_FOUND
        );
    }
}
