/**
 * Contains the version of the video-player. Is automatically set during build.
 * @type {String}
 */
// eslint-disable-next-line capitalized-comments
export const VERSION = '2.4.1'; // auto-generated-version

/**
 * Contains the different play states.
 * @type {Object.<string, string>}
 */
export const PLAY_STATES = {
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  WAITING: 'WAITING',
  FINISHED: 'FINISHED',
};

/**
 * Contains the supported quality modes.
 * @type {Object.<string, string>}
 */
export const QUALITY_MODES = {
  HLS: 'hls',
  HD: 'hd',
  SD: 'sd',
};

/**
 * Contains the supported caption types.
 * @type {Object.<string, string>}
 */
export const CAPTION_TYPES = {
  DEFAULT: 'default',
  GENERATED: 'auto-generated',
};

/**
 * Contains the interval in seconds between two syncronization procedures.
 * @type {Number}
 */
export const SYNC_INTERVAL = 1;

/**
 * Contains the difference threshold in seconds between position of the
 * state and position of a single video stream from which the video stream
 * is synced manually.
 * @type {Number}
 */
export const SYNC_DIFF_THRESHOLD = 0.5;

/**
 * Contains the difference threshold in seconds between position of the
 * state and position of a single video stream from which a seek is performed.
 * @type {Number}
 */
export const SEEK_DIFF_THRESHOLD = 1;

/**
 * Contains the name of the event that is used to pause playback on other
 * player instances when a instance starts playing.
 * @type {String}
 */
export const PLAYING_EVENT_NAME = 'videoPlaying';

/**
 * Contains the minimum width ratio a single video can occupy when resizing.
 * @type {Number}
 */
export const MIN_VIDEO_WIDTH_PERCENTAGE = 0.2;

/**
 * Contains the percentage of the total width that the resizer should be moved on button tap.
 * @type {Number}
 */
export const RESIZER_TAP_STEP = 0.2;

/**
 * Contains the default state properties.
 * @type {Object.<string, Object>}
 */
export const DEFAULT_STATE = {
  alreadyPlayed: false,
  playState: PLAY_STATES.PAUSED,
  position: 0,
  bufferPosition: 0,
  duration: 0,
  trimStart: 0,
  trimEnd: 0,
  live: false,
  liveSync: true,
  livePosition: 0,
  liveStartPosition: 0,
  liveFragmentDuration: 0,
  playbackRate: 1.0,
  volume: 1.0,
  muted: false,
  fullscreen: false,
  isChapterListShown: false,
  isQuizOverlayEnabled: true,
  isQuizOverlayVisible: false,
  captionLanguage: 'off',
  captionType: CAPTION_TYPES.DEFAULT,
  showCaptions: false,
  showInteractiveTranscript: false,
  mobileSettingsMenuOpen: false,
  fallbackStreamActive: false,
  resizerRatios: [],
};

/**
 * Contains the default configuration properties.
 * @type {Object.<string, Object>}
 */
export const DEFAULT_CONFIGURATION = {
  streams: [],
  chapters: [],
  captions: [],
  slides: [],
  relatedVideos: [],
  quiz: {
    validationCallback: null,
    questions: [],
  },
  initialState: {},
  playbackRates: [0.7, 1.0, 1.3, 1.5, 1.8, 2.0],
  videoPreload: true,
  liveDvr: false,
  theme: 'dark-orange',
  language: 'en',
  mobileMenu: true,
};

/**
 * Contains predefined themes determining the different color variables.
 * @type {Object.<string, Object>}
 */
export const THEMES = {
  'dark-orange': {
    foregroundColor: '#FFFFFF',
    accentColor: '#DD6112',
    fontColorOnAccentColor: '#000000',
    backgroundColor: '#424242',
    secondaryBackgroundColor: '#6D6D6D',
  },
  'dark-yellow': {
    foregroundColor: '#FFFFFF',
    accentColor: '#F5A704',
    fontColorOnAccentColor: '#000000',
    backgroundColor: '#424242',
    secondaryBackgroundColor: '#6D6D6D',
  },
  'dark-blue': {
    foregroundColor: '#FFFFFF',
    accentColor: '#0B72B5',
    fontColorOnAccentColor: '#FFFFFF',
    backgroundColor: '#424242',
    secondaryBackgroundColor: '#6D6D6D',
  },
  'light-green': {
    foregroundColor: '#001C3B',
    accentColor: '#ABB324',
    fontColorOnAccentColor: '#000000',
    backgroundColor: '#FFFFFF',
    secondaryBackgroundColor: '#AAAAAA',
  },
  'dark-red': {
    foregroundColor: '#FFFFFF',
    accentColor: '#B10438',
    fontColorOnAccentColor: '#FFFFFF',
    backgroundColor: '#424242',
    secondaryBackgroundColor: '#6D6D6D',
  },
  'light-red': {
    foregroundColor: '#000000',
    accentColor: '#B10438',
    fontColorOnAccentColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    secondaryBackgroundColor: '#AAAAAA',
  },
};

/**
 * Number of second to wait before the next video of a playlist is automatically loaded.
 * @type {Number}
 */
export const SECONDS_TO_NEXT_VIDEO = 5;

/**
 * Contains the possible user preferences properties.
 * @type {String[]}
 */
export const USER_PREFERENCES_KEYS = [
  'quality',
  'playbackRate',
  'volume',
  'captionLanguage',
  'captionType',
  'showCaptions',
  'showInteractiveTranscript',
  'resizerRatios',
];

/**
 * Contains the local storage key for the user preferences.
 * @type {String[]}
 */
export const USER_PREFERNECES_STORAGE_KEY = 'videoplayerUserPreferences';

/**
 * Contains the possible topics for analytics events.
 * @type {Object.<string, Object>}
 */
export const ANALYTICS_TOPICS = {
  VIDEO_SEEK: 'video_seek',
  PLAY_PAUSE: 'play_pause',
  VIDEO_PAUSE: 'video_pause',
  VIDEO_PLAY: 'video_play',
  VIDEO_FULLSCREEN: 'video_fullscreen',
  VIDEO_CHANGE_SPEED: 'video_change_speed',
  VIDEO_END: 'video_end',
  VIDEO_CLOSE: 'video_close',
  VIDEO_CHANGE_QUALITY: 'video_change_quality',
  VIDEO_CHANGE_SIZE: 'video_change_size',
  VIDEO_LANDSCAPE: 'video_landscape',
  VIDEO_PORTRAIT: 'video_portrait',
  VIDEO_SLIDE_CHANGE: 'video_slide_change',
  VIDEO_SLIDE_SEEK: 'video_slide_seek',
  VIDEO_SUBTITLE: 'video_subtitle',
  VIDEO_SUBTITLE_CHANGE: 'video_subtitle_change',
  VIDEO_TRANSCRIPT: 'video_transcript',
  VIDEO_TRANSCRIPT_SEEK: 'video_transcript_seek',
  VIDEO_CHAPTER: 'video_chapter',
  VIDEO_CHAPTER_SEEK: 'video_chapter_seek',
  VIDEO_TIME_CHANGE: 'video_time_change',
  VIDEO_DUAL_STREAM_CHANGE: 'video_dual_stream_change',
  VIDEO_VOLUME_CHANGE: 'video_volume_change',
  QUIZ_OVERLAY: 'quiz_overlay',
};
