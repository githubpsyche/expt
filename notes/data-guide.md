# Data Guide

Companion reference for the experiment data CSV. For full design rationale, see design-analysis.md.

## Overview

Each row is one behavioral trial. All subjects are in a single file, with study-phase and test-phase trials interleaved in presentation order per subject. Practice trials, fixation crosses, instructions, and other non-trial events are excluded.

A separate full CSV with additional bookkeeping columns (participant IDs, stimulus filenames, face model IDs, etc.) is available for audit and validation purposes.

**Row counts per condition:**

| Condition | Study trials | Test trials | Total per subject |
|---|---|---|---|
| 1 — Item recognition | 60 | 120 (60 old + 60 new) | 180 |
| 2 — Associative recognition | 60 | 60 (30 intact + 30 rearranged) | 120 |
| 3 — Valence rating | 60 | 60 | 120 |

## Data Dictionary

| Column | Type | Values | Present when | Description |
|---|---|---|---|---|
| subject_number | int | 1, 2, 3, ... | all rows | Sequential participant ID |
| condition | int | 1, 2, 3 | all rows | Between-subjects condition: 1 = item recognition, 2 = associative recognition, 3 = valence rating |
| trial_number | int | 1 – N | all rows | Sequential trial number within each subject, across both phases, in presentation order |
| phase | string | study, test | all rows | Experiment phase |
| block | int | 0, 1, 2, ... | all rows | Block number within the current phase (0-indexed) |
| target_gender | string | female, male | all rows | Gender of the target face |
| target_race | string | Black, White, Asian, Latino | all rows | Race of the target face |
| flanker_gender | string | female, male, or blank | study; condition 2 test | Gender of the flanker face. Blank on condition 1 and 3 test trials (single-face display) |
| flanker_race | string | Black, White, or blank | study; condition 2 test | Race of the flanker face (always Black or White — see Flanker Race Constraint below) |
| flanker_emotion | string | angry, happy, neutral, or blank | study; condition 2 test | Emotion displayed on the flanker face |
| stimulus_type | string | old, new, or blank | condition 1 test only | Whether the target was studied (old) or is a novel face (new) |
| study_flanker_emotion | string | angry, happy, neutral, or blank | condition 1 & 3 test | The flanker emotion that accompanied this target during the study phase |
| study_flanker_gender | string | female, male, or blank | condition 1 & 3 test | The flanker gender that accompanied this target during the study phase |
| pair_type | string | intact, rearranged, or blank | condition 2 test only | Whether the test display shows the original study pairing (intact) or a recombined target-flanker pair (rearranged) |
| response | string | z, m, 1–9, or blank | all rows | Key pressed by the participant. z/m for binary judgment tasks; 1–9 for valence ratings; blank if timed out |
| rt | float | milliseconds or blank | all rows | Reaction time from stimulus onset; blank if timed out |
| correct | string | True, False, or blank | all rows | Whether the response matches the correct answer. Blank for valence trials (no objectively correct answer) and timeouts |
| timed_out | string | True, False | all rows | Whether the participant failed to respond within the 3-second response window |
| rating | int | 1–9 or blank | condition 3 test only | Valence rating: 1 = most negative, 5 = neutral, 9 = most positive. Blank if timed out or not a valence trial |

## Experiment Design and Data Structure

### Factorial structure at study

The study phase crosses three factors:

| Factor | Column | Levels |
|---|---|---|
| Target gender | target_gender | female, male |
| Flanker gender | flanker_gender | female, male |
| Flanker emotion | flanker_emotion | angry, happy, neutral |

This produces 2 x 2 x 3 = 12 trial types, each replicated 5 times, yielding 60 study trials per subject. Every trial uses two unique face identities: one neutral target (center) and one emotional or neutral flanker (repeated on both sides).

### Between-subjects conditions

Each participant completes the same study phase, then one of three test phases determined by condition:

| condition | Test task | Test display | Judgment | Condition-specific columns |
|---|---|---|---|---|
| 1 | Item recognition | Single neutral face | Old or new? | stimulus_type, study_flanker_emotion, study_flanker_gender |
| 2 | Associative recognition | Three faces (same layout as study) | Same pairing or rearranged? | pair_type, plus flanker columns |
| 3 | Valence rating | Single neutral face | Rate valence 1–9 | rating, study_flanker_emotion, study_flanker_gender |

In conditions 1 and 3, the test display is a single face, so flanker columns are blank. The study-phase context is recorded in study_flanker_emotion and study_flanker_gender instead.

In condition 2, the flanker is physically present at test, so the flanker columns (flanker_gender, flanker_race, flanker_emotion) are populated directly.

### Flanker race constraint

All flankers are restricted to Black and White models from the Chicago Face Database. This keeps race constant across the three flanker emotion conditions, preventing a confound between flanker race and flanker emotion. Targets and novel faces are drawn from all races (Black, White, Asian, Latino). This is why flanker_race is always Black or White, while target_race may also be Asian or Latino.

### Rearrangement in condition 2

Rearranged test trials in condition 2 preserve all three study-phase factors (target gender, flanker gender, flanker emotion). Only the specific identity pairing changes — a target is shown with a different flanker from the same trial type. This ensures that the only cue distinguishing intact from rearranged is memory for the specific face pairing, not a category-level mismatch.
