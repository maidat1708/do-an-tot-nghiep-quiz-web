package com.example.common.request;

import org.springframework.data.annotation.Id;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductKafkaRequest{
    @Id
    int id;
    String name;
    String description;
    double price;
    long view;
}
