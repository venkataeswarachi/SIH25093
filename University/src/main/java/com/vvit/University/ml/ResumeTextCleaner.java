package com.vvit.University.ml;

import org.springframework.stereotype.Component;

@Component
public class ResumeTextCleaner {

    public String clean(String text) {

        if (text == null) return "";

        // remove weird tokens & junk
        text = text.replaceAll("(?i)new york.*", "");
        text = text.replaceAll("(?i)washington.*", "");
        text = text.replaceAll("(?i)university.*", "");

        // remove duplicate words
        text = text.replaceAll("\\b(\\w+)( \\1\\b)+", "$1");

        return text.trim();
    }
}
