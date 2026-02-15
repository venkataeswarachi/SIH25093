"""
Prompt templates for LLM-based resume generation.
"""

SYSTEM_PROMPT = """You are an expert professional resume writer specializing in creating
ATS-optimized resumes for university students. You write concise, impactful, and
quantified descriptions. You never fabricate information — only enhance what is provided.
Always use strong action verbs and focus on achievements over responsibilities."""


def build_summary_prompt(data: dict) -> str:
    """Build prompt for generating a professional summary."""
    student = data.get("student", {})
    academics = data.get("academics", {})
    projects = data.get("projects", [])
    achievements = data.get("achievements", [])
    target_role = data.get("target_role", "")

    skills_str = ", ".join(student.get("skills", []) or [])
    proj_titles = ", ".join([p.get("title", "") for p in projects[:4]])
    ach_titles = ", ".join([a.get("title", "") for a in achievements[:3]])

    prompt = f"""Write a 3-4 sentence professional summary for a resume.

Student Profile:
- Name: {student.get('name', 'N/A')}
- Course: {academics.get('course', 'N/A')} in {academics.get('branch', 'N/A')}
- Year: {academics.get('year', 'N/A')}, CGPA: {academics.get('cgpa', 'N/A')}
- Skills: {skills_str or 'Not specified'}
- Key Projects: {proj_titles or 'None listed'}
- Achievements: {ach_titles or 'None listed'}
"""
    if target_role:
        prompt += f"- Target Role: {target_role}\n"

    prompt += """
Requirements:
- 3-4 concise sentences maximum
- Use strong action verbs
- Mention the degree, key skills, and standout achievement if available
- If a target role is specified, tailor the summary toward it
- Do NOT fabricate any information
- Return ONLY the summary text, no labels or headers"""

    return prompt


def build_project_enhancement_prompt(project: dict, target_role: str = "") -> str:
    """Build prompt for enhancing a single project description."""
    prompt = f"""Rewrite this project description for a professional resume in 2-3 bullet points.

Project Title: {project.get('title', 'N/A')}
Original Description: {project.get('description', 'N/A')}
Student's Role: {project.get('role', 'N/A')}
GitHub: {project.get('gitlink', 'N/A')}
Live Demo: {project.get('deploylink', 'N/A')}
"""
    if target_role:
        prompt += f"Target Role: {target_role}\n"

    prompt += """
Requirements:
- Start each bullet with a strong action verb (Developed, Engineered, Implemented, etc.)
- Include technologies used if inferable from the description
- Keep each bullet under 20 words
- Do NOT fabricate metrics or technologies not mentioned
- Return ONLY the bullet points, one per line, each starting with •"""

    return prompt


def build_achievement_enhancement_prompt(achievement: dict) -> str:
    """Build prompt for polishing an achievement description."""
    prompt = f"""Rewrite this achievement for a professional resume as a single impactful line.

Title: {achievement.get('title', 'N/A')}
Category: {achievement.get('category', 'N/A')}
Description: {achievement.get('description', 'N/A')}

Requirements:
- Single line, under 20 words
- Start with an action verb or strong descriptor
- Include the category context (hackathon, competition, certification, etc.)
- Do NOT fabricate details
- Return ONLY the polished line, no labels"""

    return prompt


# --- Fallback templates (no LLM needed) ---

def fallback_summary(data: dict) -> str:
    """Template-based summary when no LLM API is available."""
    student = data.get("student", {})
    academics = data.get("academics", {})
    projects = data.get("projects", [])
    achievements = data.get("achievements", [])
    target_role = data.get("target_role", "")

    name = student.get("name", "Student")
    course = academics.get("course", "")
    branch = academics.get("branch", "")
    year = academics.get("year", "")
    cgpa = academics.get("cgpa", "")
    skills = student.get("skills", []) or []

    parts = []
    parts.append(
        f"Motivated {course} {branch} student in Year {year}"
        + (f" with a CGPA of {cgpa}" if cgpa else "")
        + "."
    )

    if skills:
        top_skills = skills[:5]
        parts.append(f"Proficient in {', '.join(top_skills)}.")

    if projects:
        parts.append(f"Hands-on experience with {len(projects)} project(s) including {projects[0].get('title', 'various projects')}.")

    if achievements:
        parts.append(f"Recognized for {achievements[0].get('title', 'academic excellence')}.")

    if target_role:
        parts.append(f"Seeking opportunities in {target_role}.")

    return " ".join(parts)


def fallback_project_enhance(project: dict) -> str:
    """Template-based project enhancement."""
    title = project.get("title", "Project")
    desc = project.get("description", "")
    role = project.get("role", "")

    lines = []
    if desc:
        lines.append(f"• Developed {title}: {desc[:100]}")
    else:
        lines.append(f"• Developed {title}")
    if role:
        lines.append(f"• Served as {role} in the project team")
    if project.get("gitlink"):
        lines.append(f"• Source code available on GitHub")
    if project.get("deploylink"):
        lines.append(f"• Successfully deployed to production")

    return "\n".join(lines)


def fallback_achievement_enhance(achievement: dict) -> str:
    """Template-based achievement enhancement."""
    title = achievement.get("title", "Achievement")
    category = achievement.get("category", "")
    
    if category:
        return f"Awarded {title} in {category}"
    return title
