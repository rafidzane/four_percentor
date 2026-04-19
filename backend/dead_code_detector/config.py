"""Configuration for dead code detection."""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Config:
    """Configuration for dead code detection."""

    # Analysis scope
    source_roots: List[str] = None
    ignore_patterns: List[str] = None

    # Dead code detection settings
    detect_unused_imports: bool = True
    detect_unused_functions: bool = True
    detect_unused_classes: bool = True
    detect_unused_modules: bool = True

    # Code quality settings
    detect_code_smells: bool = True
    detect_long_functions: bool = True
    detect_deep_nesting: bool = True
    detect_unused_variables: bool = True

    # Analysis modes
    mode: str = "comprehensive"  # quick, comprehensive, custom

    # Thresholds
    max_function_length: int = 50
    max_nesting_depth: int = 4
    min_confidence: str = "high"

    # Output settings
    output_format: str = "both"  # markdown, json, both
    include_recommendations: bool = True

    def __post_init__(self):
        """Initialize default values."""
        if self.source_roots is None:
            self.source_roots = ["backend"]
        if self.ignore_patterns is None:
            self.ignore_patterns = [
                ".venv", "venv", ".git", "__pycache__", ".opencode",
                "node_modules", "tests", "test_", ".pytest_cache"
            ]