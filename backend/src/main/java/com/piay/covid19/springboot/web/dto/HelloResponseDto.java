package com.piay.covid19.springboot.web.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


@Getter   //generate get methods for all declared fields
@RequiredArgsConstructor //generate constructor for fields with final
public class HelloResponseDto {
    private final String name;
    private final int amount;
}
