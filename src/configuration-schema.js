const streamSchema = {
  hls: {
    type: 'string',
    description: 'URL of the HLS video stream.',
  },
  hd: {
    type: 'string',
    description: 'URL of the HD video stream.',
  },
  sd: {
    type: 'string',
    description: 'URL of the SD video stream.',
  },
  poster: {
    type: 'string',
    description: 'URL of the poster image.',
  },
  muted: {
    type: 'boolean',
    description: 'Mutes the audio stream of the video.',
    default: false,
  },
};

const stateSchema = {
  playState: {
    type: 'string',
    options: ['PLAYING', 'PAUSED'],
    default: 'PAUSED',
  },
  position: {
    type: 'number',
    default: 0,
    description: 'Video position in seconds.',
  },
  playbackRate: {
    type: 'number',
    default: 1,
  },
  quality: {
    type: 'string',
    options: ['hls', 'hd', 'sd'],
    default: 'best quality available',
  },
  volume: {
    type: 'number',
    min: 0,
    max: 1,
    default: 1,
  },
  muted: {
    type: 'boolean',
    default: false,
  },
  captionLanguage: {
    type: 'string',
    default: 'off',
  },
  captionType: {
    type: 'string',
    default: 'default',
  },
  showCaptions: {
    type: 'boolean',
    default: false,
    description: 'Enables captions. Additionally, `captionLanguage` needs to be set.',
  },
  showInteractiveTranscript: {
    type: 'boolean',
    default: false,
    description: 'Enables interactive transcript. Additionally, `captionLanguage` needs to be set.',
  },
  resizerRatios: {
    type: 'array',
    description: 'The ratios of the resizers. Ratio is calculated by `leftVideo.width / rightVideo.width`. Per default, videos were aligned to have the same height.',
  },
};

export const configurationSchema = {
  streams: {
    required: true,
    type: 'array',
    description: 'List of URLs to the videos streams of different qualities and (optional) poster images. If there is only one quality, use `hd`.',
    schema: streamSchema,
    example: [
      {
        sd: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        hd: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        poster: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
      },
    ],
  },
  fallbackStream: {
    type: 'object',
    description: 'Contains a fallback stream that the user can switch to, i.e. a single stream source.',
    schema: streamSchema,
  },
  framesPerSecond: {
    type: 'number',
    default: 25,
    description: "Fps of the video. Used for skipping frame wise.",
  },
  language: {
    type: 'string',
    default: 'en',
    description: 'Language used for localizing messages.',
  },
  initialState: {
    type: 'object',
    description: 'The initial state the player has when loaded.',
    schema: stateSchema,
  },
  playbackRates: {
    type: 'array',
    default: [0.7, 1.0, 1.3, 1.5, 1.8, 2.0],
    description: 'The playback rates the user can choose from in the selection menu',
  },
  userPreferences: {
    type: 'object',
    schema: stateSchema,
    description: 'Override parts of the default/initial/saved state. Meant to be provided by the server based on the current user.',
  },
  foregroundColor: {
    type: 'string',
    pattern: /^#(?:[0-9a-f]{3}){1,2}$/i,
    description: 'HEX code of the color for text and all other main content.',
  },
  accentColor: {
    type: 'string',
    pattern: /^#(?:[0-9a-f]{3}){1,2}$/i,
    description: 'HEX code of the highlighting color.',

  },
  fontColorOnAccentColor: {
    type: 'string',
    pattern: /^#(?:[0-9a-f]{3}){1,2}$/i,
    description: 'HEX code of the font color on the `accentColor`. Take care that the contrast ratio is high enough.',
  },
  backgroundColor: {
    type: 'string',
    pattern: /^#(?:[0-9a-f]{3}){1,2}$/i,
    description: 'HEX code of the background for the `foregroundColor`.',
  },
  secondaryBackgroundColor: {
    type: 'string',
    pattern: /^#(?:[0-9a-f]{3}){1,2}$/i,
    description: 'HEX code of another background color used for example for displaying the buffer. Take care that the `foregroundColor` has a high contrast to both background colors.',
  },
  theme: {
    type: 'string',
    options: ['dark-orange', 'dark-yellow', 'dark-blue', 'light-green', 'dark-red', 'light-red'],
    default: 'dark-orange',
    description: 'Predefined color theme (can be adjusted by settings the colors explicitly).',
  },
  videoPreload: {
    type: 'boolean',
    default: true,
    description: 'Turns on/off preloading of the videos when the page loads.',
  },
  trimVideo: {
    type: 'object',
    description: 'Restricts the playback on a specific segment of the video.',
    schema: {
      start: {
        type: 'number',
        default: 0,
        description: 'The start position of the segment.',
      },
      end: {
        type: 'number',
        default: 'duration of video',
        description: 'The end position of the segment',
      },
    },
    example: {
      start: 60,
      end: 300,
    },
  },
  chapters: {
    type: 'array',
    description: 'List of timestamps with chapter names.',
    schema: {
      title: {
        required: true,
        type: 'string',
        description: 'Title of the chapter.',
      },
      startPosition: {
        required: true,
        type: 'number',
        description: 'Start position of the chapter in seconds.',
      },
    },
    example: [
      {
        title: 'Chapter 1',
        startPosition: 0,
      },
    ],
  },
  captions: {
    type: 'array',
    description: 'List of caption files for different languages.',
    schema: {
      name: {
        type: 'string',
        description: 'Name of the captions that is shown in the drop-down control.',
      },
      language: {
        required: true,
        type: 'string',
        description: 'Language code of the captions.',
      },
      url: {
        required: true,
        type: 'string',
        description: 'URL of the captions WebVTT file.',
      },
      type: {
        type: 'string',
        description: 'Determines the type of captions. Currently, `default` and `auto-generated` are supported.',
        default: 'default',
      },
    },
    example: [
      {
        language: 'en',
        url: '/captions/en.vtt',
      },
    ],
  },
  slides: {
    type: 'array',
    description: 'List of presentation slides and corresponding start times in seconds to show below the progress.',
    schema: {
      thumbnail: {
        required: true,
        type: 'string',
        description: 'URL of the slide thumbnail.',
      },
      startPosition: {
        required: true,
        type: 'number',
        description: 'Start position of the slide in seconds.',
      },
    },
    example: [
      {
        thumbnail: '/image/of/slide.jpg',
        startPosition: 0,
      },
    ],
  },
  quiz: {
    type: 'object',
    description: 'Information for the quiz component of the player.',
    schema: {
      validationCallback: {
        required: true,
        type: 'string',
        description: 'Name of a global function that is called by the handler to validate user answers for the questions. It will be passed the question that is currently shown as first parameter. The second parameter depends on the question type. For text questions, this will be the text the user entered. For choice questions, the second parameter will be a list of all answer objects that are associated with this question and were selected by the user. The function should return an object that has two attributes, `isAnswerCorrect` and `correctAnswers`. The first, a boolean, indicates whether anything was wrong. The second, a list containing a subset of the answers stored with this question, is used to show the user where he made mistakes or to show him what possible answers could have been.',
      },
      questions: {
        type: 'array',
        required: true,
        description: 'List of questions that are shown to the user during playback.',
        schema: {
          id: {
            required: true,
            type: 'number',
            description: 'The id for this question. This is primarily intended to be stored for the validation callback.',
          },
          text: {
            required: true,
            type: 'string',
            description: 'The question text that is shown to the user.',
          },
          type: {
            required: true,
            type: 'string',
            description: 'The questions type. Should be `single-choice`, `multiple-choice` or `freetext`.',
          },
          position: {
            required: true,
            type: 'number',
            description: 'The point in the video where the question should be shown, in seconds.',
          },
          answers: {
            type: 'array',
            description: 'A list of possible answers for `single-choice` or `multiple-choice` questions.',
            schema: {
              id: {
                required: true,
                type: 'number',
                description: 'The id for this answer. This is primarily intended to be stored for the validation callback.',
              },
              text: {
                required: true,
                type: 'string',
                description: 'The text of this answer.',
              },
            },
          },
        },
        example: [
          {
            id: 1,
            text: 'What is HTML?',
            type: 'single-choice',
            position: 3600,
            answers: [
              {
                id: 1,
                text: 'A standard internet protocol for information exchange.',
              },
              {
                id: 2,
                text: 'A markup language for creating web sites.',
              },
              {
                id: 3,
                text: 'A program used to download files to your computer',
              },
            ],
          },
        ],
      },
    },
  },
  relatedVideos: {
    type: 'array',
    description: 'List of related videos that are shown after the video has ended.',
    schema: {
      title: {
        required: true,
        type: 'string',
        description: 'Title of the video.',
      },
      url: {
        required: true,
        type: 'string',
        description: 'URL of the video page.',
      },
      thumbnail: {
        required: true,
        type: 'string',
        description: 'URL of the video thumbnail.',
      },
      duration: {
        type: 'number',
        description: 'Duration of the video in seconds.',
      },
    },
    example: [
      {
        title: 'Title of related video.',
        url: '/url/of/video-page',
        thumbnail: '/image/of/thumbnail.jpg',
        duration: 2259,
      },
    ],
  },
  playlist: {
    type: 'object',
    description: 'The playlist, the video is part of.',
    schema: {
      autoPlay: {
        type: 'boolean',
        description: 'If enabled, the user is redirected to the next video page after the video has ended.',
        default: false,
      },
      hideInList: {
        type: 'boolean',
        description: 'If enabled, the playlist entries are not shown in the playlist/chapter list.',
        default: false,
      },
      currentPosition: {
        required: true,
        type: 'number',
        description: 'The current position in the playlist.',
      },
      entries: {
        required: true,
        type: 'array',
        description: 'Videos of the playlist.',
        schema: {
          title: {
            type: 'string',
            description: 'The title of the video.',
          },
          url: {
            required: true,
            type: 'string',
            description: 'The url of the page containing the video.',
          },
        },
      },
    },
    example: {
      autoPlay: true,
      currentPosition: 1,
      entries: [
        {
          title: 'Previous Video',
          url: '/url/of/previous/video',
        },
        {
          title: 'Current Video',
          url: '/url/of/current/video',
        },
        {
          title: 'Next Video',
          url: '/url/of/next/video',
        },
      ],
    },
  },
  videoObject: {
    type: 'object',
    description: 'Video metadata defined in the [VideoObject](http://schema.org/VideoObject) schema as JSON-LD, which is rendered by the player.',
    example: {
      '@context': 'http://schema.org/',
      '@type': 'VideoObject',
      name: 'Name of the video',
      duration: 'Duration of the video',
    },
  },
  liveDvr: {
    type: 'boolean',
    description: 'If given stream is a live stream that supports DVR, this flag must be enabled to make seeking possible.',
    default: false,
  },
  positionInUrlFragment: {
    type: 'boolean',
    description: 'If enabled, the initial video position is read from the URL fragment parameter `t` (e.g. `#t=25`).',
    default: false,
  },
  mobileMenu: {
    type: 'boolean',
    description: 'If disabled, the control bar icons are forced to be shown inline instead of being part of a separated mobile menu. This might cause the control bar content to overflow, if there are two much controls!',
    default: true,
  },
  noteApi: {
    type: 'string',
    description: 'Name of a global object that is used to communicate marker and note changes. See notes.md for more information.',
    default: '',
  },
  downloadUri: {
    type: 'string',
    description: 'Uri that can be used to download a file for the current video. If set, a download button will be shown which is has this uri set as target location. If you want to trigger a file download, make sure you have the content disposition on that url set correctly.',
    default: '',
  },
};
