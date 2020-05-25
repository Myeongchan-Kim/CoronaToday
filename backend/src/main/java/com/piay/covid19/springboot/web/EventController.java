package com.piay.covid19.springboot;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {
    @GetMapping("/hello")  // Accepting GET request
    public String hello() {
        return "hello";
    }
}
