# Experiment Design Analysis

## Sources

### Emma Kreitner (student email)

> Our study has three experiments (all with the same study phase):
>
> Study: There will be three stimuli on the screen (all in a horizontal row).
> No individual face should be used twice.
> The center face is always neutral for every round.
> The flanking faces will be "negative, neutral, or positive" with the same individual face being on both sides of the target face.
> I will have them numbered and sorted into the different conditions in the Box file I share with you.
> We are going to be asking the participant to make a gender judgement for each of the targets (whether the central face is female or male).
> A fixation cross should appear before every new set of faces (2000ms).
> They will have 3 second response times.
> Blocks of 50 with rest breaks as well.
> This is going to be between subjects.
>
> Study phase 1: Item recognition Study 1 focuses on item recognition.
> Participants will see a mix of previously studied neutral target faces and new neutral faces, and will judge whether each face appeared during the study phase.
> The Z key will indicate an "old" response and the M key will indicate a "new" response.
> This study examines how emotional flankers influence later recognition accuracy, including both hits and false alarms.
> 3 seconds for each judgement.
> Blocks of 50 with rest breaks.
>
> Study phase 2: Item Association Study 2 examines associative recognition.
> Participants will see a neutral target paired with two flanker faces and will judge whether the pairing matches the original combination from the study phase.
> Flanker faces may either be the exact originals or may be substituted with faces from the same emotional category.
> The Z key will indicate that the pairing is the same, and the M key will indicate that it is different.
> 3 seconds for each judgement.
> Blocks of 50 with rest breaks.
>
> Study phase 3: Emotional Valence Study 3 evaluates the emotional valence assigned to the previously studied neutral faces.
> Participants will view each neutral target in isolation and will provide a numeric valence rating on keys 1-9: 1 being the most negative, 5 being neutral, 9 being the most positive (essentially -4 through +4).
> 3 seconds for each judgement.
> Blocks of 50 with rest breaks.

### Gordon Logan, email 1 (factorial design)

> We need to work out the number of trials in each experiment.
> That's important in programming.
> We need to figure out the number of different conditions, how many different pictures we have, and how many trials we can get it total.
>
> The basic experimental design at study involves 12 different trial types: 2 (male vs. female targets) x 2 (male vs. female flankers) x 3 (happy vs. angry vs. neutral flanker).
> We can run multiples of 12 trials at study.
> We need a minimum of 10 replications of this 12-trial design (120 study trials).
> It would be better to have 20 (240 study trials), but subjects may have trouble remembering that many faces.
> We need two unique pictures for each trial, one for the target and one that is repeated as the flankers.
> 120 trials would require 240 pictures; 240 trials would require 480 pictures.
>
> The basic design for item recognition involves N x 3 trials, where N is the number of study items.
> We will present all of the study items (120 or 240) mixed with the same number of novel items, not presented in the study phase.
> That will require 120 or 240 more trials.
> The whole item recognition experiment will involve 120 study trials and 240 test trials or 240 study trials and 480 test trials.
>
> The basic design for the associative recognition involves N x 2 trials.
> The test phase uses all of the flanker-target-flanker stimuli from the study phase.
> Half of them will be "intact" (same as study) and half will be "shuffled" (different from study).
> The shuffled stimuli will use targets from study and flankers from study, but combine them differently.
> The whole associative recognition experiment will involve 120 study trials and 120 test trials for a total of 240 trials, or 240 study and 240 test trials for a total of 480 trials.
>
> The basic design for the valence rating study involves N x 2 trials.
> The test phase presents all the targets from the study phase alone with no flankers and subjects rate the valence.
> If there are 120 study trials, then there are 120 test trials for a total of 240 trials in the experiment.
> If there are 240 study trials, then there are 240 test trials for a total of 480 trials in the experiment.

### Gordon Logan, email 2 (research goals / implementation)

> The honors student is Emma Kreitner and she's interested in the effects of emotion on memory.
> She has three experiments planned that use the same study-test design.
> The study task is the same in each experiment.
> The tasks at test differ to tap different aspects of memory: item recognition, associative recognition and valence rating.
>
> The stimuli are pictures of faces with happy, angry or neutral expressions.
> In the study task, subjects see a central face that's always neutral flanked on both sides by a happy, angry, or neutral face.
> The task is to say whether the central face is male or female.
>
> The item recognition experiment presents single neutral faces at test.
> Half are the central targets from the study phase and half are new.
> The task is to say whether or not the single face was presented at study.
> Emma's goal here is to see whether memory is affected by the emotional context the flankers provide.
>
> The associative recognition experiment presents the targets and flankers from the study lists at test, half intact and half rearranged (flankers from one study trial paired with a target from a different study trial).
> The task is to say whether or not they're rearranged.
> Emma's goal here is to see whether items are bound more strongly to emotional contexts than to neutral ones.
>
> The valence experiment presents single targets from the study list.
> The task is to rate the emotional valence of the face on a scale from negative (1) to positive (9) using the number row above the keyboard.
> (We thought everyone would have a keyboard with this arrangement.).
> Emma's goal here is to see whether targets acquire the valence of the flankers.
>
> We worked out the designs in detail and figured out the number of faces we need and the number of trials we can get.
> I don't have access to the numbers but it's something like 100 study trials and 200 test trials.
> Emma has a record of what we worked out.
> She also has all the faces we need and she's got indices for each one indicating its gender and expression.
>
> I think the three experiments can be run with essentially the same program.
> The study trials are the same.
> The test trials differ.
> We'll leave it up to you to set it up in the way you think would work best for running the experiments.

## Design Decisions

### From source emails

**1. Factorial design: 2 (target gender) x 2 (flanker gender) x 3 (flanker emotion) = 12 trial types**

> "The basic experimental design at study involves 12 different trial types: 2 (male vs. female targets) x 2 (male vs. female flankers) x 3 (happy vs. angry vs. neutral flanker)." — Logan, email 1

Emma's description is compatible but does not enumerate flanker gender as a factor.
Logan's email 1 is the only source that specifies the full factorial structure.

**2. Flanker emotions: happy, angry, neutral**

> "happy vs. angry vs. neutral flanker" — Logan, email 1
>
> "happy, angry or neutral expression" — Logan, email 2

Emma uses valence-level labels ("negative, neutral, positive") which describe the same three categories.

**3. Trial count: 120 or 240 study trials (10 or 20 reps of 12 trial types)**

> "We need a minimum of 10 replications of this 12-trial design (120 study trials). It would be better to have 20 (240 study trials), but subjects may have trouble remembering that many faces." — Logan, email 1
>
> "something like 100 study trials and 200 test trials" — Logan, email 2

Logan email 2 is approximate and consistent with the 120-trial version.
Emma says "blocks of 50" which doesn't divide evenly into 120 or 240; block size must be adjusted (see decision 22).

**4. Rearranged associative recognition trials: recombination of existing studied faces**

> "The shuffled stimuli will use targets from study and flankers from study, but combine them differently." — Logan, email 1
>
> "flankers from one study trial paired with a target from a different study trial" — Logan, email 2

Logan email 2 is the most explicit of all three descriptions.
Emma's wording ("substituted with faces from the same emotional category") is ambiguous but compatible — recombined studied flankers are indeed faces from the same emotional category.

**5. Study task: gender judgment on central face**

> "asking the participant to make a gender judgement for each of the targets (whether the central face is female or male)" — Emma
>
> "The task is to say whether the central face is male or female." — Logan, email 2

**6. Item recognition: studied targets + equal number of novel faces**

> "We will present all of the study items (120 or 240) mixed with the same number of novel items, not presented in the study phase." — Logan, email 1
>
> "Half are the central targets from the study phase and half are new." — Logan, email 2

**7. Valence rating: 1-9 number row keys**

> "numeric valence rating on keys 1-9: 1 being the most negative, 5 being neutral, 9 being the most positive (essentially -4 through +4)" — Emma
>
> "rate the emotional valence of the face on a scale from negative (1) to positive (9) using the number row above the keyboard" — Logan, email 2

**8. Between-subjects design**

> "This is going to be between subjects." — Emma

Logan email 2 describes each as a separate "experiment" with its own study+test, consistent with between-subjects.

**9. Single program, test phase switches by condition**

> "I think the three experiments can be run with essentially the same program. The study trials are the same. The test trials differ." — Logan, email 2

**10. Fixation cross: 2000ms**

> "A fixation cross should appear before every new set of faces (2000ms)." — Emma

Logan is silent on fixation duration.
Using Emma's value.

**11. Response window: 3 seconds**

> "They will have 3 second response times." — Emma (study phase)
>
> "3 seconds for each judgement." — Emma (repeated for all three test phases)

Logan is silent on timing constraints.
Study phase: fixed 3s display (see decision 28). Test phases: response-terminated with 3s timeout.

**12. Response keys for recognition tasks: Z and M**

> "The Z key will indicate an 'old' response and the M key will indicate a 'new' response." — Emma (item recognition)
>
> "The Z key will indicate that the pairing is the same, and the M key will indicate that it is different." — Emma (associative recognition)

### Rearrangement constraints (associative recognition)

Decision 4 establishes that rearranged trials recombine studied faces. Emma's "substituted with faces from the same emotional category" confirms within-emotion swaps, but neither source addresses whether flanker gender or target gender should also be preserved.

**The problem**: The study phase factorial design crosses three factors: target gender × flanker gender × flanker emotion. If rearranged trials change any factor besides the specific identity pairing, participants gain a non-associative detection cue:

-   If flanker emotion changes (angry → neutral): detectable by emotion category alone
-   If flanker gender changes (male → female): detectable by gender alone
-   If target gender changes relative to flanker gender: the gender combination itself is a cue

In each case, participants could correctly classify a trial as "rearranged" without any memory for the specific identity pairing — undermining the associative recognition measure.

**Resolution**: Rearrange within trial type. Each of the 12 trial types has 10 reps. Randomly assign 5 as intact and 5 as rearranged. For the 5 rearranged, shuffle flankers among those 5 targets via derangement (no flanker stays with its original target). This ensures the only detectable difference between intact and rearranged is the specific identity pairing — the design's stated goal.

**Mechanics**: A derangement of 5 items always has solutions (44 valid permutations). This yields 12 types × 5 intact + 12 types × 5 rearranged = 60 + 60 = 120 test trials, balanced across all trial types.

### Stimulus constraints (from CFD audit)

The stimulus set is the Chicago Face Database (CFD) 3.0, containing 597 models across four race categories. Only Black (B) and White (W) models have emotional expression photographs; Asian (A) and Latino (L) models have neutral only.

**Expression availability by race and gender:**

| | Total | Angry (A) | Happy-closed (HC) | Happy-open (HO) |
|---|---|---|---|---|
| BF (Black Female) | 104 | 47 | 48 | 48 |
| BM (Black Male) | 93 | 35 | 32 | 36 |
| WF (White Female) | 90 | 37 | 37 | 35 |
| WM (White Male) | 93 | 35 | 36 | 35 |
| AF (Asian Female) | 57 | 0 | 0 | 0 |
| AM (Asian Male) | 52 | 0 | 0 | 0 |
| LF (Latino Female) | 56 | 0 | 0 | 0 |
| LM (Latino Male) | 52 | 0 | 0 | 0 |

B/W totals: 194 female (84 angry, 85 HC), 186 male (70 angry, 68 HC). All 597 models have neutral (N).

**23. Replications: locked to 10 (120 study trials)**

Resolves decision 21. For 10 reps, the experiment needs 360 unique faces (180 per gender): 60 flankers + 60 targets + 60 novel faces. Available: 307 female, 290 male — feasible with margin.

For 20 reps, the experiment would need 720 unique faces (360 per gender). Only 290 males available — not feasible. CFD-INDIA (142 models) and CFD-MR (88 models) have neutral expressions only and cannot supplement the emotional expression shortfall.

**24. Flanker race: restricted to Black and White models**

Since only B/W models have angry and happy expressions, all emotional flankers are necessarily B/W. If neutral flankers were drawn from all races, the neutral condition would have a different racial composition than the emotional conditions — confounding flanker race with flanker emotion. Restricting all flankers (angry, happy, and neutral) to B/W keeps race constant across emotion conditions.

Targets and novel faces are always neutral and are not part of the emotion manipulation. Their race is a nuisance variable balanced across conditions by random assignment. No race restriction on targets or novels.

**Face budget per gender for 10 reps:**

| Role | Count | Pool |
|---|---|---|
| Flankers (angry) | 20 | B/W: 84F / 70M |
| Flankers (happy) | 20 | B/W: 85F / 68M |
| Flankers (neutral) | 20 | B/W: 194F / 186M |
| Targets | 60 | All races: 307F / 290M |
| Novel faces (item recog) | 60 | All races: remaining |
| Practice | \~4-8 | Remaining |

**25. Happy expression: HO (open mouth)**

The CFD provides two happy variants: HC (closed-mouth smile) and HO (open-mouth grin). HO is more intense and a closer match to the angry expression in arousal/salience. HC is more naturalistic. Researcher preference: HO, to boost effect size via stronger arousal/salience match with angry expressions.

### Developer decisions (not specified in any source)

**13. Practice trials: configurable boolean parameter, default on, 4-8 trials**

No source mentions practice.
Standard in cognitive psychology — participants need to learn the display layout and response mappings before real data collection.
Implemented as an experiment-level config parameter so researchers can toggle off if desired.
Practice stimuli must not appear in the main experiment.

**14. Debrief: placeholder screen**

No source specifies content.
Standard practice for human subjects research.
Build a placeholder debrief screen at end of experiment; researchers fill in approved text.

**15. Feedback: none, hard-coded**

No source mentions feedback anywhere.
Test phases: feedback is never given in recognition memory experiments — it would alter participants' response criterion and contaminate the measure.
Study phase: the gender judgment is an orienting task (ensures attention to faces), not a measure of gender judgment accuracy.
Feedback is optional but given the silence from all sources, omit it.
On timeout (3s expires): silent advance to next trial (fixation cross).
No "too slow" message.

**16. Response key counterbalancing: study-phase gender mapping only**

No source mentions counterbalancing. Emma specifies fixed mappings (Z=old/same, M=new/different) for test phases.
Test-phase keys are not counterbalanced: no mnemonic overlap between key letters and response labels.
Study-phase gender mapping IS counterbalanced: M=male creates an asymmetric stimulus-response compatibility effect. Half of participants get Z=female/M=male, the other half get Z=male/M=female. Assigned via URL parameter (`key_mapping=1|2`), JATOS JSON input, or random 50/50 fallback. Recorded in data as `key_mapping`.

**17. Study phase response keys: Z and M, counterbalanced**

No source specifies study phase keys.
Emma only specifies test phase keys (Z/M).
Using Z and M for consistency with test phase key positions (left/right mapping maintained throughout).
Gender-to-key assignment is counterbalanced across participants (see decision 16).

**18. Novel faces for item recognition: 50/50 gender match**

No source specifies gender distribution of novel items.
The factorial design is balanced on target gender, so novel faces should match to avoid confounding novelty with gender.

**19. ITI: 2000ms fixation cross only**

> "A fixation cross should appear before every new set of faces (2000ms)." — Emma

No additional interval mentioned by anyone.
The fixation cross IS the inter-trial interval.
Sequence: response -\> fixation (2000ms) -\> next stimulus.

**20. Display size and spacing: configurable, determine during development**

No source specifies.
Will be adjusted when we see the actual face stimuli.
Default starting point: \~250px wide faces, \~50px gaps.
Standard for face perception research.

**21. 10 vs 20 replications: resolved — 10 reps (see decision 23)**

> "minimum of 10 replications (120 study trials). It would be better to have 20 (240 study trials), but subjects may have trouble remembering that many faces" — Logan, email 1

Stimulus constraints analysis determined that 10 reps is feasible (360 faces needed, 307F/290M available) but 20 reps is not (720 faces needed, only 290M available).

**22. Block size: adjusted to divide evenly into trial count**

Emma says "blocks of 50" but this doesn't divide evenly into 120.
Will use a block size that divides cleanly (e.g., 40 or 60).
Exact value set once trial count is finalized.

**24. Flanker race: restricted to Black and White models**

All flankers (angry, happy, and neutral) restricted to B/W models. Keeps race constant across emotion conditions, avoiding a race × emotion confound. Targets and novel faces have no race restriction. See stimulus constraints for the confound analysis and face budget.

**25. Happy expression: HO (open mouth)**

HO (open-mouth grin) chosen over HC (closed-mouth smile). More intense and a closer arousal/salience match with angry expressions, boosting expected effect size.

**26. Associative rearrangement: within trial type**

Rearranged trials preserve target gender, flanker gender, and flanker emotion — only the specific identity pairing changes. 5 intact + 5 rearranged per trial type (10 reps each). See rearrangement constraints for analysis.

**27. Data output fields**

Per-trial fields recorded by the experiment. Common fields on all trials: `condition`, `key_mapping`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`.

Study phase adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`.

Item recognition adds: `stimulus_type` (old/new), `study_flanker_emotion`, `study_flanker_gender`.

Associative recognition adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `trial_type` (intact/rearranged).

Valence rating adds: `study_flanker_emotion`, `study_flanker_gender`, `rating` (1-9).

**28. Study-phase encoding duration: fixed (3s)**

Study trials use a fixed stimulus display duration: the faces remain on screen for the full 3 seconds regardless of when the participant responds. This prevents encoding time from varying with flanker condition. If emotional flankers systematically speed or slow gender judgments, response-terminated display would confound encoding duration with the IV — memory differences could reflect more or less time on screen rather than the emotional context itself. Fixed display eliminates this confound by equalizing encoding opportunity across all conditions.

Test phases remain response-terminated (trial ends on keypress, 3s timeout). There is no encoding concern at test; response-terminated trials keep the pace comfortable and avoid dead time after responding.

**29. Study-phase response feedback: prompt text swap**

No source specifies response feedback during study. Because the study phase uses a fixed 3-second display (decision 28), participants receive no visual indication that their keypress was registered. After response, the key-mapping prompt (e.g., "female (Z) or male (M)?") is replaced with "✓ Response recorded." This is a registration cue only — no accuracy information is provided (consistent with decision 15). Controlled by `STUDY_RESPONSE_FEEDBACK` in config.js; default on.

### Research Questions and Output Fields

Each test phase addresses a distinct question about how emotional flankers at study affect later memory for neutral target faces. Per-trial output fields (decision 27) are specified per question below. All trials share a common set: `condition`, `key_mapping`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`. The study phase additionally records: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`.

#### RQ1: Item recognition — Does emotional context affect recognition accuracy?

> "This study examines how emotional flankers influence later recognition accuracy, including both hits and false alarms." — Emma
>
> "Emma's goal here is to see whether memory is affected by the emotional context the flankers provide." — Logan, email 2

The design addresses this by presenting studied neutral targets alone at test, mixed with novel faces. Additional phase-specific fields: `stimulus_type` (old/new), `study_flanker_emotion`, `study_flanker_gender`.

Analysis: Signal detection (d', criterion) per flanker emotion condition.

- **Hit rate**: Filter `stimulus_type="old"`, group by `study_flanker_emotion` → proportion responding "old"
- **False alarm rate**: Filter `stimulus_type="new"` → proportion responding "old" (pooled — new items have no study history, so no emotion breakdown)
- **d' per emotion**: Each emotion condition's hit rate against the shared false alarm rate
- **Fields used**: `stimulus_type`, `study_flanker_emotion`, `response`, `correct`

For a fuller factorial analysis (target gender × flanker gender × flanker emotion), also need: `target_gender` — present; `study_flanker_gender` — present (decision 27). All three study-phase factors are available for factorial breakdown.

#### RQ2: Associative recognition — Are items bound more strongly to emotional contexts?

> "Emma's goal here is to see whether items are bound more strongly to emotional contexts than to neutral ones." — Logan, email 2

The design addresses this by presenting studied target-flanker pairings at test, half intact and half rearranged within trial type (decision 26). Additional phase-specific fields: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `trial_type` (intact/rearranged).

Analysis: Signal detection per flanker emotion condition.

- **Hit rate**: Filter `trial_type="intact"`, group by `flanker_emotion` → proportion responding "same"
- **False alarm rate**: Filter `trial_type="rearranged"`, group by `flanker_emotion` → proportion responding "same"
- **d' per emotion**: Hit rate vs. false alarm rate within each emotion condition
- **Fields used**: `trial_type`, `flanker_emotion`, `response`, `correct`

Factorial breakdown by `target_gender` × `flanker_gender` also possible using existing fields. No missing fields — all three factors (`target_gender`, `flanker_gender`, `flanker_emotion`) are directly present in the test data because the flanker is shown at test.

#### RQ3: Valence rating — Do targets acquire the valence of their flankers?

> "Emma's goal here is to see whether targets acquire the valence of the flankers." — Logan, email 2

The design addresses this by presenting studied neutral targets alone and collecting valence ratings. Additional phase-specific fields: `study_flanker_emotion`, `study_flanker_gender`, `rating` (1-9).

Analysis: One-way comparison of mean ratings across flanker emotion.

- **Group by** `study_flanker_emotion` → compare mean `rating`
- **Prediction**: happy > neutral > angry
- **Fields used**: `study_flanker_emotion`, `rating`

For factorial breakdown, also need: `target_gender` — present; `study_flanker_gender` — present (decision 27). All three study-phase factors are available for factorial breakdown.

## Consolidated Design Specification

### Overview

-   Between-subjects design: each participant completes one study phase + one of three test phases
-   Single program; test phase determined by condition assignment
-   Stimuli are photographs of faces from the Chicago Face Database (CFD) 3.0
-   Flanker emotions: angry (A expression), happy (HO open-mouth expression), neutral (N expression)
-   All flankers restricted to Black and White CFD models (race constant across emotion conditions); targets and novel faces from all races
-   Factorial design at study: 2 (target gender) x 2 (flanker gender) x 3 (flanker emotion) = 12 trial types
-   Study trial count must be a multiple of 12 (one per trial type per replication)
-   10 replications (120 study trials)
-   No face identity is used more than once across the entire experiment (each trial uses unique individuals)

### Research Questions

Each test phase addresses a distinct question about how emotional flankers at study affect later memory for neutral target faces.

1.  **Item recognition** — Does emotional context affect recognition accuracy? Measured by comparing hit rates and false alarm rates across flanker emotion conditions.
2.  **Associative recognition** — Are items bound more strongly to emotional contexts? Measured by comparing discrimination of intact vs. rearranged pairings across flanker emotion conditions.
3.  **Valence rating** — Do targets acquire the valence of their flankers? Measured by comparing mean valence ratings across flanker emotion conditions.

### Universal Trial Structure (all phases)

-   **Trial sequence**: Fixation cross (2000ms) -> stimulus display -> next trial
-   **Study phase timing**: Fixed 3s display; response recorded but does not end trial (see decision 28)
-   **Test phase timing**: Response-terminated with 3s timeout
-   **Timeout**: Silent advance to next trial; no feedback, no "too slow" message
-   **Blocking**: All phases use equal-sized blocks with rest breaks between (block size TBD, must divide phase total evenly)
-   **Trial order**: Randomized within blocks

### Study Phase (shared across all experiments)

-   **Display**: Three face photographs in a horizontal row — neutral center target, identical emotional flankers on both sides
-   **Stimuli**: 2 unique face identities per trial (1 neutral target, 1 emotional flanker repeated on both sides)
-   **Task**: Gender judgment on center face (Z=female, M=male)

### Test Phase 1: Item Recognition

-   **Display**: Single neutral face photograph
-   **Stimuli**: All studied neutral targets + equal number of novel neutral faces (50/50 gender-matched)
-   **Task**: Old/new judgment (Z=old, M=new)

### Test Phase 2: Associative Recognition

-   **Display**: Three face photographs in a horizontal row (same layout as study)
-   **Stimuli**: All studied target-flanker combinations; half intact (same pairing as study), half rearranged within trial type (target gender, flanker gender, and flanker emotion preserved; only specific identity pairing changes)
-   **Task**: Same/different judgment (Z=same, M=different)

### Test Phase 3: Valence Rating

-   **Display**: Single neutral face photograph
-   **Stimuli**: All studied neutral targets, presented alone
-   **Task**: Rate emotional valence using number row keys 1-9 above the keyboard, not numpad (1=most negative, 5=neutral, 9=most positive)

### Other Screens

-   **Instructions**: Before study phase and before test phase, with response key reminders
-   **Debrief**: Placeholder screen at end (researcher provides text)

### Data Output

Per-trial fields recorded by the experiment:

-   **All trials**: `condition`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`
-   **Study** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`
-   **Item recognition** adds: `stimulus_type`, `study_flanker_emotion`, `study_flanker_gender`
-   **Associative recognition** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `trial_type`
-   **Valence rating** adds: `study_flanker_emotion`, `study_flanker_gender`, `rating`

### Configurable Parameters

| Parameter | Default | Notes |
|-----------------------------|------------------------|-------------------|
| Experiment condition | — | 1 (item recog), 2 (assoc recog), or 3 (valence) |
| Number of replications | 10 | Locked; 20 not feasible (decision 23) |
| Block size | TBD | Must divide phase total evenly |
| Practice trials | on | Boolean; if on, 4-8 practice trials before study and test using non-experimental stimuli |
| Face display width | \~250px | Adjusted during development |
| Face spacing | \~50px | Adjusted during development |

------------------------------------------------------------------------

## Trial Count Summary

10 replications of the 12-type factorial design (decision 23). Derived from Logan email 1: "We need two unique pictures for each trial, one for the target and one that is repeated as the flankers."

| | Count |
|----|-----|
| Study trials | 120 |
| Unique study faces | 240 (120 targets + 120 flankers) |
| Item Recog test trials | 240 (120 old + 120 new) |
| Additional novel faces needed | 120 |
| Assoc Recog test trials | 120 (60 intact + 60 rearranged) |
| Valence test trials | 120 |
| **Total unique faces needed** | **360** |

------------------------------------------------------------------------

## Clean Experiment Overview

Emotional context shapes what we remember and how we remember it, but the mechanisms are not fully understood. This experiment investigates how emotional faces presented alongside neutral target faces during encoding affect three distinct aspects of memory: whether the target is recognized at all, whether the target-context pairing is remembered, and whether the target itself takes on the emotional valence of its context. Each question is tested in a separate between-subjects condition using the same study phase, isolating the effect of emotional flankers on item memory, associative memory, and affective transfer.

During the study phase, participants view a neutral face flanked on both sides by an identical emotional face (happy, angry, or neutral) and make a gender judgment on the central face. The flanker emotion is the key manipulation. At test, each participant completes one of three tasks: (1) an item recognition test, judging whether individual neutral faces are old or new, which reveals whether emotional context enhances or impairs recognition accuracy; (2) an associative recognition test, judging whether target-flanker pairings are intact or rearranged, which reveals whether emotional contexts produce stronger associative bindings; or (3) a valence rating task, rating each neutral target on a 1–9 scale, which reveals whether targets acquire the affective tone of their flankers.

### Design

-   Between-subjects: each participant completes one study phase and one of three test phases
-   Stimuli are photographs of faces from the Chicago Face Database (CFD) 3.0, using angry, happy (open-mouth), and neutral expressions
-   Flankers restricted to Black and White models to keep race constant across emotion conditions; targets and novel faces drawn from all races
-   Factorial design at study: 2 (target gender) x 2 (flanker gender) x 3 (flanker emotion) = 12 trial types
-   10 replications of the 12-type design (120 study trials)
-   No face identity is used more than once across the entire experiment

### Procedure

Each trial begins with a fixation cross (2000 ms), followed by the stimulus display. Trials are randomized within equal-sized blocks, with rest breaks between blocks.

**Study phase.** Three face photographs appear in a horizontal row: a neutral center target flanked on both sides by the same emotional face. The participant judges whether the central face is male or female. The display remains on screen for a fixed 3 seconds regardless of when the participant responds, ensuring equal encoding time across flanker emotion conditions. If no response is given within 3 seconds, the experiment advances silently.

**Test phase 1 — Item recognition.** A single neutral face appears. The participant judges whether it was presented during the study phase. Half of the faces are studied targets; half are novel. The key measure is whether hit rates and false alarm rates differ across flanker emotion conditions from study.

**Test phase 2 — Associative recognition.** Three faces appear in the same layout as the study phase. The participant judges whether the target-flanker pairing is the same as during study or rearranged. Half of pairings are intact; half are rearranged within the same trial type (preserving target gender, flanker gender, and flanker emotion) so that only the specific identity pairing changes. The key measure is whether discrimination of intact vs. rearranged pairings differs across flanker emotion conditions.

**Test phase 3 — Valence rating.** A single neutral face appears. The participant rates its emotional valence on a 1–9 scale (1 = most negative, 9 = most positive). The key measure is whether mean ratings shift toward the valence of the flankers from the study phase.

### Trial Counts

| | Count |
|----|-----|
| Study trials | 120 |
| Unique study faces | 240 (120 targets + 120 flankers) |
| Item recognition test trials | 240 (120 old + 120 new) |
| Associative recognition test trials | 120 (60 intact + 60 rearranged) |
| Valence rating test trials | 120 |
| **Total unique faces needed** | **360** |