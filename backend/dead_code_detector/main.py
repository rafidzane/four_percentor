#!/usr/bin/env python3
"""Main entry point for dead code detection tool."""

import argparse
import sys
from pathlib import Path

from .detector import DeadCodeDetector
from .reporter import Reporter
from .config import Config


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Dead code detection tool for Python backend"
    )
    parser.add_argument(
        "--backend",
        type=str,
        default="backend",
        help="Backend directory to analyze"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="dead_code_report",
        help="Output file path (without extension)"
    )
    parser.add_argument(
        "--mode",
        type=str,
        choices=["quick", "comprehensive", "custom"],
        default="comprehensive",
        help="Analysis mode"
    )
    parser.add_argument(
        "--format",
        type=str,
        choices=["markdown", "json", "both"],
        default="both",
        help="Output format"
    )
    parser.add_argument(
        "--ignore",
        type=str,
        nargs="+",
        help="Additional ignore patterns"
    )

    args = parser.parse_args()

    # Create configuration
    config = Config(
        mode=args.mode,
        output_format=args.format
    )

    if args.ignore:
        config.ignore_patterns.extend(args.ignore)

    # Create detector
    detector = DeadCodeDetector(config)

    # Analyze backend
    print(f"Analyzing backend code in {args.backend}...")
    findings = detector.analyze([args.backend])

    # Generate report
    reporter = Reporter(config)
    reporter.save_report(findings, detector.metrics, args.output)

    # Print summary
    print(f"\n✓ Analysis complete!")
    print(f"✓ Found {len(findings)} dead code items")
    print(f"✓ Report saved to {args.output}.md and {args.output}.json")

    # Exit with error if critical findings found
    critical_count = len([f for f in findings if f.severity == "critical"])
    if critical_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())