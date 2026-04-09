package com.nexus.subscriptions.controller;

import com.nexus.subscriptions.model.Subscription;
import com.nexus.subscriptions.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionRepository repository;

    public SubscriptionController(SubscriptionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    @PostMapping
    public Subscription addSubscription(@RequestBody Subscription subscription) {
        return repository.save(subscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable String id) {
        return repository.findById(id).map(sub -> {
            repository.delete(sub);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
