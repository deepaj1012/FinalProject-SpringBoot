package com.helpbridge.controller;

import com.helpbridge.model.HelpPost;
import com.helpbridge.service.HelpPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/help-posts")
public class HelpPostController {

    @Autowired
    private HelpPostService helpPostService;

    @PostMapping("/{ngoId}")
    public ResponseEntity<HelpPost> createPost(@RequestBody HelpPost post, @PathVariable Long ngoId) {
        return ResponseEntity.ok(helpPostService.createPost(post, ngoId));
    }

    @GetMapping
    public ResponseEntity<List<HelpPost>> getAllPosts() {
        return ResponseEntity.ok(helpPostService.getAllPosts());
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<HelpPost>> getPostsByNgo(@PathVariable Long ngoId) {
        return ResponseEntity.ok(helpPostService.getPostsByNgo(ngoId));
    }

    @PostMapping("/{postId}/complete")
    public ResponseEntity<?> completePost(@PathVariable Long postId) {
        helpPostService.completePost(postId);
        return ResponseEntity.ok().body("{\"message\": \"Post marked as completed\"}");
    }

    @PostMapping("/{postId}/donate")
    public ResponseEntity<?> donate(@PathVariable Long postId, @RequestParam Double amount) {
        helpPostService.donate(postId, amount);
        return ResponseEntity.ok().body("{\"message\": \"Donation successful\"}");
    }
}
