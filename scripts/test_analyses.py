#!/usr/bin/env python3
"""
Analysis pipeline tests for simulated face-flanker experiment data.
Loads JSONL files produced by generate_simulated_data.js and verifies
that all intended analyses can be computed.

Usage:  uv run python scripts/test_analyses.py
"""

import json
import sys
from pathlib import Path

import pandas as pd
from scipy.stats import norm, f_oneway

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "simulated"

# ============================================================
# Test harness
# ============================================================

passed = 0
failed = 0
errors: list[str] = []


def assert_true(condition: bool, message: str) -> None:
    global passed, failed
    if condition:
        passed += 1
    else:
        failed += 1
        errors.append(message)
        print(f"  FAIL: {message}")


def assert_equal(actual, expected, message: str) -> None:
    assert_true(actual == expected, f"{message} (expected {expected}, got {actual})")


def section(name: str) -> None:
    print(f"\n{name}")
    print("-" * len(name))


# ============================================================
# Load data
# ============================================================


def load_jsonl(filepath: Path) -> pd.DataFrame:
    """Load a JSONL file into a DataFrame."""
    rows = []
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return pd.DataFrame(rows)


# Expected files: condition_{1,2,3}_km_{1,2}.jsonl
FILES = {}
for cond in [1, 2, 3]:
    for km in [1, 2]:
        key = (cond, km)
        filepath = DATA_DIR / f"condition_{cond}_km_{km}.jsonl"
        if filepath.exists():
            FILES[key] = load_jsonl(filepath)

# ============================================================
# 1. Data integrity checks (all files)
# ============================================================

section("1. Data integrity")

EXPECTED_STUDY = 120
EXPECTED_TEST = {1: 240, 2: 120, 3: 120}

COMMON_FIELDS = [
    "condition",
    "phase",
    "block",
    "target_id",
    "target_gender",
    "target_race",
    "target_filename",
    "response",
    "rt",
    "timed_out",
    "correct_response",
    "correct",
    "key_mapping",
    "test_mode",
    "subject_id",
    "study_id",
    "session_id",
]

STUDY_FIELDS = COMMON_FIELDS + [
    "flanker_id",
    "flanker_gender",
    "flanker_race",
    "flanker_emotion",
    "flanker_filename",
]

ITEM_RECOG_FIELDS = COMMON_FIELDS + [
    "stimulus_type",
    "study_flanker_emotion",
    "study_flanker_gender",
]

ASSOC_RECOG_FIELDS = COMMON_FIELDS + [
    "flanker_id",
    "flanker_gender",
    "flanker_race",
    "flanker_emotion",
    "flanker_filename",
    "trial_type",
]

VALENCE_FIELDS = COMMON_FIELDS + [
    "study_flanker_emotion",
    "study_flanker_gender",
    "rating",
]

assert_equal(len(FILES), 6, "All 6 JSONL files loaded")

for (cond, km), df in sorted(FILES.items()):
    label = f"cond={cond} km={km}"
    study = df[df["phase"] == "study"]
    test = df[df["phase"] == "test"]

    assert_equal(len(study), EXPECTED_STUDY, f"{label}: study trial count")
    assert_equal(len(test), EXPECTED_TEST[cond], f"{label}: test trial count")

    # Check condition and key_mapping values
    assert_true(
        (df["condition"] == cond).all(), f"{label}: condition field consistent"
    )
    assert_true(
        (df["key_mapping"] == km).all(), f"{label}: key_mapping field consistent"
    )

    # Check required fields on study trials
    for field in STUDY_FIELDS:
        assert_true(field in study.columns, f"{label}: study has field '{field}'")

    # Check required fields on test trials
    if cond == 1:
        required = ITEM_RECOG_FIELDS
    elif cond == 2:
        required = ASSOC_RECOG_FIELDS
    else:
        required = VALENCE_FIELDS
    for field in required:
        assert_true(field in test.columns, f"{label}: test has field '{field}'")

    # No duplicate target_id in study phase
    assert_true(
        study["target_id"].is_unique, f"{label}: no duplicate target_id in study"
    )

# ============================================================
# 2. Condition 1 — Item recognition (signal detection)
# ============================================================

section("2. Condition 1 — Item recognition")


def compute_dprime(hit_rate: float, fa_rate: float) -> float:
    """Compute d' with edge correction (0 → 0.5/n, 1 → 1-0.5/n)."""
    return float(norm.ppf(hit_rate) - norm.ppf(fa_rate))


def edge_correct(rate: float, n: int) -> float:
    """Apply Macmillan & Kaplan (1985) edge correction."""
    if rate == 0:
        return 0.5 / n
    if rate == 1:
        return 1 - 0.5 / n
    return rate


for km in [1, 2]:
    df = FILES[(1, km)]
    test = df[df["phase"] == "test"].copy()
    label = f"cond=1 km={km}"

    old_key = "z" if km == 1 else "m"

    # Filter out timed-out trials for signal detection
    responded = test[~test["timed_out"]]

    # Hit rate by emotion
    old_trials = responded[responded["stimulus_type"] == "old"]
    hits_by_emo = old_trials.groupby("study_flanker_emotion").apply(
        lambda g: (g["response"] == old_key).mean()
    )

    # False alarm rate (pooled — new items have no emotion)
    new_trials = responded[responded["stimulus_type"] == "new"]
    fa_rate = (new_trials["response"] == old_key).mean()
    n_new = len(new_trials)

    assert_true(len(hits_by_emo) == 3, f"{label}: hit rates for 3 emotions")
    assert_true(fa_rate >= 0, f"{label}: false alarm rate computable")

    # Compute d' per emotion
    fa_corrected = edge_correct(fa_rate, n_new)
    for emo in ["angry", "happy", "neutral"]:
        assert_true(emo in hits_by_emo.index, f"{label}: hit rate for {emo}")
        n_old_emo = len(old_trials[old_trials["study_flanker_emotion"] == emo])
        hr = edge_correct(hits_by_emo[emo], n_old_emo)
        d = compute_dprime(hr, fa_corrected)
        assert_true(
            pd.notna(d) and abs(d) < 10,
            f"{label}: d' for {emo} is finite ({d:.3f})",
        )

    # Factorial breakdown: target_gender x study_flanker_gender x study_flanker_emotion
    factorial = (
        old_trials.groupby(
            ["target_gender", "study_flanker_gender", "study_flanker_emotion"]
        )
        .size()
        .reset_index(name="count")
    )
    assert_true(
        len(factorial) == 12,
        f"{label}: 2x2x3 factorial breakdown has 12 cells",
    )

# ============================================================
# 3. Condition 2 — Associative recognition (signal detection)
# ============================================================

section("3. Condition 2 — Associative recognition")

for km in [1, 2]:
    df = FILES[(2, km)]
    test = df[df["phase"] == "test"].copy()
    label = f"cond=2 km={km}"

    same_key = "z" if km == 1 else "m"

    responded = test[~test["timed_out"]]

    # Hit rate: intact trials responding "same", by emotion
    intact = responded[responded["trial_type"] == "intact"]
    hits_by_emo = intact.groupby("flanker_emotion").apply(
        lambda g: (g["response"] == same_key).mean()
    )

    # FA rate: rearranged trials responding "same", by emotion
    rearranged = responded[responded["trial_type"] == "rearranged"]
    fa_by_emo = rearranged.groupby("flanker_emotion").apply(
        lambda g: (g["response"] == same_key).mean()
    )

    assert_true(len(hits_by_emo) == 3, f"{label}: hit rates for 3 emotions")
    assert_true(len(fa_by_emo) == 3, f"{label}: FA rates for 3 emotions")

    # d' per emotion (within-emotion)
    for emo in ["angry", "happy", "neutral"]:
        n_intact = len(intact[intact["flanker_emotion"] == emo])
        n_rearr = len(rearranged[rearranged["flanker_emotion"] == emo])
        hr = edge_correct(hits_by_emo[emo], n_intact)
        far = edge_correct(fa_by_emo[emo], n_rearr)
        d = compute_dprime(hr, far)
        assert_true(
            pd.notna(d) and abs(d) < 10,
            f"{label}: d' for {emo} is finite ({d:.3f})",
        )

    # Factorial breakdown: target_gender x flanker_gender x flanker_emotion
    factorial = (
        test.groupby(["target_gender", "flanker_gender", "flanker_emotion"])
        .size()
        .reset_index(name="count")
    )
    assert_true(
        len(factorial) == 12,
        f"{label}: 2x2x3 factorial breakdown has 12 cells",
    )

# ============================================================
# 4. Condition 3 — Valence rating
# ============================================================

section("4. Condition 3 — Valence rating")

for km in [1, 2]:
    df = FILES[(3, km)]
    test = df[df["phase"] == "test"].copy()
    label = f"cond=3 km={km}"

    responded = test[~test["timed_out"]]

    # Rating field present and valid
    assert_true("rating" in responded.columns, f"{label}: rating field present")
    ratings = responded["rating"].dropna()
    assert_true(
        ratings.between(1, 9).all(),
        f"{label}: all ratings in 1-9 range",
    )

    # Mean rating by emotion
    mean_by_emo = responded.groupby("study_flanker_emotion")["rating"].mean()
    assert_true(len(mean_by_emo) == 3, f"{label}: mean ratings for 3 emotions")

    for emo in ["angry", "happy", "neutral"]:
        assert_true(emo in mean_by_emo.index, f"{label}: mean rating for {emo}")
        assert_true(
            pd.notna(mean_by_emo[emo]),
            f"{label}: mean rating for {emo} is finite ({mean_by_emo[emo]:.2f})",
        )

    # One-way ANOVA
    groups = [
        responded[responded["study_flanker_emotion"] == emo]["rating"].values
        for emo in ["angry", "happy", "neutral"]
    ]
    f_stat, p_value = f_oneway(*groups)
    assert_true(
        pd.notna(f_stat) and pd.notna(p_value),
        f"{label}: ANOVA computable (F={f_stat:.3f}, p={p_value:.3f})",
    )

    # Factorial breakdown: target_gender x study_flanker_gender x study_flanker_emotion
    factorial = (
        responded.groupby(
            ["target_gender", "study_flanker_gender", "study_flanker_emotion"]
        )
        .size()
        .reset_index(name="count")
    )
    assert_true(
        len(factorial) == 12,
        f"{label}: 2x2x3 factorial breakdown has 12 cells",
    )

# ============================================================
# Results
# ============================================================

print(f"\n{'=' * 40}")
print(f"RESULTS: {passed} passed, {failed} failed")
if failed == 0:
    print("All tests passed.")
else:
    print("\nFailures:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
