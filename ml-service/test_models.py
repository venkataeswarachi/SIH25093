"""
ML Service Test Suite with Metrics — Comprehensive evaluation of all ML models.
Tests: Skills Classifier, Project Ranker, Achievement Scorer, ATS Scorer.
Generates performance metrics and detailed reports.
"""

import json
import sys
import time
import statistics
from pathlib import Path
from typing import List, Dict, Tuple
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s"
)
logger = logging.getLogger("ml_test_suite")

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from services.skills_classifier import classify_skills, SKILL_TAXONOMY
from services.project_ranker import rank_projects
from services.achievement_scorer import score_achievements
from services.ats_scorer import compute_ats_score


# ========================== METRICS CLASSES ==========================

class MetricsCollector:
    """Collects and computes metrics for model evaluation."""
    
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.execution_times = []
        self.scores = []
        self.results = []
        self.errors = []
        self.start_time = None
        self.total_samples = 0
        
    def start(self):
        """Start timing."""
        self.start_time = time.time()
    
    def end(self):
        """End timing and record."""
        if self.start_time:
            elapsed = time.time() - self.start_time
            self.execution_times.append(elapsed)
            self.start_time = None
            return elapsed
        return 0
    
    def add_score(self, score: float):
        """Add a score result."""
        if isinstance(score, (int, float)):
            self.scores.append(float(score))
    
    def add_result(self, result: any):
        """Add detailed result."""
        self.results.append(result)
    
    def add_error(self, error: str):
        """Record an error."""
        self.errors.append(error)
    
    def get_metrics(self) -> Dict:
        """Compute and return all metrics."""
        total_tests = self.total_samples
        successful = total_tests - len(self.errors)
        
        metrics = {
            "model": self.model_name,
            "total_samples": total_tests,
            "successful": successful,
            "failed": len(self.errors),
            "success_rate": round(successful / total_tests * 100, 2) if total_tests > 0 else 0,
        }
        
        # Execution time metrics
        if self.execution_times:
            metrics["execution_time"] = {
                "total_seconds": round(sum(self.execution_times), 3),
                "avg_seconds": round(statistics.mean(self.execution_times), 4),
                "min_seconds": round(min(self.execution_times), 4),
                "max_seconds": round(max(self.execution_times), 4),
                "median_seconds": round(statistics.median(self.execution_times), 4),
                "stdev_seconds": round(statistics.stdev(self.execution_times), 4) if len(self.execution_times) > 1 else 0,
            }
        
        # Score metrics
        if self.scores:
            metrics["scores"] = {
                "count": len(self.scores),
                "mean": round(statistics.mean(self.scores), 3),
                "median": round(statistics.median(self.scores), 3),
                "min": round(min(self.scores), 3),
                "max": round(max(self.scores), 3),
                "stdev": round(statistics.stdev(self.scores), 3) if len(self.scores) > 1 else 0,
            }
        
        return metrics
    
    def print_summary(self):
        """Print summary metrics."""
        metrics = self.get_metrics()
        print(f"\n{'='*70}")
        print(f"MODEL: {metrics['model']}")
        print(f"{'='*70}")
        print(f"Total Samples:     {metrics['total_samples']}")
        print(f"Successful:        {metrics['successful']}")
        print(f"Failed:            {metrics['failed']}")
        print(f"Success Rate:      {metrics['success_rate']}%")
        
        if "execution_time" in metrics:
            et = metrics["execution_time"]
            print(f"\nExecution Time:")
            print(f"  Total:   {et['total_seconds']}s")
            print(f"  Average: {et['avg_seconds']}s")
            print(f"  Min:     {et['min_seconds']}s")
            print(f"  Max:     {et['max_seconds']}s")
            print(f"  Median:  {et['median_seconds']}s")
            print(f"  StdDev:  {et['stdev_seconds']}s")
        
        if "scores" in metrics:
            scores = metrics["scores"]
            print(f"\nScore Distribution:")
            print(f"  Count:   {scores['count']}")
            print(f"  Mean:    {scores['mean']}")
            print(f"  Median:  {scores['median']}")
            print(f"  Min:     {scores['min']}")
            print(f"  Max:     {scores['max']}")
            print(f"  StdDev:  {scores['stdev']}")
        
        return metrics


# ========================== SKILLS CLASSIFIER TESTS ==========================

def test_skills_classifier(test_data: List[Dict], sample_size: int = None) -> Tuple[MetricsCollector, Dict]:
    """Test skills classification model."""
    metrics = MetricsCollector("Skills Classifier (TF-IDF + Random Forest)")
    
    # Determine sample size
    if sample_size is None:
        sample_size = min(len(test_data), 500)
    
    test_sample = test_data[:sample_size]
    metrics.total_samples = len(test_sample)
    
    print(f"\n[TEST] Skills Classifier | Testing {len(test_sample)} samples...")
    
    coverage_stats = {
        "categorized_skills": 0,
        "uncategorized_skills": 0,
        "total_skills": 0,
        "categories_used": set(),
        "category_distribution": {}
    }
    
    for idx, resume in enumerate(test_sample):
        try:
            metrics.start()
            
            # Get skills
            skills = resume["student"].get("skills", [])
            if not skills:
                continue
            
            coverage_stats["total_skills"] += len(skills)
            
            # Classify
            classified = classify_skills(skills)
            
            elapsed = metrics.end()
            
            # Collect metrics
            for category, skills_list in classified.items():
                coverage_stats["categories_used"].add(category)
                coverage_stats["category_distribution"][category] = \
                    coverage_stats["category_distribution"].get(category, 0) + len(skills_list)
                
                if category != "Other":
                    coverage_stats["categorized_skills"] += len(skills_list)
                else:
                    coverage_stats["uncategorized_skills"] += len(skills_list)
            
            metrics.add_result({
                "input_skills": len(skills),
                "categories": len(classified),
                "categorized": coverage_stats["categorized_skills"],
                "time_ms": round(elapsed * 1000, 2)
            })
            
        except Exception as e:
            metrics.add_error(f"Sample {idx}: {str(e)}")
            logger.error(f"Error processing sample {idx}: {e}")
    
    # Compute coverage rate
    if coverage_stats["total_skills"] > 0:
        coverage_rate = (coverage_stats["categorized_skills"] / coverage_stats["total_skills"]) * 100
        coverage_stats["coverage_rate"] = round(coverage_rate, 2)
    
    print(f"  ✓ Processed {metrics.total_samples - len(metrics.errors)} samples successfully")
    print(f"  ✓ Coverage Rate: {coverage_stats.get('coverage_rate', 0)}%")
    print(f"  ✓ Categories Used: {len(coverage_stats['categories_used'])}/{len(SKILL_TAXONOMY)}")
    
    return metrics, coverage_stats


# ========================== PROJECT RANKER TESTS ==========================

def test_project_ranker(test_data: List[Dict], sample_size: int = None) -> Tuple[MetricsCollector, Dict]:
    """Test project ranking model."""
    metrics = MetricsCollector("Project Ranker (Sentence Transformers)")
    
    # Determine sample size
    if sample_size is None:
        sample_size = min(len(test_data), 300)
    
    test_sample = test_data[:sample_size]
    metrics.total_samples = len(test_sample)
    
    print(f"\n[TEST] Project Ranker | Testing {len(test_sample)} samples...")
    
    ranking_stats = {
        "total_projects": 0,
        "ranked_projects": 0,
        "avg_score_per_resume": 0,
        "score_range": {"min": 1.0, "max": 0.0},
        "relevance_distributions": []
    }
    
    for idx, resume in enumerate(test_sample):
        try:
            metrics.start()
            
            # Get projects and target role
            projects = resume.get("projects", [])
            target_role = resume.get("target_role", "")
            
            if not projects:
                continue
            
            ranking_stats["total_projects"] += len(projects)
            
            # Rank
            ranked = rank_projects(projects, target_role)
            
            elapsed = metrics.end()
            
            # Collect metrics
            if ranked:
                ranking_stats["ranked_projects"] += len(ranked)
                scores = [p.get("relevance_score", 0) for p in ranked]
                
                if scores:
                    metrics.add_score(statistics.mean(scores))
                    ranking_stats["avg_score_per_resume"] = statistics.mean(
                        [statistics.mean([p.get("relevance_score", 0) for p in ranked])]
                    )
                    
                    ranking_stats["score_range"]["min"] = min(
                        ranking_stats["score_range"]["min"],
                        min(scores)
                    )
                    ranking_stats["score_range"]["max"] = max(
                        ranking_stats["score_range"]["max"],
                        max(scores)
                    )
                
                metrics.add_result({
                    "input_projects": len(projects),
                    "ranked_projects": len(ranked),
                    "avg_relevance_score": round(statistics.mean(scores), 3) if scores else 0,
                    "time_ms": round(elapsed * 1000, 2)
                })
            
        except Exception as e:
            metrics.add_error(f"Sample {idx}: {str(e)}")
            logger.error(f"Error processing sample {idx}: {e}")
    
    print(f"  ✓ Processed {metrics.total_samples - len(metrics.errors)} samples successfully")
    print(f"  ✓ Total Projects Ranked: {ranking_stats['ranked_projects']}/{ranking_stats['total_projects']}")
    print(f"  ✓ Score Range: {ranking_stats['score_range']['min']:.3f} - {ranking_stats['score_range']['max']:.3f}")
    
    return metrics, ranking_stats


# ========================== ACHIEVEMENT SCORER TESTS ==========================

def test_achievement_scorer(test_data: List[Dict], sample_size: int = None) -> Tuple[MetricsCollector, Dict]:
    """Test achievement scoring model."""
    metrics = MetricsCollector("Achievement Scorer (Keyword Heuristics)")
    
    # Determine sample size
    if sample_size is None:
        sample_size = min(len(test_data), 400)
    
    test_sample = test_data[:sample_size]
    metrics.total_samples = len(test_sample)
    
    print(f"\n[TEST] Achievement Scorer | Testing {len(test_sample)} samples...")
    
    achievement_stats = {
        "total_achievements": 0,
        "scored_achievements": 0,
        "score_distribution": {
            "high_impact": 0,    # > 0.7
            "medium_impact": 0,  # 0.4 - 0.7
            "low_impact": 0,     # < 0.4
        },
        "category_distribution": {}
    }
    
    for idx, resume in enumerate(test_sample):
        try:
            metrics.start()
            
            # Get achievements
            achievements = resume.get("achievements", [])
            if not achievements:
                continue
            
            achievement_stats["total_achievements"] += len(achievements)
            
            # Score
            scored = score_achievements(achievements)
            
            elapsed = metrics.end()
            
            # Collect metrics
            achievement_stats["scored_achievements"] += len(scored)
            
            for ach in scored:
                score = ach.get("impact_score", 0)
                metrics.add_score(score)
                
                # Categorize by impact
                if score > 0.7:
                    achievement_stats["score_distribution"]["high_impact"] += 1
                elif score >= 0.4:
                    achievement_stats["score_distribution"]["medium_impact"] += 1
                else:
                    achievement_stats["score_distribution"]["low_impact"] += 1
                
                # Category stats
                category = ach.get("category", "Unknown")
                achievement_stats["category_distribution"][category] = \
                    achievement_stats["category_distribution"].get(category, 0) + 1
            
            metrics.add_result({
                "input_achievements": len(achievements),
                "scored_achievements": len(scored),
                "avg_impact_score": round(statistics.mean([a.get("impact_score", 0) for a in scored]), 3),
                "time_ms": round(elapsed * 1000, 2)
            })
            
        except Exception as e:
            metrics.add_error(f"Sample {idx}: {str(e)}")
            logger.error(f"Error processing sample {idx}: {e}")
    
    print(f"  ✓ Processed {metrics.total_samples - len(metrics.errors)} samples successfully")
    print(f"  ✓ Total Achievements Scored: {achievement_stats['scored_achievements']}/{achievement_stats['total_achievements']}")
    print(f"  ✓ High Impact: {achievement_stats['score_distribution']['high_impact']}")
    print(f"  ✓ Medium Impact: {achievement_stats['score_distribution']['medium_impact']}")
    print(f"  ✓ Low Impact: {achievement_stats['score_distribution']['low_impact']}")
    
    return metrics, achievement_stats


# ========================== ATS SCORER TESTS ==========================

def test_ats_scorer(test_data: List[Dict], sample_size: int = None) -> Tuple[MetricsCollector, Dict]:
    """Test ATS scoring model."""
    metrics = MetricsCollector("ATS Scorer (TF-IDF + Keyword Matching)")
    
    # Determine sample size
    if sample_size is None:
        sample_size = min(len(test_data), 300)
    
    test_sample = test_data[:sample_size]
    metrics.total_samples = len(test_sample)
    
    print(f"\n[TEST] ATS Scorer | Testing {len(test_sample)} samples...")
    
    ats_stats = {
        "total_resumes": 0,
        "scored_resumes": 0,
        "score_range": {"min": 100.0, "max": 0.0},
        "score_distribution": {
            "excellent": 0,    # > 80
            "good": 0,         # 60-80
            "average": 0,      # 40-60
            "poor": 0,         # < 40
        },
        "target_role_distribution": {}
    }
    
    for idx, resume in enumerate(test_sample):
        try:
            metrics.start()
            
            # Build resume text
            student = resume.get("student", {})
            academics = resume.get("academics", {})
            projects = resume.get("projects", [])
            achievements = resume.get("achievements", [])
            target_role = resume.get("target_role", "Software Engineer")
            
            ats_stats["total_resumes"] += 1
            
            # Build comprehensive resume text
            resume_text = f"""
            {student.get('name', '')} {student.get('email', '')}
            {academics.get('branch', '')} {academics.get('course', '')} CGPA: {academics.get('cgpa', 0)}
            Skills: {', '.join(student.get('skills', []))}
            {' '.join([p.get('description', '') for p in projects])}
            {' '.join([a.get('title', '') for a in achievements])}
            """
            
            # Score ATS
            ats_score = compute_ats_score(resume_text, target_role)
            
            elapsed = metrics.end()
            
            # Collect metrics
            ats_stats["scored_resumes"] += 1
            metrics.add_score(ats_score)
            
            # Update range
            ats_stats["score_range"]["min"] = min(ats_stats["score_range"]["min"], ats_score)
            ats_stats["score_range"]["max"] = max(ats_stats["score_range"]["max"], ats_score)
            
            # Score distribution
            if ats_score > 80:
                ats_stats["score_distribution"]["excellent"] += 1
            elif ats_score >= 60:
                ats_stats["score_distribution"]["good"] += 1
            elif ats_score >= 40:
                ats_stats["score_distribution"]["average"] += 1
            else:
                ats_stats["score_distribution"]["poor"] += 1
            
            # Target role distribution
            ats_stats["target_role_distribution"][target_role] = \
                ats_stats["target_role_distribution"].get(target_role, 0) + 1
            
            metrics.add_result({
                "target_role": target_role,
                "ats_score": round(ats_score, 2),
                "time_ms": round(elapsed * 1000, 2)
            })
            
        except Exception as e:
            metrics.add_error(f"Sample {idx}: {str(e)}")
            logger.error(f"Error processing sample {idx}: {e}")
    
    print(f"  ✓ Processed {metrics.total_samples - len(metrics.errors)} samples successfully")
    print(f"  ✓ Excellent (>80): {ats_stats['score_distribution']['excellent']}")
    print(f"  ✓ Good (60-80): {ats_stats['score_distribution']['good']}")
    print(f"  ✓ Average (40-60): {ats_stats['score_distribution']['average']}")
    print(f"  ✓ Poor (<40): {ats_stats['score_distribution']['poor']}")
    print(f"  ✓ Score Range: {ats_stats['score_range']['min']:.2f} - {ats_stats['score_range']['max']:.2f}")
    
    return metrics, ats_stats


# ========================== MAIN TEST EXECUTION ==========================

def load_test_data(filepath: str = "data/test_data_samples.json") -> List[Dict]:
    """Load test data from JSON file."""
    if not Path(filepath).exists():
        raise FileNotFoundError(f"Test data not found: {filepath}")
    
    with open(filepath, "r") as f:
        return json.load(f)


def generate_test_report(all_metrics: Dict, all_stats: Dict) -> str:
    """Generate comprehensive test report."""
    report = []
    report.append("\n" + "="*80)
    report.append("ML SERVICE — COMPREHENSIVE TEST REPORT")
    report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("="*80)
    
    # Overall statistics
    total_samples = sum(m.total_samples for m in all_metrics.values())
    total_successful = sum(m.total_samples - len(m.errors) for m in all_metrics.values())
    overall_success = (total_successful / (total_samples * 4)) * 100 if total_samples > 0 else 0
    
    report.append(f"\nOVERALL STATISTICS")
    report.append("-" * 80)
    report.append(f"Total Test Samples: {total_samples}")
    report.append(f"Overall Success Rate: {overall_success:.2f}%")
    report.append(f"Test Models: 4 (Skills Classifier, Project Ranker, Achievement Scorer, ATS Scorer)")
    
    # Model metrics
    report.append(f"\nMODEL PERFORMANCE METRICS")
    report.append("-" * 80)
    
    for model_name, metrics in all_metrics.items():
        model_metrics = metrics.get_metrics()
        report.append(f"\n{model_metrics['model']}")
        report.append(f"  Success Rate: {model_metrics['success_rate']}%")
        
        if "execution_time" in model_metrics:
            et = model_metrics["execution_time"]
            report.append(f"  Avg Execution Time: {et['avg_seconds']:.4f}s")
        
        if "scores" in model_metrics:
            scores = model_metrics["scores"]
            report.append(f"  Score Mean: {scores['mean']:.3f}")
            report.append(f"  Score Range: {scores['min']:.3f} - {scores['max']:.3f}")
    
    # Detailed statistics
    report.append(f"\nDETAILED STATISTICS BY MODEL")
    report.append("-" * 80)
    
    if "skills_classifier" in all_stats:
        sc_stats = all_stats["skills_classifier"]
        report.append(f"\n[SKILLS CLASSIFIER]")
        report.append(f"  Coverage Rate: {sc_stats.get('coverage_rate', 0)}%")
        report.append(f"  Categories Used: {len(sc_stats.get('categories_used', set()))}")
        report.append(f"  Categorized Skills: {sc_stats.get('categorized_skills', 0)}")
    
    if "project_ranker" in all_stats:
        pr_stats = all_stats["project_ranker"]
        report.append(f"\n[PROJECT RANKER]")
        report.append(f"  Total Projects: {pr_stats.get('total_projects', 0)}")
        report.append(f"  Score Range: {pr_stats['score_range']['min']:.3f} - {pr_stats['score_range']['max']:.3f}")
    
    if "achievement_scorer" in all_stats:
        as_stats = all_stats["achievement_scorer"]
        report.append(f"\n[ACHIEVEMENT SCORER]")
        report.append(f"  Total Achievements: {as_stats.get('total_achievements', 0)}")
        dist = as_stats.get('score_distribution', {})
        report.append(f"  High Impact: {dist.get('high_impact', 0)}")
        report.append(f"  Medium Impact: {dist.get('medium_impact', 0)}")
        report.append(f"  Low Impact: {dist.get('low_impact', 0)}")
    
    if "ats_scorer" in all_stats:
        ats_stats = all_stats["ats_scorer"]
        report.append(f"\n[ATS SCORER]")
        report.append(f"  Score Range: {ats_stats['score_range']['min']:.2f} - {ats_stats['score_range']['max']:.2f}")
        dist = ats_stats.get('score_distribution', {})
        report.append(f"  Excellent (>80): {dist.get('excellent', 0)}")
        report.append(f"  Good (60-80): {dist.get('good', 0)}")
        report.append(f"  Average (40-60): {dist.get('average', 0)}")
        report.append(f"  Poor (<40): {dist.get('poor', 0)}")
    
    report.append("\n" + "="*80)
    report.append("END OF REPORT")
    report.append("="*80 + "\n")
    
    return "\n".join(report)


def save_test_report(report: str, filename: str = "test_report.txt"):
    """Save test report to file."""
    filepath = f"results/{filename}"
    
    # Ensure directory exists
    import os
    os.makedirs("results", exist_ok=True)
    
    with open(filepath, "w") as f:
        f.write(report)
    
    print(f"\n✓ Test report saved to: {filepath}")
    return filepath


def save_metrics_json(all_metrics: Dict, all_stats: Dict, filename: str = "metrics.json"):
    """Save all metrics to JSON file."""
    filepath = f"results/{filename}"
    
    # Ensure directory exists
    import os
    os.makedirs("results", exist_ok=True)
    
    # Convert metrics to dictionaries
    metrics_dict = {}
    for name, m in all_metrics.items():
        metrics_dict[name] = m.get_metrics()
    
    data = {
        "timestamp": datetime.now().isoformat(),
        "metrics": metrics_dict,
        "statistics": all_stats
    }
    
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"✓ Metrics saved to: {filepath}")
    return filepath


# ========================== MAIN ==========================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("ML SERVICE TEST SUITE — COMPREHENSIVE MODEL EVALUATION")
    print("="*80)
    
    try:
        # Load test data
        print("\n[INIT] Loading test data...")
        test_data = load_test_data()
        print(f"✓ Loaded {len(test_data)} test samples")
        
        # Initialize metrics collectors
        all_metrics = {}
        all_stats = {}
        
        # Run tests
        print("\n[RUN] Starting comprehensive tests...\n")
        
        # Test 1: Skills Classifier
        metrics_sc, stats_sc = test_skills_classifier(test_data)
        all_metrics["skills_classifier"] = metrics_sc
        all_stats["skills_classifier"] = stats_sc
        
        # Test 2: Project Ranker
        metrics_pr, stats_pr = test_project_ranker(test_data)
        all_metrics["project_ranker"] = metrics_pr
        all_stats["project_ranker"] = stats_pr
        
        # Test 3: Achievement Scorer
        metrics_as, stats_as = test_achievement_scorer(test_data)
        all_metrics["achievement_scorer"] = metrics_as
        all_stats["achievement_scorer"] = stats_as
        
        # Test 4: ATS Scorer
        metrics_ats, stats_ats = test_ats_scorer(test_data)
        all_metrics["ats_scorer"] = metrics_ats
        all_stats["ats_scorer"] = stats_ats
        
        # Print summary for each model
        print("\n[SUMMARY] Model Performance Summaries:\n")
        for name, metrics in all_metrics.items():
            metrics.print_summary()
        
        # Generate and save reports
        print("\n[REPORT] Generating comprehensive report...")
        report = generate_test_report(all_metrics, all_stats)
        print(report)
        
        # Save reports
        save_test_report(report)
        save_metrics_json(all_metrics, all_stats)
        
        print("\n✓ All tests completed successfully!")
        
    except FileNotFoundError as e:
        print(f"\n✗ Error: {e}")
        print("Please first run: python generate_test_data.py")
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
