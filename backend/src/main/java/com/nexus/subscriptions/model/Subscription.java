package com.nexus.subscriptions.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "subscriptions")
public class Subscription {
    @Id
    private String id;
    private String name;
    private double cost;
    private String category;
    private String date;
    private String duration;
}
