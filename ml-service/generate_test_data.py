"""
Generate test data for ML Service — 500-1000 realistic resume samples.
Used to test and evaluate model performance.
"""

import json
import random
from typing import List, Dict
from datetime import datetime

# ========================== STATIC DATA ==========================

FIRST_NAMES = [
    "Aarav", "Aditya", "Ananya", "Arjun", "Aryan", "Ashwini",
    "Aisha", "Akshay", "Amit", "Anjali", "Ankita", "Anuj",
    "Apurva", "Arun", "Ashish", "Atul", "Avni", "Ayush",
    "Bhavin", "Bhavna", "Bhavya", "Bikram", "Bipin",
    "Chirag", "Chitra", "Chhaya",
    "Deepak", "Deepa", "Deepti", "Dev", "Devendra", "Dhriti",
    "Divya", "Diwakar", "Diya",
    "Esha", "Eshanth",
    "Faisal", "Farzan", "Fiza",
    "Gaurav", "Gauravi", "Gautam", "Geetanjali", "Geetika", "Gitika",
    "Gitanjali", "Grishma", "Gunjan",
    "Hanuman", "Harshal", "Harshitha", "Harshvardhan", "Hemanth",
    "Hiral", "Harsh", "Harshit", "Hemkumar", "Hemant",
    "Ishan", "Ishita", "Ishwar", "Isha",
    "Jatin", "Jasmine", "Jaya", "Jayadip", "Jerome", "Jinal", "Jitendra",
    "Jnanadeep", "Johnson", "Jolly", "Joshi", "Joslin", "Joyita", "Julian",
    "Juljit",
    "Karan", "Karanvir", "Karina", "Karuna", "Kashmira", "Kaveri",
    "Kavya", "Kirthi", "Kirthiga", "Kiteesh", "Kshitij", "Kumari", "Kundan",
    "Kuniteja", "Kusum", "Kavitha", "Kalyan", "Kamal",
    "Lakshmi", "Lakshya", "Lata", "Lavanya", "Leela", "Leena",
    "Lilan", "Lima", "Likith", "Lipika", "Lochan", "Logan", "Lohit", "Lokesh",
    "Lokit", "Loveleen", "Lovely", "Lovia", "Lupita", "Lydia",
]

LAST_NAMES = [
    "Sharma", "Singh", "Patel", "Kumar", "Verma", "Gupta",
    "Mishra", "Yadav", "Pandey", "Rao", "Nair", "Iyer",
    "Reddy", "Menon", "Dutta", "Roy", "Sen", "Das",
    "Krishnan", "Subramanian", "Pillai", "Sinha", "Biswas",
    "Majumdar", "Bhat", "Hegde", "Desai", "Joshi", "Saxena",
]

BRANCHES = [
    "Computer Science", "Information Technology", "Electronics and Communication",
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
    "Aerospace Engineering", "Instrumentation Engineering"
]

PROGRAMMING_LANGUAGES = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust",
    "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "SQL"
]

WEB_FRAMEWORKS = [
    "React", "Angular", "Vue.js", "Next.js", "Express.js", "Django", "Flask",
    "FastAPI", "Spring Boot", "ASP.NET", "Laravel", "Rails", "NestJS"
]

DATABASES = [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "DynamoDB",
    "Cassandra", "Neo4j", "Oracle", "SQL Server", "Elasticsearch"
]

TOOLS = [
    "Git", "GitHub", "Docker", "Kubernetes", "Jenkins", "AWS", "Azure",
    "GCP", "Terraform", "Jira", "Postman", "Figma", "VS Code", "IntelliJ"
]

PROJECT_TITLES = [
    "AI Resume Builder", "E-commerce Platform", "Social Media App",
    "Mobile Banking App", "Cloud Storage Service", "Chat Application",
    "Video Streaming Platform", "Weather Forecasting System", "Expense Tracker",
    "Project Management Tool", "Blog Platform", "Music Recommendation System",
    "Real-time Collaboration Tool", "IoT Dashboard", "ML Text Classifier",
    "Recommendation Engine", "Vehicle Tracking System", "Supply Chain Manager",
    "Employee Management System", "Learning Management System"
]

PROJECT_DESCRIPTIONS = [
    "Built a full-stack application with microservices architecture",
    "Developed RESTful APIs using scalable backend services",
    "Created responsive UI with modern frontend frameworks",
    "Implemented real-time features using WebSockets",
    "Optimized database queries reducing latency by 40%",
    "Deployed on cloud infrastructure with auto-scaling",
    "Integrated third-party APIs for enhanced functionality",
    "Implemented authentication and authorization system",
    "Conducted unit and integration testing with 85% coverage",
    "Performed code reviews and mentored junior developers",
    "Implemented CI/CD pipeline for automated deployment",
    "Created comprehensive documentation and API specifications",
    "Designed system architecture for scalability",
    "Implemented caching strategies for performance optimization",
    "Collaborated with cross-functional teams using Agile methodology"
]

ACHIEVEMENT_TITLES = [
    "1st Place in National Hackathon", "Published Research Paper at International Conference",
    "Gold Medal in Programming Competition", "Secured Scholarship for Academic Excellence",
    "Winner of ML Hackathon 2024", "2nd Place in Software Engineering Competition",
    "Selected for Google Summer of Code", "Certified Kubernetes Administrator",
    "AWS Solutions Architect Certification", "Data Science Specialist Award",
    "Best Innovation Award in University", "Topper in Data Structures Course",
    "Won Startup Competition with 50K Prize", "Published 3 Research Papers",
    "Speaker at Tech Conference 2024", "Organized Successfully 3 Hackathons",
    "Mentored 10+ Students in Coding", "Contributed to Open Source Projects",
    "Participated in ICPC Regional Competition", "Ranked Top 1% in University"
]

ROLES = [
    "Software Engineer", "Full Stack Developer", "Frontend Engineer",
    "Backend Engineer", "Data Scientist", "ML Engineer", "DevOps Engineer",
    "Cloud Architect", "Product Manager", "Technical Lead", "Solutions Architect"
]

CATEGORIES = {
    "achievement": ["Hackathon", "Competition", "Research", "Publication", "Certification", "Award", "Sports", "Cultural", "Volunteer"],
}

TARGET_ROLES = [
    "Software Engineer", "Full Stack Developer", "Frontend Engineer",
    "Backend Engineer", "Data Scientist", "ML Engineer", "DevOps Engineer",
    "Cloud Architect", "Senior Software Engineer", "Tech Lead"
]


# ========================== GENERATION FUNCTIONS ==========================

def generate_email(first_name: str, last_name: str) -> str:
    """Generate realistic email addresses."""
    domains = ["gmail.com", "outlook.com", "yahoo.com", "company.com"]
    name_format = random.choice([
        f"{first_name.lower()}.{last_name.lower()}",
        f"{first_name.lower()}{random.randint(1000, 9999)}",
        f"{first_name[0]}{last_name.lower()}{random.randint(100, 999)}",
    ])
    return f"{name_format}@{random.choice(domains)}"


def generate_student_info() -> Dict:
    """Generate student information."""
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    skills = random.sample(
        PROGRAMMING_LANGUAGES + WEB_FRAMEWORKS + DATABASES + TOOLS,
        k=random.randint(5, 15)
    )
    
    return {
        "name": f"{first_name} {last_name}",
        "email": generate_email(first_name, last_name),
        "mobile": random.randint(7000000000, 9999999999),
        "skills": skills,
        "gitlink": f"https://github.com/{first_name.lower()}{last_name.lower()}",
        "portfolio": f"https://{first_name.lower()}-portfolio.com",
    }


def generate_academic_info() -> Dict:
    """Generate academic information."""
    year = random.randint(1, 4)
    semester = random.randint(1, 2)
    batch = f"20{random.randint(20, 23)}"
    section = random.choice(["A", "B", "C", "D"])
    
    return {
        "course": "B.Tech",
        "branch": random.choice(BRANCHES),
        "year": year,
        "semester": semester,
        "cgpa": round(random.uniform(6.5, 10.0), 2),
        "batch": batch,
        "section": section,
    }


def generate_projects(count: int = None) -> List[Dict]:
    """Generate project information."""
    if count is None:
        count = random.randint(2, 6)
    
    projects = []
    for i in range(count):
        projects.append({
            "title": random.choice(PROJECT_TITLES) + f" v{i+1}",
            "description": ". ".join(random.sample(PROJECT_DESCRIPTIONS, k=random.randint(2, 4))),
            "role": random.choice(ROLES),
            "gitlink": f"https://github.com/user/project-{i+1}",
            "deploylink": f"https://project-{i+1}-demo.com",
        })
    return projects


def generate_achievements(count: int = None) -> List[Dict]:
    """Generate achievement information."""
    if count is None:
        count = random.randint(3, 8)
    
    achievements = []
    for i in range(min(count, len(ACHIEVEMENT_TITLES))):
        title = ACHIEVEMENT_TITLES[i]
        achievements.append({
            "title": title,
            "category": random.choice(CATEGORIES["achievement"]),
            "description": f"Achieved {title.lower()} with recognition from {random.choice(['University', 'Company', 'Organization', 'Online Platform'])}",
        })
    return achievements


def generate_resume_sample() -> Dict:
    """Generate a single complete resume sample."""
    return {
        "student": generate_student_info(),
        "academics": generate_academic_info(),
        "projects": generate_projects(),
        "achievements": generate_achievements(),
        "target_role": random.choice(TARGET_ROLES),
        "template": random.choice(["professional", "modern", "creative", "academic"]),
    }


def generate_test_dataset(num_samples: int = 500) -> List[Dict]:
    """Generate complete test dataset."""
    print(f"Generating {num_samples} test resume samples...")
    dataset = []
    
    for i in range(num_samples):
        if (i + 1) % 100 == 0:
            print(f"  Generated {i + 1}/{num_samples} samples...")
        
        dataset.append(generate_resume_sample())
    
    print(f"✓ Successfully generated {num_samples} samples!")
    return dataset


def save_test_data(dataset: List[Dict], filename: str = "test_data_samples.json"):
    """Save test data to JSON file."""
    filepath = f"data/{filename}"
    
    # Ensure directory exists
    import os
    os.makedirs("data", exist_ok=True)
    
    with open(filepath, "w") as f:
        json.dump(dataset, f, indent=2)
    
    print(f"✓ Test data saved to: {filepath}")
    return filepath


# ========================== MAIN EXECUTION ==========================

if __name__ == "__main__":
    # Generate 500 to 1000 samples (use 750 as default)
    NUM_SAMPLES = 750
    
    # Generate dataset
    test_data = generate_test_dataset(num_samples=NUM_SAMPLES)
    
    # Save to file
    save_test_data(test_data, "test_data_samples.json")
    
    # Print summary
    print("\n" + "="*60)
    print("TEST DATA GENERATION SUMMARY")
    print("="*60)
    print(f"Total Samples: {len(test_data)}")
    print(f"Sample Structure:")
    print(f"  - Student Info: name, email, mobile, skills, gitlink, portfolio")
    print(f"  - Academic Info: course, branch, year, semester, cgpa, batch, section")
    print(f"  - Projects: 2-6 per sample (title, description, role, links)")
    print(f"  - Achievements: 3-8 per sample (title, category, description)")
    print(f"  - Target Role: varies across tech roles")
    print("\nSample Fields:")
    if test_data:
        sample = test_data[0]
        print(f"\nFirst Sample (index 0):")
        print(f"  Student: {sample['student']['name']} ({sample['student']['email']})")
        print(f"  Branch: {sample['academics']['branch']}")
        print(f"  CGPA: {sample['academics']['cgpa']}")
        print(f"  Skills (count): {len(sample['student']['skills'])}")
        print(f"  Projects (count): {len(sample['projects'])}")
        print(f"  Achievements (count): {len(sample['achievements'])}")
        print(f"  Target Role: {sample['target_role']}")
