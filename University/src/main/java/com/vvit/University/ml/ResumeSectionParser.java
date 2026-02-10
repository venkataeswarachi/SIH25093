package com.vvit.University.ml;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
@Component
public class ResumeSectionParser {

    public Map<String, String> parse(String text) {

        Map<String, String> sections = new HashMap<>();

        sections.put("summary", safeExtract(text, "SUMMARY:", "EDUCATION:"));
        sections.put("education", safeExtract(text, "EDUCATION:", "ACHIEVEMENTS:"));
        sections.put("achievements", safeExtract(text, "ACHIEVEMENTS:", "LINKS:"));
        sections.put("links", safeExtract(text, "LINKS:", null));

        return sections;
    }

    private String safeExtract(String text, String start, String end) {

        int startIndex = text.indexOf(start);
        if (startIndex == -1) {
            return ""; // section missing
        }

        startIndex += start.length();

        int endIndex;
        if (end == null) {
            endIndex = text.length();
        } else {
            endIndex = text.indexOf(end, startIndex);
            if (endIndex == -1) {
                endIndex = text.length(); // end section missing
            }
        }

        if (startIndex > endIndex) {
            return "";
        }

        return text.substring(startIndex, endIndex).trim();
    }
}
