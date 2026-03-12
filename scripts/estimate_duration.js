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

// Overhead estimates (instruction screens, rest breaks, practice notices, key quiz)
var INSTRUCTION_SCREEN_MS = 15000;  // ~15s to read instructions and click Begin
var REST_BREAK_MS = 8000;           // ~8s average rest break
var PRACTICE_NOTICE_MS = 5000;      // practice start + end notices
var KEY_QUIZ_MS = 10000;            // ~10s per phase for key mapping quiz (2 items, feedback loop)

// Trial counts (derived from config)
// Condition 2 presents study trials twice (two shuffled passes) for stronger encoding
var STUDY_PASSES = { 1: 1, 2: 2, 3: 1 };
var N_STUDY = { 1: N_STUDY_TRIALS, 2: N_STUDY_TRIALS * 2, 3: N_STUDY_TRIALS };
var N_TEST = { 1: N_STUDY_TRIALS * 2, 2: N_STUDY_TRIALS, 3: N_STUDY_TRIALS };

// Block counts (rest breaks = blocks - 1 per pass; condition 2 has a notice between passes)
var studyBlocks = { 1: N_STUDY[1] / STUDY_BLOCK_SIZE,
                    2: N_STUDY[2] / STUDY_BLOCK_SIZE,
                    3: N_STUDY[3] / STUDY_BLOCK_SIZE };
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
  // Study phase (condition 2 has two passes with a notice between them)
  var studyTrialTime = N_STUDY[c] * STUDY_TRIAL_MS;
  var studyRestBreaks = (studyBlocks[c] - STUDY_PASSES[c]) * REST_BREAK_MS;
  var studyPassNotices = (STUDY_PASSES[c] - 1) * PRACTICE_NOTICE_MS;
  var studyPractice = nPracticeStudy * STUDY_TRIAL_MS;
  var studyPracticeOverhead = (nPracticeStudy > 0) ? (2 * PRACTICE_NOTICE_MS) : 0;
  var studyTotal = INSTRUCTION_SCREEN_MS + KEY_QUIZ_MS + studyPracticeOverhead + studyPractice +
                   studyTrialTime + studyRestBreaks + studyPassNotices;

  // Test phase
  var testTrialTimeMax = N_TEST[c] * TEST_TRIAL_MAX_MS;
  var testTrialTimeTypical = N_TEST[c] * TEST_TRIAL_TYPICAL_MS;
  var testRestBreaks = (testBlocks[c] - 1) * REST_BREAK_MS;
  var testPractice = nPracticeTest[c] * TEST_TRIAL_MAX_MS;
  var testPracticeOverhead = (nPracticeTest[c] > 0) ? (2 * PRACTICE_NOTICE_MS) : 0;
  var debrief = 10000;

  var testQuiz = (c !== 3) ? KEY_QUIZ_MS : 0;  // condition 3 (valence) skips key quiz
  var testTotalMax = INSTRUCTION_SCREEN_MS + testQuiz + testPracticeOverhead + testPractice +
                     testTrialTimeMax + testRestBreaks + debrief;
  var testTotalTypical = INSTRUCTION_SCREEN_MS + testQuiz + testPracticeOverhead + testPractice +
                         testTrialTimeTypical + testRestBreaks + debrief;

  var totalMax = studyTotal + testTotalMax;
  var totalTypical = studyTotal + testTotalTypical;

  console.log('Condition ' + c + ': ' + condNames[c]);
  console.log('  Study:  ' + N_STUDY[c] + ' trials in ' + studyBlocks[c] + ' blocks' +
    (STUDY_PASSES[c] > 1 ? ' (' + STUDY_PASSES[c] + ' passes)' : '') +
    '  →  ' + formatTime(studyTotal));
  console.log('  Test:   ' + N_TEST[c] + ' trials in ' + testBlocks[c] + ' blocks  →  ' +
    formatTime(testTotalTypical) + ' typical, ' + formatTime(testTotalMax) + ' max');
  console.log('  Total:  ' + formatTime(totalTypical) + ' typical, ' + formatTime(totalMax) + ' max');
  console.log('');
}
