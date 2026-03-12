#!/usr/bin/env python3
"""Convert JATOS JSONL data to long-format CSVs (one row per trial).

Produces two files:
  - Analysis CSV (lean, for statistical work)
  - Full CSV (all fields, for audit/validation)

Usage:
    python scripts/convert_jatos_data.py data/2026_02_20_pilot_39subj.jsonl --output data/2026_02_20_pilot_39subj.csv
    python scripts/convert_jatos_data.py data/file.jsonl --output data/custom.csv
"""

import argparse
import csv
import json
import os
import sys

# Analysis CSV: columns needed for statistical models
ANALYSIS_COLUMNS = [
    "subject_number",
    "condition",
    "trial_number",
    "phase",
    "block",
    "target_gender",
    "target_race",
    "flanker_gender",
    "flanker_race",
    "flanker_emotion",
    "stimulus_type",
    "study_flanker_emotion",
    "study_flanker_gender",
    "pair_type",
    "response",
    "rt",
    "correct",
    "timed_out",
    "rating",
]

# Full CSV: analysis columns plus bookkeeping/validation fields
EXTRA_COLUMNS = [
    "key_mapping",
    "subject_id",
    "study_id",
    "session_id",
    "test_mode",
    "trial_index",
    "target_id",
    "target_filename",
    "flanker_id",
    "flanker_filename",
    "correct_response",
    "device_pixel_ratio",
]

FULL_COLUMNS = ANALYSIS_COLUMNS + EXTRA_COLUMNS

# Value mappings: short codes -> spelled out
GENDER_MAP = {"F": "female", "M": "male"}
RACE_MAP = {"B": "Black", "W": "White", "A": "Asian", "L": "Latino"}


def spell_gender(value):
    """Map F/M to female/male; pass through blanks."""
    if not value:
        return ""
    return GENDER_MAP.get(value, value)


def spell_race(value):
    """Map B/W/A/L to full names; pass through blanks."""
    if not value:
        return ""
    return RACE_MAP.get(value, value)


def derive_pair_type(trial):
    """Derive intact/rearranged for condition 2 test trials from existing pilot data.

    In pre-fix data, jsPsych overwrites trial_type with the plugin name, so
    pair_type is missing. We recover it from correct_response + key_mapping:
      key_mapping 1: same=z, different=m
      key_mapping 2: same=m, different=z
    """
    km = trial.get("key_mapping")
    cr = trial.get("correct_response")
    if km == 1:
        return "intact" if cr == "z" else "rearranged"
    elif km == 2:
        return "intact" if cr == "m" else "rearranged"
    return ""


def is_trial_row(event):
    """Return True if this event is a non-practice study or test trial.

    Fixation cross events also carry phase='study'/'test' but lack target_id.
    """
    phase = event.get("phase")
    block = event.get("block")
    if phase not in ("study", "test"):
        return False
    if block == "practice":
        return False
    if not event.get("target_id"):
        return False
    return True


def process_participant(events, subject_number):
    """Extract trial rows for one participant."""
    rows = []
    trial_number = 0

    # Global properties (same on every event for this participant)
    condition = events[0].get("condition") if events else None
    key_mapping = events[0].get("key_mapping") if events else None
    test_mode = events[0].get("test_mode", False) if events else False
    subject_id = events[0].get("subject_id", "") if events else ""
    study_id = events[0].get("study_id", "") if events else ""
    session_id = events[0].get("session_id", "") if events else ""

    for event in events:
        if not is_trial_row(event):
            continue

        trial_number += 1

        # Determine pair_type for condition 2 test trials
        pair_type = ""
        if condition == 2 and event.get("phase") == "test":
            pair_type = event.get("pair_type") or derive_pair_type(event)

        row = {
            # Analysis fields
            "subject_number": subject_number,
            "condition": condition,
            "key_mapping": key_mapping,
            "trial_number": trial_number,
            "phase": event.get("phase", ""),
            "block": event.get("block", ""),
            "target_gender": spell_gender(event.get("target_gender", "")),
            "target_race": spell_race(event.get("target_race", "")),
            "flanker_gender": spell_gender(event.get("flanker_gender") or ""),
            "flanker_race": spell_race(event.get("flanker_race") or ""),
            "flanker_emotion": event.get("flanker_emotion") or "",
            "stimulus_type": event.get("stimulus_type") or "",
            "study_flanker_emotion": event.get("study_flanker_emotion") or "",
            "study_flanker_gender": spell_gender(event.get("study_flanker_gender") or ""),
            "pair_type": pair_type,
            "response": event.get("response") if event.get("response") is not None else "",
            "rt": event.get("rt") if event.get("rt") is not None else "",
            "correct": event.get("correct") if event.get("correct") is not None else "",
            "timed_out": event.get("timed_out", ""),
            "rating": event.get("rating") if event.get("rating") is not None else "",
            # Extra fields (full CSV only)
            "subject_id": subject_id,
            "study_id": study_id,
            "session_id": session_id,
            "test_mode": test_mode,
            "trial_index": event.get("trial_index", ""),
            "target_id": event.get("target_id", ""),
            "target_filename": event.get("target_filename", ""),
            "flanker_id": event.get("flanker_id") or "",
            "flanker_filename": event.get("flanker_filename") or "",
            "correct_response": event.get("correct_response") if event.get("correct_response") is not None else "",
            "device_pixel_ratio": event.get("device_pixel_ratio", ""),
        }
        rows.append(row)

    return rows


def write_csv(path, rows, columns):
    """Write rows to a CSV with the given column subset."""
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description="Convert JATOS JSONL to long-format CSVs")
    parser.add_argument("input", help="Path to JATOS JSONL file")
    parser.add_argument("--output", "-o", default=None, help="Output base path (default: data/pilot_data.csv)")
    args = parser.parse_args()

    if not os.path.isfile(args.input):
        print(f"Error: input file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    base_path = args.output or os.path.join(os.path.dirname(args.input), "pilot_data.csv")
    root, ext = os.path.splitext(base_path)
    full_path = root + "_full" + ext

    all_rows = []
    subject_number = 0

    with open(args.input, "r") as f:
        for line_num, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                events = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"Warning: skipping line {line_num} (invalid JSON): {e}", file=sys.stderr)
                continue

            if not isinstance(events, list) or len(events) == 0:
                print(f"Warning: skipping line {line_num} (empty or not a JSON array)", file=sys.stderr)
                continue

            subject_number += 1
            rows = process_participant(events, subject_number)
            all_rows.extend(rows)

    write_csv(base_path, all_rows, ANALYSIS_COLUMNS)
    write_csv(full_path, all_rows, FULL_COLUMNS)

    print(f"Wrote {len(all_rows)} trials from {subject_number} subjects")
    print(f"  Analysis: {base_path} ({len(ANALYSIS_COLUMNS)} columns)")
    print(f"  Full:     {full_path} ({len(FULL_COLUMNS)} columns)")


if __name__ == "__main__":
    main()
