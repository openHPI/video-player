## Configuration

The player configuration is provided as JSON object:
```html
<video-player configuration='{}'></video-player>
```

### Parameters
<!-- DO NOT REMOVE BEGIN-SECTION/END-SECTION COMMENTS. -->
<!-- THEY ARE USED FOR GENERATING PARAMETERS DOCS FROM SCHEMA. -->
<!-- BEGIN-SECTION CONFIGURATION -->
* **streams** (array): List of URLs to the videos streams of different qualities and (optional) poster images. If there is only one quality, use `hd`. (*Required*)
   * **hls** (string): URL of the HLS video stream.
   * **hd** (string): URL of the HD video stream.
   * **sd** (string): URL of the SD video stream.
   * **poster** (string): URL of the poster image.
   * **muted** (boolean): Mutes the audio stream of the video. (default: `false`)

   *Example*
```JSON
   [
     {
       "sd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
       "hd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
       "poster": "https://peach.blender.org/wp-content/uploads/bbb-splash.png"
     }
   ]
```
* **quizValidationCallback** (string): Function that is called by the handler to validate user answers for the questions. It will be passed the question that is currently shown as first parameter. The second parameter depends on the question type. For text questions, this will be the text the user entered. For choice questions, the second parameter will be a list of all answer objects that are associated with this question and were selected by the user. The function should return an object that has two attributes, `isAnswerCorrect` and `correctAnswers`. The first, a boolean, indicates whether anything was wrong. The second, a list containing a subset of the answers stored with this question, is used to show the user where he made mistakes or to show him what possible answers could have been. (*Required*)
* **fallbackStream** (object): Contains a fallback stream that the user can switch to, i.e. a single stream source.
   * **hls** (string): URL of the HLS video stream.
   * **hd** (string): URL of the HD video stream.
   * **sd** (string): URL of the SD video stream.
   * **poster** (string): URL of the poster image.
   * **muted** (boolean): Mutes the audio stream of the video. (default: `false`)
* **language** (string): Language used for localizing messages. (default: `"en"`)
* **initialState** (object): The initial state the player has when loaded.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
   * **captionType** (string): (default: `"default"`)
   * **showCaptions** (boolean): Enables captions. Additionally, `captionLanguage` needs to be set. (default: `false`)
   * **showInteractiveTranscript** (boolean): Enables interactive transcript. Additionally, `captionLanguage` needs to be set. (default: `false`)
   * **resizerRatios** (array): The ratios of the resizers. Ratio is calculated by `leftVideo.width / rightVideo.width`. Per default, videos were aligned to have the same height.
* **userPreferences** (object): Override parts of the default/initial/saved state. Meant to be provided by the server based on the current user.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
   * **captionType** (string): (default: `"default"`)
   * **showCaptions** (boolean): Enables captions. Additionally, `captionLanguage` needs to be set. (default: `false`)
   * **showInteractiveTranscript** (boolean): Enables interactive transcript. Additionally, `captionLanguage` needs to be set. (default: `false`)
   * **resizerRatios** (array): The ratios of the resizers. Ratio is calculated by `leftVideo.width / rightVideo.width`. Per default, videos were aligned to have the same height.
* **foregroundColor** (string): HEX code of the color for text and all other main content.
* **accentColor** (string): HEX code of the highlighting color.
* **fontColorOnAccentColor** (string): HEX code of the font color on the `accentColor`. Take care that the contrast ratio is high enough.
* **backgroundColor** (string): HEX code of the background for the `foregroundColor`.
* **secondaryBackgroundColor** (string): HEX code of another background color used for example for displaying the buffer. Take care that the `foregroundColor` has a high contrast to both background colors.
* **theme** (string):`<["dark-orange","dark-yellow","dark-blue","light-green","dark-red","light-red"]>` Predefined color theme (can be adjusted by settings the colors explicitly). (default: `"dark-orange"`)
* **videoPreload** (boolean): Turns on/off preloading of the videos when the page loads. (default: `true`)
* **trimVideo** (object): Restricts the playback on a specific segment of the video.
   * **start** (number): The start position of the segment. (default: `0`)
   * **end** (number): The end position of the segment (default: `"duration of video"`)

   *Example*
```JSON
   {
     "start": 60,
     "end": 300
   }
```
* **chapters** (array): List of timestamps with chapter names.
   * **title** (string): Title of the chapter. (*Required*)
   * **startPosition** (number): Start position of the chapter in seconds. (*Required*)

   *Example*
```JSON
   [
     {
       "title": "Chapter 1",
       "startPosition": 0
     }
   ]
```
* **captions** (array): List of caption files for different languages.
   * **language** (string): Language code of the captions. (*Required*)
   * **url** (string): URL of the captions WebVTT file. (*Required*)
   * **name** (string): Name of the captions that is shown in the drop-down control.
   * **type** (string): Determines the type of captions. Currently, `default` and `auto-generated` are supported. (default: `"default"`)

   *Example*
```JSON
   [
     {
       "language": "en",
       "url": "/captions/en.vtt"
     }
   ]
```
* **slides** (array): List of presentation slides and corresponding start times in seconds to show below the progress.
   * **thumbnail** (string): URL of the slide thumbnail. (*Required*)
   * **startPosition** (number): Start position of the slide in seconds. (*Required*)

   *Example*
```JSON
   [
     {
       "thumbnail": "/image/of/slide.jpg",
       "startPosition": 0
     }
   ]
```
* **quizQuestions** (array): List of questions that are shown to the user during playback.
   * **id** (number): The id for this question. This is primarily intended to be stored for the validation callback. (*Required*)
   * **text** (string): The question text that is shown to the user. (*Required*)
   * **type** (string): The questions type. Should be `single-choice`, `multiple-choice` or `freetext`. (*Required*)
   * **position** (number): The point in the video where the question should be shown, in seconds. (*Required*)
   * **answers** (array): A list of possible answers for `single-choice` or `multiple-choice` questions.
       * **id** (number): The id for this answer. This is primarily intended to be stored for the validation callback. (*Required*)
       * **text** (string): The text of this answer. (*Required*)

   *Example*
```JSON
   [
     {
       "id": 1,
       "text": "What is HTML?",
       "type": "single-choice",
       "position": 3600,
       "answers": [
         {
           "id": 1,
           "text": "A standard internet protocol for information exchange."
         },
         {
           "id": 2,
           "text": "A markup language for creating web sites."
         },
         {
           "id": 3,
           "text": "A program used to download files to your computer"
         }
       ]
     }
   ]
```
* **relatedVideos** (array): List of related videos that are shown after the video has ended.
   * **title** (string): Title of the video. (*Required*)
   * **url** (string): URL of the video page. (*Required*)
   * **thumbnail** (string): URL of the video thumbnail. (*Required*)
   * **duration** (number): Duration of the video in seconds.

   *Example*
```JSON
   [
     {
       "title": "Title of related video.",
       "url": "/url/of/video-page",
       "thumbnail": "/image/of/thumbnail.jpg",
       "duration": 2259
     }
   ]
```
* **playlist** (object): The playlist, the video is part of.
   * **currentPosition** (number): The current position in the playlist. (*Required*)
   * **entries** (array): Videos of the playlist. (*Required*)
       * **url** (string): The url of the page containing the video. (*Required*)
       * **title** (string): The title of the video.
   * **autoPlay** (boolean): If enabled, the user is redirected to the next video page after the video has ended. (default: `false`)
   * **hideInList** (boolean): If enabled, the playlist entries are not shown in the playlist/chapter list. (default: `false`)

   *Example*
```JSON
   {
     "autoPlay": true,
     "currentPosition": 1,
     "entries": [
       {
         "title": "Previous Video",
         "url": "/url/of/previous/video"
       },
       {
         "title": "Current Video",
         "url": "/url/of/current/video"
       },
       {
         "title": "Next Video",
         "url": "/url/of/next/video"
       }
     ]
   }
```
* **videoObject** (object): Video metadata defined in the [VideoObject](http://schema.org/VideoObject) schema as JSON-LD, which is rendered by the player.

   *Example*
```JSON
   {
     "@context": "http://schema.org/",
     "@type": "VideoObject",
     "name": "Name of the video",
     "duration": "Duration of the video"
   }
```
* **liveDvr** (boolean): If given stream is a live stream that supports DVR, this flag must be enabled to make seeking possible. (default: `false`)
* **positionInUrlFragment** (boolean): If enabled, the initial video position is read from the URL fragment parameter `t` (e.g. `#t=25`). (default: `false`)
* **mobileMenu** (boolean): If disabled, the control bar icons are forced to be shown inline instead of being part of a separated mobile menu. This might cause the control bar content to overflow, if there are two much controls! (default: `true`)
<!-- END-SECTION CONFIGURATION -->
