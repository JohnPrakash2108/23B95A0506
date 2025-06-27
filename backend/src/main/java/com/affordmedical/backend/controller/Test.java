package com.affordmedical.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/get")
    public ResponseEntity<String> getMessage(){
        return new ResponseEntity<>("Hello World", HttpStatus.OK);
    }
}
