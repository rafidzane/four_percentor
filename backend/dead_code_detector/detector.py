"""Dead code detection logic."""

import ast
import os
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass
from enum import Enum

from .config import Config


class Severity(Enum):
    """Severity levels for dead code findings."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Confidence(Enum):
    """Confidence levels for findings."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


@dataclass
class Finding:
    """Represents a dead code finding."""

    type: str  # import, function, class, module, variable
    severity: Severity
    confidence: Confidence
    file_path: str
    line_number: int
    name: str
    description: str
    context: str


@dataclass
class CodeQualityMetric:
    """Represents a code quality metric."""

    name: str
    value: float
    threshold: Optional[float] = None
    status: str = "ok"  # ok, warning, error


class DeadCodeDetector:
    """Detects dead code in Python files."""

    def __init__(self, config: Optional[Config] = None):
        """Initialize the detector.

        Args:
            config: Configuration for the detector
        """
        self.config = config or Config()
        self.findings: List[Finding] = []
        self.metrics: Dict[str, CodeQualityMetric] = {}

    def analyze(self, source_roots: Optional[List[str]] = None) -> List[Finding]:
        """Analyze source code for dead code.

        Args:
            source_roots: List of root directories to analyze

        Returns:
            List of dead code findings
        """
        if source_roots:
            self.config.source_roots = source_roots

        self.findings = []
        self.metrics = {}

        for root in self.config.source_roots:
            self._analyze_directory(root)

        return self.findings

    def _analyze_directory(self, directory: str):
        """Analyze all Python files in a directory.

        Args:
            directory: Directory to analyze
        """
        directory_path = Path(directory)

        if not directory_path.exists():
            return

        for root, _, files in os.walk(directory_path):
            # Skip ignored directories
            if any(ignored in root for ignored in self.config.ignore_patterns):
                continue

            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    self._analyze_file(file_path)

    def _analyze_file(self, file_path: str):
        """Analyze a single Python file.

        Args:
            file_path: Path to the Python file
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                source = f.read()

            tree = ast.parse(source, filename=file_path)

            # Analyze for dead code
            if self.config.detect_unused_imports:
                self._analyze_imports(tree, file_path)

            if self.config.detect_unused_functions:
                self._analyze_functions(tree, file_path)

            if self.config.detect_unused_classes:
                self._analyze_classes(tree, file_path)

            if self.config.detect_unused_modules:
                self._analyze_modules(tree, file_path)

            # Analyze code quality
            if self.config.detect_code_smells:
                self._analyze_code_smells(tree, file_path)

        except Exception as e:
            # Skip files that can't be parsed
            pass

    def _analyze_imports(self, tree: ast.AST, file_path: str):
        """Analyze imports for unused ones.

        Args:
            tree: AST of the file
            file_path: Path to the file
        """
        imports = set()
        used_names = set()

        # Collect all import names
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.add(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.add(node.module)

        # Collect all used names
        for node in ast.walk(tree):
            if isinstance(node, ast.Name):
                used_names.add(node.id)
            elif isinstance(node, ast.Attribute):
                # Handle attribute access like module.function
                if isinstance(node.value, ast.Name):
                    used_names.add(node.value.id)

        # Find unused imports
        for imp in imports:
            if imp not in used_names:
                self.findings.append(Finding(
                    type="import",
                    severity=Severity.LOW,
                    confidence=Confidence.HIGH,
                    file_path=file_path,
                    line_number=0,  # Can't easily get line number for imports
                    name=imp,
                    description=f"Unused import: {imp}",
                    context=""
                ))

    def _analyze_functions(self, tree: ast.AST, file_path: str):
        """Analyze functions for unused ones.

        Args:
            tree: AST of the file
            file_path: Path to the file
        """
        functions = set()
        used_names = set()

        # Collect all function names
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.add(node.name)
                # Check for decorators
                for decorator in node.decorator_list:
                    if isinstance(decorator, ast.Name):
                        used_names.add(decorator.id)

        # Collect all used names
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    used_names.add(node.func.id)
                elif isinstance(node.func, ast.Attribute):
                    if isinstance(node.func.value, ast.Name):
                        used_names.add(node.func.value.id)

        # Find unused functions
        for func in functions:
            if func not in used_names:
                # Skip private functions (start with _)
                if not func.startswith('_'):
                    self.findings.append(Finding(
                        type="function",
                        severity=Severity.MEDIUM,
                        confidence=Confidence.MEDIUM,
                        file_path=file_path,
                        line_number=0,  # Can't easily get line number
                        name=func,
                        description=f"Unused function: {func}",
                        context=""
                    ))

    def _analyze_classes(self, tree: ast.AST, file_path: str):
        """Analyze classes for unused ones.

        Args:
            tree: AST of the file
            file_path: Path to the file
        """
        classes = set()
        used_names = set()

        # Collect all class names
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                classes.add(node.name)

        # Collect all used names
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    used_names.add(node.func.id)
                elif isinstance(node.func, ast.Attribute):
                    if isinstance(node.func.value, ast.Name):
                        used_names.add(node.func.value.id)

        # Find unused classes
        for cls in classes:
            if cls not in used_names:
                # Skip abstract classes
                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef) and node.name == cls:
                        for base in node.bases:
                            if isinstance(base, ast.Name) and base.id == 'ABC':
                                continue
                        break

                self.findings.append(Finding(
                    type="class",
                    severity=Severity.HIGH,
                    confidence=Confidence.MEDIUM,
                    file_path=file_path,
                    line_number=0,
                    name=cls,
                    description=f"Unused class: {cls}",
                    context=""
                ))

    def _analyze_modules(self, tree: ast.AST, file_path: str):
        """Analyze modules for unused ones.

        Args:
            tree: AST of the file
            file_path: Path to the file
        """
        # This is handled in _analyze_imports
        pass

    def _analyze_code_smells(self, tree: ast.AST, file_path: str):
        """Analyze code smells.

        Args:
            tree: AST of the file
            file_path: Path to the file
        """
        # Count lines and functions
        line_count = 0
        function_count = 0

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                function_count += 1
                # Count lines in function
                if node.body:
                    last_line = node.body[-1].lineno
                    line_count += last_line

        # Add metrics
        self.metrics['line_count'] = CodeQualityMetric(
            name="Total Lines",
            value=line_count,
            threshold=None
        )

        self.metrics['function_count'] = CodeQualityMetric(
            name="Function Count",
            value=function_count,
            threshold=None
        )

        # Calculate complexity (simplified)
        complexity = function_count * 1.5
        self.metrics['complexity'] = CodeQualityMetric(
            name="Cyclomatic Complexity",
            value=complexity,
            threshold=10.0,
            status="warning" if complexity > 10 else "ok"
        )