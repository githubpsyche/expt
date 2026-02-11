// ============================================================
// Trial generation for the face-flanker memory experiment.
// Reads STIMULI (from stimuli.js) and config parameters.
// ============================================================

/**
 * Master allocation function. Called once at experiment start.
 * Allocates faces to roles and builds trial arrays for study + test phases.
 *
 * @param {number} condition - 1 (item recog), 2 (assoc recog), 3 (valence)
 * @returns {{ studyTrials, testTrials, practiceStudyTrials, practiceTestTrials, preloadPaths }}
 */
function allocateTrials(condition) {
  var used = {};  // model_id -> true; enforces no identity reuse

  // --- Partition stimulus pools (driven by config constants) ---
  var genders = ['F', 'M'];
  var pools = { target_F: filterPool('F', null, 'N'), target_M: filterPool('M', null, 'N') };
  for (var gi = 0; gi < genders.length; gi++) {
    for (var ei = 0; ei < FLANKER_EMOTIONS.length; ei++) {
      var emo = FLANKER_EMOTIONS[ei];
      var expr = EMOTION_EXPR_MAP[emo];
      pools['flanker_' + genders[gi] + '_' + emo] = filterPool(genders[gi], FLANKER_RACES, expr);
    }
  }

  // --- Draw faces in order of constraint tightness ---
  var nPerPool = N_REPLICATIONS * 2;  // 10 reps * 2 trial types per (gender x emotion) = 20
  var flankers = { F: {}, M: {} };
  for (var gi = 0; gi < genders.length; gi++) {
    for (var ei = 0; ei < FLANKER_EMOTIONS.length; ei++) {
      var emo = FLANKER_EMOTIONS[ei];
      var expr = EMOTION_EXPR_MAP[emo];
      flankers[genders[gi]][emo] = drawN(
        pools['flanker_' + genders[gi] + '_' + emo], nPerPool, expr, used
      );
    }
  }

  var targets = {
    F: drawN(pools.target_F, 60, 'N', used),
    M: drawN(pools.target_M, 60, 'N', used)
  };

  var novels = { F: [], M: [] };
  if (condition === 1) {
    novels.F = drawN(pools.target_F, 60, 'N', used);
    novels.M = drawN(pools.target_M, 60, 'N', used);
  }

  // --- Practice faces ---
  var practiceTargets = { F: [], M: [] };
  var practiceFlankers = { F: [], M: [] };
  if (PRACTICE_ENABLED) {
    practiceTargets.F  = drawN(pools.target_F,          2, 'N', used);
    practiceTargets.M  = drawN(pools.target_M,          2, 'N', used);
    practiceFlankers.F = drawN(pools.flanker_F_neutral,  2, 'N', used);
    practiceFlankers.M = drawN(pools.flanker_M_neutral,  2, 'N', used);
  }

  // --- Build study trials ---
  var studyTrials = buildStudyTrials(flankers, targets);

  // --- Build test trials ---
  var testTrials;
  if (condition === 1) {
    testTrials = buildItemRecogTrials(studyTrials, novels);
  } else if (condition === 2) {
    testTrials = buildAssocRecogTrials(studyTrials);
  } else {
    testTrials = buildValenceTrials(studyTrials);
  }

  // --- Build practice trials ---
  var practiceStudyTrials = [];
  var practiceTestTrials = [];
  if (PRACTICE_ENABLED) {
    practiceStudyTrials = buildPracticeStudyTrials(practiceTargets, practiceFlankers);
    practiceTestTrials = buildPracticeTestTrials(practiceTargets, condition);
  }

  // --- Collect preload paths ---
  var preloadPaths = collectPreloadPaths(studyTrials, testTrials, practiceStudyTrials, practiceTestTrials);

  return {
    studyTrials: studyTrials,
    testTrials: testTrials,
    practiceStudyTrials: practiceStudyTrials,
    practiceTestTrials: practiceTestTrials,
    preloadPaths: preloadPaths
  };
}

// ============================================================
// Pool filtering
// ============================================================

/**
 * Filter STIMULI to models matching gender, race list, and having a given expression.
 * @param {string} gender - 'F' or 'M'
 * @param {string[]|null} races - array of race codes, or null for any race
 * @param {string} expr - expression key ('N', 'A', 'HC')
 * @returns {object[]} filtered models
 */
function filterPool(gender, races, expr) {
  var result = [];
  for (var i = 0; i < STIMULI.length; i++) {
    var s = STIMULI[i];
    if (s.gender !== gender) continue;
    if (races !== null && races.indexOf(s.race) === -1) continue;
    if (!s.expressions[expr]) continue;
    result.push(s);
  }
  return result;
}

/**
 * Draw n models from a pool, skipping already-used IDs. Shuffles pool first.
 * @param {object[]} pool - array of model objects
 * @param {number} n - how many to draw
 * @param {string} expr - expression key to use for filename
 * @param {object} used - map of model_id -> true
 * @returns {object[]} array of { model_id, race, gender, filename }
 */
function drawN(pool, n, expr, used) {
  var shuffled = jsPsych.randomization.shuffle(pool.slice());
  var result = [];
  for (var i = 0; i < shuffled.length; i++) {
    if (used[shuffled[i].model_id]) continue;
    result.push({
      model_id: shuffled[i].model_id,
      race:     shuffled[i].race,
      gender:   shuffled[i].gender,
      filename: shuffled[i].expressions[expr]
    });
    used[shuffled[i].model_id] = true;
    if (result.length === n) break;
  }
  if (result.length < n) {
    throw new Error(
      'Not enough faces: needed ' + n + ' ' + expr + ' from pool of ' +
      pool.length + ', got ' + result.length + ' (after excluding used)'
    );
  }
  return result;
}

// ============================================================
// Study trial construction
// ============================================================

function buildStudyTrials(flankers, targets) {
  var genders = ['F', 'M'];
  var emotions = FLANKER_EMOTIONS;

  // Track consumption index per pool
  var flankerIdx = { F: { angry: 0, happy: 0, neutral: 0 }, M: { angry: 0, happy: 0, neutral: 0 } };
  var targetIdx = { F: 0, M: 0 };

  var trials = [];

  for (var ti = 0; ti < genders.length; ti++) {
    var tGender = genders[ti];
    for (var fi = 0; fi < genders.length; fi++) {
      var fGender = genders[fi];
      for (var ei = 0; ei < emotions.length; ei++) {
        var fEmotion = emotions[ei];

        for (var rep = 0; rep < N_REPLICATIONS; rep++) {
          var target  = targets[tGender][targetIdx[tGender]++];
          var flanker = flankers[fGender][fEmotion][flankerIdx[fGender][fEmotion]++];

          trials.push({
            target_id:        target.model_id,
            target_gender:    tGender,
            target_race:      target.race,
            target_filename:  target.filename,
            flanker_id:       flanker.model_id,
            flanker_gender:   fGender,
            flanker_race:     flanker.race,
            flanker_emotion:  fEmotion,
            flanker_filename: flanker.filename
          });
        }
      }
    }
  }

  return trials;  // length = 120
}

// ============================================================
// Test trial construction
// ============================================================

function buildItemRecogTrials(studyTrials, novels) {
  var trials = [];

  // Old items: all 120 study targets
  for (var i = 0; i < studyTrials.length; i++) {
    var st = studyTrials[i];
    trials.push({
      target_id:             st.target_id,
      target_gender:         st.target_gender,
      target_race:           st.target_race,
      target_filename:       st.target_filename,
      stimulus_type:         'old',
      study_flanker_emotion: st.flanker_emotion,
      study_flanker_gender:  st.flanker_gender,
      correct_response:      ITEM_RECOG_KEYS.old
    });
  }

  // New items: 120 novel faces
  var allNovels = novels.F.concat(novels.M);
  for (var i = 0; i < allNovels.length; i++) {
    var novel = allNovels[i];
    trials.push({
      target_id:             novel.model_id,
      target_gender:         novel.gender,
      target_race:           novel.race,
      target_filename:       novel.filename,
      stimulus_type:         'new',
      study_flanker_emotion: null,
      study_flanker_gender:  null,
      correct_response:      ITEM_RECOG_KEYS.new
    });
  }

  return trials;  // length = 240
}

function buildAssocRecogTrials(studyTrials) {
  // Group study trials by trial type
  var byType = {};
  for (var i = 0; i < studyTrials.length; i++) {
    var st = studyTrials[i];
    var key = st.target_gender + '_' + st.flanker_gender + '_' + st.flanker_emotion;
    if (!byType[key]) byType[key] = [];
    byType[key].push(st);
  }

  var trials = [];

  var keys = Object.keys(byType);
  for (var k = 0; k < keys.length; k++) {
    var group = jsPsych.randomization.shuffle(byType[keys[k]].slice());
    // First 5 intact, last 5 rearranged
    var intactGroup     = group.slice(0, 5);
    var rearrangedGroup = group.slice(5, 10);

    // Intact trials
    for (var i = 0; i < intactGroup.length; i++) {
      var st = intactGroup[i];
      trials.push({
        target_id:        st.target_id,
        target_gender:    st.target_gender,
        target_race:      st.target_race,
        target_filename:  st.target_filename,
        flanker_id:       st.flanker_id,
        flanker_gender:   st.flanker_gender,
        flanker_race:     st.flanker_race,
        flanker_emotion:  st.flanker_emotion,
        flanker_filename: st.flanker_filename,
        trial_type:       'intact',
        correct_response: ASSOC_RECOG_KEYS.same
      });
    }

    // Rearranged trials: derange flankers among 5 targets
    var derangedIdx = derangement(5);
    for (var i = 0; i < 5; i++) {
      var st    = rearrangedGroup[i];
      var donor = rearrangedGroup[derangedIdx[i]];
      trials.push({
        target_id:        st.target_id,
        target_gender:    st.target_gender,
        target_race:      st.target_race,
        target_filename:  st.target_filename,
        flanker_id:       donor.flanker_id,
        flanker_gender:   donor.flanker_gender,
        flanker_race:     donor.flanker_race,
        flanker_emotion:  donor.flanker_emotion,
        flanker_filename: donor.flanker_filename,
        trial_type:       'rearranged',
        correct_response: ASSOC_RECOG_KEYS.different
      });
    }
  }

  return trials;  // length = 120 (60 intact + 60 rearranged)
}

function buildValenceTrials(studyTrials) {
  var trials = [];
  for (var i = 0; i < studyTrials.length; i++) {
    var st = studyTrials[i];
    trials.push({
      target_id:             st.target_id,
      target_gender:         st.target_gender,
      target_race:           st.target_race,
      target_filename:       st.target_filename,
      study_flanker_emotion: st.flanker_emotion,
      study_flanker_gender:  st.flanker_gender,
      correct_response:      null
    });
  }
  return trials;  // length = 120
}

// ============================================================
// Practice trials
// ============================================================

function buildPracticeStudyTrials(practiceTargets, practiceFlankers) {
  // 4 practice study trials: pair each target with a neutral flanker
  var trials = [];
  var tAll = practiceTargets.F.concat(practiceTargets.M);
  var fAll = practiceFlankers.F.concat(practiceFlankers.M);

  for (var i = 0; i < tAll.length; i++) {
    trials.push({
      target_id:        tAll[i].model_id,
      target_gender:    tAll[i].gender,
      target_race:      tAll[i].race,
      target_filename:  tAll[i].filename,
      flanker_id:       fAll[i].model_id,
      flanker_gender:   fAll[i].gender,
      flanker_race:     fAll[i].race,
      flanker_emotion:  'neutral',
      flanker_filename: fAll[i].filename
    });
  }
  return trials;
}

function buildPracticeTestTrials(practiceTargets, condition) {
  var tAll = practiceTargets.F.concat(practiceTargets.M);
  var trials = [];

  if (condition === 1) {
    // Show 2 old + 2 "new" (use remaining 2 as pseudo-new)
    for (var i = 0; i < 2; i++) {
      trials.push({
        target_id:             tAll[i].model_id,
        target_gender:         tAll[i].gender,
        target_race:           tAll[i].race,
        target_filename:       tAll[i].filename,
        stimulus_type:         'old',
        study_flanker_emotion: 'neutral',
        study_flanker_gender:  null,
        correct_response:      ITEM_RECOG_KEYS.old
      });
    }
    for (var i = 2; i < 4; i++) {
      trials.push({
        target_id:             tAll[i].model_id,
        target_gender:         tAll[i].gender,
        target_race:           tAll[i].race,
        target_filename:       tAll[i].filename,
        stimulus_type:         'new',
        study_flanker_emotion: null,
        study_flanker_gender:  null,
        correct_response:      ITEM_RECOG_KEYS.new
      });
    }
  } else if (condition === 2) {
    // 4 practice assoc trials (all "intact" for simplicity)
    for (var i = 0; i < tAll.length; i++) {
      trials.push({
        target_id:        tAll[i].model_id,
        target_gender:    tAll[i].gender,
        target_race:      tAll[i].race,
        target_filename:  tAll[i].filename,
        flanker_id:       null,
        flanker_gender:   null,
        flanker_race:     null,
        flanker_emotion:  'neutral',
        flanker_filename: null,
        trial_type:       'intact',
        correct_response: ASSOC_RECOG_KEYS.same
      });
    }
  }
  // Condition 3: no practice for valence (return empty array)
  return trials;
}

// ============================================================
// Preload path collection
// ============================================================

function collectPreloadPaths(studyTrials, testTrials, practiceStudy, practiceTest) {
  var pathSet = {};

  function addPaths(trials) {
    for (var i = 0; i < trials.length; i++) {
      var t = trials[i];
      if (t.target_filename)  pathSet[t.target_filename]  = true;
      if (t.flanker_filename) pathSet[t.flanker_filename] = true;
    }
  }

  addPaths(studyTrials);
  addPaths(testTrials);
  addPaths(practiceStudy);
  addPaths(practiceTest);

  return Object.keys(pathSet);
}
