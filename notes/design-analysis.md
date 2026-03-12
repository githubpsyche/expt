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

**Resolution**: Rearrange within trial type. Each rearranged trial's flanker is swapped with a flanker from a different trial of the same type via derangement (no flanker stays with its original target). This ensures the only detectable difference between intact and rearranged is the specific identity pairing — the design's stated goal.

**Mechanics (5 reps)**: With 5 reps per trial type, an even split is impossible. Six trial types get 3 intact + 2 rearranged, six get 2 intact + 3 rearranged, alternating across gender combinations to balance emotions (10 intact + 10 rearranged per emotion, 30 + 30 = 60 total). See decision 31 for details.

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

**23. Replications: reduced to 5 (60 study trials)**

Resolves decision 21. Originally set to 10 reps (360 unique faces needed, feasible). 20 reps not feasible (720 faces needed, only 290 males available).

Reduced to 5 reps after 39-subject pilot showed overall d' near floor (~0.3), leaving no room for emotion effects. See decision 31 for rationale and downstream implications.

**24. Flanker race: restricted to Black and White models**

Since only B/W models have angry and happy expressions, all emotional flankers are necessarily B/W. If neutral flankers were drawn from all races, the neutral condition would have a different racial composition than the emotional conditions — confounding flanker race with flanker emotion. Restricting all flankers (angry, happy, and neutral) to B/W keeps race constant across emotion conditions.

Targets and novel faces are always neutral and are not part of the emotion manipulation. Their race is a nuisance variable balanced across conditions by random assignment. No race restriction on targets or novels.

**Face budget per gender for 5 reps:**

| Role | Count | Pool |
|---|---|---|
| Flankers (angry) | 10 | B/W: 84F / 70M |
| Flankers (happy) | 10 | B/W: 85F / 68M |
| Flankers (neutral) | 10 | B/W: 194F / 186M |
| Targets | 30 | All races: 307F / 290M |
| Novel faces (item recog) | 30 | All races: remaining |
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

**16. Response key counterbalancing: test-phase binary tasks only**

No source mentions counterbalancing. Emma specifies fixed mappings (Z=old/same, M=new/different) for test phases.

A single `KEY_MAPPING` variable (1 or 2) controls **test-phase** binary key assignments:
- **Key mapping 1**: Z=old/same, M=new/different
- **Key mapping 2**: Z=new/different, M=old/same

Study-phase keys are fixed (see decision 17). `KEY_MAPPING` is assigned via URL parameter (`key_mapping=1|2`), JATOS JSON input, or random 50/50 fallback. Recorded in data as `key_mapping`.

**17. Study phase response keys: Z and M, fixed (Z=female, M=male)**

No source specifies study phase keys.
Emma only specifies test phase keys (Z/M).
Study keys are fixed: Z=female, M=male. The M=male mnemonic makes the mapping intuitive and eliminates the SRC confound that would arise from counterbalancing (M=male is naturally compatible). Originally counterbalanced via `KEY_MAPPING`, but fixed after pilot testing showed low study accuracy (72.5% in the 8-subject pilot) and participant confusion — two participants reported the key mapping felt reversed (see decision 37).

**18. Novel faces for item recognition: 50/50 gender match**

No source specifies gender distribution of novel items.
The factorial design is balanced on target gender, so novel faces should match to avoid confounding novelty with gender.

**19. ITI: 2000ms fixation cross only**

> "A fixation cross should appear before every new set of faces (2000ms)." — Emma

No additional interval mentioned by anyone.
The fixation cross IS the inter-trial interval.
Sequence: response -\> fixation (2000ms) -\> next stimulus.

**20. Display size and spacing: 100px wide, 0px gap**

> "I think it would be good to reduce the size of the displays by about 1/2. The flankers are far from the target, measured center to center. They may be so far in the periphery that subjects won't recognise their gender or emotion. If we shrink the displays, we may be more likely to find effects." — Logan

Initial implementation used 400px face width (matching the resized source image resolution). Reduced to 200px per Logan's recommendation to decrease flanker-target eccentricity and increase experimental sensitivity to flanker emotion effects. Source images remain 400px, providing 2x resolution for retina/HiDPI displays. Gap between faces is 0px, keeping flanker edges adjacent to the target edge.

After the 39-subject pilot showed a null gender compatibility effect (RT = 994 ms compatible vs. 996 ms incompatible), Logan recommended further reduction:

> "We should look closer at the flanker displays. The key flanker result in the study phase is the effect of same vs. different gender flankers. This effect is null (RT = 994 ms for compatible, 996 ms for incompatible; accuracy = .9672 for compatible, .9656 for incomptible). It's possible that the flankers are too far from the target to have much influence. The whole display could be too large. We could try smaller displays as well." — Logan
>
> "The smaller display is a good idea. In the original Eriksen and Eriksen (1974) flanker study, the compatibility effect got smaller as the distance between the target and the flankers increased from .0625 to .5 to 1.0 degrees of visual angle." — Logan

Further reduced from 200px to 100px per this feedback. Source images remain 400px, now providing 4x resolution.

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

Rearranged trials preserve target gender, flanker gender, and flanker emotion — only the specific identity pairing changes. With 5 reps per trial type, the intact/rearranged split alternates across types to achieve 30/30 overall (see decision 31). See rearrangement constraints section for rationale.

**27. Data output fields**

Per-trial fields recorded by the experiment. Common fields on all trials: `condition`, `key_mapping`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`.

Study phase adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`.

Item recognition adds: `stimulus_type` (old/new), `study_flanker_emotion`, `study_flanker_gender`.

Associative recognition adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `pair_type` (intact/rearranged).

Valence rating adds: `study_flanker_emotion`, `study_flanker_gender`, `rating` (1-9).

**28. Study-phase encoding duration: fixed (3s)**

Study trials use a fixed stimulus display duration: the faces remain on screen for the full 3 seconds regardless of when the participant responds. This prevents encoding time from varying with flanker condition. If emotional flankers systematically speed or slow gender judgments, response-terminated display would confound encoding duration with the IV — memory differences could reflect more or less time on screen rather than the emotional context itself. Fixed display eliminates this confound by equalizing encoding opportunity across all conditions.

Test phases remain response-terminated (trial ends on keypress, 3s timeout). There is no encoding concern at test; response-terminated trials keep the pace comfortable and avoid dead time after responding.

**29. Study-phase response feedback: prompt text swap**

No source specifies response feedback during study. Because the study phase uses a fixed 3-second display (decision 28), participants receive no visual indication that their keypress was registered. After a valid keypress, the prompt text below the faces changes to "Response recorded" to confirm registration. This is a registration cue only — no accuracy information is provided (consistent with decision 15). Controlled by `STUDY_RESPONSE_FEEDBACK` in config.js; default on.

**30. Dark background**

Dark gray background (`#333`) with light text (`#eee`) and white fixation cross (`#fff`). Standard practice in face perception experiments — reduces glare, minimizes screen luminance contrast with face stimuli, and better approximates lab viewing conditions. Implemented via `experiment/flanker.css` overrides on jsPsych defaults. Buttons and progress bar retain their own light backgrounds from jsPsych CSS.

**31. Study list reduction: 120 → 60 trials (10 → 5 replications)**

> "For now, I think we should focus on Experiment 1 and see if we can get the item recognition task working. I think the problem may be that there are too many faces to remember. We now have 120 orienting (flanker task) trials in Experiment 1, which means 240 test trials. We could cut the number of orienting trials down to 60 or even 36. [...] If we reduced that to 5 replications, we would have 60 trials. [...] If we went to 36 orienting trials, I think we'd have too few trials to get stable data." — Logan

Reduced `N_REPLICATIONS` from 10 to 5 and `STUDY_BLOCK_SIZE` from 40 to 30 (60 / 30 = 2 blocks). The 39-subject pilot showed d' ≈ 0.3 across all three emotion conditions — near floor with no room for emotion modulation. Halving the study list should improve overall recognition accuracy, making the experiment sensitive to any emotion effect that exists.

**Downstream effects by condition:**

- **Condition 1 (item recognition)**: 60 old + 60 new = 120 test trials, 20 old per emotion. Sufficient for per-emotion d' with standard edge correction.
- **Condition 2 (associative recognition)**: 60 study → 30 intact + 30 rearranged. With 5 reps per trial type, a naive `ceil(5/2)` split would give 36/24. Fixed by alternating which of the 12 trial types get majority-intact (3/2) vs majority-rearranged (2/3), balanced across emotions (10 intact + 10 rearranged per emotion). `derangement(2)` is a trivial swap and `derangement(3)` has only 2 possible permutations, but which items are assigned to rearranged is random, so the resulting pairs are unpredictable. `TEST_BLOCK_SIZE_ASSOC_RECOG` set to 30 (60 / 30 = 2 blocks).
- **Condition 3 (valence)**: 60 study → 60 test → 20 ratings per emotion. Workable for mean ratings. `TEST_BLOCK_SIZE_VALENCE` set to 30 (60 / 30 = 2 blocks).

**32. Face cropping: CSS crop to 50% width**

CFD face images include shoulders, background, and hair that are not relevant to the task. At small display sizes (100px, decision 20), these non-face elements consume a disproportionate fraction of the image area. `FACE_CROP` (config.js, default 0.5) controls how much of the original image width is shown using CSS `object-fit: cover` with `object-position: center 20%`. The 20% vertical offset focuses the crop on the face rather than the forehead. Display height is computed as `FACE_WIDTH * (281/400) / FACE_CROP`, preserving the CFD aspect ratio (400×281) within the cropped viewport.

**33. Key quiz after instructions**

After study-phase and test-phase instructions (except valence, which uses number keys), participants complete a key-mapping quiz. Each quiz item displays a label (e.g., "female", "old") and the participant must press the correct key. Incorrect responses trigger feedback and the item repeats until correct. This ensures participants have learned the mapping before trials begin. Added after the 8-subject pilot showed 72.5% study accuracy, partly attributable to key confusion (one participant at 5% accuracy, consistent with reversed keys).

**34. Removed on-screen trial prompts**

On-screen key reminders (e.g., "Z = female | M = male") were originally displayed below the stimulus on every trial. Removed from all real trials per E.C. feedback: "We usually do that" (referring to the standard practice of not showing key reminders during trials). The key quiz (decision 33) and practice-phase prompts (decision 35) compensate for the removal.

**35. Practice-only prompts**

Practice trials retain on-screen key reminders below the stimulus to help participants learn the mapping. Real trials do not show prompts (decision 34). At the end of the practice phase, a notice warns participants: "From now on, the key instructions will **not** be displayed on screen during trials." This transitions participants from prompted practice to unprompted real trials.

**36. Rest break key reminders**

Rest breaks between blocks include a reminder of the current key mapping (e.g., "Reminder: Z = female, M = male"). This compensates for the removal of on-screen trial prompts (decision 34) and gives participants a chance to re-check the mapping if needed without adding visual clutter to trial displays.

**37. Participant feedback: key confusion (March 2, 2026 pilot)**

Two Prolific participants reported that the instructions displayed Z=male and M=female (reversed from the correct mapping Z=female, M=male). Investigation confirmed that the instruction text in code was correct. The fix was applied in the same batch of uncommitted changes that included decisions 33-36 (key quiz, prompt removal, practice prompts, rest break reminders). The fixed study key mapping (decision 17, M=male mnemonic) and the key quiz (decision 33) together address the underlying confusion.

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

The design addresses this by presenting studied target-flanker pairings at test, half intact and half rearranged within trial type (decision 26). Additional phase-specific fields: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `pair_type` (intact/rearranged).

Analysis: Signal detection per flanker emotion condition.

- **Hit rate**: Filter `pair_type="intact"`, group by `flanker_emotion` → proportion responding "same"
- **False alarm rate**: Filter `pair_type="rearranged"`, group by `flanker_emotion` → proportion responding "same"
- **d' per emotion**: Hit rate vs. false alarm rate within each emotion condition
- **Fields used**: `pair_type`, `flanker_emotion`, `response`, `correct`

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
-   5 replications (60 study trials; reduced from 10 per decision 31)
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
-   **Task**: Gender judgment on center face (Z=female, M=male; fixed mapping — see decision 17)

### Test Phase 1: Item Recognition

-   **Display**: Single neutral face photograph
-   **Stimuli**: All studied neutral targets + equal number of novel neutral faces (50/50 gender-matched)
-   **Task**: Old/new judgment (key mapping counterbalanced — see decision 16)

### Test Phase 2: Associative Recognition

-   **Display**: Three face photographs in a horizontal row (same layout as study)
-   **Stimuli**: All studied target-flanker combinations; half intact (same pairing as study), half rearranged within trial type (target gender, flanker gender, and flanker emotion preserved; only specific identity pairing changes)
-   **Task**: Same/different judgment (key mapping counterbalanced — see decision 16)

### Test Phase 3: Valence Rating

-   **Display**: Single neutral face photograph
-   **Stimuli**: All studied neutral targets, presented alone
-   **Task**: Rate emotional valence using number row keys 1-9 above the keyboard, not numpad (1=most negative, 5=neutral, 9=most positive)

### Other Screens

-   **Instructions**: Before study phase and before test phase, with response key descriptions
-   **Key quiz**: After instructions for study and test phases (except valence), participant must press correct key for each label; incorrect responses repeat with feedback (decision 33)
-   **Practice**: 4 study + 4 test practice trials (except valence, which has no test practice) using non-experimental stimuli; practice trials show on-screen key prompts (decision 35)
-   **Practice-end notice**: Warns that key instructions will not be displayed during real trials (decision 35)
-   **Rest breaks**: Between blocks, with key mapping reminder text (decision 36)
-   **Debrief**: Placeholder screen at end (researcher provides text)

### Data Output

Per-trial fields recorded by the experiment:

-   **All trials**: `condition`, `key_mapping`, `phase`, `block`, `trial_index`, `target_id`, `target_gender`, `target_race`, `target_filename`, `response`, `rt`, `timed_out`, `correct_response`, `correct`, `device_pixel_ratio`
-   **Study** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`
-   **Item recognition** adds: `stimulus_type`, `study_flanker_emotion`, `study_flanker_gender`
-   **Associative recognition** adds: `flanker_id`, `flanker_gender`, `flanker_race`, `flanker_emotion`, `flanker_filename`, `pair_type`
-   **Valence rating** adds: `study_flanker_emotion`, `study_flanker_gender`, `rating`

### Configurable Parameters

| Parameter | Default | Notes |
|-----------------------------|------------------------|-------------------|
| Experiment condition | — | 1 (item recog), 2 (assoc recog), or 3 (valence) |
| Number of replications | 5 | Reduced from 10 per decision 31; 20 not feasible (decision 23) |
| Study block size | 30 | 60 / 30 = 2 blocks |
| Test block size (item recog) | 40 | 120 / 40 = 3 blocks |
| Test block size (assoc recog) | 30 | 60 / 30 = 2 blocks |
| Test block size (valence) | 30 | 60 / 30 = 2 blocks |
| Practice trials | on | Boolean; if on, 4 practice trials before study and test (except valence test) |
| Face display width | 100px | Reduced from 400px → 200px → 100px per Logan feedback (decision 20) |
| Face crop | 0.5 | Fraction of original image width shown; CSS object-fit crop (decision 32) |
| Face spacing | 0px | Flanker edges adjacent to target |

------------------------------------------------------------------------

## Trial Count Summary

5 replications of the 12-type factorial design (decisions 23, 31). Derived from Logan email 1: "We need two unique pictures for each trial, one for the target and one that is repeated as the flankers."

| | Count |
|----|-----|
| Study trials | 60 |
| Unique study faces | 120 (60 targets + 60 flankers) |
| Item Recog test trials | 120 (60 old + 60 new) |
| Additional novel faces needed | 60 |
| Assoc Recog test trials | 60 (30 intact + 30 rearranged) |
| Valence test trials | 60 |
| **Total unique faces needed** | **180** |

------------------------------------------------------------------------

## Clean Experiment Overview

Emotional context shapes what we remember and how we remember it, but the mechanisms are not fully understood. This experiment investigates how emotional faces presented alongside neutral target faces during encoding affect three distinct aspects of memory: whether the target is recognized at all, whether the target-context pairing is remembered, and whether the target itself takes on the emotional valence of its context. Each question is tested in a separate between-subjects condition using the same study phase, isolating the effect of emotional flankers on item memory, associative memory, and affective transfer.

During the study phase, participants view a neutral face flanked on both sides by an identical emotional face (happy, angry, or neutral) and make a gender judgment on the central face. The flanker emotion is the key manipulation. At test, each participant completes one of three tasks: (1) an item recognition test, judging whether individual neutral faces are old or new, which reveals whether emotional context enhances or impairs recognition accuracy; (2) an associative recognition test, judging whether target-flanker pairings are intact or rearranged, which reveals whether emotional contexts produce stronger associative bindings; or (3) a valence rating task, rating each neutral target on a 1–9 scale, which reveals whether targets acquire the affective tone of their flankers.

### Design

-   Between-subjects: each participant completes one study phase and one of three test phases
-   Stimuli are photographs of faces from the Chicago Face Database (CFD) 3.0, using angry, happy (open-mouth), and neutral expressions
-   Flankers restricted to Black and White models to keep race constant across emotion conditions; targets and novel faces drawn from all races
-   Factorial design at study: 2 (target gender) x 2 (flanker gender) x 3 (flanker emotion) = 12 trial types
-   5 replications of the 12-type design (60 study trials)
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
| Study trials | 60 |
| Unique study faces | 120 (60 targets + 60 flankers) |
| Item recognition test trials | 120 (60 old + 60 new) |
| Associative recognition test trials | 60 (30 intact + 30 rearranged) |
| Valence rating test trials | 60 |
| **Total unique faces needed** | **180** |