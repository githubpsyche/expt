# Experiment Overview

## The Experiment

This is **Emma Kreitner's honors thesis** (advisor: Gordon Logan). The core question: **how does emotional context at encoding affect different types of memory?**

### Study Phase (same for all conditions)

Subjects see three faces in a row — a **neutral target** in the center, flanked by two copies of the same **emotional flanker face** (angry, happy, or neutral). Their task is to judge the **gender of the center face** (Z=female, M=male). This is incidental encoding — subjects aren't told to remember anything.

The flanker's gender can be **compatible** (same as target) or **incompatible** (different), creating the classic flanker interference effect. The display is up for a fixed 3 seconds regardless of response.

- 60 study trials (12 trial types: 2 target gender × 2 flanker gender × 3 flanker emotion × 5 reps)
- Condition 2 gets a **double pass** (120 trials — all 60 pairs shown twice)

### Three Test Conditions (between-subjects)

Each tests a different aspect of memory from the same study phase:

**Condition 1 — Item Recognition.** Single faces shown one at a time: 60 old targets + 60 new faces. "Old or new?" This tests whether emotional flanker context at encoding affects recognition of the target face itself. **Result (n=32): d' ≈ 0.44, significant.** Subjects recognize studied targets above chance, but no emotion modulation — angry, happy, and neutral flanker conditions produce equivalent hit rates.

**Condition 2 — Associative Recognition.** Face triplets shown (same layout as study): 30 intact pairs (exact study pairing) + 30 rearranged (flanker swapped within same trial type — same emotion, same gender combination, different specific identity). "Same or different?" This tests whether subjects remember which specific faces appeared together. **Result (pooled n=37): d' ≈ 0.04, not significant.** Pure guessing.

**Condition 3 — Valence Rating.** Studied targets shown alone, rate emotional valence 1-9. Tests whether neutral targets "absorb" the flanker's affect. (We haven't discussed this condition in our conversation.)

### What We've Found So Far

**The emotion question can't be answered yet — we're stuck on a prior question.** The experiment was designed to compare memory across flanker emotion conditions (angry vs happy vs neutral). But the results so far reveal a more basic problem: the paradigm may not produce the right *kind* of memory to test emotion modulation at all.

**Condition 1 — Item recognition works; emotion modulates RT but not accuracy.** Subjects recognize studied targets above chance (d' ≈ 0.44), but hit rates are flat across the three flanker emotion conditions (all ps > .45). Where emotion does show up is in response speed: targets studied with angry flankers are recognized ~45 ms faster than those studied with happy flankers (p = .035). So emotional context at encoding doesn't change *whether* you recognize a face, but it does change *how quickly* — angry contexts produce faster retrieval.

**Condition 2 — Associative recognition is at floor in both accuracy and RT, so emotion modulation is untestable.** You can't ask "does emotion strengthen associative binding?" when there's no associative binding to modulate. Across n=37 subjects and three data collections, d' ≈ 0.04 with no emotion effect. RT is equally flat: intact (1289 ms) vs rearranged (1270 ms), F(1,36) = 1.21, p = .278, with no emotion modulation or interaction. Unlike condition 1, where emotion at least shows up in retrieval speed, condition 2 has no signal in either measure — subjects aren't even slowing down for rearranged pairs. The experiment was designed to compare intact/rearranged discrimination across angry, happy, and neutral flanker conditions — but discrimination is zero in all three, so the comparison is meaningless.

**The flanker compatibility effect deepens the puzzle.** The study phase shows robust flanker interference (p = .001 on both accuracy and RT): incompatible flankers cost ~125 ms and ~20 percentage points. This proves subjects process the flanker deeply enough for its gender to interfere with the target response. Yet this processing produces no detectable associative memory. The compatibility effect confirms the flanker manipulation is working during encoding — subjects aren't ignoring it — but the memory system isn't retaining the association.

**So where does this leave the research question?** The experiment asks whether emotional context differentially affects item memory, associative memory, and affective transfer. The answer so far:
- Item memory: exists, but emotion doesn't modulate it (with a hint in RT for angry)
- Associative memory: doesn't exist at all under incidental encoding, regardless of emotion
- Affective transfer (condition 3): not yet tested

The dissociation between conditions 1 and 2 is itself a finding — incidental encoding with a gender-judgment flanker task produces item traces but not associative bindings — but it's not the finding the experiment was designed to produce.

### Design History (Condition 2)

| Collection | n | Design changes | d' |
|-----------|---|---------------|-----|
| Mar 11 | 6 | Single study pass, 24/36 split bug | ≈ 0 |
| Mar 13 | 6 | Double study pass, 30/30 fix | ≈ 0 |
| Mar 21 | 26 (25 analyzed) | Same as Mar 13 | ≈ 0.08 |
| **Pooled** | **37** | | **≈ 0.04** |

Doubling the study exposure (single → double pass) did not improve d': old design d' = -0.07, new design d' = 0.06, t(35) = -0.85, p = .404. The problem is not encoding strength.

### Open Question

We discovered that **condition 1 only tests target faces** — flanker faces never appear at test. So we don't actually know if flankers produce any item memory at all. The compatibility effect proves momentary processing, but processing ≠ memory formation. If flankers aren't even encoded into memory, then the condition 2 null is trivially explained: you can't bind what you don't have.

This matters for interpreting the results against the research question. If flankers aren't remembered at all, then:
- The condition 1 null for emotion modulation might just reflect that the flanker's emotion was never encoded durably enough to affect later target recognition
- The condition 2 null isn't about binding failure — it's about flanker encoding failure
- The entire logic of the experiment (emotional context affects memory) requires that the emotional context is itself encoded, which we haven't verified