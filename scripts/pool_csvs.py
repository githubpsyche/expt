#!/usr/bin/env python3
"""Pool multiple per-session CSVs into a single CSV with unique subject numbers.

Reads analysis CSVs produced by convert_jatos_data.py, concatenates them,
renumbers subjects sequentially across files, and adds a 'pilot' column
identifying which source file each row came from.

Usage:
    python scripts/pool_csvs.py data/a.csv data/b.csv -o data/pooled.csv
    python scripts/pool_csvs.py data/a.csv data/b.csv -o data/pooled.csv --condition 2
    python scripts/pool_csvs.py data/a.csv data/b.csv -o data/pooled.csv --labels mar13 mar21
"""

import argparse
import csv
import os
import sys


def read_csv(path):
    with open(path, "r", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader), reader.fieldnames


def main():
    parser = argparse.ArgumentParser(description="Pool multiple CSVs with unique subject numbering")
    parser.add_argument("inputs", nargs="+", help="Input CSV files to pool")
    parser.add_argument("--output", "-o", required=True, help="Output CSV path")
    parser.add_argument("--condition", "-c", type=int, default=None,
                        help="Filter to this condition number (e.g. 2)")
    parser.add_argument("--labels", "-l", nargs="+", default=None,
                        help="Pilot labels for each input file (default: filenames)")
    args = parser.parse_args()

    if args.labels and len(args.labels) != len(args.inputs):
        print(f"Error: {len(args.labels)} labels given for {len(args.inputs)} input files",
              file=sys.stderr)
        sys.exit(1)

    for path in args.inputs:
        if not os.path.isfile(path):
            print(f"Error: input file not found: {path}", file=sys.stderr)
            sys.exit(1)

    # Derive labels from filenames if not provided
    labels = args.labels or [os.path.splitext(os.path.basename(p))[0] for p in args.inputs]

    all_rows = []
    subject_offset = 0
    fieldnames = None

    for path, label in zip(args.inputs, labels):
        rows, fnames = read_csv(path)

        if fieldnames is None:
            fieldnames = fnames
        elif fnames != fieldnames:
            print(f"Warning: {path} has different columns than first file", file=sys.stderr)

        # Filter by condition if requested
        if args.condition is not None:
            rows = [r for r in rows if r.get("condition") == str(args.condition)]

        # Find unique subjects in this file and build renumbering map
        orig_subjects = sorted(set(int(r["subject_number"]) for r in rows))
        subj_map = {s: i + subject_offset + 1 for i, s in enumerate(orig_subjects)}

        for row in rows:
            row["subject_number"] = str(subj_map[int(row["subject_number"])])
            row["pilot"] = label

        subject_offset += len(orig_subjects)
        all_rows.extend(rows)

        n_subj = len(orig_subjects)
        id_range = f"{subj_map[orig_subjects[0]]}-{subj_map[orig_subjects[-1]]}"
        print(f"  {label}: {len(rows)} rows, {n_subj} subjects (IDs {id_range})")

    # Add 'pilot' to output columns
    out_columns = list(fieldnames) + ["pilot"]

    with open(args.output, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=out_columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(all_rows)

    n_total = subject_offset
    print(f"\nWrote {len(all_rows)} rows, {n_total} subjects to {args.output}")


if __name__ == "__main__":
    main()