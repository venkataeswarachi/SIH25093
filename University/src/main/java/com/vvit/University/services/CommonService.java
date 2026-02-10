package com.vvit.University.services;

import com.vvit.University.payload.NoticeDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CommonService {
    public ResponseEntity<String> postNotice(
            String title,
            String description,
            MultipartFile file,
            String adminEmail
    ) throws IOException;
    List<NoticeDTO> getAllNotices();
    ResponseEntity<Resource> viewNotice(Long noticeId)
            throws IOException;
}
