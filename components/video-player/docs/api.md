## API

The video-player provides the following public interface for accessing and manipulating its state.

#### Properties
* `configuration` The configuration of the video-player. Configuration needs to be reloaded manually after edits (see below).
* `state` The current state of the video-player. Must not be modified directly, but via the methods below.

#### Methods
* `play()` Plays the video.
* `pause()` Pauses the video.
* `seek(seconds)` Seeks to the specified position.
* `setPlaybackRate(playbackRate)` Sets the playback rate.
* `setQuality(quality)` Sets the quality of the stream.
* `setVolume(volume)` Sets the volume of the playback (0.0-1.0).
* `mute()` Enables muting.
* `unmute()` Disables muting.
* `showCaptions(language)` Shows captions in the specified language.
* `hideCaptions()` Hides captions.
* `showInteractiveTranscript(language)` Shows interactive transcript in the specified language.
* `hideInteractiveTranscript()` Hides interactive transcript.
* `enterFullscreen()` Enters the fullscreen mode.
* `exitFullscreen()` Exits the fullscreen mode.
* `reloadConfiguration()` Reloads the configuration.
