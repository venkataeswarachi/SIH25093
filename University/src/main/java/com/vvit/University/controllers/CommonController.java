package com.vvit.University.controllers;

import com.vvit.University.payload.NoticeDTO;
import com.vvit.University.services.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/comm")
public class CommonController {
    @Autowired
    private CommonService commonService;
    @PostMapping("/post/notice")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> postNotice(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam MultipartFile file,
            Authentication authentication
    ) throws IOException {
        return commonService.postNotice(title, description, file, authentication.getName());
    }

    @GetMapping("get/notices")
    public ResponseEntity<List<NoticeDTO>> listNotices() {
        return ResponseEntity.ok(commonService.getAllNotices());
    }

    @GetMapping("/notice/{id}/view")
    public ResponseEntity<Resource> viewNotice(@PathVariable Long id)
            throws IOException {
        return commonService.viewNotice(id);
    }
}
