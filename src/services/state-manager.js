import {PLAY_STATES, CAPTION_TYPES} from '../constants.js';

export class StateManager {
  /**
   * Initializes a new StateManager instance.
   * @param {VideoPlayer} videoPlayer  The VideoPlayer, whose state should be controlled.
   * @param {string} statePath  The path of the state property on the VideoPlayer.
   * @param {string} configurationPath  The path of the configuration property on the VideoPlayer.
   * @return {StateManager}  The new StateManager instance.
   */
  constructor(videoPlayer, statePath, configurationPath) {
    this.videoPlayer = videoPlayer;
    this.statePath = statePath;
    this.configurationPath = configurationPath;
    this.stickyTrimEnd = true;
  }

  /**
   * Gets the state object of the attatched VideoPlayer.
   * @return {Object} The state object.
   */
  get state() {
    return this.videoPlayer[this.statePath];
  }

  /**
   * Gets the configuration object of the attatched VideoPlayer.
   * @return {Object} The configuration object.
   */
  get configuration() {
    return this.videoPlayer[this.configurationPath];
  }

  /**
   * Sets a single property of the state.
   * @param {string} path  The state path of the property that shold be set.
   * @param {any} value The new value of the property.
   * @returns {void}
   */
  setState(path, value) {
    this.videoPlayer.set(this.statePath + '.' + path, value);
  }


  /**
   * Sets the play state to 'playing'.
   * @returns {void}
   */
  play() {
    if(this.state.playState === PLAY_STATES.FINISHED) {
      this.setPosition(this.state.trimStart);
    }
    this.setPlayState(PLAY_STATES.PLAYING);
  }

  /**
   * Sets the play state to 'paused'.
   * @returns {void}
   */
  pause() {
    this.setPlayState(PLAY_STATES.PAUSED);
  }

  /**
   * Sets the play state to specified value.
   * @param {string} playState The new play state.
   * @param {boolean} updatePosition If true, current position is updated depending on the new play state.
   * @returns {void}
   */
  setPlayState(playState, updatePosition = true) {
    if(!Object.values(PLAY_STATES).includes(playState)) {
      throw new RangeError(`Value must be in [${Object.values(PLAY_STATES).toString()}].`);
    }

    if(updatePosition) {
      // Enable live sync when playing if its the first time playing or DVR is disabled
      if(this.state.live && playState === PLAY_STATES.PLAYING && (!this.state.alreadyPlayed || !this.videoPlayer.configuration.liveDvr)) {
        this.setLiveSync(true);
      }

      // Skip to end position explicitly
      if(playState === PLAY_STATES.FINISHED && this.state.position !== this.state.trimEnd) {
        this.setPosition(this.state.trimEnd);
      }
    }

    this.setState('playState', playState);

    // Disable live sync when pausing the playback
    if(this.state.live && this.state.playState === PLAY_STATES.PAUSED) {
      this.setLiveSync(false);
    }
  }

  /**
   * Toggles the current play state.
   * @returns {void}
   */
  togglePlayPause() {
    switch(this.state.playState) {
      case PLAY_STATES.PAUSED:
      case PLAY_STATES.FINISHED:
        this.play();
        break;

      case PLAY_STATES.PLAYING:
        this.pause();
        break;
    }
  }

  /**
   * Sets alreadyPlayed flag indicating whether the video was initially played by the user.
   * @param {boolean} value The new flag value.
   * @returns {void}
   */
  setAlreadyPlayed(value = true) {
    this.setState('alreadyPlayed', value);
  }


  /**
   * Sets the current position in the video.
   * @param {number} seconds The current position in seconds.
   * @param {boolean} userSeek Indicates whether the seek was performed by the user.
   * @returns {void}
   */
  setPosition(seconds, userSeek = true) {
    if(seconds < this.state.trimStart || this.state.trimEnd && seconds > this.state.trimEnd) {
      throw new RangeError('Value must be between 0 and duration of the video and within the trimmed range.');
    }

    this.setState('position', seconds);

    // Enable live sync when user seeked to last second of a live stream
    if(this.state.live && userSeek) {
      let liveSync = this.state.livePosition - this.state.position < 1;
      this.setLiveSync(liveSync);
    }

    if(this.state.position === this.state.trimEnd && this.state.trimEnd > 0) {
      this.setPlayState(PLAY_STATES.FINISHED);
    } else if(this.state.playState === PLAY_STATES.FINISHED) {
      this.setPlayState(PLAY_STATES.PAUSED);
    }
  }

  /**
   * Skips a number of seconds from the current position.
   * @param  {number} seconds The number of seconds to skip.
   * @returns {void}
   */
  skipSeconds(seconds) {
    let position = Math.max(this.state.trimStart, Math.min(this.state.position + seconds, this.state.trimEnd));
    this.setPosition(position);
  }

  /**
   * Sets the current buffer position of the videos.
   * @param {number} seconds The current buffer position in seconds.
   * @returns {void}
   */
  setBufferPosition(seconds) {
    if(seconds < 0 || this.state.duration && seconds > this.state.duration) {
      throw new RangeError('Value must be between 0 and duration of the video.');
    }

    this.setState('bufferPosition', seconds);
  }

  /**
   * Sets the duration of the video.
   * @param {number} seconds The duration of the current video in seconds.
   * @returns {void}
   */
  setDuration(seconds) {
    if(seconds < 0) {
      throw new RangeError('Value must be positive.');
    }

    // In Safari (native HLS support), the duration of a stream is Infinity,
    // if it is a live stream.
    if(seconds === Infinity) {
      this.setLive(true);
    } else if(this.state.duration === Infinity) {
      this.setLive(false);
    }

    this.setState('duration', seconds);
    if(!this.state.trimEnd || this.stickyTrimEnd) {
      this.trimEnd(seconds);
      this.stickyTrimEnd = true;
    }
  }

  /**
   * Sets the trimmed start position of the video.
   * @param  {number} seconds The position in seconds.
   * @return {void}
   */
  trimStart(seconds) {
    if(seconds < 0 || this.state.duration && seconds > this.state.duration) {
      throw new RangeError('Value must be between 0 and duration of the video.');
    }

    this.setState('trimStart', seconds || 0);
    if(seconds && typeof this.state.position === 'undefined' || this.state.position < seconds) {
      this.setPosition(seconds, false);
    }
  }

  /**
   * Sets the trimmed end position of the video.
   * @param  {number} seconds The position in seconds.
   * @return {void}
   */
  trimEnd(seconds) {
    if(seconds <= 0 || this.state.duration && seconds > this.state.duration) {
      throw new RangeError('Value must be between 0 and duration of the video.');
    }

    if(seconds) {
      this.setState('trimEnd', seconds);
      this.stickyTrimEnd = false;
    } else if(this.state.duration) {
      this.setState('trimEnd', this.state.duration);
      this.stickyTrimEnd = true;
    }
    if(seconds && this.state.position > seconds) {
      this.setPosition(seconds, false);
    }
  }


  /**
   * Sets the playback rate of the video.
   * @param {number} playbackRate The new playback rate.
   * @returns {void}
   */
  setPlaybackRate(playbackRate) {
    if(!this.state.live) {
      this.setState('playbackRate', playbackRate);
    }
  }

  /**
   * Toggles the muting.
   * @returns {void}
   */
  toggleMute() {
    if(this.state.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  /**
   * Enables muting.
   * @returns {void}
   */
  mute() {
    this.setState('muted', true);
  }

  /**
   * Disables muting.
   * @returns {void}
   */
  unmute() {
    this.setState('muted', false);
  }

  /**
   * Sets the volume.
   * @param {number} volume The new volume (0.0-1.0).
   * @returns {void}
   */
  setVolume(volume) {
    if(volume < 0 || volume > 1) {
      throw new RangeError('Value must be between 0 and 1.');
    }

    // Always (un)mute first to avoid potential inconsistent states between
    // e.g. mute button icon and sound-control-bar
    if(volume === 0) {
      this.mute();
    } else {
      this.unmute();
    }
    this.setState('volume', volume);
  }


  /**
   * Sets the list of qualities, which are available for all streams.
   * @param {Array} qualities Available
   * @returns {void}
   */
  setAvailableQualities(qualities) {
    this.setState('availableQualities', qualities);
  }
  /**
   * Sets the quality.
   * @param {string} quality The new quality.
   * @returns {void}
   */
  setQuality(quality) {
    if(!this.state.availableQualities.includes(quality)) {
      throw new Error('No stream in specified quality available.');
    }

    this.setState('quality', quality);
  }


  /**
   * Toggles the fullscreen mode.
   * @returns {void}
   */
  toggleFullscreen() {
    this.setFullscreen(!this.state.fullscreen);
  }

  /**
   * Sets the fullscreen mode explicitly.
   * @param {boolean} fullscreen Boolean determining whether the full screen mode is active or not.
   * @returns {void}
   */
  setFullscreen(fullscreen) {
    this.setState('fullscreen', fullscreen);
  }

  /**
   * Toggles the visibility of the chapter list.
   * @returns {void}
   */
  toggleIsChapterListShown() {
    this.setState('isChapterListShown', !this.state.isChapterListShown);
  }

  /**
   * Toggles whether the quizzes are enabled.
   * @returns {void}
   */
  toggleIsQuizOverlayEnabled() {
    this.setState('isQuizOverlayEnabled', !this.state.isQuizOverlayEnabled);
  }

  /**
   * Sets whether the quiz overlay is currently shown to the user
   * @param {boolean} visibility Boolean determining whether the quiz overlay is shown
   * @returns {void}
   */
  setQuizOverlayVisibility(visibility) {
    this.setState('isQuizOverlayVisible', visibility);
  }

  /**
   * Sets the visibility of the interactive transcript.
   * @param {Boolean} isVisible Boolean determining whether the interactive transcript is shown.
   * @returns {void}
   */
  setInteractiveTranscriptVisibility(isVisible) {
    this.setState('showInteractiveTranscript', isVisible);
  }

  /**
   * Sets the visibility of the captions.
   * @param {Boolean} isVisible Boolean determining whether the captions are shown.
   * @returns {void}
   */
  setCaptionsVisibility(isVisible) {
    this.setState('showCaptions', isVisible);
  }


  /**
   * Sets the new caption selection or turns captions off by setting the
   * language to 'off'.
   * @param {string} language The language to be set.
   * @param {string} type The type to be set.
   * @returns {void}
   */
  setSelectedCaptions(language, type = null) {
    if(!this.configuration.captions) {
      throw new Error('No captions available.');
    }

    // Get captions that match given language and type (if provided)
    let matchingCaptions = this.configuration.captions.filter(item => {
      let match = item.language === language;
      if(type) {
        match = match && item.type === type;
      }
      return match;
    });
    let captions = matchingCaptions.filter(item => item.type === CAPTION_TYPES.DEFAULT)[0] || matchingCaptions[0];
    if(!captions) {
      throw new Error('Specified captions are not available.');
    }

    this.setState('captionLanguage', captions.language);
    this.setState('captionType', captions.type);
  }

  /**
   * Sets the captions for the selected language.
   * @param {Array} captions The active captions.
   * @returns {void}
   */
  setActiveCaptions(captions) {
    this.setState('activeCaptions', captions);
  }

  /**
   * Sets whether the mobile settings menu is open or not
   * @param {Boolean} menuOpen Whether the menu is open
   * @returns {void}
   */
  setMobileSettingsMenuOpen(menuOpen) {
    this.setState('mobileSettingsMenuOpen', menuOpen);
  }

  /**
   * Toggles the flag that determines whether the fallback stream is active.
   * @return {void}
   */
  toggleFallbackStream() {
    if (this.state.fallbackStreamActive) {
      this.setFallbackStreamActive(false);
    } else {
      this.setFallbackStreamActive(true);
    }
  }

  /**
   * Sets the flag that determines whether the fallback stream is active.
   * @param {Boolean} fallbackStreamActive New value.
   * @return {void}
   */
  setFallbackStreamActive(fallbackStreamActive) {
    this.setState('fallbackStreamActive', fallbackStreamActive);
  }


  /**
   * Sets the live indicator, which determines if streams are live or not.
   * @param  {Boolean} live The live indicator.
   * @returns {void}
   */
  setLive(live) {
    // Set playback rate to 1 when live stream is played
    if(live) {
      this.setPlaybackRate(1);
    }

    this.setState('live', live);
  }

  /**
   * Sets the live sync indicator, which determines whether playback is at the live edge of the stream.
   * @param {boolean} liveSync The live sync indicator.
   * @returns {void}
   */
  setLiveSync(liveSync) {
    if(liveSync && this.state.livePosition - this.state.position > this.state.liveFragmentDuration) {
      this.setPosition(this.state.livePosition);
    }

    this.setState('liveSync', liveSync);
  }

  /**
   * Sets the position of the live sync point.
   * @param {number} seconds The live sync point in seconds.
   * @returns {void}
   */
  setLivePosition(seconds) {
    if(seconds < 0 || this.state.duration && seconds > this.state.duration) {
      throw new RangeError('Value must be between 0 and duration of the stream.');
    }
    this.setState('livePosition', seconds);
  }

  /**
   * Sets the position of the first live-stream fragment that can be played.
   * @param {number} seconds The live start position in seconds.
   * @returns {void}
   */
  setLiveStartPosition(seconds) {
    if(seconds < 0 || this.state.duration && seconds > this.state.duration) {
      throw new RangeError('Value must be between 0 and duration of the stream.');
    }
    this.setState('liveStartPosition', seconds);
  }

  /**
   * Sets the duration of a live-stream fragment.
   * @param {number} seconds The duration of a fragment in seconds.
   * @returns {void}
   */
  setLiveFragmentDuration(seconds) {
    if(seconds < 0) {
      throw new RangeError('Value must be greater or equal 0.');
    }
    this.setState('liveFragmentDuration', seconds);
  }


  /**
   * Sets the ratio of a certain resizer.
   * @param {Number} resizerIndex The index of the resizer.
   * @param {Number} ratio        Thew new ratio.
   * @returns {void}
   */
  setResizerRatio(resizerIndex, ratio) {
    if(resizerIndex < 0 || resizerIndex > this.state.resizerRatios.length) {
      throw new RangeError('resizerIndex must be between 0 and the number of resizers.');
    }
    this.setState('resizerRatios.' + resizerIndex, ratio);
  }

  /**
   * Sets the ratio of all resizer.
   * @param {Array} ratios Thew new ratios.
   * @returns {void}
   */
  setResizerRatios(ratios) {
    this.setState('resizerRatios', ratios);
  }
}
