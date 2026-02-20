# Analysis Guide

How to analyze, interpret, and draw inferences from the experiment data. Companion to [data-guide.md](data-guide.md) (data dictionary and structure) and [design-analysis.md](design-analysis.md) (design rationale).

## Signal Detection Theory Background

Two of the three research questions (RQ1 and RQ2) use signal detection theory (SDT) to measure memory. This section explains why SDT is needed and how its metrics work.

### Why not raw accuracy?

In a recognition memory task, participants classify items as "old" (studied) or "new" (not studied). A participant who responds "old" to every single item will correctly identify 100% of old items — perfect hit rate — but will also falsely endorse 100% of new items. Raw accuracy (proportion correct) conflates two distinct processes: the participant's ability to distinguish old from new items (sensitivity), and their general tendency to favor one response over the other (response bias). SDT separates these two components.

### d' (d-prime): sensitivity

d' measures how well the participant can discriminate between the two classes of items (old vs. new, or intact vs. rearranged). It is computed as:

    d' = z(hit rate) - z(false alarm rate)

where z() is the inverse of the standard normal cumulative distribution function (the probit transform). A d' of 0 means the participant cannot distinguish old from new at all — performance is at chance regardless of the hit rate. Higher d' means better discrimination. Typical d' values in recognition memory experiments range from about 0.5 (weak memory) to 2.0 or more (strong memory).

#### The underlying model

SDT assumes that when a participant encounters a face at test, they experience some degree of "familiarity" — an internal signal that the face has been seen before. This signal is noisy: even genuinely old faces sometimes feel unfamiliar, and genuinely new faces sometimes feel familiar. The model represents this with two normal (bell-curve) distributions along a familiarity axis:

- **X-axis: familiarity.** A continuous internal signal. Higher values mean the face feels more familiar. This is not directly observable — it is a latent psychological variable.
- **Y-axis: probability density.** How likely a given familiarity value is for items from each class.

The two distributions are:

- **New-item distribution:** centered at 0, with standard deviation 1. When the participant sees a face they have never studied, their familiarity signal is drawn from this distribution.
- **Old-item distribution:** centered at d', with standard deviation 1. When the participant sees a face they did study, their familiarity signal is drawn from this distribution.

d' is the distance between the two peaks, measured in standard deviations. A larger d' means less overlap between the distributions — old items reliably feel more familiar than new items, making discrimination easier.

         New items          Old items
         (not studied)      (studied)
              │                  │
              ▼                  ▼
            ┌───┐             ┌───┐
           ╱     ╲           ╱     ╲
          ╱       ╲         ╱       ╲
         ╱         ╲       ╱         ╲
        ╱           ╲     ╱           ╲
    ───╱─────────────╲───╱─────────────╲───  ← familiarity axis
       0             ···  d'
                     ↑
              overlap zone
        (where errors happen)

#### How the participant decides

The participant sets a criterion — a threshold on the familiarity axis. If the familiarity signal for a given face exceeds the criterion, they respond "old"; otherwise they respond "new." The criterion's position determines the trade-off between hits and false alarms:

- **Liberal criterion (shifted left):** The threshold is low, so the participant says "old" readily. This catches most old items (high hit rate) but also falsely endorses many new items (high false alarm rate).
- **Conservative criterion (shifted right):** The threshold is high, so the participant says "old" only when very confident. This produces fewer false alarms but also misses more old items (lower hit rate).
- **Unbiased criterion (midpoint between the two peaks):** The threshold sits where the two distributions cross, producing balanced error rates.

Crucially, moving the criterion changes both the hit rate and false alarm rate, but does not change how far apart the distributions are. The participant's sensitivity (d') stays the same regardless of where they place the criterion.

#### Why the z-transform recovers d'

The z-transform (inverse normal CDF) converts a probability — like a hit rate or false alarm rate — back into a position on the standard normal curve, expressed in standard deviations from the mean.

- **z(false alarm rate)** tells us where the criterion sits relative to the center of the new-item distribution (which is at 0). Because the new-item distribution is a standard normal centered at 0, z(FA rate) directly gives the criterion's position on the familiarity axis.
- **z(hit rate)** tells us where the criterion sits relative to the center of the old-item distribution (which is at d'). Because the old-item distribution is a standard normal centered at d', z(hit rate) gives the criterion's position measured from d'.

Subtracting the two cancels the criterion:

    z(hit rate) = d' − criterion    (criterion measured from old-item center)
    z(FA rate)  = 0 − criterion     (criterion measured from new-item center)

    z(hit rate) − z(FA rate) = (d' − criterion) − (−criterion) = d'

The criterion term appears in both z-scores with opposite signs and drops out of the subtraction, leaving only d' — the distance between the two distribution centers. This is what makes d' a pure measure of sensitivity, uncontaminated by response bias.

#### Worked example: criterion cancellation

The table below shows that with a true d' of 1.0, three different criterion placements produce different hit and FA rates but always recover d' = 1.0 after the z-transform:

| Criterion placement | Hit rate | FA rate | z(hit) | z(FA) | z(hit) − z(FA) |
|---|---|---|---|---|---|
| Unbiased (midpoint) | .69 | .31 | 0.50 | −0.50 | **1.0** |
| Liberal (say "old" more) | .84 | .50 | 1.00 | 0.00 | **1.0** |
| Conservative (say "new" more) | .50 | .16 | 0.00 | −1.00 | **1.0** |

A liberal participant (middle row) has a higher hit rate (.84 vs. .69) than an unbiased participant, but also a higher false alarm rate (.50 vs. .31). Raw accuracy would differ, but d' correctly identifies that both participants have the same underlying sensitivity. This is why d' is preferred over raw accuracy for recognition memory research.

### Criterion c: response bias

Criterion c uses the same two-distribution model as d'. Where d' measures the distance between the two peaks, c measures where the participant placed their decision threshold on the same familiarity axis — specifically, how far that threshold sits from the midpoint between the peaks.

    c = -0.5 * [z(hit rate) + z(false alarm rate)]

#### How the formula works

From the d' derivation above, we have:

    z(hit rate) = d' − threshold
    z(FA rate)  = 0  − threshold

where "threshold" is the criterion's absolute position on the familiarity axis. Adding (rather than subtracting) the two z-scores:

    z(hit rate) + z(FA rate) = d' − 2 * threshold

The midpoint between the two distribution centers is at d'/2. Criterion c is defined as how far the threshold deviates from this midpoint:

    c = midpoint − threshold = d'/2 − threshold

Substituting and rearranging gives the standard formula: `c = -0.5 * [z(hit) + z(FA)]`. The negative sign is a convention so that the sign of c has an intuitive meaning:

- **c = 0:** Unbiased — the threshold is at the midpoint, equally likely to say "old" or "new" when uncertain.
- **c > 0 (positive, conservative):** The threshold is shifted toward the old-item distribution. The participant requires stronger familiarity before saying "old," producing fewer hits but also fewer false alarms.
- **c < 0 (negative, liberal):** The threshold is shifted toward the new-item distribution. The participant says "old" more readily, producing more hits but also more false alarms.

#### Why criterion matters for this experiment

Criterion is important because the experimental manipulation might shift response bias rather than (or in addition to) actual memory sensitivity. For example, emotional context might make participants more willing to say "old" without actually improving their memory — which would show up as a criterion shift rather than a d' change. Reporting both d' and c for each condition lets us distinguish three scenarios: a genuine sensitivity change (d' differs, c constant), a pure bias shift (d' constant, c differs), or both.

### Edge correction

Hit rates of exactly 0 or 1 produce infinite z-scores, making d' and criterion undefined. The standard fix (Macmillan & Kaplan, 1985) replaces extreme rates: 0 becomes 0.5/N, and 1 becomes 1 - 0.5/N, where N is the number of trials. This makes the minimum possible d' slightly above its true value and the maximum slightly below, but avoids undefined values without meaningfully distorting the results.

## Study Phase Analysis

### Purpose

The study phase is identical across all three between-subjects conditions: participants view a neutral target face flanked by two emotional faces and judge the target's gender. Analyzing study-phase performance serves two purposes:

1. **Cover task validation.** Accuracy on the gender judgment should be near ceiling. If accuracy is low, participants are either not attending to the faces or the task is too difficult, both of which would undermine the encoding manipulation.

2. **Flanker interference check.** Reaction times may differ across flanker emotion conditions. If emotional flankers slow or speed gender judgments relative to neutral flankers, this suggests the flankers are being processed (the manipulation is working at the attentional level). However, because the study display is presented for a fixed 3 seconds regardless of response time (see design-analysis.md, decision 28), RT differences do not create an encoding-time confound — all participants get the same amount of time to encode the faces regardless of when they respond.

### Computation

**Accuracy and RT by flanker emotion.** Filter: phase = study. Group by flanker_emotion. Compute proportion where correct = True, and mean RT excluding timed-out trials.

**Full factorial RT.** Group by flanker_emotion x target_gender x flanker_gender (the three study-phase factors). Compute mean RT excluding timed-out trials. This reveals whether flanker effects on RT depend on the gender match between target and flanker.

### Interpretation

Near-ceiling accuracy (>95%) confirms the task is working. RT differences between emotion conditions are informative but not critical — they tell us whether emotional flankers captured attention, but the fixed display duration means all conditions had equal encoding opportunity. The full factorial breakdown is exploratory; with the planned sample size, higher-order interactions (e.g., flanker emotion x target gender x flanker gender) are underpowered and should be interpreted cautiously.

### Statistical inference (full sample)

Repeated-measures ANOVA on RT with flanker emotion (3 levels) x target gender (2 levels) x flanker gender (2 levels), all within-subjects. The main effect of flanker emotion is the primary test. Accuracy is expected to be at ceiling and may not warrant an inferential test; if it varies meaningfully, the same ANOVA structure applies.

## RQ1: Does Emotional Context Affect Recognition Accuracy?

### Research question

During the study phase, neutral target faces were presented alongside emotional flanker faces. Does the emotional context at encoding affect whether the target is later recognized? Specifically, are targets studied with emotional flankers (angry or happy) recognized more or less accurately than targets studied with neutral flankers?

### Logic of the analysis

Condition 1 participants complete an item recognition test: they see single neutral faces and judge each as "old" (studied) or "new" (not studied). This directly maps onto signal detection theory — old items are "signal" and new items are "noise." If emotional flankers enhance encoding of the target face, hit rates should be higher for targets from emotional contexts, producing higher d' for the angry and happy conditions compared to neutral.

### Why the false alarm rate is pooled

New items at test were never presented during the study phase, so they have no flanker emotion condition — there is no meaningful way to assign an emotion to a face that was never studied. All new items therefore share one false alarm rate, and each emotion condition's d' compares that emotion's hit rate against this common baseline.

This means d' differences across emotions are driven entirely by hit rate differences. A change in overall response bias (becoming more or less willing to say "old") would affect the false alarm rate equally for all conditions and cancel out in the d' comparison. However, criterion (c) will differ across emotions if emotional context shifts the hit rate without affecting the FA rate.

### Computation

**Filter:** condition = 1, phase = test

| Measure | Filter | Group by | Compute |
|---|---|---|---|
| Hit rate | stimulus_type = old | study_flanker_emotion | proportion responding "old" (correct = True) |
| False alarm rate | stimulus_type = new | pooled (no grouping) | proportion responding "old" (correct = False) |
| d' | — | study_flanker_emotion | z(hit rate) - z(FA rate) |
| Criterion c | — | study_flanker_emotion | -0.5 * [z(hit rate) + z(FA rate)] |

Apply edge correction to hit and FA rates before computing z-scores. For the full factorial, add target_gender and study_flanker_gender as grouping variables.

### Interpreting results

- **d'(angry) > d'(neutral) or d'(happy) > d'(neutral)**: Emotional context enhanced item memory — the target was encoded more strongly when flanked by emotional faces.
- **d'(angry) > d'(happy)** or vice versa: Valence-specific effect — one type of emotional context is more effective than the other.
- **d'(angry) ≈ d'(happy) > d'(neutral)**: General emotional enhancement — any emotional context helps, regardless of valence.
- **No d' differences, but criterion differences**: Emotional context shifts response bias (e.g., participants are more willing to call emotionally-encoded faces "old") without actually improving discriminability.
- **No differences in either**: Emotional flanker context does not affect item recognition.

### Statistical inference (full sample)

Each participant in condition 1 contributes one d' value per flanker emotion level (angry, happy, neutral), making flanker emotion a within-subjects factor.

- **Primary test:** One-way repeated-measures ANOVA on d' with flanker emotion (3 levels).
- **Planned comparisons:** (1) Emotional (mean of angry and happy) vs. neutral — tests for a general emotional enhancement effect. (2) Angry vs. happy — tests for valence-specific differences.
- **Criterion analysis:** Same ANOVA and comparisons on criterion (c) to assess whether observed differences reflect sensitivity changes, bias shifts, or both.
- **Effect size:** Report partial eta-squared for the ANOVA and Cohen's d for planned comparisons.

## RQ2: Are Items Bound More Strongly to Emotional Contexts?

### Research question

Beyond recognizing individual faces, do participants form stronger associative memories for target-flanker pairings when the flanker is emotional? That is, are the specific identity pairings from the study phase better remembered when the flanker expressed anger or happiness compared to a neutral expression?

### Logic of the analysis

Condition 2 participants complete an associative recognition test: they see the three-face display from the study phase and judge whether the target-flanker pairing is "intact" (same as study) or "rearranged" (different flanker identity from the same trial type). This maps onto SDT with intact trials as "signal" and rearranged trials as "noise." Higher d' for a given emotion means participants were better at discriminating intact from rearranged pairings in that emotion condition — i.e., they formed stronger associative memories.

This is a more demanding memory test than item recognition (RQ1). Recognizing a face as "old" only requires memory for the individual item. Recognizing a pairing as "intact" requires memory for the specific association between target and flanker — who was paired with whom.

### Why false alarm rates are computed per emotion

Unlike RQ1, rearranged trials in condition 2 preserve the flanker emotion (and target gender and flanker gender). A rearranged angry trial still shows an angry flanker — only the specific identity pairing has changed. This means each emotion condition has its own set of rearranged trials and therefore its own false alarm rate.

This is analytically important because a participant might be biased toward saying "same" specifically for one emotion (e.g., always saying "same" to angry pairings because the angry faces are more memorable and "feel familiar"). Per-emotion FA rates allow d' to correctly adjust for such condition-specific biases.

### Computation

**Filter:** condition = 2, phase = test

| Measure | Filter | Group by | Compute |
|---|---|---|---|
| Hit rate | pair_type = intact | flanker_emotion | proportion responding "same" (correct = True) |
| False alarm rate | pair_type = rearranged | flanker_emotion | proportion responding "same" (correct = False) |
| d' | — | flanker_emotion | z(hit rate) - z(FA rate) |
| Criterion c | — | flanker_emotion | -0.5 * [z(hit rate) + z(FA rate)] |

Apply edge correction. For the full factorial, add target_gender and flanker_gender as grouping variables (both are directly available on condition 2 test trials because the flanker is shown at test).

### Interpreting results

- **d'(angry) > d'(neutral) or d'(happy) > d'(neutral)**: Emotional context produced stronger associative binding — participants better remembered who was paired with whom when the flanker was emotional.
- **Overall low d' (near 0)**: Participants had difficulty distinguishing intact from rearranged pairings, which is common in associative recognition tasks with faces. Effect may emerge at the group level even if individual d' values are modest.
- **Criterion differences across emotions**: Participants may be more willing to say "same" for one emotion condition (e.g., because emotional pairings "feel familiar"), which d' appropriately separates from actual discriminability.

### Statistical inference (full sample)

Each participant in condition 2 contributes one d' per flanker emotion level, making flanker emotion within-subjects.

- **Primary test:** One-way repeated-measures ANOVA on d' with flanker emotion (3 levels).
- **Planned comparisons:** Same as RQ1 — emotional vs. neutral, and angry vs. happy.
- **Criterion analysis:** Same structure on criterion.
- **Effect size:** Partial eta-squared and Cohen's d.

## RQ3: Do Targets Acquire the Valence of Their Flankers?

### Research question

After being studied alongside emotional flanker faces, do neutral target faces come to be perceived as having emotional valence themselves? Specifically, are targets that were flanked by happy faces later rated as more positive, and targets flanked by angry faces rated as more negative, compared to targets flanked by neutral faces?

### Logic of the analysis

Condition 3 participants rate the valence of each studied neutral target on a 1-9 scale (1 = most negative, 5 = neutral, 9 = most positive). This is a direct rating measure — no signal detection is needed. The target faces were all objectively neutral, so any systematic difference in ratings across flanker emotion conditions reflects a transfer of affect from the flanker to the target's mental representation.

Unlike RQ1 and RQ2, there is no "correct" answer — the rating reflects the participant's subjective impression. The `correct` column is blank for valence trials.

### Computation

**Filter:** condition = 3, phase = test, timed_out = False

| Measure | Group by | Compute |
|---|---|---|
| Mean valence rating | study_flanker_emotion | mean of rating |
| Standard deviation | study_flanker_emotion | SD of rating |
| N | study_flanker_emotion | count (after excluding timeouts) |
| Predicted ordering | — | happy > neutral > angry |

For the full factorial, add target_gender and study_flanker_gender as grouping variables.

### Interpreting results

- **happy > neutral > angry ordering**: The predicted pattern — targets acquired the valence of their flankers. The strength of the effect is gauged by the size of the mean differences and the overlap of the distributions.
- **All means near 5 with small differences**: Expected. The faces are objectively neutral, so even a successful manipulation will produce means near the scale midpoint. The question is whether there are reliable differences between conditions, not whether means deviate far from 5.
- **No ordering, or reversed ordering**: Flanker emotion did not transfer to target valence (or did so in an unexpected direction), suggesting the affective transfer mechanism is weak or absent in this paradigm.
- **Large SDs relative to mean differences**: Individual variability in how participants use the rating scale may obscure a real effect. This is common with subjective ratings and motivates using within-subjects comparisons (each participant serves as their own baseline).

### Statistical inference (full sample)

Each participant in condition 3 contributes a mean rating per flanker emotion level, making flanker emotion within-subjects.

- **Primary test:** One-way repeated-measures ANOVA on mean rating with flanker emotion (3 levels).
- **Planned comparisons:** (1) Happy vs. angry — the strongest predicted contrast. (2) Happy vs. neutral and angry vs. neutral — tests whether each emotional condition differs from the neutral baseline.
- **Effect size:** Partial eta-squared for the ANOVA; Cohen's d for pairwise comparisons. Because the expected effect is a shift in ratings on a 9-point scale, even small mean differences (e.g., 0.3-0.5 scale points) may be meaningful if reliable.

## Notes on Pilot Data

The pilot dataset contains one participant per condition (3 total). With n=1, individual variation dominates, and no statistical inference is appropriate. The purpose of the pilot analysis is to:

1. **Verify the data pipeline** — confirm that trial counts, condition assignments, and column values are correct.
2. **Confirm the analysis code runs** — catch computational errors (e.g., edge correction, filtering) before the full dataset arrives.
3. **Sanity-check the metrics** — d' values should be in a plausible range (not wildly high or systematically negative), ratings should use the scale range, and accuracy should be high for the study-phase cover task.

Patterns in the pilot data should not be interpreted as evidence for or against the research hypotheses.
