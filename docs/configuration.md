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
   * **ratio** (string): The ratio of the video. This is mandatory when the videoAlignment is set to `height`. It should be in the format `x:y`.

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
* **fallbackStream** (object): Contains a fallback stream that the user can switch to, i.e. a single stream source.
   * **hls** (string): URL of the HLS video stream.
   * **hd** (string): URL of the HD video stream.
   * **sd** (string): URL of the SD video stream.
   * **poster** (string): URL of the poster image.
   * **ratio** (string): The ratio of the video. This is mandatory when the videoAlignment is set to `height`. It should be in the format `x:y`.
* **language** (string): Language used for localizing messages. (default: `"en"`)
* **initialState** (object): The initial state the player has when loaded.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
* **userPreferences** (object): Override parts of the default/initial/saved state. Meant to be provided by the server based on the current user.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
* **foregroundColor** (string): HEX code of the color for text and all other main content.
* **accentColor** (string): HEX code of the highlighting color.
* **fontColorOnAccentColor** (string): HEX code of the font color on the `accentColor`. Take care that the contrast ratio is high enough.
* **backgroundColor** (string): HEX code of the background for the `foregroundColor`.
* **secondaryBackgroundColor** (string): HEX code of another background color used for example for displaying the buffer. Take care that the `foregroundColor` has a high contrast to both background colors.
* **theme** (string):`<["dark-orange","dark-yellow","dark-blue","light-green"]>` Predefined color theme (can be adjusted by settings the colors explicitly). (default: `"dark-orange"`)
* **loadFontAwesome** (boolean): [FontAwesome](http://fontawesome.io) is used for the icons of the player. If your site already loads FontAwesome, this can be set to false to save bandwidth. (default: `true`)
* **videoPreload** (boolean): Turns on/off preloading of the videos when the page loads. (default: `true`)
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
   * **language** (string): Language of the captions. (*Required*)
   * **url** (string): URL of the captions WebVTT file. (*Required*)

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
* **playlist** (object): URLs of the previous and/or next video, if video is in a playlist.
   * **autoPlay** (boolean): If enabled, the user is redirected to the next video page after the video has ended. (default: `false`)
   * **previousVideo** (string): The URL of the previous video in the playlist.
   * **nextVideo** (string): The URL of the next video in the playlist.

   *Example*
```JSON
   {
     "autoPlay": true,
     "previousVideo": "/url/of/previous/video",
     "nextVideo": "/url/of/next/video"
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
* **videoAlignment** (string):`<["width","height"]>` If there is more than one video this property decides whether they should have the same height or the same width.
<!-- END-SECTION CONFIGURATION -->
