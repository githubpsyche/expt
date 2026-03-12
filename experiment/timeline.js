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

  // 2. Study instructions + key quiz
  timeline.push(makeStudyInstructions());
  var studyQuiz = makeKeyQuiz('study', condition);
  for (var q = 0; q < studyQuiz.length; q++) {
    timeline.push(studyQuiz[q]);
  }

  // 3. Study practice (if enabled)
  if (PRACTICE_ENABLED && trialData.practiceStudyTrials.length > 0) {
    timeline.push(makePracticeNotice('study'));
    var practiceStudyNodes = buildTrialNodes(
      trialData.practiceStudyTrials, 'study', condition, 'practice'
    );
    for (var i = 0; i < practiceStudyNodes.length; i++) {
      timeline.push(practiceStudyNodes[i]);
    }
    timeline.push(makePracticeEndNotice('study', condition));
  }

  // 4. Study phase blocks
  // Condition 2: present all 60 study trials twice (two independently shuffled passes)
  // to strengthen associative memory traces for the harder associative recognition test.
  var studyPasses = (condition === 2) ? 2 : 1;
  for (var pass = 0; pass < studyPasses; pass++) {
    if (pass > 0) {
      timeline.push(makeSecondStudyPassNotice());
    }
    var studyNodes = buildPhaseBlocks(
      trialData.studyTrials, 'study', STUDY_BLOCK_SIZE, condition
    );
    for (var i = 0; i < studyNodes.length; i++) {
      timeline.push(studyNodes[i]);
    }
  }

  // 5. Test instructions + key quiz (condition-specific)
  timeline.push(makeTestInstructions(condition));
  var testQuiz = makeKeyQuiz('test', condition);
  for (var q = 0; q < testQuiz.length; q++) {
    timeline.push(testQuiz[q]);
  }

  // 6. Test practice (if enabled; skip for valence)
  if (PRACTICE_ENABLED && condition !== 3 && trialData.practiceTestTrials.length > 0) {
    timeline.push(makePracticeNotice('test'));
    var practiceTestNodes = buildTrialNodes(
      trialData.practiceTestTrials, 'test', condition, 'practice'
    );
    for (var i = 0; i < practiceTestNodes.length; i++) {
      timeline.push(practiceTestNodes[i]);
    }
    timeline.push(makePracticeEndNotice('test', condition));
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

  // 8. Key-mapping smoke test (simulation mode only)
  if (jsPsych.data.getURLVariable('simulate')) {
    timeline.push({
      type: jsPsychCallFunction,
      func: function () {
        var errors = validateTrialKeyConsistency(jsPsych);
        if (errors.length > 0) {
          console.error('KEY MAPPING SMOKE TEST FAILED:');
          errors.forEach(function (e) { console.error('  ' + e); });
        } else {
          console.log('Key mapping smoke test passed.');
        }
      }
    });
  }

  // 9. Debrief
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
      nodes.push(makeRestBreak(b + 1, blocks.length, phase, condition));
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
      FACE_SPACING,
      FACE_CROP
    );
  } else {
    stimulus = singleFaceHTML(trialData.target_filename, FACE_WIDTH, FACE_CROP);
  }

  var isPractice = (blockNum === 'practice');

  if (phase === 'study') {
    choices = [STUDY_KEYS.female, STUDY_KEYS.male];
    if (isPractice) {
      var kl = getKeyLabels('study', null);
      prompt = '<p class="trial-prompt">Is the center face <strong>' + kl.left +
        ' (' + RESPONSE_KEY_LEFT.toUpperCase() + ')</strong> or <strong>' + kl.right +
        ' (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '<p class="trial-prompt"></p>';
    }
  } else if (condition === 1) {
    choices = [ITEM_RECOG_KEYS.old, ITEM_RECOG_KEYS.new];
    if (isPractice) {
      var kl = getKeyLabels('test', 1);
      prompt = '<p class="trial-prompt"><strong>' + kl.left.charAt(0).toUpperCase() + kl.left.slice(1) +
        ' (' + RESPONSE_KEY_LEFT.toUpperCase() + ')</strong> or <strong>' +
        kl.right.charAt(0).toUpperCase() + kl.right.slice(1) +
        ' (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '';
    }
  } else if (condition === 2) {
    choices = [ASSOC_RECOG_KEYS.same, ASSOC_RECOG_KEYS.different];
    if (isPractice) {
      var kl = getKeyLabels('test', 2);
      prompt = '<p class="trial-prompt"><strong>' + kl.left.charAt(0).toUpperCase() + kl.left.slice(1) +
        ' (' + RESPONSE_KEY_LEFT.toUpperCase() + ')</strong> or <strong>' +
        kl.right.charAt(0).toUpperCase() + kl.right.slice(1) +
        ' (' + RESPONSE_KEY_RIGHT.toUpperCase() + ')</strong>?</p>';
    } else {
      prompt = '';
    }
  } else {
    choices = VALENCE_KEYS;
    prompt = '';
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
      data.device_pixel_ratio = window.devicePixelRatio;

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
  var kl = getKeyLabels('study', null);
  var leftLabel = kl.left;
  var rightLabel = kl.right;
  return {
    type: jsPsychInstructions,
    pages: [
      '<h2>Study Phase</h2>' +
      '<p>In this part of the experiment, you will see three faces on the screen.</p>' +
      '<p>Your task is to judge the <strong>gender</strong> of the <strong>center face</strong>.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> = <strong>' + leftLabel.toUpperCase() + '</strong></p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> = <strong>' + rightLabel.toUpperCase() + '</strong></p>' +
      '<p>There will be no reminder on screen, so please memorize these keys.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>' +
      '<p>Please try to respond as quickly and accurately as possible.</p>'
    ],
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: 'Begin'
  };
}

function makeTestInstructions(condition) {
  var pages;

  if (condition === 1) {
    var kl = getKeyLabels('test', 1);
    var leftLabel = kl.left.toUpperCase();
    var rightLabel = kl.right.toUpperCase();
    var leftDesc = (kl.left === 'old') ? 'appeared during study' : 'did not appear during study';
    var rightDesc = (kl.right === 'old') ? 'appeared during study' : 'did not appear during study';
    pages = [
      '<h2>Test Phase: Recognition</h2>' +
      '<p>You will now see individual faces, one at a time.</p>' +
      '<p>Some of these faces appeared during the study phase (old faces). ' +
      'Others are faces you have not seen before (new faces).</p>' +
      '<p>Your task is to decide whether each face is old or new.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> = <strong>' + leftLabel + '</strong> (' + leftDesc + ')</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> = <strong>' + rightLabel + '</strong> (' + rightDesc + ')</p>' +
      '<p>There will be no reminder on screen, so please memorize these keys.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>' +
      '<p>Please respond as quickly and accurately as possible.</p>'
    ];
  } else if (condition === 2) {
    var kl = getKeyLabels('test', 2);
    var leftLabel = kl.left.toUpperCase();
    var rightLabel = kl.right.toUpperCase();
    pages = [
      '<h2>Test Phase: Associative Recognition</h2>' +
      '<p>You will now see groups of three faces, just as in the study phase.</p>' +
      '<p>Some groups show the exact same pairing as during study (same). ' +
      'Others have been rearranged \u2014 the center face is shown with different flankers (different).</p>' +
      '<p>Your task is to decide whether each pairing is the same or different.</p>' +
      '<p>Press <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> = <strong>' + leftLabel + '</strong></p>' +
      '<p>Press <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> = <strong>' + rightLabel + '</strong></p>' +
      '<p>There will be no reminder on screen, so please memorize these keys.</p>' +
      '<p>You will have 3 seconds to respond on each trial.</p>' +
      '<p>Please respond as quickly and accurately as possible.</p>'
    ];
  } else {
    pages = [
      '<h2>Test Phase: Valence Rating</h2>' +
      '<p>You will now see individual faces from the study phase.</p>' +
      '<p>Please rate each face on how positive or negative it feels, using the number keys 1\u20139:</p>' +
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
    allow_backward: false,
    button_label_next: 'Begin'
  };
}

/**
 * Build key mapping quiz nodes. Each item shows a label and only
 * the correct key advances the trial.
 */
function makeKeyQuiz(phase, condition) {
  var items = [];

  if (phase === 'study') {
    items.push({ label: 'FEMALE', key: STUDY_KEYS.female });
    items.push({ label: 'MALE', key: STUDY_KEYS.male });
  } else if (condition === 1) {
    items.push({ label: 'OLD', key: ITEM_RECOG_KEYS.old });
    items.push({ label: 'NEW', key: ITEM_RECOG_KEYS.new });
  } else if (condition === 2) {
    items.push({ label: 'SAME', key: ASSOC_RECOG_KEYS.same });
    items.push({ label: 'DIFFERENT', key: ASSOC_RECOG_KEYS.different });
  }
  // Condition 3 (valence): skip quiz — 1–9 mapping is intuitive

  var nodes = [];
  for (var i = 0; i < items.length; i++) {
    (function (item) {
      nodes.push({
        timeline: [
          {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<p>Press the key for <strong>' + item.label + '</strong></p>',
            choices: 'ALL_KEYS',
            data: { trial_part: 'key_quiz', correct_key: item.key },
            simulation_options: { data: { response: item.key } }
          },
          {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function () {
              var prev = jsPsych.data.getLastTrialData().values()[0];
              if (prev.response === prev.correct_key) {
                return '<p style="color: #6b6;">Correct!</p>';
              }
              return '<p style="color: #b66;">Incorrect. The key for ' + item.label +
                ' is <strong>' + item.key.toUpperCase() + '</strong>.</p>' +
                '<p>Press any key to try again.</p>';
            },
            choices: 'ALL_KEYS',
            trial_duration: function () {
              var prev = jsPsych.data.getLastTrialData().values()[0];
              return (prev.response === prev.correct_key) ? 1000 : null;
            }
          }
        ],
        loop_function: function (data) {
          var quizTrial = data.values()[0];
          return quizTrial.response !== quizTrial.correct_key;
        }
      });
    })(items[i]);
  }
  return nodes;
}

function keyMappingReminder(phase, condition) {
  var kl = getKeyLabels(phase, condition);
  if (kl) {
    return '<p>Reminder: <strong>' + RESPONSE_KEY_LEFT.toUpperCase() + '</strong> = ' + kl.left.toUpperCase() +
      ' &nbsp;&nbsp; <strong>' + RESPONSE_KEY_RIGHT.toUpperCase() + '</strong> = ' + kl.right.toUpperCase() + '</p>';
  }
  return '<p>Reminder: <strong>1</strong> = most negative &nbsp;&nbsp; ' +
    '<strong>5</strong> = neutral &nbsp;&nbsp; <strong>9</strong> = most positive</p>';
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

function makePracticeEndNotice(phase, condition) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Practice Complete</h2>' +
      '<p>The practice trials are over. The real trials will begin next.</p>' +
      '<p>From now on, the key instructions will <strong>not</strong> be displayed on screen during trials.</p>' +
      keyMappingReminder(phase, condition) +
      '<p>Press any key to continue.</p>',
    choices: 'ALL_KEYS'
  };
}

function makeSecondStudyPassNotice() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Second Round</h2>' +
      '<p>You will now see the same faces a second time.</p>' +
      '<p>Continue judging each target\'s gender as before.</p>' +
      '<p>Press any key to continue.</p>',
    choices: 'ALL_KEYS'
  };
}

function makeRestBreak(blockNum, totalBlocks, phase, condition) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h2>Rest Break</h2>' +
      '<p>You have completed block ' + blockNum + ' of ' + totalBlocks + '.</p>' +
      '<p>Take a short break if you need one.</p>' +
      keyMappingReminder(phase, condition) +
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
