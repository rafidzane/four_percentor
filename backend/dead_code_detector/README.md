# Dead Code Detection Tool

A Python tool for detecting and reporting dead code in your backend codebase.

## Features

- **Unused Import Detection**: Identifies imports that are never used
- **Unused Function Detection**: Finds functions that are never called
- **Unused Class Detection**: Detects classes that are never instantiated
- **Code Quality Metrics**: Calculates complexity, line count, and function count
- **Multiple Output Formats**: Generate reports in Markdown and JSON formats
- **Configurable Analysis**: Support for quick, comprehensive, and custom analysis modes

## Installation

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install pylint
```

## Usage

### Basic Usage

Run the tool on your backend directory:
```bash
python -m backend.dead_code_detector.main --backend backend
```

### Advanced Usage

```bash
# Specify output file
python -m backend.dead_code_detector.main --backend backend --output my_report

# Use specific output format
python -m backend.dead_code_detector.main --backend backend --format markdown

# Use quick analysis mode (faster, fewer findings)
python -m backend.dead_code_detector.main --backend backend --mode quick

# Use custom analysis mode with filters
python -m backend.dead_code_detector.main --backend backend --mode custom --ignore tests

# Combine options
python -m backend.dead_code_detector.main --backend backend --output analysis --format both --mode comprehensive
```

## Command-Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--backend` | Backend directory to analyze | `backend` |
| `--output` | Output file path (without extension) | `dead_code_report` |
| `--mode` | Analysis mode: `quick`, `comprehensive`, `custom` | `comprehensive` |
| `--format` | Output format: `markdown`, `json`, `both` | `both` |
| `--ignore` | Additional ignore patterns (space-separated) | None |

## Output Files

The tool generates two output files:

1. **Markdown Report** (`<output>.md`): Human-readable report with:
   - Summary statistics
   - Findings by type (imports, functions, classes)
   - Code quality metrics
   - Actionable recommendations

2. **JSON Report** (`<output>.json`): Machine-readable data with:
   - Structured findings
   - Severity and confidence levels
   - Metrics and thresholds

## Configuration

You can configure the tool by modifying the `Config` class in `backend/dead_code_detector/config.py`:

```python
@dataclass
class Config:
    # Analysis scope
    source_roots: List[str] = ["backend"]
    ignore_patterns: List[str] = [...]

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
    mode: str = "comprehensive"

    # Thresholds
    max_function_length: int = 50
    max_nesting_depth: int = 4
    min_confidence: str = "high"

    # Output settings
    output_format: str = "both"
    include_recommendations: bool = True
```

## Analysis Modes

### Quick Mode
- Fast analysis focusing on high-confidence findings
- Good for quick checks during development

### Comprehensive Mode
- Thorough analysis including all types of dead code
- Best for regular code quality checks

### Custom Mode
- Allows filtering by file type, severity, or confidence level
- Maximum flexibility for specific needs

## Severity Levels

- **Critical**: Unused classes that could cause issues
- **High**: Unused classes and important functions
- **Medium**: Unused functions
- **Low**: Unused imports

## Confidence Levels

- **High**: Strong evidence that code is unused
- **Medium**: Some evidence, requires review
- **Low**: Uncertain, likely false positive

## Best Practices

1. **Run regularly**: Schedule regular analysis during development
2. **Review findings**: Always review flagged code before removal
3. **Use version control**: Keep changes tracked before cleanup
4. **Focus on high severity**: Prioritize critical and high severity findings
5. **Consider context**: Some "unused" code may be intentionally kept for future use

## Troubleshooting

### False Positives
Some code may appear unused but is intentionally kept for:
- Future features
- API compatibility
- Testing purposes
- Documentation examples

### Performance
For large codebases, use quick mode for faster results.

### Import Issues
The tool analyzes static code structure. It may miss:
- Dynamically imported modules
- Code executed in specific conditions
- Code used in runtime-generated code

## Examples

### Example 1: Find Unused Imports
```bash
python -m backend.dead_code_detector.main --backend backend --format json
```
Then search the JSON output for `"type": "import"`.

### Example 2: Quick Check Before Commit
```bash
python -m backend.dead_code_detector.main --backend backend --mode quick
```

### Example 3: Generate Detailed Report
```bash
python -m backend.dead_code_detector.main --backend backend --output detailed_report
```

## Contributing

To extend the tool:

1. Add new detection logic in `detector.py`
2. Add new metrics in `detector.py`
3. Update report generation in `reporter.py`
4. Add tests in `tests/` directory

## License

This tool is part of the four_percentor project.