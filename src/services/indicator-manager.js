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
  constructor(id, position, text) {
    this.id = id;
    this.position = position;
    this.text = text;
  }

}

/**
 * Manager for the indicators in the video progress bar used by markers and notes.
 */
export class IndicatorManager{
  /**
   * Initializes a new IndicatorManager instance.
   * @param {VideoPlayer} videoPlayer  The VideoPlayer, whose indicators should be controlled.
   * @param {string} indicatorsPath  The path of the indicator property on the VideoPlayer.
   * @return {IndicatorManager}  The new IndicatorManager instance.
   */
  constructor(videoPlayer, indicatorsPath, configurationPath) {
    this.videoPlayer = videoPlayer;
    this.indicatorsPath = indicatorsPath;
    this.configurationPath = configurationPath;
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
   * Gets the noteApi object from the window with the name given in the configuration
   * @return {Object} The api object.
   */
  get api() {
    return window[this.configuration.noteApi];
  }

  /**
   * Adds an indicator, which will then be shown in the video progress bar.
   * @param {Indicator} indicator The indicator to be added.
   * @returns {void}
   */
  addIndicator(position, text) {
    var id = this.api.add(position, text);
    this.videoPlayer.push(this.indicatorsPath, Indicator(id, position, text));
  }

  /**
   * Removes an indicator by reference
   * @param {Indicator} indicator The indicator to be removed.
   * @returns {void}
   */
  removeIndicator(indicator) {
    var index = this.indicators.indexOf(indicator);
    if(index > -1) {
      this.videoPlayer.splice(this.indicatorsPath, 1);
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
  * Loads indicators from the api
  * @returns {void}
  */
  loadIndicators() {
    var indicators = this.api.load();
    for(let indicator of indicators) {
      this.videoPlayer.push(this.indicatorsPath, Indicator(id, position, text));
    }
  }
}
