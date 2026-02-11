// ============================================================
// Timeline construction for the face-flanker memory experiment.
// Assembles instructions, practice, study, test, and debrief.
// ============================================================

/**
 * Build the full experiment timeline.
 * @param {object} jsPsych - the jsPsych instance
 * @param {object} trialData - output of allocateTrials()
 * @param {number} condition - 1, 2, or 3
 * @returns {object[]} timeline array for jsPsych.run()
 */
function buildTimeline(jsPsych, trialData, condition) {
  var timeline = [];

  // 1. Preload all images
  timeline.push({
    type: jsPsychPreload,
    images: trialData.preloadPaths,
    show_progress_bar: true,
    message: '<p>Loading experiment images. This may take a moment...</p>'
  });

  // 2. Study instructions
  timeline.push(makeStudyInstructions());

  // 3. Study practice (if enabled)
  if (PRACTICE_ENABLED && trialData.practiceStudyTrials.length > 0) {
    timeline.push(makePracticeNotice('study'));
    var practiceStudyNodes = buildTrialNodes(
      trialData.practiceStudyTrials, 'study', condition, 'practice'
    );
    for (var i = 0; i < practiceStudyNodes.length; i++) {
      timeline.push(practiceStudyNodes[i]);
    }
    timeline.push(makePracticeEndNotice());
  }

  // 4. Study phase blocks
  var studyNodes = buildPhaseBlocks(
    trialData.studyTrials, 'study', STUDY_BLOCK_SIZE, condition
  );
  for (var i = 0; i < studyNodes.length; i++) {
    timeline.push(studyNodes[i]);
  }

  // 5. Test instructions (condition-specific)
  timeline.push(makeTestInstructions(condition));

  // 6. Test practice (if enabled; skip for valence)
  if (PRACTICE_ENABLED && condition !== 3 && trialData.practiceTestTrials.length > 0) {
    timeline.push(makePracticeNotice('test'));
    var practiceTestNodes = buildTrialNodes(
      trialData.practiceTestTrials, 'test', condition, 'practice'
    );
    for (var i = 0; i < practiceTestNodes.length; i++) {
      timeline.push(practiceTestNodes[i]);
    }
    timeline.push(makePracticeEndNotice());
  }

  // 7. Test phase blocks
  var testBlockSize;
  if (condition === 1) testBlockSize = TEST_BLOCK_SIZE_ITEM_RECOG;
  else if (condition === 2) testBlockSize = TEST_BLOCK_SIZE_ASSOC_RECOG;
  else testBlockSize = TEST_BLOCK_SIZE_VALENCE;

  var testNodes = buildPhaseBlocks(
    trialData.testTrials, 'test', testBlockSize, condition
  );
  for (var i = 0; i < testNodes.length; i++) {
    timeline.push(testNodes[i]);
  }

  // 8. Debrief
  timeline.push(makeDebrief());

  return timeline;
}

// ============================================================
// Block construction
// ============================================================

/**
 * Shuffle trials, split into blocks, insert fixation + rest breaks.
 */
function buildPhaseBlocks(trials, phase, blockSize, condition) {
  var shuffled = jsPsych.randomization.shuffle(trials.slice());
  var blocks = chunkArray(shuffled, blockSize);
  var nodes = [];

  for (var b = 0; b < blocks.length; b++) {
    var blockTrials = blocks[b];
    var trialNodes = buildTrialNodes(blockTrials, phase, condition, b);
    for (var i = 0; i < trialNodes.length; i++) {
      nodes.push(trialNodes[i]);
    }

    // Rest break between blocks (not after last)
    if (b < blocks.length - 1) {
      nodes.push(makeRestBreak(b + 1, blocks.length));
    }
  }

  return nodes;
}

/**
 * Build fixation + stimulus node pairs for an array of trial data.
 */
function buildTrialNodes(trials, phase, condition, blockNum) {
  var nodes = [];
  for (var t = 0; t < trials.length; t++) {
    // Fixation cross
    nodes.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<span class="fixation-cross">+</span>',
      choices: 'NO_KEYS',
      trial_duration: FIXATION_DURATION,
      data: { phase: phase, trial_part: 'fixation' }
    });

    // Stimulus trial
    nodes.push(makeTrialNode(trials[t], phase, condition, blockNum));
  }
  return nodes;
}

// ============================================================
// Trial node factory
// ============================================================

function makeTrialNode(trialData, phase, condition, blockNum) {
  // Determine if this is a flanker display or single-face display
  var isFlankerDisplay = (phase === 'study') ||
                         (phase === 'test' && condition === 2);

  var stimulus, choices, prompt;

  if (isFlankerDisplay) {
    stimulus = flankerDisplayHTML(
      trialData.target_filename,
      trialData.flanker_filename,
      FACE_WIDTH,
      FACE_SPACING
    );
  } else {
    stimulus = singleFaceHTML(trialData.target_filename, FACE_WIDTH);
  }

  if (phase === 'study') {
    choices = [STUDY_KEYS.female, STUDY_KEYS.male];
    if (KEY_MAPPING === 1) {
      prompt = '<p>Is the center face <strong>female (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>male (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '<p>Is the center face <strong>male (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>female (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    }
  } else if (condition === 1) {
    choices = [ITEM_RECOG_KEYS.old, ITEM_RECOG_KEYS.new];
    if (KEY_MAPPING === 1) {
      prompt = '<p><strong>Old (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>New (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '<p><strong>New (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>Old (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    }
  } else if (condition === 2) {
    choices = [ASSOC_RECOG_KEYS.same, ASSOC_RECOG_KEYS.different];
    if (KEY_MAPPING === 1) {
      prompt = '<p><strong>Same (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>Different (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '<p><strong>Different (' + RESPONSE_KEY_LEFT.toUpperCase() +
        ')</strong> or <strong>Same (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    }
  } else {
    choices = VALENCE_KEYS;
    prompt = '<p>Rate emotional valence: <strong>1</strong> (most negative) — <strong>5</strong> (neutral) — <strong>9</strong> (most positive)</p>';
  }

  // Build data object with all trial-specific fields
  var data = { phase: phase, block: blockNum };
  var fields = Object.keys(trialData);
  for (var i = 0; i < fields.length; i++) {
    data[fields[i]] = trialData[fields[i]];
  }

  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: stimulus,
    choices: choices,
    trial_duration: RESPONSE_TIMEOUT,
    response_ends_trial: (phase !== 'study'),
    prompt: prompt,
    data: data,
    on_load: function () {
      if (phase !== 'study' || !STUDY_RESPONSE_FEEDBACK) return;
      var stimDiv = document.getElementById('jspsych-html-keyboard-response-stimulus');
      if (!stimDiv) return;
      var promptEl = stimDiv.nextElementSibling;
      if (!promptEl) return;
      var done = false;
      document.addEventListener('keydown', function handler(e) {
        if (!done && choices.indexOf(e.key) !== -1) {
          done = true;
          promptEl.textContent = '\u2713 Response recorded';
          document.removeEventListener('keydown', handler);
        }
      });
    },
    on_finish: function (data) {
      data.timed_out = (data.response === null);

      if (data.phase === 'study') {
        data.correct_response = (data.target_gender === 'F')
          ? STUDY_KEYS.female
          : STUDY_KEYS.male;
        data.correct = (data.response === data.correct_response);
      } else if (data.correct_response !== null && data.correct_response !== undefined) {
        data.correct = (data.response === data.correct_response);
      } else {
        data.correct = null;
      }

      // Valence: parse rating from key press
      if (CONDITION === 3 && data.phase === 'test') {
        data.rating = (data.response !== null) ? parseInt(data.response) : null;
      }
    }
  };
}

// ============================================================
// Instruction screens
// ============================================================

function makeStudyInstructions() {
  var leftLabel = (KEY_MAPPING === 1) ? 'female' : 'male';
  var rightLabel = (KEY_MAPPING === 1) ? 'male' : 'female';
  return {
    type: jsPsychInstructions,
    pages: [
      '<h2>Study Phase</h2>' +
      '<p>In this part of the experiment, you will see three faces on the screen.</p>' +
      '<p>Your task is to judge the <strong>gender</strong> of the <strong>center face</strong>.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> if the center face is <strong>' + leftLabel + '</strong>.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> if the center face is <strong>' + rightLabel + '</strong>.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>' +
      '<p>Please try to respond as quickly and accurately as possible.</p>'
    ],
    show_clickable_nav: true,
    button_label_next: 'Begin'
  };
}

function makeTestInstructions(condition) {
  var pages;

  if (condition === 1) {
    var leftDesc = (KEY_MAPPING === 1) ? 'old</strong> (appeared during study)' : 'new</strong> (did not appear during study)';
    var rightDesc = (KEY_MAPPING === 1) ? 'new</strong> (did not appear during study)' : 'old</strong> (appeared during study)';
    pages = [
      '<h2>Test Phase: Recognition</h2>' +
      '<p>You will now see individual faces, one at a time.</p>' +
      '<p>Some faces appeared during the study phase. Others are new.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> if you think the face is <strong>' + leftDesc + '.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> if you think the face is <strong>' + rightDesc + '.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>'
    ];
  } else if (condition === 2) {
    var leftDesc = (KEY_MAPPING === 1) ? 'the <strong>same</strong> as during study' : '<strong>different</strong> from study';
    var rightDesc = (KEY_MAPPING === 1) ? '<strong>different</strong> from study' : 'the <strong>same</strong> as during study';
    pages = [
      '<h2>Test Phase: Associative Recognition</h2>' +
      '<p>You will now see groups of three faces, just as in the study phase.</p>' +
      '<p>Some groups are exactly the same as during study. Others have been rearranged.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> if the pairing is ' + leftDesc + '.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> if the pairing is ' + rightDesc + '.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>'
    ];
  } else {
    pages = [
      '<h2>Test Phase: Valence Rating</h2>' +
      '<p>You will now see individual faces from the study phase.</p>' +
      '<p>Please rate each face on an emotional scale using the number keys 1\u20139:</p>' +
      '<p><strong>1</strong> = most negative &nbsp;&nbsp; ' +
      '<strong>5</strong> = neutral &nbsp;&nbsp; ' +
      '<strong>9</strong> = most positive</p>' +
      '<p>Use the number keys along the top of your keyboard (not the number pad).</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>'
    ];
  }

  return {
    type: jsPsychInstructions,
    pages: pages,
    show_clickable_nav: true,
    button_label_next: 'Begin'
  };
}

function makePracticeNotice(phase) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Practice Trials</h2>' +
      '<p>You will now complete a few practice trials to familiarize yourself with the task.</p>' +
      '<p>Press any key to begin the practice.</p>',
    choices: 'ALL_KEYS'
  };
}

function makePracticeEndNotice() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Practice Complete</h2>' +
      '<p>The practice trials are over. The real trials will begin next.</p>' +
      '<p>Press any key to continue.</p>',
    choices: 'ALL_KEYS'
  };
}

function makeRestBreak(blockNum, totalBlocks) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Rest Break</h2>' +
      '<p>You have completed block ' + blockNum + ' of ' + totalBlocks + '.</p>' +
      '<p>Take a short break if you need one.</p>' +
      '<p>Press any key to continue.</p>',
    choices: 'ALL_KEYS'
  };
}

function makeDebrief() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Experiment Complete</h2>' +
      '<p>Thank you for participating in this study.</p>' +
      '<p>[Debrief text placeholder &mdash; to be filled by researcher]</p>' +
      '<p>Press any key to finish.</p>',
    choices: 'ALL_KEYS'
  };
}
