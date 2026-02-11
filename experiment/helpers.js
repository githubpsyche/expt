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
 * Build the three-image flanker display HTML.
 * @param {string} targetSrc - path to center (target) image
 * @param {string} flankerSrc - path to flanker image (shown on both sides)
 * @param {number} faceWidth - pixel width for each image
 * @param {number} faceSpacing - pixel gap between images
 * @returns {string} HTML string
 */
function flankerDisplayHTML(targetSrc, flankerSrc, faceWidth, faceSpacing) {
  return (
    '<div class="flanker-display" style="gap: ' + faceSpacing + 'px;">' +
      '<img src="' + flankerSrc + '" class="face-image" style="width: ' + faceWidth + 'px;" />' +
      '<img src="' + targetSrc + '" class="face-image" style="width: ' + faceWidth + 'px;" />' +
      '<img src="' + flankerSrc + '" class="face-image" style="width: ' + faceWidth + 'px;" />' +
    '</div>'
  );
}

/**
 * Build a single-face display HTML.
 * @param {string} faceSrc - path to the face image
 * @param {number} faceWidth - pixel width
 * @returns {string} HTML string
 */
function singleFaceHTML(faceSrc, faceWidth) {
  return (
    '<div class="single-face-display">' +
      '<img src="' + faceSrc + '" class="face-image" style="width: ' + faceWidth + 'px;" />' +
    '</div>'
  );
}
