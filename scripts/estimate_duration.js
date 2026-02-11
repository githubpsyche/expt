#!/usr/bin/env node
/**
 * Estimate experiment duration for each condition based on config.js.
 * Usage:  node scripts/estimate_duration.js
 */

var fs = require('fs');
var path = require('path');

// Load config (same mock pattern as run_tests.js)
var jsPsych = {
  randomization: { shuffle: function (a) { return a.slice(); } },
  data: {
    getURLVariable: function () { return null; },
    addProperties: function () {}
  }
};
var jatos;

var root = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(root, 'experiment/stimuli.js'), 'utf8').replace('const STIMULI', 'var STIMULI'));
eval(fs.readFileSync(path.join(root, 'experiment/helpers.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'experiment/config.js'), 'utf8'));

// ============================================================
// Timing model
// ============================================================

// Study: fixation + fixed display (response does NOT end trial)
var STUDY_TRIAL_MS = FIXATION_DURATION + RESPONSE_TIMEOUT;

// Test: fixation + response window
// Worst case: participant waits full timeout every trial
// Typical: ~1000ms RT on average
var TEST_TRIAL_MAX_MS = FIXATION_DURATION + RESPONSE_TIMEOUT;
var TYPICAL_RT_MS = 1000;
var TEST_TRIAL_TYPICAL_MS = FIXATION_DURATION + TYPICAL_RT_MS;

// Overhead estimates (instruction screens, rest breaks, practice notices)
var INSTRUCTION_SCREEN_MS = 15000;  // ~15s to read instructions and click Begin
var REST_BREAK_MS = 8000;           // ~8s average rest break
var PRACTICE_NOTICE_MS = 5000;      // practice start + end notices

// Trial counts
var N_STUDY = N_STUDY_TRIALS;       // 120
var N_TEST = { 1: 240, 2: 120, 3: 120 };

// Block counts (rest breaks = blocks - 1)
var studyBlocks = N_STUDY / STUDY_BLOCK_SIZE;
var testBlocks = {
  1: N_TEST[1] / TEST_BLOCK_SIZE_ITEM_RECOG,
  2: N_TEST[2] / TEST_BLOCK_SIZE_ASSOC_RECOG,
  3: N_TEST[3] / TEST_BLOCK_SIZE_VALENCE
};

// Practice trial counts
var nPracticeStudy = PRACTICE_ENABLED ? N_PRACTICE_STUDY : 0;
var nPracticeTest  = { 1: 0, 2: 0, 3: 0 };
if (PRACTICE_ENABLED) {
  nPracticeTest[1] = N_PRACTICE_TEST;
  nPracticeTest[2] = N_PRACTICE_TEST;
  nPracticeTest[3] = 0;  // no practice for valence
}

function formatTime(ms) {
  var totalSec = Math.round(ms / 1000);
  var min = Math.floor(totalSec / 60);
  var sec = totalSec % 60;
  return min + ':' + (sec < 10 ? '0' : '') + sec;
}

// ============================================================
// Compute per condition
// ============================================================

console.log('Experiment duration estimates');
console.log('============================');
console.log('');
console.log('Config: FIXATION_DURATION=' + FIXATION_DURATION + 'ms, RESPONSE_TIMEOUT=' + RESPONSE_TIMEOUT + 'ms');
console.log('        PRACTICE_ENABLED=' + PRACTICE_ENABLED + ', typical RT assumption=' + TYPICAL_RT_MS + 'ms');
console.log('');

var condNames = { 1: 'Item Recognition', 2: 'Associative Recognition', 3: 'Valence Rating' };

for (var c = 1; c <= 3; c++) {
  // Study phase (same for all)
  var studyTrialTime = N_STUDY * STUDY_TRIAL_MS;
  var studyRestBreaks = (studyBlocks - 1) * REST_BREAK_MS;
  var studyPractice = nPracticeStudy * STUDY_TRIAL_MS;
  var studyPracticeOverhead = (nPracticeStudy > 0) ? (2 * PRACTICE_NOTICE_MS) : 0;
  var studyTotal = INSTRUCTION_SCREEN_MS + studyPracticeOverhead + studyPractice +
                   studyTrialTime + studyRestBreaks;

  // Test phase
  var testTrialTimeMax = N_TEST[c] * TEST_TRIAL_MAX_MS;
  var testTrialTimeTypical = N_TEST[c] * TEST_TRIAL_TYPICAL_MS;
  var testRestBreaks = (testBlocks[c] - 1) * REST_BREAK_MS;
  var testPractice = nPracticeTest[c] * TEST_TRIAL_MAX_MS;
  var testPracticeOverhead = (nPracticeTest[c] > 0) ? (2 * PRACTICE_NOTICE_MS) : 0;
  var debrief = 10000;

  var testTotalMax = INSTRUCTION_SCREEN_MS + testPracticeOverhead + testPractice +
                     testTrialTimeMax + testRestBreaks + debrief;
  var testTotalTypical = INSTRUCTION_SCREEN_MS + testPracticeOverhead + testPractice +
                         testTrialTimeTypical + testRestBreaks + debrief;

  var totalMax = studyTotal + testTotalMax;
  var totalTypical = studyTotal + testTotalTypical;

  console.log('Condition ' + c + ': ' + condNames[c]);
  console.log('  Study:  ' + N_STUDY + ' trials in ' + studyBlocks + ' blocks  →  ' + formatTime(studyTotal));
  console.log('  Test:   ' + N_TEST[c] + ' trials in ' + testBlocks[c] + ' blocks  →  ' +
    formatTime(testTotalTypical) + ' typical, ' + formatTime(testTotalMax) + ' max');
  console.log('  Total:  ' + formatTime(totalTypical) + ' typical, ' + formatTime(totalMax) + ' max');
  console.log('');
}
