// ============================================================
// Utility functions for the face-flanker memory experiment.
// No jsPsych dependency — pure functions only.
// ============================================================

/**
 * Generate a derangement of indices [0..n-1].
 * A derangement is a permutation where no element maps to itself.
 * Uses rejection sampling (for n=5: ~36.7% acceptance, ~2.7 expected attempts).
 *
 * @param {number} n - length of the array
 * @returns {number[]} permutation where result[i] !== i for all i
 */
function derangement(n) {
  while (true) {
    var perm = [];
    for (var i = 0; i < n; i++) perm.push(i);
    // Fisher-Yates shuffle
    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    // Check: no fixed points
    var isDerangement = true;
    for (var i = 0; i < n; i++) {
      if (perm[i] === i) {
        isDerangement = false;
        break;
      }
    }
    if (isDerangement) return perm;
  }
}

/**
 * Split an array into chunks of a given size.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array[]}
 */
function chunkArray(arr, size) {
  var chunks = [];
  for (var i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Compute inline style string for a face image, including crop dimensions.
 * @param {number} faceWidth - display width in px
 * @param {number} faceCrop - fraction of original image width to show (0–1)
 * @returns {string} CSS style attribute value
 */
function faceImageStyle(faceWidth, faceCrop) {
  // CFD images are 400x281 after resize (aspect ratio 400:281)
  var displayHeight = Math.round(faceWidth * (281 / 400) / faceCrop);
  return 'width: ' + faceWidth + 'px; height: ' + displayHeight + 'px;';
}

/**
 * Build the three-image flanker display HTML.
 * @param {string} targetSrc - path to center (target) image
 * @param {string} flankerSrc - path to flanker image (shown on both sides)
 * @param {number} faceWidth - pixel width for each image
 * @param {number} faceSpacing - pixel gap between images
 * @param {number} faceCrop - fraction of original image width to show (0–1)
 * @returns {string} HTML string
 */
function flankerDisplayHTML(targetSrc, flankerSrc, faceWidth, faceSpacing, faceCrop) {
  var style = faceImageStyle(faceWidth, faceCrop);
  return (
    '<div class="flanker-display" style="gap: ' + faceSpacing + 'px;">' +
      '<img src="' + flankerSrc + '" class="face-image" style="' + style + '" />' +
      '<img src="' + targetSrc + '" class="face-image" style="' + style + '" />' +
      '<img src="' + flankerSrc + '" class="face-image" style="' + style + '" />' +
    '</div>'
  );
}

/**
 * Build a single-face display HTML.
 * @param {string} faceSrc - path to the face image
 * @param {number} faceWidth - pixel width
 * @param {number} faceCrop - fraction of original image width to show (0–1)
 * @returns {string} HTML string
 */
function singleFaceHTML(faceSrc, faceWidth, faceCrop) {
  var style = faceImageStyle(faceWidth, faceCrop);
  return (
    '<div class="single-face-display">' +
      '<img src="' + faceSrc + '" class="face-image" style="' + style + '" />' +
    '</div>'
  );
}

// ============================================================
// Simulation smoke test — key-mapping consistency
// ============================================================

/**
 * Validate that correct_response fields in trial data are consistent
 * with the key objects. Run after simulation to catch mismatches.
 * @param {object} jsPsych - the jsPsych instance
 * @returns {string[]} array of error messages (empty = pass)
 */
function validateTrialKeyConsistency(jsPsych) {
  var errors = [];
  var trials = jsPsych.data.get().values();

  for (var i = 0; i < trials.length; i++) {
    var t = trials[i];
    if (t.trial_part === 'fixation' || t.trial_part === 'key_quiz') continue;
    if (t.correct_response === undefined || t.correct_response === null) continue;

    if (t.phase === 'study') {
      var expected = (t.target_gender === 'F') ? STUDY_KEYS.female : STUDY_KEYS.male;
      if (t.correct_response !== expected) {
        errors.push('Study trial ' + i + ': target_gender=' + t.target_gender +
          ' expected ' + expected + ' got ' + t.correct_response);
      }
    } else if (t.phase === 'test' && t.stimulus_type !== undefined) {
      // Condition 1: item recognition
      var expected = (t.stimulus_type === 'old') ? ITEM_RECOG_KEYS.old : ITEM_RECOG_KEYS['new'];
      if (t.correct_response !== expected) {
        errors.push('Test trial ' + i + ': stimulus_type=' + t.stimulus_type +
          ' expected ' + expected + ' got ' + t.correct_response);
      }
    } else if (t.phase === 'test' && t.pair_type !== undefined) {
      // Condition 2: associative recognition
      var expected = (t.pair_type === 'intact') ? ASSOC_RECOG_KEYS.same : ASSOC_RECOG_KEYS.different;
      if (t.correct_response !== expected) {
        errors.push('Test trial ' + i + ': pair_type=' + t.pair_type +
          ' expected ' + expected + ' got ' + t.correct_response);
      }
    }
  }
  return errors;
}
