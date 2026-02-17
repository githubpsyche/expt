// ============================================================
// Experiment Configuration
// Loaded after jsPsych init (uses jsPsych.data.getURLVariable)
// ============================================================

// --- Condition assignment ---
// 1 = Item Recognition, 2 = Associative Recognition, 3 = Valence Rating
var CONDITION = (function () {
  var urlCondition = parseInt(jsPsych.data.getURLVariable('condition'));
  if ([1, 2, 3].indexOf(urlCondition) !== -1) return urlCondition;
  return null;
})();

// --- Timing (ms) ---
var FIXATION_DURATION = 2000;   // fixation cross before each trial
var RESPONSE_TIMEOUT  = 3000; // study: fixed display duration; test: max response window

// --- Display (px) ---
var FACE_WIDTH   = 200; // width of each face image (study flanker display + test single face)
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
var N_REPLICATIONS  = 10;  // repetitions per trial type (each uses a unique face pair)
var N_TRIAL_TYPES   = 12;  // 2 target genders x 2 flanker genders x 3 flanker emotions
var N_STUDY_TRIALS  = N_REPLICATIONS * N_TRIAL_TYPES;  // 120

// --- Block sizes (must divide phase totals evenly) ---
var STUDY_BLOCK_SIZE            = 40;  // 120 / 40 = 3 blocks
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

// Key-mapping counterbalance (1 or 2), controls all binary tasks:
//   1 = left=female/old/same, right=male/new/different
//   2 = left=male/new/different, right=female/old/same
var KEY_MAPPING = (function () {
  var urlMapping = parseInt(jsPsych.data.getURLVariable('key_mapping'));
  if ([1, 2].indexOf(urlMapping) !== -1) return urlMapping;
  return Math.random() < 0.5 ? 1 : 2;
})();

var STUDY_KEYS = (KEY_MAPPING === 1)
  ? { female: RESPONSE_KEY_LEFT,  male: RESPONSE_KEY_RIGHT }
  : { female: RESPONSE_KEY_RIGHT, male: RESPONSE_KEY_LEFT };

var ITEM_RECOG_KEYS = (KEY_MAPPING === 1)
  ? { old: RESPONSE_KEY_LEFT,  new: RESPONSE_KEY_RIGHT }
  : { old: RESPONSE_KEY_RIGHT, new: RESPONSE_KEY_LEFT };

var ASSOC_RECOG_KEYS = (KEY_MAPPING === 1)
  ? { same: RESPONSE_KEY_LEFT,  different: RESPONSE_KEY_RIGHT }
  : { same: RESPONSE_KEY_RIGHT, different: RESPONSE_KEY_LEFT };

var VALENCE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// --- Test mode (reduces timing, disables practice) ---
var TEST_MODE = parseInt(jsPsych.data.getURLVariable('test_mode')) === 1;

if (TEST_MODE) {
  FIXATION_DURATION = 200;
  RESPONSE_TIMEOUT  = 500;
  PRACTICE_ENABLED  = false;
}

// --- Prolific integration ---
var SUBJECT_ID = jsPsych.data.getURLVariable('PROLIFIC_PID') || '';
var STUDY_ID   = jsPsych.data.getURLVariable('STUDY_ID') || '';
var SESSION_ID = jsPsych.data.getURLVariable('SESSION_ID') || '';

// --- Add global properties to all trial data ---
jsPsych.data.addProperties({
  condition:   CONDITION,
  key_mapping: KEY_MAPPING,
  test_mode:   TEST_MODE,
  subject_id:  SUBJECT_ID,
  study_id:    STUDY_ID,
  session_id:  SESSION_ID
});
