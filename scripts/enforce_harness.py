#!/usr/bin/env python3
"""
scripts/enforce_harness.py
==========================
Deterministic Harness Enforcement Engine.

Controls agent execution boundaries, blocks prohibited file modifications
(e.g., protected contracts, lockfiles), executes validation suites, and
logs deterministic feedback for coding agents.
"""

import argparse
import subprocess
import sys
from pathlib import Path
from typing import List, Set

REPO_ROOT = Path(__file__).resolve().parent.parent

# Files that an autonomous agent may NEVER modify without explicit override
PROTECTED_PATHS = {
    "requirements.txt",
    "pytest.ini",
    ".env.example",
    "core/interfaces.py",
    "docs/adr/0001-model-agnostic-harness-architecture.md",
    "docs/adr/0004-verification-gates-before-completion.md",
}


def get_git_modified_files() -> Set[str]:
    """Retrieve all untracked, modified, and staged files relative to repo root."""
    try:
        # Check modified & staged files
        diff_proc = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        # Check untracked files
        untracked_proc = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        
        modified = set()
        if diff_proc.returncode == 0 and diff_proc.stdout:
            modified.update(line.strip().replace("\\", "/") for line in diff_proc.stdout.splitlines() if line.strip())
            
        if untracked_proc.returncode == 0 and untracked_proc.stdout:
            for line in untracked_proc.stdout.splitlines():
                line = line.strip()
                if line.startswith("?? ") or line.startswith("M ") or line.startswith("A "):
                    filepath = line[3:].strip().replace("\\", "/")
                    modified.add(filepath)
                    
        return modified
    except Exception as e:
        print(f"[HARNESS ERROR] Unable to determine git status: {e}", file=sys.stderr)
        return set()


def check_boundary_violations(allowed_scopes: List[str] = None) -> List[str]:
    """
    Check if any modified files violate protected paths or out-of-scope boundaries.
    """
    modified = get_git_modified_files()
    violations = []

    # 1. Protected paths check
    for file_path in modified:
        if file_path in PROTECTED_PATHS:
            violations.append(
                f"[PROTECTED PATH VIOLATION] Modification prohibited: '{file_path}' is an immutable core contract."
            )

    # 2. Scoped boundary check (if explicit scopes provided)
    if allowed_scopes:
        normalized_scopes = [s.replace("\\", "/").rstrip("/") for s in allowed_scopes]
        for file_path in modified:
            in_scope = any(
                file_path.startswith(f"{scope}/") or file_path == scope
                for scope in normalized_scopes
            )
            if not in_scope and file_path not in PROTECTED_PATHS:
                violations.append(
                    f"[SCOPE DRIFT VIOLATION] Out-of-scope file modified: '{file_path}'. "
                    f"Allowed boundaries: {normalized_scopes}"
                )

    return violations


def run_test_suite() -> int:
    """Execute pytest suite deterministically and capture exit code."""
    print("[HARNESS ENFORCEMENT] Running deterministic verification suite (pytest)...")
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "-q"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    return result.returncode


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Deterministic Agent Harness Enforcement Script"
    )
    parser.add_argument(
        "--scope",
        nargs="*",
        help="Allowed directory or file prefixes for the current task.",
    )
    parser.add_argument(
        "--check-boundaries-only",
        action="store_true",
        help="Only verify filesystem boundaries and protected paths.",
    )
    parser.add_argument(
        "--skip-tests",
        action="store_true",
        help="Skip unit test execution.",
    )

    args = parser.parse_args()

    print("=================================================================")
    print(" [*] HARNESS ENFORCEMENT ENGINE: Pre-Commit Invariant Verification")
    print("=================================================================")

    # 1. Check boundary invariants
    violations = check_boundary_violations(allowed_scopes=args.scope)
    if violations:
        print("\n[FAIL] BOUNDARY ENFORCEMENT FAILED:")
        for v in violations:
            print(f"  - {v}")
        print("\n[ACTION REQUIRED FOR AGENT]: Revert unauthorized file modifications immediately.")
        print("Adhere to instructions in .github/instructions/01-agent-boundaries.md.\n")
        return 1

    print("[PASS] Filesystem and boundary invariants verified.")

    if args.check_boundaries_only:
        print("[PASS] Pre-commit check passed successfully.")
        return 0

    # 2. Run verification gates
    if not args.skip_tests:
        test_exit_code = run_test_suite()
        if test_exit_code != 0:
            print("\n[FAIL] VERIFICATION SUITE FAILED.")
            print("[ACTION REQUIRED FOR AGENT]: Analyze failing tests above and rectify without mutating test contracts.\n")
            return test_exit_code

    print("[PASS] All verification gates passed deterministically. Commit authorized.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
