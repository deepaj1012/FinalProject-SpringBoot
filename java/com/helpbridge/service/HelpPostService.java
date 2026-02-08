package com.helpbridge.service;

import com.helpbridge.model.HelpPost;
import com.helpbridge.model.NGO;
import com.helpbridge.repository.HelpPostRepository;
import com.helpbridge.repository.NGORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HelpPostService {

    @Autowired
    private HelpPostRepository helpPostRepository;

    @Autowired
    private NGORepository ngoRepository;

    public HelpPost createPost(HelpPost post, Long ngoId) {
        NGO ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        post.setNgo(ngo);
        post.setCity(ngo.getCity()); // Default to NGO city
        return helpPostRepository.save(post);
    }

    public List<HelpPost> getAllPosts() {
        return helpPostRepository.findAll();
    }

    public List<HelpPost> getPostsByStatus(String status) {
        return helpPostRepository.findByStatus(status);
    }

    public List<HelpPost> getPostsByNgo(Long ngoId) {
        return helpPostRepository.findByNgoId(ngoId);
    }

    public void completePost(Long postId) {
        HelpPost post = helpPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("COMPLETED");
        helpPostRepository.save(post);
    }

    public void donate(Long postId, Double amount) {
        HelpPost post = helpPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCollectedAmount(post.getCollectedAmount() + amount);
        helpPostRepository.save(post);
    }
}
