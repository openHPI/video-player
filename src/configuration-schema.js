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
    options: [0.7, 1.0, 1.3, 1.5, 1.8, 2.0],
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
};

const configurationSchema = {
  streams: {
    required: true,
    type: 'array',
    description: 'List of URLs to the videos streams of different qualities and (optional) poster images. If there is only one quality, use `hd`.',
    schema: {
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
        description: 'URL of the poster image',
      },
    },
    example: [
      {
        sd: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        hd: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        poster: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
      },
    ],
  },
  initialState: {
    type: 'object',
    description: 'The initial state the player has when loaded.',
    schema: stateSchema,
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
    options: ['dark-orange', 'dark-yellow', 'dark-blue', 'light-green'],
    default: 'dark-orange',
    description: 'Predefined color theme (can be adjusted by settings the colors explicitly)',
  },
  videoPreload: {
    type: 'boolean',
    default: true,
    description: '[FontAwesome](http://fontawesome.io) is used for the icons of the player. If your site already loads FontAwesome, this can be set to false to save bandwidth.',
  },
  loadFontAwesome: {
    type: 'boolean',
    default: true,
    description: 'Turns on/off preloading of the videos when the page loads.',
  },
  chapters: {
    type: 'array',
    description: 'List of timestamps with chapter names.',
    schema: {
      text: {
        required: true,
        type: 'string',
        description: 'Title of the chapter',
      },
      seconds: {
        required: true,
        type: 'number',
        description: 'Start position of the chapter in seconds',
      },
    },
    example: [
      {
        text: 'Chapter 1',
        seconds: 0,
      },
    ],
  },
  captions: {
    type: 'array',
    description: 'List of caption files for different languages.',
    schema: {
      language: {
        required: true,
        type: 'string',
        description: 'Language of the captions',
      },
      source: {
        required: true,
        type: 'string',
        description: 'URL of the captions WebVTT file',
      },
    },
    example: [
      {
        language: 'en',
        source: '/captions/en.vtt',
      },
    ],
  },
  slides: {
    type: 'array',
    description: 'List of presentation slides and corresponding start times in seconds to show below the progress.',
    schema: {
      imageUrl: {
        required: true,
        type: 'string',
        description: 'URL of the slide thumbnail',
      },
      startPosition: {
        required: true,
        type: 'number',
        description: 'Start position of the slide in seconds',
      },
    },
    example: [
      {
        imageUrl: '/image/of/slide.jpg',
        startPosition: 0,
      },
    ],
  },
  relatedVideos: {
    type: 'array',
    description: 'List of related videos that are shown after the video has ended.',
    schema: {
      title: {
        required: true,
        type: 'string',
        description: 'Title of the video',
      },
      imageUrl: {
        required: true,
        type: 'string',
        description: 'URL of the video thumbnail',
      },
      url: {
        required: true,
        type: 'string',
        description: 'URL of the video page',
      },
      length: {
        type: 'number',
        description: 'Duration of the video in seconds',
      },
    },
    example: [
      {
        title: 'Title of related video',
        imageUrl: '/image/of/thumbnail.jpg',
        url: '/url/of/video-page',
      },
    ],
  },
  playlist: {
    type: 'object',
    description: 'URLs of the previous and/or next video, if video is in a playlist.',
    schema: {
      autoPlay: {
        type: 'boolean',
        description: 'If enabled, the user is redirected to the next video page after the video has ended.',
        default: false,
      },
      previousVideo : {
        type: 'string',
        description: 'The URL of the previous video in the playlist',
      },
      nextVideo : {
        type: 'string',
        description: 'The URL of the next video in the playlist',
      },
    },
    example: {
      autoPlay: true,
      previousVideo: '/url/of/previous/video',
      nextVideo: '/url/of/next/video',
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
};

// Export schema as IMD module in browser context and as object in Node context
if (typeof window === 'undefined') {
  exports.schema = configurationSchema;
} else {
  define('configuration-schema', () => configurationSchema);
}
