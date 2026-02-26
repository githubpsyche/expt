// ============================================================
// Experiment Configuration
// Constants are set at load time; URL-dependent params are
// deferred to initURLParams() (called after jatos.onLoad on JATOS).
// ============================================================

// --- Timing (ms) ---
var FIXATION_DURATION = 2000;   // fixation cross before each trial
var RESPONSE_TIMEOUT  = 3000; // study: fixed display duration; test: max response window

// --- Display (px) ---
var FACE_WIDTH   = 100; // width of each face image (study flanker display + test single face)
var FACE_SPACING = 0;   // horizontal gap between faces in the 3-face flanker display

// --- Stimulus decisions ---
var HAPPY_EXPRESSION = 'HO';          // 'HC' (closed mouth) or 'HO' (open mouth)
var FLANKER_RACES    = ['B', 'W'];    // race codes for flanker-eligible models
var FLANKER_EMOTIONS = ['angry', 'happy', 'neutral'];
var EMOTION_EXPR_MAP = {              // maps emotion names to CFD expression codes
  angry:   'A',
  happy:   HAPPY_EXPRESSION,
  neutral: 'N'
};

// --- Study phase ---
var N_REPLICATIONS  = 5;   // repetitions per trial type (each uses a unique face pair)
var N_TRIAL_TYPES   = 12;  // 2 target genders x 2 flanker genders x 3 flanker emotions
var N_STUDY_TRIALS  = N_REPLICATIONS * N_TRIAL_TYPES;  // 120

// --- Block sizes (must divide phase totals evenly) ---
var STUDY_BLOCK_SIZE            = 30;  // 60 / 30 = 2 blocks
var TEST_BLOCK_SIZE_ITEM_RECOG  = 40;  // 240 / 40 = 6 blocks
var TEST_BLOCK_SIZE_ASSOC_RECOG = 40;  // 120 / 40 = 3 blocks
var TEST_BLOCK_SIZE_VALENCE     = 40;  // 120 / 40 = 3 blocks

// --- Study-phase response feedback ---
var STUDY_RESPONSE_FEEDBACK = true;  // swap prompt to "Response recorded" after study-phase keypress

// --- Practice ---
var PRACTICE_ENABLED   = true;
var N_PRACTICE_STUDY   = 4;
var N_PRACTICE_TEST    = 4;

// --- Response keys ---
var RESPONSE_KEY_LEFT  = 'z';
var RESPONSE_KEY_RIGHT = 'm';

var VALENCE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// ============================================================
// URL-dependent parameters (populated by initURLParams)
// ============================================================

// Declared here so they are globally visible; assigned in initURLParams().
var CONDITION, KEY_MAPPING, TEST_MODE;
var SUBJECT_ID, STUDY_ID, SESSION_ID;
var STUDY_KEYS, ITEM_RECOG_KEYS, ASSOC_RECOG_KEYS;

/**
 * Read URL parameters and set up all URL-dependent config.
 * Must be called after jsPsych init. On JATOS, call inside jatos.onLoad()
 * so that jatos.urlQueryParameters is available.
 */
function initURLParams() {
  // Helper: read from JATOS params if available, else jsPsych
  function getParam(name) {
    if (typeof jatos !== 'undefined' && jatos.urlQueryParameters &&
        jatos.urlQueryParameters[name] !== undefined) {
      return jatos.urlQueryParameters[name];
    }
    return jsPsych.data.getURLVariable(name);
  }

  // --- Condition assignment ---
  // 1 = Item Recognition, 2 = Associative Recognition, 3 = Valence Rating
  var urlCondition = parseInt(getParam('condition'));
  CONDITION = ([1, 2, 3].indexOf(urlCondition) !== -1) ? urlCondition : null;

  // --- Key-mapping counterbalance (1 or 2), controls all binary tasks ---
  //   1 = left=female/old/same, right=male/new/different
  //   2 = left=male/new/different, right=female/old/same
  var urlMapping = parseInt(getParam('key_mapping'));
  KEY_MAPPING = ([1, 2].indexOf(urlMapping) !== -1) ? urlMapping : (Math.random() < 0.5 ? 1 : 2);

  STUDY_KEYS = (KEY_MAPPING === 1)
    ? { female: RESPONSE_KEY_LEFT,  male: RESPONSE_KEY_RIGHT }
    : { female: RESPONSE_KEY_RIGHT, male: RESPONSE_KEY_LEFT };

  ITEM_RECOG_KEYS = (KEY_MAPPING === 1)
    ? { old: RESPONSE_KEY_LEFT,  new: RESPONSE_KEY_RIGHT }
    : { old: RESPONSE_KEY_RIGHT, new: RESPONSE_KEY_LEFT };

  ASSOC_RECOG_KEYS = (KEY_MAPPING === 1)
    ? { same: RESPONSE_KEY_LEFT,  different: RESPONSE_KEY_RIGHT }
    : { same: RESPONSE_KEY_RIGHT, different: RESPONSE_KEY_LEFT };

  // --- Test mode (reduces timing, disables practice) ---
  TEST_MODE = parseInt(getParam('test_mode')) === 1;

  if (TEST_MODE) {
    FIXATION_DURATION = 200;
    RESPONSE_TIMEOUT  = 500;
    PRACTICE_ENABLED  = false;
  }

  // --- Prolific integration ---
  SUBJECT_ID = getParam('PROLIFIC_PID') || '';
  STUDY_ID   = getParam('STUDY_ID') || '';
  SESSION_ID = getParam('SESSION_ID') || '';

  // --- Add global properties to all trial data ---
  jsPsych.data.addProperties({
    condition:   CONDITION,
    key_mapping: KEY_MAPPING,
    test_mode:   TEST_MODE,
    subject_id:  SUBJECT_ID,
    study_id:    STUDY_ID,
    session_id:  SESSION_ID
  });
}
