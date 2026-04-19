"""Report generation for dead code detection."""

import json
from pathlib import Path
from typing import List, Optional
from .detector import Finding, CodeQualityMetric, Severity
from .config import Config


class Reporter:
    """Generates reports from dead code findings."""

    def __init__(self, config: Optional[Config] = None):
        """Initialize the reporter.

        Args:
            config: Configuration for the reporter
        """
        self.config = config or Config()

    def generate_markdown_report(self, findings: List[Finding], metrics: dict) -> str:
        """Generate a markdown report.

        Args:
            findings: List of dead code findings
            metrics: Dictionary of code quality metrics

        Returns:
            Markdown formatted report
        """
        report = []

        # Title
        report.append("# Dead Code Detection Report\n")

        # Summary
        report.append("## Summary\n")
        report.append(f"- **Total Findings**: {len(findings)}\n")
        report.append(f"- **Severity Distribution**:\n")
        report.append(f"  - Critical: {len([f for f in findings if f.severity == Severity.CRITICAL])}\n")
        report.append(f"  - High: {len([f for f in findings if f.severity == Severity.HIGH])}\n")
        report.append(f"  - Medium: {len([f for f in findings if f.severity == Severity.MEDIUM])}\n")
        report.append(f"  - Low: {len([f for f in findings if f.severity == Severity.LOW])}\n")

        # Findings by type
        report.append("\n## Findings by Type\n")
        for finding_type in ["import", "function", "class", "module"]:
            type_findings = [f for f in findings if f.type == finding_type]
            if type_findings:
                report.append(f"### {finding_type.capitalize()}\n")
                for finding in type_findings:
                    report.append(f"- **{finding.name}** ({finding.severity.value})\n")
                    report.append(f"  - File: `{finding.file_path}`\n")
                    report.append(f"  - Description: {finding.description}\n")
                    report.append(f"  - Confidence: {finding.confidence.value}\n")
                report.append("\n")

        # Code Quality Metrics
        report.append("\n## Code Quality Metrics\n")
        for metric_name, metric in metrics.items():
            status_emoji = "✓" if metric.status == "ok" else "⚠"
            report.append(f"- {status_emoji} **{metric_name}**: {metric.value}\n")
            if metric.threshold and metric.status == "warning":
                report.append(f"  - Threshold: {metric.threshold}\n")

        # Recommendations
        if self.config.include_recommendations:
            report.append("\n## Recommendations\n")
            self._add_recommendations(report, findings)

        return "".join(report)

    def generate_json_report(self, findings: List[Finding], metrics: dict) -> str:
        """Generate a JSON report.

        Args:
            findings: List of dead code findings
            metrics: Dictionary of code quality metrics

        Returns:
            JSON formatted report
        """
        report = {
            "summary": {
                "total_findings": len(findings),
                "findings_by_severity": {
                    "critical": len([f for f in findings if f.severity == Severity.CRITICAL]),
                    "high": len([f for f in findings if f.severity == Severity.HIGH]),
                    "medium": len([f for f in findings if f.severity == Severity.MEDIUM]),
                    "low": len([f for f in findings if f.severity == Severity.LOW])
                }
            },
            "findings": [
                {
                    "type": f.type,
                    "severity": f.severity.value,
                    "confidence": f.confidence.value,
                    "file_path": f.file_path,
                    "line_number": f.line_number,
                    "name": f.name,
                    "description": f.description,
                    "context": f.context
                }
                for f in findings
            ],
            "metrics": {
                metric_name: {
                    "name": metric.name,
                    "value": metric.value,
                    "threshold": metric.threshold,
                    "status": metric.status
                }
                for metric_name, metric in metrics.items()
            }
        }

        return json.dumps(report, indent=2)

    def _add_recommendations(self, report: list, findings: List[Finding]):
        """Add recommendations to the report.

        Args:
            report: List to append recommendations to
            findings: List of dead code findings
        """
        # Remove unused imports first
        import_findings = [f for f in findings if f.type == "import"]
        if import_findings:
            report.append("1. **Remove unused imports** - These can be safely deleted:\n")
            for finding in import_findings[:5]:  # Show top 5
                report.append(f"   - `{finding.name}` in `{finding.file_path}`\n")
            if len(import_findings) > 5:
                report.append(f"   - ... and {len(import_findings) - 5} more\n")
            report.append("\n")

        # Remove unused functions
        function_findings = [f for f in findings if f.type == "function"]
        if function_findings:
            report.append("2. **Review unused functions** - Consider if these are needed:\n")
            for finding in function_findings[:5]:
                report.append(f"   - `{finding.name}` in `{finding.file_path}`\n")
            if len(function_findings) > 5:
                report.append(f"   - ... and {len(function_findings) - 5} more\n")
            report.append("\n")

        # Remove unused classes
        class_findings = [f for f in findings if f.type == "class"]
        if class_findings:
            report.append("3. **Review unused classes** - Consider if these are needed:\n")
            for finding in class_findings[:5]:
                report.append(f"   - `{finding.name}` in `{finding.file_path}`\n")
            if len(class_findings) > 5:
                report.append(f"   - ... and {len(class_findings) - 5} more\n")
            report.append("\n")

        # Code quality improvements
        report.append("4. **Improve code quality** - Consider refactoring:\n")
        report.append("   - Break down long functions into smaller, focused ones\n")
        report.append("   - Reduce nesting depth for better readability\n")
        report.append("\n")

    def save_report(self, findings: List[Finding], metrics: dict, output_path: str):
        """Save report to file.

        Args:
            findings: List of dead code findings
            metrics: Dictionary of code quality metrics
            output_path: Path to save the report
        """
        output_path = Path(output_path)

        if self.config.output_format in ["markdown", "both"]:
            markdown_report = self.generate_markdown_report(findings, metrics)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.with_suffix('.md').write_text(markdown_report)

        if self.config.output_format in ["json", "both"]:
            json_report = self.generate_json_report(findings, metrics)
            output_path.with_suffix('.json').write_text(json_report)