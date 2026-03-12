#!/usr/bin/env node
/**
 * Verification tests for the face-flanker memory experiment.
 * Run from project root:  node scripts/run_tests.js
 *
 * Tests cover: stimulus manifest, helpers, trial allocation (all 3 conditions),
 * identity uniqueness, derangement correctness, factor preservation, and
 * data field completeness per design-analysis.md decision 27.
 */

var fs = require('fs');
var path = require('path');

// ============================================================
// Test harness
// ============================================================

var passed = 0;
var failed = 0;
var errors = [];

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    errors.push(message);
    console.log('  FAIL: ' + message);
  }
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, message + ' (expected ' + expected + ', got ' + actual + ')');
}

function section(name) {
  console.log('\n' + name);
  console.log('-'.repeat(name.length));
}

// ============================================================
// Load experiment modules
// ============================================================

// Mock jsPsych for Node.js testing
var jsPsych = {
  randomization: {
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }
  },
  data: {
    getURLVariable: function () { return null; },
    addProperties: function () {}
  }
};

// Stub jatos as undefined (local testing mode)
var jatos; // intentionally undefined

var root = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(root, 'experiment/stimuli.js'), 'utf8').replace('const STIMULI', 'var STIMULI'));
eval(fs.readFileSync(path.join(root, 'experiment/helpers.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'experiment/config.js'), 'utf8'));

// Initialize URL-dependent config (sets KEY_MAPPING and derived key mappings)
initURLParams();

eval(fs.readFileSync(path.join(root, 'experiment/trials.js'), 'utf8'));

// ============================================================
// 1. Stimulus manifest
// ============================================================

section('1. Stimulus manifest (stimuli.js)');

assertEqual(STIMULI.length, 597, 'Total model count');

var raceGenderCounts = {};
for (var i = 0; i < STIMULI.length; i++) {
  var key = STIMULI[i].race + STIMULI[i].gender;
  raceGenderCounts[key] = (raceGenderCounts[key] || 0) + 1;
}
assertEqual(raceGenderCounts['BF'], 104, 'BF count');
assertEqual(raceGenderCounts['BM'],  93, 'BM count');
assertEqual(raceGenderCounts['WF'],  90, 'WF count');
assertEqual(raceGenderCounts['WM'],  93, 'WM count');
assertEqual(raceGenderCounts['AF'],  57, 'AF count');
assertEqual(raceGenderCounts['AM'],  52, 'AM count');
assertEqual(raceGenderCounts['LF'],  56, 'LF count');
assertEqual(raceGenderCounts['LM'],  52, 'LM count');

// Expression availability for B/W models
function countExpr(gender, races, expr) {
  return STIMULI.filter(function (s) {
    return s.gender === gender && races.indexOf(s.race) !== -1 && s.expressions[expr];
  }).length;
}
assertEqual(countExpr('F', ['B', 'W'], 'A'),  84, 'B/W angry female');
assertEqual(countExpr('M', ['B', 'W'], 'A'),  70, 'B/W angry male');
assertEqual(countExpr('F', ['B', 'W'], 'HC'), 85, 'B/W happy(HC) female');
assertEqual(countExpr('M', ['B', 'W'], 'HC'), 68, 'B/W happy(HC) male');
assertEqual(countExpr('F', ['B', 'W'], 'N'), 194, 'B/W neutral female');
assertEqual(countExpr('M', ['B', 'W'], 'N'), 186, 'B/W neutral male');
assertEqual(countExpr('F', ['B', 'W'], 'HO'), 83, 'B/W happy(HO) female');
assertEqual(countExpr('M', ['B', 'W'], 'HO'), 71, 'B/W happy(HO) male');

// All models should have neutral
var allHaveNeutral = STIMULI.every(function (s) { return !!s.expressions.N; });
assert(allHaveNeutral, 'All models have neutral expression');

// All neutral female (any race)
assertEqual(countExpr('F', ['A', 'B', 'L', 'W'], 'N'), 307, 'All-race neutral female');
assertEqual(countExpr('M', ['A', 'B', 'L', 'W'], 'N'), 290, 'All-race neutral male');

// Image paths should be valid (local files or remote URLs)
var sampleModel = STIMULI.find(function (s) { return s.model_id === 'BF-001'; });
assert(!!sampleModel, 'BF-001 exists in manifest');
if (sampleModel) {
  var isRemote = sampleModel.expressions.N.startsWith('http');
  if (isRemote) {
    assert(sampleModel.expressions.N.endsWith('.jpg'), 'BF-001 neutral path ends with .jpg');
    if (sampleModel.expressions.A) {
      assert(sampleModel.expressions.A.endsWith('.jpg'), 'BF-001 angry path ends with .jpg');
    }
  } else {
    var nPath = path.join(root, sampleModel.expressions.N);
    assert(fs.existsSync(nPath), 'BF-001 neutral file exists on disk');
    if (sampleModel.expressions.A) {
      var aPath = path.join(root, sampleModel.expressions.A);
      assert(fs.existsSync(aPath), 'BF-001 angry file exists on disk');
    }
  }
}

// ============================================================
// 1b. Config consistency
// ============================================================

section('1b. Config consistency');

// EMOTION_EXPR_MAP should have an entry for every emotion in FLANKER_EMOTIONS
for (var i = 0; i < FLANKER_EMOTIONS.length; i++) {
  var emo = FLANKER_EMOTIONS[i];
  assert(EMOTION_EXPR_MAP[emo] !== undefined,
    'EMOTION_EXPR_MAP has entry for "' + emo + '"');
}

// HAPPY_EXPRESSION should be reflected in EMOTION_EXPR_MAP
assertEqual(EMOTION_EXPR_MAP.happy, HAPPY_EXPRESSION,
  'EMOTION_EXPR_MAP.happy matches HAPPY_EXPRESSION');

// Every expression code in EMOTION_EXPR_MAP should exist for at least some B/W models
var exprCodes = {};
for (var i = 0; i < FLANKER_EMOTIONS.length; i++) {
  exprCodes[EMOTION_EXPR_MAP[FLANKER_EMOTIONS[i]]] = true;
}
var codes = Object.keys(exprCodes);
for (var i = 0; i < codes.length; i++) {
  var available = countExpr('F', FLANKER_RACES, codes[i]) + countExpr('M', FLANKER_RACES, codes[i]);
  assert(available > 0,
    'Expression code "' + codes[i] + '" has models in FLANKER_RACES pool (' + available + ')');
}

// N_TRIAL_TYPES should equal 2 * 2 * FLANKER_EMOTIONS.length
assertEqual(N_TRIAL_TYPES, 2 * 2 * FLANKER_EMOTIONS.length,
  'N_TRIAL_TYPES = 2 genders * 2 genders * ' + FLANKER_EMOTIONS.length + ' emotions');

// ============================================================
// 2. Helpers
// ============================================================

section('2. Helper functions');

// derangement
for (var trial = 0; trial < 50; trial++) {
  var d = derangement(5);
  var hasFixed = false;
  for (var i = 0; i < 5; i++) {
    if (d[i] === i) hasFixed = true;
  }
  assert(!hasFixed, 'derangement(5) has no fixed points (trial ' + trial + ')');
}

// chunkArray
var chunks = chunkArray([1, 2, 3, 4, 5, 6], 2);
assertEqual(chunks.length, 3, 'chunkArray produces 3 chunks of size 2');
assertEqual(chunks[0].length, 2, 'First chunk has 2 elements');

var chunks120 = chunkArray(new Array(120), 40);
assertEqual(chunks120.length, 3, 'chunkArray(120, 40) produces 3 blocks');

var chunks240 = chunkArray(new Array(240), 40);
assertEqual(chunks240.length, 6, 'chunkArray(240, 40) produces 6 blocks');

// flankerDisplayHTML
var html = flankerDisplayHTML('target.jpg', 'flanker.jpg', 250, 50);
assert(html.indexOf('flanker-display') !== -1, 'flankerDisplayHTML contains flanker-display class');
assert(html.indexOf('target.jpg') !== -1, 'flankerDisplayHTML contains target path');
assert((html.match(/flanker\.jpg/g) || []).length === 2, 'flankerDisplayHTML contains flanker path twice');

// singleFaceHTML
var shtml = singleFaceHTML('face.jpg', 250);
assert(shtml.indexOf('single-face-display') !== -1, 'singleFaceHTML contains single-face-display class');
assert(shtml.indexOf('face.jpg') !== -1, 'singleFaceHTML contains face path');

// ============================================================
// 3. Condition 1 — Item Recognition
// ============================================================

section('3. Condition 1 — Item Recognition');

CONDITION = 1;
var d1 = allocateTrials(1);

assertEqual(d1.studyTrials.length, N_STUDY_TRIALS, 'Study trials = ' + N_STUDY_TRIALS);
assertEqual(d1.testTrials.length,  N_STUDY_TRIALS * 2, 'Test trials = ' + (N_STUDY_TRIALS * 2));

var oldTrials = d1.testTrials.filter(function (t) { return t.stimulus_type === 'old'; });
var newTrials = d1.testTrials.filter(function (t) { return t.stimulus_type === 'new'; });
assertEqual(oldTrials.length, N_STUDY_TRIALS, 'Old test trials = ' + N_STUDY_TRIALS);
assertEqual(newTrials.length, N_STUDY_TRIALS, 'New test trials = ' + N_STUDY_TRIALS);

// Gender balance in novel faces
var novelF = newTrials.filter(function (t) { return t.target_gender === 'F'; }).length;
var novelM = newTrials.filter(function (t) { return t.target_gender === 'M'; }).length;
assertEqual(novelF, N_STUDY_TRIALS / 2, 'Novel female = ' + (N_STUDY_TRIALS / 2));
assertEqual(novelM, N_STUDY_TRIALS / 2, 'Novel male = ' + (N_STUDY_TRIALS / 2));

// Study trial type distribution (12 types, N_REPLICATIONS each)
var typeCount1 = {};
for (var i = 0; i < d1.studyTrials.length; i++) {
  var t = d1.studyTrials[i];
  var key = t.target_gender + '_' + t.flanker_gender + '_' + t.flanker_emotion;
  typeCount1[key] = (typeCount1[key] || 0) + 1;
}
var typeKeys1 = Object.keys(typeCount1);
assertEqual(typeKeys1.length, 12, 'Study has 12 trial types');
for (var i = 0; i < typeKeys1.length; i++) {
  assertEqual(typeCount1[typeKeys1[i]], N_REPLICATIONS, 'Type ' + typeKeys1[i] + ' has ' + N_REPLICATIONS + ' reps');
}

// Identity uniqueness (no model_id used in more than one role)
var usedIds = {};
var dupeCount = 0;
function trackId(id, role) {
  if (usedIds[id]) { dupeCount++; return; }
  usedIds[id] = role;
}
for (var i = 0; i < d1.studyTrials.length; i++) {
  trackId(d1.studyTrials[i].target_id, 'target');
  trackId(d1.studyTrials[i].flanker_id, 'flanker');
}
for (var i = 0; i < newTrials.length; i++) {
  trackId(newTrials[i].target_id, 'novel');
}
assertEqual(dupeCount, 0, 'No identity reuse across target/flanker/novel roles');
assertEqual(Object.keys(usedIds).length, N_STUDY_TRIALS * 3, 'Total unique faces = ' + (N_STUDY_TRIALS * 3));

// All flankers are B/W
var nonBWFlankers = d1.studyTrials.filter(function (t) {
  return ['B', 'W'].indexOf(t.flanker_race) === -1;
});
assertEqual(nonBWFlankers.length, 0, 'All flankers are B/W');

// Practice faces are disjoint from main experiment
for (var i = 0; i < d1.practiceStudyTrials.length; i++) {
  assert(!usedIds[d1.practiceStudyTrials[i].target_id], 'Practice target not in main pool');
  assert(!usedIds[d1.practiceStudyTrials[i].flanker_id], 'Practice flanker not in main pool');
}

assertEqual(d1.practiceStudyTrials.length, 4, 'Practice study = 4');
assertEqual(d1.practiceTestTrials.length, 4, 'Practice test = 4');

// ============================================================
// 4. Condition 2 — Associative Recognition
// ============================================================

section('4. Condition 2 — Associative Recognition');

CONDITION = 2;
var d2 = allocateTrials(2);

assertEqual(d2.studyTrials.length, N_STUDY_TRIALS, 'Study trials = ' + N_STUDY_TRIALS);
assertEqual(d2.testTrials.length,  N_STUDY_TRIALS, 'Test trials = ' + N_STUDY_TRIALS);

var intactTrials = d2.testTrials.filter(function (t) { return t.pair_type === 'intact'; });
var rearrangedTrials = d2.testTrials.filter(function (t) { return t.pair_type === 'rearranged'; });
assertEqual(intactTrials.length + rearrangedTrials.length, N_STUDY_TRIALS, 'Intact + Rearranged = ' + N_STUDY_TRIALS);
assertEqual(intactTrials.length, N_STUDY_TRIALS / 2, 'Exactly ' + (N_STUDY_TRIALS / 2) + ' intact trials');
assertEqual(rearrangedTrials.length, N_STUDY_TRIALS / 2, 'Exactly ' + (N_STUDY_TRIALS / 2) + ' rearranged trials');

// Balanced by emotion × pair_type
var emotionType = {};
for (var i = 0; i < d2.testTrials.length; i++) {
  var t = d2.testTrials[i];
  var key = t.flanker_emotion + '_' + t.pair_type;
  emotionType[key] = (emotionType[key] || 0) + 1;
}
// With N_REPLICATIONS reps, each emotion has 4 trial types × N_REPLICATIONS trials total
// Split ~half intact ~half rearranged, totals per emotion should sum correctly
var perEmotion = N_REPLICATIONS * 4; // 4 trial types per emotion (2 targ gender × 2 flank gender)
var perEmotionHalf = perEmotion / 2;
for (var emo of ['angry', 'happy', 'neutral']) {
  var intactN = emotionType[emo + '_intact'] || 0;
  var rearrangedN = emotionType[emo + '_rearranged'] || 0;
  assertEqual(intactN + rearrangedN, perEmotion, emo + ' total = ' + perEmotion);
  assertEqual(intactN, perEmotionHalf, emo + ' intact = ' + perEmotionHalf);
  assertEqual(rearrangedN, perEmotionHalf, emo + ' rearranged = ' + perEmotionHalf);
}

// Derangement: no rearranged trial has its original flanker
var studyPairings = {};
for (var i = 0; i < d2.studyTrials.length; i++) {
  studyPairings[d2.studyTrials[i].target_id] = d2.studyTrials[i].flanker_id;
}
var fixedPoints = 0;
for (var i = 0; i < rearrangedTrials.length; i++) {
  if (rearrangedTrials[i].flanker_id === studyPairings[rearrangedTrials[i].target_id]) {
    fixedPoints++;
  }
}
assertEqual(fixedPoints, 0, 'No derangement fixed points');

// Factor preservation: rearranged trials keep target_gender, flanker_gender, flanker_emotion
var factorViolations = 0;
for (var i = 0; i < rearrangedTrials.length; i++) {
  var rt = rearrangedTrials[i];
  var orig = d2.studyTrials.filter(function (s) { return s.target_id === rt.target_id; })[0];
  if (rt.target_gender  !== orig.target_gender)  factorViolations++;
  if (rt.flanker_gender !== orig.flanker_gender) factorViolations++;
  if (rt.flanker_emotion !== orig.flanker_emotion) factorViolations++;
}
assertEqual(factorViolations, 0, 'Rearranged trials preserve all 3 factors');

// Intact trials have same pairing as study
var intactMismatches = 0;
for (var i = 0; i < intactTrials.length; i++) {
  if (intactTrials[i].flanker_id !== studyPairings[intactTrials[i].target_id]) {
    intactMismatches++;
  }
}
assertEqual(intactMismatches, 0, 'All intact trials match original study pairing');

assertEqual(d2.practiceStudyTrials.length, 4, 'Practice study = 4');
assertEqual(d2.practiceTestTrials.length, 4, 'Practice test = 4');

// ============================================================
// 5. Condition 3 — Valence Rating
// ============================================================

section('5. Condition 3 — Valence Rating');

CONDITION = 3;
var d3 = allocateTrials(3);

assertEqual(d3.studyTrials.length, N_STUDY_TRIALS, 'Study trials = ' + N_STUDY_TRIALS);
assertEqual(d3.testTrials.length,  N_STUDY_TRIALS, 'Test trials = ' + N_STUDY_TRIALS);

// All test trials should have study_flanker_emotion and study_flanker_gender
var missingEmo = d3.testTrials.filter(function (t) { return !t.study_flanker_emotion; }).length;
var missingGender = d3.testTrials.filter(function (t) { return !t.study_flanker_gender; }).length;
assertEqual(missingEmo, 0, 'All test trials have study_flanker_emotion');
assertEqual(missingGender, 0, 'All test trials have study_flanker_gender');

// correct_response should be null for valence
var hasCorrect = d3.testTrials.filter(function (t) { return t.correct_response !== null; }).length;
assertEqual(hasCorrect, 0, 'No correct_response for valence trials');

assertEqual(d3.practiceStudyTrials.length, 4, 'Practice study = 4');
assertEqual(d3.practiceTestTrials.length, 0, 'Practice test = 0 (no valence practice)');

// ============================================================
// 6. Data field completeness (decision 27)
// ============================================================

section('6. Data field completeness (decision 27)');

// Common fields that should be present on every study trial data object
var commonStudyFields = [
  'target_id', 'target_gender', 'target_race', 'target_filename',
  'flanker_id', 'flanker_gender', 'flanker_race', 'flanker_emotion', 'flanker_filename'
];
for (var f = 0; f < commonStudyFields.length; f++) {
  var field = commonStudyFields[f];
  var missing = d1.studyTrials.filter(function (t) { return t[field] === undefined; }).length;
  assertEqual(missing, 0, 'Study trials have field: ' + field);
}

// Item recognition test fields
var itemRecogFields = ['target_id', 'target_gender', 'target_race', 'target_filename',
  'stimulus_type', 'correct_response'];
for (var f = 0; f < itemRecogFields.length; f++) {
  var field = itemRecogFields[f];
  var missing = d1.testTrials.filter(function (t) { return t[field] === undefined; }).length;
  assertEqual(missing, 0, 'Item recog test trials have field: ' + field);
}
// study_flanker_emotion present for old items
var oldMissingEmo = oldTrials.filter(function (t) { return !t.study_flanker_emotion; }).length;
assertEqual(oldMissingEmo, 0, 'Old items have study_flanker_emotion');
// study_flanker_gender present for old items
var oldMissingGender = oldTrials.filter(function (t) { return !t.study_flanker_gender; }).length;
assertEqual(oldMissingGender, 0, 'Old items have study_flanker_gender');

// Associative recognition test fields
var assocFields = ['target_id', 'target_gender', 'target_race', 'target_filename',
  'flanker_id', 'flanker_gender', 'flanker_race', 'flanker_emotion', 'flanker_filename',
  'pair_type', 'correct_response'];
for (var f = 0; f < assocFields.length; f++) {
  var field = assocFields[f];
  var missing = d2.testTrials.filter(function (t) { return t[field] === undefined; }).length;
  assertEqual(missing, 0, 'Assoc recog test trials have field: ' + field);
}

// Valence test fields
var valenceFields = ['target_id', 'target_gender', 'target_race', 'target_filename',
  'study_flanker_emotion', 'study_flanker_gender'];
for (var f = 0; f < valenceFields.length; f++) {
  var field = valenceFields[f];
  var missing = d3.testTrials.filter(function (t) { return t[field] === undefined; }).length;
  assertEqual(missing, 0, 'Valence test trials have field: ' + field);
}

// ============================================================
// 7. Preload paths
// ============================================================

section('7. Preload paths');

// Condition 1 needs the most images (study + old targets + novel targets)
assert(d1.preloadPaths.length > 0, 'Condition 1 has preload paths');
// All paths should be valid (local files or remote URLs)
var preloadIsRemote = d1.preloadPaths[0].startsWith('http');
if (preloadIsRemote) {
  var badUrls = d1.preloadPaths.filter(function (p) { return !p.endsWith('.jpg'); }).length;
  assertEqual(badUrls, 0, 'All preload paths are valid image URLs (cond 1)');
} else {
  var missingFiles = 0;
  for (var i = 0; i < d1.preloadPaths.length; i++) {
    if (!fs.existsSync(path.join(root, d1.preloadPaths[i]))) {
      missingFiles++;
      if (missingFiles <= 3) console.log('  Missing: ' + d1.preloadPaths[i]);
    }
  }
  assertEqual(missingFiles, 0, 'All preload paths resolve to files on disk (cond 1)');
}

// Condition 2 preload should include flanker images for test phase
assert(d2.preloadPaths.length > 0, 'Condition 2 has preload paths');
if (preloadIsRemote) {
  var badUrls2 = d2.preloadPaths.filter(function (p) { return !p.endsWith('.jpg'); }).length;
  assertEqual(badUrls2, 0, 'All preload paths are valid image URLs (cond 2)');
} else {
  var missingFiles2 = d2.preloadPaths.filter(function (p) {
    return !fs.existsSync(path.join(root, p));
  }).length;
  assertEqual(missingFiles2, 0, 'All preload paths resolve to files on disk (cond 2)');
}

// ============================================================
// Summary
// ============================================================

console.log('\n' + '='.repeat(40));
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  console.log('\nFailures:');
  for (var i = 0; i < errors.length; i++) {
    console.log('  - ' + errors[i]);
  }
  process.exit(1);
} else {
  console.log('All tests passed.');
}
