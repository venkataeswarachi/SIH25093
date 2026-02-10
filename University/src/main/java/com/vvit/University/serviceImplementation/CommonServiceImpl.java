package com.vvit.University.serviceImplementation;

import com.vvit.University.models.Notices;
import com.vvit.University.payload.NoticeDTO;
import com.vvit.University.repository.NoticeRepository;
import com.vvit.University.services.CommonService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class CommonServiceImpl implements CommonService {

    private static final String NOTICE_DIR = "notices/";
    @Autowired
    private NoticeRepository noticeRepository;

    @Transactional
    public ResponseEntity<String> postNotice(
            String title,
            String description,
            MultipartFile file,
            String adminEmail
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        Files.createDirectories(Paths.get(NOTICE_DIR));

        String storedFileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(NOTICE_DIR + storedFileName);
        Files.copy(file.getInputStream(), filePath,
                StandardCopyOption.REPLACE_EXISTING);

        Notices notice = new Notices();
        notice.setTitle(title);
        notice.setDescription(description);
        notice.setFileName(file.getOriginalFilename());
        notice.setStoredFileName(storedFileName);
        notice.setFilePath(filePath.toString());
        notice.setContentType(file.getContentType());
        notice.setPostedBy(adminEmail);

        noticeRepository.save(notice);

        return ResponseEntity.ok("Notice posted successfully");
    }

    @Override
    public List<NoticeDTO> getAllNotices() {

        return noticeRepository.findAll()
                .stream()
                .map(n -> {
                    NoticeDTO dto = new NoticeDTO();
                    dto.setNoticeId(n.getNoticeId());
                    dto.setTitle(n.getTitle());
                    dto.setDescription(n.getDescription());
                    dto.setPostedAt(n.getPostedAt());
                    return dto;
                })
                .toList();
    }
    @Override
    public ResponseEntity<Resource> viewNotice(Long noticeId)
            throws IOException {

        Notices notice = noticeRepository.findById(noticeId)
                .orElseThrow(() ->
                        new RuntimeException("Notice not found"));

        Path path = Paths.get(notice.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(notice.getContentType())
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                notice.getFileName() + "\""
                )
                .body(resource);
    }
}
