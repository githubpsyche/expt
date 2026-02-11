# Face-Flanker Memory Experiment

A jsPsych 7.3.4 web experiment investigating how emotional context at encoding affects memory for neutral faces. Built for Emma Kreitner's honors thesis (advisor: Gordon Logan).

## Overview

Emotional context shapes what we remember and how we remember it, but the mechanisms are not fully understood. This experiment investigates how emotional faces presented alongside neutral target faces during encoding affect three distinct aspects of memory: whether the target is recognized at all, whether the target-context pairing is remembered, and whether the target itself takes on the emotional valence of its context. Each question is tested in a separate between-subjects condition using the same study phase, isolating the effect of emotional flankers on item memory, associative memory, and affective transfer.

During the study phase, participants view a neutral face flanked on both sides by an identical emotional face (happy, angry, or neutral) and make a gender judgment on the central face. The flanker emotion is the key manipulation. At test, each participant completes one of three tasks: (1) an item recognition test, judging whether individual neutral faces are old or new, which reveals whether emotional context enhances or impairs recognition accuracy; (2) an associative recognition test, judging whether target-flanker pairings are intact or rearranged, which reveals whether emotional contexts produce stronger associative bindings; or (3) a valence rating task, rating each neutral target on a 1-9 scale, which reveals whether targets acquire the affective tone of their flankers.

### Design

- Between-subjects: each participant completes one study phase and one of three test phases
- Stimuli are photographs of faces from the Chicago Face Database (CFD) 3.0, using angry, happy (open-mouth), and neutral expressions
- Flankers restricted to Black and White models to keep race constant across emotion conditions; targets and novel faces drawn from all races
- Factorial design at study: 2 (target gender) x 2 (flanker gender) x 3 (flanker emotion) = 12 trial types
- 10 replications of the 12-type design (120 study trials)
- No face identity is used more than once across the entire experiment

### Trial counts

| | Count |
|----|-----|
| Study trials | 120 |
| Unique study faces | 240 (120 targets + 120 flankers) |
| Item recognition test trials | 240 (120 old + 120 new) |
| Associative recognition test trials | 120 (60 intact + 60 rearranged) |
| Valence rating test trials | 120 |
| **Total unique faces needed** | **360** |

## Repository structure

```
expt/
  experiment/
    index.html              Entry point — loads jsPsych, plugins, and experiment modules
    config.js               Experiment parameters (condition, timing, display, block sizes, keys)
    stimuli.js              Generated stimulus manifest (597 CFD models with image URLs)
    helpers.js              Utility functions (derangement, HTML generators)
    trials.js               Face allocation and trial generation (study + all 3 test phases)
    timeline.js             Timeline construction (instructions, practice, blocks, debrief)
    flanker.css             Display styles (flanker layout, single-face layout, fixation cross)
    core/
      init_experiment.js    JATOS-aware jsPsych initialization
      jspsych/
        jspsych.js          jsPsych 7.3.4 core
        css/                jsPsych stylesheets
        plugins/            56 standard jsPsych plugins
  materials/
    cfd/                    Chicago Face Database 3.0 (resized to 400px for web; used by manifest + GitHub Pages)
  scripts/
    generate_manifest.py    Scans CFD directory, produces experiment/stimuli.js (--local for relative paths)
    resize_images.py        Resizes CFD images to 400px display width
    generate_simulated_data.js  Generates simulated JSONL data for all conditions
    estimate_duration.js    Computes estimated experiment duration from config.js
    run_tests.js            Verification test suite (182 tests)
    test_analyses.py        Python analysis pipeline tests (signal detection, ANOVA)
  data/
    simulated/              Generated JSONL files (not committed)
  notes/
    design-analysis.md      Authoritative design specification (27 decisions, full rationale)
```

## Design analysis

The full design specification lives in [`notes/design-analysis.md`](notes/design-analysis.md). It contains:

- **Source emails** from the student and advisor, quoted verbatim
- **27 numbered design decisions** with rationale for each, organized into:
  - Decisions from source emails (1-12)
  - Rearrangement constraints analysis for associative recognition
  - Stimulus constraints from CFD audit (decisions 23-25), including expression availability tables and face budget
  - Developer decisions (13-22, 24-27)
- **Research questions and output fields** with per-RQ analysis traces through the data fields
- **Consolidated design specification** — a compact reference for all phases, data output, and configurable parameters
- **Trial count summary**
- **Clean experiment overview** — a standalone description suitable for sharing

## Running the experiment locally

The experiment runs in any modern browser but requires a local HTTP server — opening `index.html` via `file://` URLs does not reliably support URL query parameters across browsers.

1. Start a local server from the project root:

   ```bash
   # Python (already installed)
   python3 -m http.server 8000

   # Or Node.js
   npx serve -l 8000

   # Or VS Code Live Server extension (right-click index.html → Open with Live Server)
   ```

2. Open the experiment with a `condition` parameter:

   ```
   http://localhost:8000/experiment/index.html?condition=1   # Item recognition
   http://localhost:8000/experiment/index.html?condition=2   # Associative recognition
   http://localhost:8000/experiment/index.html?condition=3   # Valence rating
   ```

   If no condition is specified, a configuration error is displayed.

2. The experiment will preload face images (may take a moment), then proceed through:
   - Study instructions
   - Practice trials (4 study practice)
   - Study phase (120 trials in 3 blocks of 40, with rest breaks)
   - Test instructions
   - Practice trials (4 test practice, except valence)
   - Test phase (trial count and block count depend on condition)
   - Debrief screen

3. When running outside JATOS, the experiment displays the collected data as JSON at the end.

## Demoing on GitHub Pages

The experiment can be hosted as a static site on GitHub Pages for live demos.

1. Enable GitHub Pages for the repo (Settings → Pages), building from the root of the `main` branch.
2. Ensure `.nojekyll` exists in the repo root (already present) so GitHub serves files directly.
3. Ensure `stimuli.js` was generated with GitHub URLs (the default): `python3 scripts/generate_manifest.py`

```
https://githubpsyche.github.io/expt/experiment/index.html?condition=1
https://githubpsyche.github.io/expt/experiment/index.html?condition=1&simulate=visual
```

The experiment runs entirely client-side, so no server configuration is needed beyond enabling Pages.

## JATOS deployment

The experiment detects JATOS automatically via the `jatos.js` script. No code changes are needed — the same `index.html` works both locally and on JATOS.

**URL parameters.** All configuration is passed via URL query string. `condition` (1, 2, or 3) is required; `key_mapping` (1 or 2) is optional and randomized if omitted. Both values are read at startup and stored on every trial in the output data.

```
https://your-jatos-server.com/publix/123/start?batchId=456&condition=2&key_mapping=1
```

**Data submission.** On JATOS, `jatos.endStudy()` submits the full JSON dataset automatically at experiment completion. Outside JATOS, the data is displayed on screen instead.

**Prolific integration.** When recruiting via Prolific, the platform appends `PROLIFIC_PID`, `STUDY_ID`, and `SESSION_ID` to the study URL. These are read from URL parameters and stored on every trial, enabling participant-level data linkage.

**Packaging.** To deploy, package the `experiment/` directory as a JATOS `.jzip` study. With GitHub URLs in `stimuli.js` (the default), images are loaded from GitHub Pages at runtime, so `materials/` is not needed in the package. With `--local` paths, include `materials/` as well.

## Configurable parameters

All parameters are in [`experiment/config.js`](experiment/config.js):

| Parameter | Default | Notes |
|-----------|---------|-------|
| `CONDITION` | (required) | 1 = item recog, 2 = assoc recog, 3 = valence; set via `?condition=` URL param |
| `KEY_MAPPING` | random | 1 or 2; counterbalances all binary response keys; set via `?key_mapping=` or random |
| `RESPONSE_KEY_LEFT` | `'z'` | Left response key for all binary tasks |
| `RESPONSE_KEY_RIGHT` | `'m'` | Right response key for all binary tasks |
| `HAPPY_EXPRESSION` | `'HO'` | `'HC'` (closed mouth) or `'HO'` (open mouth); single-knob switch |
| `FLANKER_RACES` | `['B', 'W']` | Race codes for flanker-eligible models |
| `FLANKER_EMOTIONS` | `['angry', 'happy', 'neutral']` | Emotion conditions in the study phase |
| `EMOTION_EXPR_MAP` | `{angry:'A', happy:HO, neutral:'N'}` | Maps emotion names to CFD expression codes |
| `FIXATION_DURATION` | 2000 ms | Duration of fixation cross before each trial |
| `RESPONSE_TIMEOUT` | 3000 ms | Study: fixed display duration; test: max response window |
| `FACE_WIDTH` | 400 px | Display width of each face image |
| `FACE_SPACING` | 0 px | Gap between faces in the flanker display |
| `N_REPLICATIONS` | 10 | Replications of the 12-type factorial design |
| `STUDY_BLOCK_SIZE` | 40 | Trials per study block (120 / 40 = 3 blocks) |
| `TEST_BLOCK_SIZE_*` | 40 | Trials per test block (adjustable per condition) |
| `STUDY_RESPONSE_FEEDBACK` | true | Show border on target face after study-phase keypress |
| `PRACTICE_ENABLED` | true | Toggle practice trials on/off |
| `N_PRACTICE_STUDY` | 4 | Number of practice study trials |
| `N_PRACTICE_TEST` | 4 | Number of practice test trials |
| `VALENCE_KEYS` | 1-9 | Number row keys for valence rating |

Key mapping 1 = left=female/old/same, right=male/new/different. Key mapping 2 reverses this.

## Estimated duration

Run `node scripts/estimate_duration.js` to compute estimated durations from the current `config.js` values. With default settings (2s fixation, 3s response window):

| Condition | Typical (~1s RT) | Max (full timeout) |
|---|---|---|
| 1 — Item Recognition | ~25 min | ~33 min |
| 2 — Associative Recognition | ~18 min | ~22 min |
| 3 — Valence Rating | ~18 min | ~22 min |

The study phase (~11 min) is the same across conditions. Condition 1 is longest because it has 240 test trials (120 old + 120 new) vs. 120 for the other two. "Typical" assumes ~1s average RT on response-terminated test trials; "max" assumes every trial reaches the 3s timeout. Re-run the script after changing timing parameters to get updated estimates.

## Test mode and simulation

For faster development testing, two URL parameters are available:

| URL params | Behavior |
|---|---|
| `?condition=1&test_mode=1` | Fast timing (200ms fixation, 500ms response), no practice |
| `?condition=1&simulate=visual` | Full timing, jsPsych auto-responds with simulated keypresses |
| `?condition=1&test_mode=1&simulate=visual` | Fast timing + simulated keypresses — quick visual preview |
| `?condition=1&simulate=data-only` | Instant — no rendering, data generated immediately |

Both `test_mode` and `simulate` are recorded in the output data. These are for development only and should not be used in production.

## Regenerating the stimulus manifest

If the CFD image directory changes (new images added or removed), regenerate the manifest:

```bash
python3 scripts/generate_manifest.py           # GitHub URLs (default)
python3 scripts/generate_manifest.py --local   # Relative local paths
```

The script scans `materials/cfd/Images/CFD/`, parses model folders and expression filenames, and writes `experiment/stimuli.js` with entries for all models that have at least one usable expression (N, A, HC, or HO).

By default, image paths are absolute URLs pointing to this repo's GitHub Pages site, which enables demos and JATOS deployment without bundling image files. The `--local` flag generates relative paths (`materials/cfd/...`) for local serving.

The manifest is a complete inventory of available expressions; the experiment selects which happy expression to use at runtime via `HAPPY_EXPRESSION` in config.js. The script prints a summary of model counts by race and gender.

## Running tests

### Experiment structure tests (Node.js)

```
node scripts/run_tests.js
```

The test suite ([`scripts/run_tests.js`](scripts/run_tests.js)) runs 182 tests covering:

1. **Stimulus manifest** — model counts by race/gender match the CFD audit (597 models), expression availability for B/W models, file-exists checks for image paths
2. **Helper functions** — derangement correctness (50 iterations, no fixed points), array chunking, HTML display generators
3. **Condition 1 (item recognition)** — 120 study + 240 test trials, old/new split, gender balance, 12 trial types x 10 reps, identity uniqueness across 360 faces, B/W flanker constraint, practice face disjointness
4. **Condition 2 (associative recognition)** — 60 intact + 60 rearranged, balanced by emotion x trial type, zero derangement fixed points, all 3 study factors preserved in rearranged trials, intact pairings match study
5. **Condition 3 (valence rating)** — 120 test with `study_flanker_emotion`/`study_flanker_gender`, null `correct_response`, no practice test trials
6. **Data field completeness** — every field specified in design decision 27 is present on every trial for each phase
7. **Preload paths** — all image paths in the preload list are valid (URL format or files on disk)

### Analysis pipeline tests (Python)

```
node scripts/generate_simulated_data.js   # generate example data (6 JSONL files)
uv run python scripts/test_analyses.py    # run analysis pipeline tests
```

The generator produces one JSONL file per condition (1-3) x key mapping (1-2) in `data/simulated/`. The Python test suite loads these files and verifies that all intended analyses are computable:

1. **Data integrity** — correct trial counts, required fields present, condition/key_mapping consistency, no duplicate target IDs in study phase
2. **Item recognition** — hit rates by emotion, false alarm rate, d' per flanker emotion (with edge correction), 2x2x3 factorial breakdown
3. **Associative recognition** — within-emotion hit/FA rates, d' per flanker emotion, 2x2x3 factorial breakdown
4. **Valence rating** — mean ratings by emotion, one-way ANOVA, 2x2x3 factorial breakdown

## Data output

Per-trial data fields are specified in design decision 27. All trials include:

`condition`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`

Phase-specific additions:

- **Study** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`
- **Item recognition** adds: `stimulus_type` (old/new), `study_flanker_emotion`, `study_flanker_gender`
- **Associative recognition** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `trial_type` (intact/rearranged)
- **Valence rating** adds: `study_flanker_emotion`, `study_flanker_gender`, `rating` (1-9)

## Tech stack

- **jsPsych 7.3.4** — experiment framework (bundled, no CDN dependency)
- **JATOS** — online deployment and data collection (optional)
- **Chicago Face Database 3.0** — face stimuli (not included in repo; must be obtained separately)
- **Python 3.12** — stimulus manifest generation, analysis pipeline tests
- **uv** — Python environment and dependency management
- **pandas**, **scipy** — analysis pipeline testing (signal detection, ANOVA)
- **Node.js** — experiment test suite, simulated data generation
