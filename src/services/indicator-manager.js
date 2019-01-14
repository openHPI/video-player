/**
 * Class that represents an indicator
 */

export class Indicator{
  /*
   * Initializes a new Indicator instance.
   * @param {integer} id A unique id of this indicator.
   * @param {integer} path The position of the indicator, in seconds.
   * @param {string} text The text of the new indicator that will be shown on hover. If empty, the tooltip will contain a delete button.
   * @return {Indicator} The new indicator instance
   */
  constructor(id, position, text, initialFocus = false) {
    this.id = id;
    this.position = position;
    this.text = text;
    this.initialFocus = initialFocus;
  }
}

/**
 * Manager for the indicators in the video progress bar used by notes.
 */
export class IndicatorManager{
  /**
   * Initializes a new IndicatorManager instance.
   * @param {VideoPlayer} videoPlayer  The VideoPlayer, whose indicators should be controlled.
   * @param {string} indicatorsPath  The path of the indicator property on the VideoPlayer.
   * @param {string} configurationPath  The path of the configuration property on the VideoPlayer.
   * @return {IndicatorManager}  The new IndicatorManager instance.
   */
  constructor(videoPlayer, indicatorsPath, configurationPath) {
    this.videoPlayer = videoPlayer;
    this.indicatorsPath = indicatorsPath;
    this.configurationPath = configurationPath;

    if(this.api) {
      this.loadIndicators();
    }
  }

  /**
   * Gets the indicators list of the attatched VideoPlayer.
   * @return {Object} The indicators list.
   */
  get indicators() {
    return this.videoPlayer[this.indicatorsPath];
  }

  /**
   * Gets the configuration object of the attatched VideoPlayer.
   * @return {Object} The configuration object.
   */
  get configuration() {
    return this.videoPlayer[this.configurationPath];
  }

  /**
   * Gets the noteApi object from the window with the name given in the configuration.
   * @return {Object} The api object.
   */
  get api() {
    return window[this.configuration.noteApi];
  }

  /**
   * Adds an indicator, which will then be shown in the video progress bar. Works asynchronously.
   * @param {number} position The position where the new indicator should be added.
   * @param {string} text The text of the new indicator. May be empty.
   * @param {boolean} setFocus Boolean value indicating whether the new indicator should receive input focus on creation.
   * @return {void}
   */
  addIndicator(position, text, setFocus = true) {
    let callback = function(newIndicatorId) {
      let indicator = new Indicator(newIndicatorId, position, text, setFocus);
      this.videoPlayer.push(this.indicatorsPath, indicator);
    }.bind(this);

    this.api.add(position, text, callback);
  }

  /**
   * Removes an indicator by reference.
   * @param {Indicator} indicator The indicator to be removed.
   * @returns {void}
   */
  removeIndicator(indicator) {
    let index = this.indicators.indexOf(indicator);
    if(index > -1) {
      this.videoPlayer.splice(this.indicatorsPath, index, 1);
    }

    this.api.remove(indicator.id);
  }

  /**
   * Changes an indicator's text. May not be used to change from or to null text.
   * @param {Indicator} indicator The indicator to be changed
   * @param {string} text The new text
   * @returns {void}
   */
  setIndicatorText(indicator, text) {
    this.api.setText(indicator.id, text);
    indicator.text = text;
  }

  /**
   * Loads indicators from the api. Works asynchronously.
   * @returns {void}
   */
  loadIndicators() {
    this.videoPlayer.splice(this.indicatorsPath, 0);

    let callback = function(indicators) {
      for(let indicator of indicators) {
        this.videoPlayer.push(this.indicatorsPath, new Indicator(indicator.id, indicator.position, indicator.text));
      }
    }.bind(this);

    this.api.load(callback);
  }

  /**
   * External interface. Note api was changed.
   * @returns {void}
   */
  noteApiChanged() {
    // Reload indicators from new api.
    if(this.api) {
      this.loadIndicators();
    }
  }
}
