#!/usr/bin/env node
/**
 * Generate simulated experiment data for analysis pipeline testing.
 * Produces one JSONL file per condition x key_mapping combination (6 files).
 *
 * Usage:  node scripts/generate_simulated_data.js
 * Output: data/simulated/condition_{c}_km_{k}.jsonl
 */

var fs = require('fs');
var path = require('path');

// ============================================================
// Load experiment modules (same pattern as run_tests.js)
// ============================================================

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

var jatos; // intentionally undefined

var root = path.resolve(__dirname, '..');
eval(fs.readFileSync(path.join(root, 'experiment/stimuli.js'), 'utf8').replace('const STIMULI', 'var STIMULI'));
eval(fs.readFileSync(path.join(root, 'experiment/helpers.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'experiment/config.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'experiment/trials.js'), 'utf8'));

// ============================================================
// Simulation helpers
// ============================================================

function randomRT() {
  // Ex-Gaussian-ish: uniform 300-2500ms
  return Math.round(300 + Math.random() * 2200);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Add simulated response data to a trial object.
 */
function simulateResponse(trial, phase, condition, keyMapping, blockNum) {
  trial.phase = phase;
  trial.block = blockNum;

  // ~5% timeout rate
  var timedOut = Math.random() < 0.05;

  if (timedOut) {
    trial.response = null;
    trial.rt = null;
    trial.timed_out = true;
  } else {
    trial.rt = randomRT();
    trial.timed_out = false;

    if (phase === 'study') {
      // Gender judgment: choose between the two study keys
      var studyKeys = (keyMapping === 1)
        ? { female: 'z', male: 'm' }
        : { female: 'm', male: 'z' };
      trial.response = randomChoice([studyKeys.female, studyKeys.male]);
      trial.correct_response = (trial.target_gender === 'F')
        ? studyKeys.female : studyKeys.male;
    } else if (condition === 1) {
      var itemKeys = (keyMapping === 1)
        ? { old: 'z', new: 'm' }
        : { old: 'm', new: 'z' };
      trial.response = randomChoice([itemKeys.old, itemKeys.new]);
      // correct_response already set by allocateTrials
    } else if (condition === 2) {
      var assocKeys = (keyMapping === 1)
        ? { same: 'z', different: 'm' }
        : { same: 'm', different: 'z' };
      trial.response = randomChoice([assocKeys.same, assocKeys.different]);
      // correct_response already set by allocateTrials
    } else {
      // Valence: random 1-9
      trial.response = String(Math.floor(Math.random() * 9) + 1);
      trial.rating = parseInt(trial.response);
    }
  }

  // Compute correctness
  if (phase === 'study' || (condition !== 3 && phase === 'test')) {
    trial.correct = (trial.response === trial.correct_response);
  } else if (condition === 3 && phase === 'test') {
    trial.correct = null;
    if (!trial.timed_out) {
      trial.rating = parseInt(trial.response);
    } else {
      trial.rating = null;
    }
  }

  // Global properties
  trial.condition = condition;
  trial.key_mapping = keyMapping;
  trial.test_mode = false;
  trial.subject_id = 'SIM_C' + condition + '_KM' + keyMapping;
  trial.study_id = 'SIMULATED';
  trial.session_id = 'SIM_SESSION';
}

// ============================================================
// Generate data for all condition x key_mapping combinations
// ============================================================

var outDir = path.join(root, 'data', 'simulated');
fs.mkdirSync(outDir, { recursive: true });

var conditions = [1, 2, 3];
var keyMappings = [1, 2];

for (var ci = 0; ci < conditions.length; ci++) {
  for (var ki = 0; ki < keyMappings.length; ki++) {
    var cond = conditions[ci];
    var km = keyMappings[ki];

    // Set globals before allocating (config.js reads these)
    CONDITION = cond;
    KEY_MAPPING = km;

    // Recompute derived key objects
    STUDY_KEYS = (km === 1)
      ? { female: 'z', male: 'm' }
      : { female: 'm', male: 'z' };
    ITEM_RECOG_KEYS = (km === 1)
      ? { old: 'z', new: 'm' }
      : { old: 'm', new: 'z' };
    ASSOC_RECOG_KEYS = (km === 1)
      ? { same: 'z', different: 'm' }
      : { same: 'm', different: 'z' };

    var trialData = allocateTrials(cond);

    // Determine test block size
    var testBlockSize;
    if (cond === 1) testBlockSize = TEST_BLOCK_SIZE_ITEM_RECOG;
    else if (cond === 2) testBlockSize = TEST_BLOCK_SIZE_ASSOC_RECOG;
    else testBlockSize = TEST_BLOCK_SIZE_VALENCE;

    var rows = [];

    // Study trials — assign blocks
    var studyBlocks = chunkArray(trialData.studyTrials, STUDY_BLOCK_SIZE);
    for (var b = 0; b < studyBlocks.length; b++) {
      for (var t = 0; t < studyBlocks[b].length; t++) {
        var trial = Object.assign({}, studyBlocks[b][t]);
        simulateResponse(trial, 'study', cond, km, b);
        rows.push(trial);
      }
    }

    // Test trials — assign blocks
    var testBlocks = chunkArray(trialData.testTrials, testBlockSize);
    for (var b = 0; b < testBlocks.length; b++) {
      for (var t = 0; t < testBlocks[b].length; t++) {
        var trial = Object.assign({}, testBlocks[b][t]);
        simulateResponse(trial, 'test', cond, km, b);
        rows.push(trial);
      }
    }

    // Write JSONL
    var filename = 'condition_' + cond + '_km_' + km + '.jsonl';
    var filepath = path.join(outDir, filename);
    var lines = rows.map(function (r) { return JSON.stringify(r); });
    fs.writeFileSync(filepath, lines.join('\n') + '\n');

    console.log('Wrote ' + filepath + ' (' + rows.length + ' trials)');
  }
}

console.log('\nDone. Generated ' + (conditions.length * keyMappings.length) + ' files.');
