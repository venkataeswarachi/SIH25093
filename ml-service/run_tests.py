"""
Quick Start Script — Automatically generates test data and runs all tests.
Single command to evaluate the entire ML Service.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Run a command and handle errors."""
    print(f"\n{'='*80}")
    print(f"[RUN] {description}")
    print(f"{'='*80}")
    print(f"Command: {' '.join(cmd)}\n")
    
    try:
        result = subprocess.run(cmd, capture_output=False, text=True)
        if result.returncode != 0:
            print(f"\n✗ Error: Command failed with exit code {result.returncode}")
            return False
        print(f"\n✓ {description} completed successfully")
        return True
    except Exception as e:
        print(f"\n✗ Error running command: {e}")
        return False

def main():
    """Main execution function."""
    print("\n" + "="*80)
    print("ML SERVICE TEST FRAMEWORK — QUICK START")
    print("="*80)
    print("\nThis script will:")
    print("  1. Generate 750 test data samples")
    print("  2. Run comprehensive tests on all ML models")
    print("  3. Generate detailed performance metrics and reports")
    print("  4. Save results to results/ directory")
    
    # Check if we're in the right directory
    if not Path("generate_test_data.py").exists() or not Path("test_models.py").exists():
        print("\n✗ Error: Must run from ml-service directory")
        print("  Current directory:", os.getcwd())
        sys.exit(1)
    
    # Step 1: Generate test data
    print("\n" + "-"*80)
    print("STEP 1: Generate Test Data")
    print("-"*80)
    
    success = run_command(
        [sys.executable, "generate_test_data.py"],
        "Test Data Generation"
    )
    
    if not success:
        print("\n✗ Test data generation failed")
        sys.exit(1)
    
    # Verify test data was created
    if not Path("data/test_data_samples.json").exists():
        print("\n✗ Test data file not created")
        sys.exit(1)
    
    # Step 2: Run tests
    print("\n" + "-"*80)
    print("STEP 2: Run ML Model Tests")
    print("-"*80)
    
    success = run_command(
        [sys.executable, "test_models.py"],
        "ML Model Test Suite"
    )
    
    if not success:
        print("\n✗ Model tests failed")
        sys.exit(1)
    
    # Step 3: Display results
    print("\n" + "="*80)
    print("✓ ALL TESTS COMPLETED SUCCESSFULLY!")
    print("="*80)
    
    # Check generated files
    files_check = [
        ("data/test_data_samples.json", "Test Data"),
        ("results/test_report.txt", "Test Report"),
        ("results/metrics.json", "Metrics JSON"),
    ]
    
    print("\n✓ Generated Files:")
    for filepath, desc in files_check:
        if Path(filepath).exists():
            file_size = Path(filepath).stat().st_size
            print(f"  ✓ {desc:20} - {filepath:40} ({file_size:,} bytes)")
        else:
            print(f"  ? {desc:20} - {filepath:40} (not found)")
    
    # Print result summary
    print("\n" + "="*80)
    print("NEXT STEPS")
    print("="*80)
    print("\n1. View Test Report:")
    print(f"   cat results/test_report.txt")
    print("\n2. View Detailed Metrics (JSON):")
    print(f"   cat results/metrics.json")
    print("\n3. Analyze Results:")
    print(f"   - Check success rates for each model")
    print(f"   - Review execution time benchmarks")
    print(f"   - Examine score distributions")
    print("\n4. Run Tests Again:")
    print(f"   python run_tests.py")
    print("\n" + "="*80)

if __name__ == "__main__":
    main()
