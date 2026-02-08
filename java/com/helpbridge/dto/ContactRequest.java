package com.helpbridge.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    private String name;
    private String email;
    private String subject;
    private String message;
}
