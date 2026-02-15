"""
Prompt templates for LLM-based resume generation.
FAANG-grade: XYZ formula, STAR method, strong action verbs, quantified impact.
"""

import re

# ---------------------------------------------------------------------------
# Action verb banks (categorized for variety)
# ---------------------------------------------------------------------------

ACTION_VERBS = {
    "build": ["Engineered", "Architected", "Developed", "Built", "Constructed", "Designed"],
    "improve": ["Optimized", "Streamlined", "Enhanced", "Accelerated", "Revamped", "Improved"],
    "lead": ["Spearheaded", "Led", "Orchestrated", "Directed", "Championed", "Drove"],
    "create": ["Pioneered", "Launched", "Established", "Introduced", "Initiated", "Created"],
    "analyze": ["Analyzed", "Investigated", "Evaluated", "Assessed", "Researched", "Examined"],
    "implement": ["Implemented", "Deployed", "Integrated", "Executed", "Delivered", "Shipped"],
}

# Technology extraction patterns
TECH_PATTERNS = {
    "React": r"\breact(?:\.?js)?\b",
    "Angular": r"\bangular\b",
    "Vue.js": r"\bvue(?:\.?js)?\b",
    "Next.js": r"\bnext(?:\.?js)?\b",
    "Node.js": r"\bnode(?:\.?js)?\b",
    "Express": r"\bexpress(?:\.?js)?\b",
    "Spring Boot": r"\bspring\s*boot\b",
    "Django": r"\bdjango\b",
    "Flask": r"\bflask\b",
    "FastAPI": r"\bfastapi\b",
    "Python": r"\bpython\b",
    "Java": r"\bjava\b(?!\s*script)",
    "JavaScript": r"\bjavascript\b",
    "TypeScript": r"\btypescript\b",
    "Go": r"\bgo(?:lang)?\b",
    "Rust": r"\brust\b",
    "C++": r"\bc\+\+\b",
    "MySQL": r"\bmysql\b",
    "PostgreSQL": r"\bpostgre(?:sql)?\b",
    "MongoDB": r"\bmongo(?:db)?\b",
    "Redis": r"\bredis\b",
    "Docker": r"\bdocker\b",
    "Kubernetes": r"\bkubernetes|k8s\b",
    "AWS": r"\baws\b",
    "GCP": r"\bgcp|google\s*cloud\b",
    "Azure": r"\bazure\b",
    "TensorFlow": r"\btensorflow\b",
    "PyTorch": r"\bpytorch\b",
    "scikit-learn": r"\bscikit|sklearn\b",
    "NLP": r"\bnlp\b",
    "REST API": r"\brest(?:ful)?\s*api\b",
    "GraphQL": r"\bgraphql\b",
    "WebSocket": r"\bwebsocket\b",
    "JWT": r"\bjwt\b",
    "OAuth": r"\boauth\b",
    "CI/CD": r"\bci/?cd\b",
    "Git": r"\bgit(?!hub|link)\b",
    "Kafka": r"\bkafka\b",
    "RabbitMQ": r"\brabbitmq\b",
    "Elasticsearch": r"\belasticsearch\b",
    "HTML/CSS": r"\bhtml.*css|css.*html\b",
    "Tailwind CSS": r"\btailwind\b",
    "Bootstrap": r"\bbootstrap\b",
    "Machine Learning": r"\bmachine\s*learning\b",
    "Deep Learning": r"\bdeep\s*learning\b",
    "Computer Vision": r"\bcomputer\s*vision|opencv\b",
    "Selenium": r"\bselenium\b",
    "Hibernate": r"\bhibernate|jpa\b",
    "Firebase": r"\bfirebase\b",
    "Supabase": r"\bsupabase\b",
    "Stripe": r"\bstripe\b",
    "Sentence Transformers": r"\bsentence[- ]?transform\b",
}

# Feature/capability patterns for impact extraction
FEATURE_PATTERNS = [
    (r"role[- ]based\s+access", "role-based access control (RBAC)"),
    (r"authentication|auth\b", "secure authentication system"),
    (r"real[- ]?time", "real-time data synchronization"),
    (r"payment\s*gateway", "payment gateway integration"),
    (r"notification|push\s*notif", "automated notification system"),
    (r"recommendation", "intelligent recommendation engine"),
    (r"search|filter", "advanced search and filtering"),
    (r"dashboard|analytics", "interactive analytics dashboard"),
    (r"crud|manage.*record", "full CRUD operations"),
    (r"upload|file\s*manag", "file management system"),
    (r"deploy|production|ci/?cd", "CI/CD pipeline with automated deployment"),
    (r"responsive|mobile[- ]first", "responsive mobile-first design"),
    (r"caching|redis", "caching layer for performance optimization"),
    (r"api\s*integrat", "third-party API integrations"),
    (r"tracking|monitor|order\s*track", "comprehensive tracking and monitoring"),
    (r"scalab", "horizontally scalable architecture"),
    (r"microservice", "microservices architecture"),
    (r"testing|unit\s*test|jest|junit", "comprehensive test suite"),
    (r"attendance", "automated attendance tracking system"),
    (r"marks|grading|score", "marks management and grading module"),
    (r"notice|announcement", "dynamic notice/announcement board"),
]


def _extract_techs(text: str) -> list[str]:
    """Extract technology names from free text."""
    found = []
    text_lower = text.lower()
    for tech, pattern in TECH_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            found.append(tech)
    return found


def _extract_features(text: str) -> list[str]:
    """Extract notable features/capabilities from description."""
    found = []
    text_lower = text.lower()
    for pattern, label in FEATURE_PATTERNS:
        if re.search(pattern, text_lower):
            found.append(label)
    return found[:4]


def _pick_verb(category: str, index: int = 0) -> str:
    """Pick a varied action verb from a category."""
    verbs = ACTION_VERBS.get(category, ACTION_VERBS["build"])
    return verbs[abs(index) % len(verbs)]


# ---------------------------------------------------------------------------
# System prompt for LLM
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are a senior technical resume writer who has helped candidates land roles at
Google, Meta, Amazon, Microsoft, and top startups. You write resumes that are:

1. ATS-optimized with strategic keyword placement
2. Impact-driven using the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"
3. Technically precise -- never fabricate technologies or metrics
4. Concise yet comprehensive -- every word earns its place

Resume principles you follow:
- Lead every bullet with a strong, unique action verb (never repeat verbs)
- Quantify impact wherever possible (users, performance, time saved, scale)
- Highlight technical decisions and architecture choices
- Show progression: what you built, how you built it, what impact it had
- Use present tense for current roles, past tense for completed projects"""


# ---------------------------------------------------------------------------
# LLM Prompt Builders
# ---------------------------------------------------------------------------

def build_summary_prompt(data: dict) -> str:
    """Build prompt for generating a FAANG-quality professional summary."""
    student = data.get("student", {})
    academics = data.get("academics", {})
    projects = data.get("projects", [])
    achievements = data.get("achievements", [])
    target_role = data.get("target_role", "")

    skills_str = ", ".join(student.get("skills", []) or [])
    proj_details = "; ".join([
        f"{p.get('title', '')} ({p.get('role', '')}): {p.get('description', '')[:80]}"
        for p in projects[:4]
    ])
    ach_details = "; ".join([
        f"{a.get('title', '')} - {a.get('description', '')[:60]}"
        for a in achievements[:3]
    ])

    prompt = f"""Write a powerful 3-4 sentence professional summary for a top-tier tech resume.

Candidate Profile:
- Education: {academics.get('course', 'N/A')} in {academics.get('branch', 'N/A')}, Year {academics.get('year', 'N/A')}
- CGPA: {academics.get('cgpa', 'N/A')}/10
- Technical Skills: {skills_str or 'Not specified'}
- Projects: {proj_details or 'None listed'}
- Achievements: {ach_details or 'None listed'}
- GitHub: {student.get('gitlink', 'N/A')}
- Portfolio: {student.get('portfolio', 'N/A')}
"""
    if target_role:
        prompt += f"- Target Role: {target_role}\n"

    prompt += """
Requirements:
- First sentence: Identity + strongest qualifier (e.g., "Results-driven CSE student with X.XX CGPA...")
- Second sentence: Core technical competencies and what you've built with them
- Third sentence: Standout achievement or unique differentiator
- Optional fourth: Career aspiration aligned with target role
- Use power words: architected, spearheaded, engineered, delivered, scaled
- NO generic filler ("hardworking", "passionate about learning")
- NO fabricated metrics or technologies
- Return ONLY the summary paragraph, no headers or labels"""

    return prompt


def build_project_enhancement_prompt(project: dict, target_role: str = "") -> str:
    """Build prompt for FAANG-quality project bullet points."""
    prompt = f"""Rewrite this project for a top-tier tech resume using 3-4 impactful bullet points.

Project: {project.get('title', 'N/A')}
Description: {project.get('description', 'N/A')}
Role: {project.get('role', 'N/A')}
GitHub: {project.get('gitlink', 'N/A')}
Live Demo: {project.get('deploylink', 'N/A')}
"""
    if target_role:
        prompt += f"Target Role: {target_role}\n"

    prompt += """
Requirements:
- Each bullet starts with a UNIQUE strong action verb (Engineered, Architected, Implemented, Deployed, etc.)
- Use XYZ formula: "Accomplished [X] by implementing [Y] resulting in [Z]"
- Include specific technologies mentioned in the description
- Mention architecture decisions (e.g., "using microservices architecture", "with JWT-based auth")
- If GitHub/deploy link exists, mention open-source contribution or production deployment
- Each bullet: 15-25 words, technically precise
- Do NOT fabricate any technologies, metrics, or features not inferable from the description
- Start each line with a dash (-)
- Return ONLY the bullet points"""

    return prompt


def build_achievement_enhancement_prompt(achievement: dict) -> str:
    """Build prompt for a FAANG-quality achievement line."""
    prompt = f"""Rewrite this achievement as a powerful single-line resume bullet.

Title: {achievement.get('title', 'N/A')}
Category: {achievement.get('category', 'N/A')}
Description: {achievement.get('description', 'N/A')}

Requirements:
- Single impactful line, 15-25 words
- Lead with a strong action verb or quantifier
- Include competitive context (e.g., "among 5,000+ participants", "top 50 nationally")
- Mention the specific domain/technology if relevant
- Do NOT fabricate numbers not present in the description -- but DO include numbers that are mentioned
- Return ONLY the polished line"""

    return prompt


# ============================================================================
# FALLBACK TEMPLATES -- No LLM needed, but still FAANG-quality
# ============================================================================

def fallback_summary(data: dict) -> str:
    """Generate a strong professional summary without LLM."""
    student = data.get("student", {})
    academics = data.get("academics", {})
    projects = data.get("projects", [])
    achievements = data.get("achievements", [])
    target_role = data.get("target_role", "")
    skills = student.get("skills", []) or []

    course = academics.get("course", "")
    branch = academics.get("branch", "")
    year = academics.get("year", "")
    cgpa = academics.get("cgpa", 0)

    # --- Sentence 1: Identity + Qualifier ---
    qualifiers = []
    if cgpa and float(cgpa) >= 8.5:
        qualifiers.append(f"high-achieving (CGPA: {cgpa}/10)")
    elif cgpa and float(cgpa) >= 7.5:
        qualifiers.append(f"strong academic record (CGPA: {cgpa}/10)")

    if len(projects) >= 3:
        qualifiers.append(f"with {len(projects)}+ end-to-end project deliveries")
    elif projects:
        qualifiers.append("with hands-on project experience")

    qualifier_str = ", ".join(qualifiers[:2])
    s1 = f"Results-driven {course} {branch} student"
    if year:
        s1 += f" (Year {year})"
    if qualifier_str:
        s1 += f", {qualifier_str}"
    s1 += "."

    # --- Sentence 2: Technical competencies ---
    if skills:
        top_skills = skills[:6]
        if len(top_skills) > 2:
            skill_str = ", ".join(top_skills[:-1]) + f", and {top_skills[-1]}"
        elif len(top_skills) == 2:
            skill_str = f"{top_skills[0]} and {top_skills[1]}"
        else:
            skill_str = top_skills[0]

        # Detect what they've built
        if projects:
            domains = set()
            for p in projects:
                desc_lower = (p.get("description", "") or "").lower()
                title_lower = (p.get("title", "") or "").lower()
                combined = f"{desc_lower} {title_lower}"
                if any(w in combined for w in ["web", "frontend", "backend", "full-stack", "full stack", "management system"]):
                    domains.add("full-stack web applications")
                if any(w in combined for w in ["ml", "machine learning", "ai", "nlp", "deep learning", "resume"]):
                    domains.add("ML-powered intelligent systems")
                if any(w in combined for w in ["mobile", "android", "ios", "flutter"]):
                    domains.add("cross-platform mobile applications")
                if any(w in combined for w in ["api", "microservice", "backend"]):
                    domains.add("scalable backend services and APIs")
                if any(w in combined for w in ["e-commerce", "ecommerce", "shop", "payment"]):
                    domains.add("production-grade e-commerce platforms")
                if not domains:
                    domains.add("software solutions")

            domain_str = " and ".join(list(domains)[:2])
            s2 = f"Proficient in {skill_str}, with demonstrated expertise in architecting {domain_str}."
        else:
            s2 = f"Proficient in {skill_str}, with a strong foundation in software engineering, system design, and algorithmic problem-solving."
    else:
        s2 = "Strong technical foundation with experience across multiple technology stacks and software engineering paradigms."

    # --- Sentence 3: Standout achievement ---
    s3 = ""
    if achievements:
        top_ach = achievements[0]
        title = top_ach.get("title", "")
        desc = top_ach.get("description", "")
        category = (top_ach.get("category", "") or "").lower()

        # Extract numbers for quantification
        numbers = re.findall(r'\d[\d,]*', desc)
        quant_str = f" (among {numbers[0]}+ candidates)" if numbers else ""

        if "hackathon" in category or "competition" in category:
            s3 = f"Recognized as {title}{quant_str}, demonstrating exceptional problem-solving and innovation under competitive pressure."
        elif "research" in category or "publication" in category:
            s3 = f"Published researcher with work on {title}, contributing original methodologies to the academic community."
        elif "certification" in category:
            s3 = f"Industry-certified professional, having earned {title}, validating domain expertise."
        else:
            s3 = f"Distinguished by {title}{quant_str}, reflecting consistent dedication to technical excellence."

    # --- Sentence 4: Career aspiration ---
    if target_role:
        s4 = f"Actively seeking {target_role} opportunities to engineer impactful, scalable solutions and contribute to high-performance engineering teams."
    else:
        s4 = "Eager to contribute to high-performance engineering teams building products that scale to millions of users."

    parts = [s1, s2]
    if s3:
        parts.append(s3)
    parts.append(s4)

    return " ".join(parts)


def fallback_project_enhance(project: dict) -> str:
    """Generate FAANG-quality project bullets without LLM."""
    title = project.get("title", "Project")
    desc = project.get("description", "") or ""
    role = project.get("role", "") or ""
    gitlink = project.get("gitlink", "")
    deploylink = project.get("deploylink", "")

    # Extract technologies and features from all text
    all_text = f"{title} {desc} {role}"
    techs = _extract_techs(all_text)
    features = _extract_features(all_text)

    lines = []
    verb_idx = abs(hash(title)) % 6  # deterministic but varied per project

    # --- Bullet 1: What was built + tech stack (architecture-level) ---
    tech_str = ""
    if techs:
        if len(techs) >= 3:
            tech_str = f" leveraging {', '.join(techs[:3])}" + (f", and {techs[3]}" if len(techs) > 3 else "")
        elif len(techs) == 2:
            tech_str = f" leveraging {techs[0]} and {techs[1]}"
        else:
            tech_str = f" leveraging {techs[0]}"

    verb1 = _pick_verb("build", verb_idx)
    # Clean up description for bullet
    desc_clean = desc.strip().rstrip(".")
    if len(desc_clean) > 130:
        # Truncate at word boundary
        desc_clean = desc_clean[:130].rsplit(" ", 1)[0] + "..."
    # Lowercase first word unless it's an acronym
    if desc_clean:
        words = desc_clean.split()
        if words and len(words[0]) > 2 and words[0].isalpha() and not words[0].isupper():
            desc_clean = desc_clean[0].lower() + desc_clean[1:]

    lines.append(f"- {verb1} {desc_clean}{tech_str}")

    # --- Bullet 2: Key features / architecture decisions ---
    if features:
        verb2 = _pick_verb("implement", verb_idx + 1)
        if len(features) >= 3:
            feat_str = f"{features[0]}, {features[1]}, and {features[2]}"
        elif len(features) == 2:
            feat_str = f"{features[0]} and {features[1]}"
        else:
            feat_str = features[0]
        lines.append(f"- {verb2} {feat_str}, ensuring production-grade reliability and seamless user experience")
    elif role:
        verb2 = _pick_verb("lead", verb_idx + 1)
        lines.append(f"- {verb2} end-to-end system design, development, and testing as {role}, following agile best practices")

    # --- Bullet 3: Impact / deployment / open-source ---
    if deploylink and deploylink.strip():
        verb3 = _pick_verb("create", verb_idx + 2)
        lines.append(f"- {verb3} automated deployment pipeline, shipping a production-ready application serving real users")
    elif gitlink and gitlink.strip():
        verb3 = _pick_verb("create", verb_idx + 2)
        lines.append(f"- {verb3} well-documented open-source codebase, following clean architecture principles and enabling community contribution")
    else:
        verb3 = _pick_verb("improve", verb_idx + 2)
        lines.append(f"- {verb3} system performance through efficient algorithms, modular design patterns, and comprehensive code optimization")

    # --- Optional Bullet 4: Collaboration / scale (if enough features) ---
    if len(features) > 2 or (techs and len(techs) >= 3):
        verb4 = _pick_verb("analyze", verb_idx + 3)
        lines.append(f"- {verb4} system requirements and designed scalable architecture, ensuring maintainability and extensibility")

    return "\n".join(lines)


def fallback_achievement_enhance(achievement: dict) -> str:
    """Generate a strong achievement line without LLM."""
    title = achievement.get("title", "")
    category = (achievement.get("category", "") or "").lower()
    description = achievement.get("description", "") or ""
    combined = f"{title} {description}".lower()

    # Extract numbers from description for quantification
    numbers = re.findall(r'\d[\d,]*', description)

    # Build contextual enhancement based on category
    if "hackathon" in category or "hackathon" in combined:
        if numbers:
            return f"Secured {title}, competing against {numbers[0]}+ teams in a high-intensity innovation challenge"
        return f"Secured {title}, demonstrating rapid prototyping, teamwork, and innovative problem-solving under time constraints"

    if "competition" in category or "coding" in combined or "competitive" in combined:
        if "first" in combined or "1st" in combined or "won" in combined or "winner" in combined:
            qualifier = f"outperforming {numbers[0]}+ participants" if numbers else "through exceptional algorithmic problem-solving"
            return f"Achieved {title}, {qualifier}"
        elif "second" in combined or "2nd" in combined:
            return f"Earned {title}, ranking in the top tier among competitive programmers"
        else:
            return f"Competed in {title}, demonstrating strong algorithmic thinking and coding proficiency"

    if "research" in category or "publish" in combined or "paper" in combined or "journal" in combined:
        if "ieee" in combined:
            return f"Published peer-reviewed research -- {title} -- at IEEE conference, advancing the state of the art"
        elif "acm" in combined:
            return f"Published peer-reviewed research -- {title} -- at ACM conference, contributing novel methodologies"
        else:
            return f"Authored and published research on {title}, demonstrating depth in technical research and scholarly analysis"

    if "certification" in category or "certified" in combined:
        return f"Earned industry certification: {title}, validating professional-level domain proficiency"

    if "scholarship" in combined or "fellowship" in combined:
        return f"Awarded {title} in recognition of outstanding academic performance and technical aptitude"

    if "open source" in combined or "contribution" in combined:
        return f"Contributed to {title}, collaborating with global developers on production-grade open-source software"

    if "lead" in combined or "president" in combined or "head" in combined:
        return f"Led as {title}, driving technical initiatives and mentoring peers in software development practices"

    # Generic but still strong
    if numbers:
        return f"Recognized for {title} (among {numbers[0]}+ candidates), showcasing technical excellence and competitive performance"
    return f"Recognized for {title}, demonstrating sustained technical excellence and high performance"
