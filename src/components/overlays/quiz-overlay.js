import { PLAY_STATES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/overlay--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class QuizOverlay extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="overlay--style-module">
        label {
          font-weight: normal;
        }

        a[disabled] {
          pointer-events: none;
          color: grey;
        }

        h3 {
          color: inherit;
          font-size: 24px;
        }

        h5 {
          color: inherit;
          font-size: 14px;
        }

        #container__quiz-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background-color: rgba(0, 0, 0, 0.85);
          color: white;
        }

        .container__centered-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;
        }

        .container__answer-box {
          display: flex;
          align-items: left;
          justify-content: left;
          flex-direction: column;
        }

        .button__quiz {
          margin-top: 10px;
          text-decoration: none;
          color: inherit;
          font-weight: bold;
        }

        .quiz__answer {
          color: inherit;
        }

        .quiz__highlighting-correct {
          color: lime;
        }

        .quiz__highlighting-wrong {
          color: red;
        }

        .quiz__highlighting-strikethrough label {
          text-decoration: line-through;
        }

        #input__freetext-answer {
          background: transparent;
          border: none;
          border-bottom: 1px dashed;
          text-align: center;
          width: 300px;
          color: inherit;
        }

        input[type='checkbox'], input[type='radio'], label {
          cursor: pointer;
        }

        input:focus {
          outline: none;
        }
      </style>

      <div id="container__quiz-overlay" class="overlay" style$="visibility: [[ifThenElse(_isVisible, 'visible', 'hidden')]];">
        <h3 id="text__quiz-question">[[_currentQuestion.text]]</h3>

        <template is="dom-if" if="[[_isTextQuestion(_currentQuestion)]]">
          <div class$="quiz__answer [[_getValidationClass(_currentQuestion, _correctAnswers, _isAnswerCorrect, null)]]">
            <input id="input__freetext-answer" type="text" on-input="_textAnswerChanged" placeholder$="[[localize('quiz--enter-answer-here')]]" disabled$="[[_correctAnswersShown]]"></input>
          </div>

          <template is="dom-if" if="[[_correctAnswersShown]]">
            <h5>[[localize('quiz--correct-answers')]]</h5>
            <div class="container__answer-box">
              <template is="dom-repeat" items="[[_correctAnswers]]">
                <span class="">[[item.text]]</span>
              </template>
            </div>
          </template>
        </template>

        <template is="dom-if" if="[[!_isTextQuestion(_currentQuestion)]]">
          <div class="container__answer-box">
            <template is="dom-repeat" items="[[_currentQuestion.answers]]">
              <div class$="quiz__answer [[_getValidationClass(_currentQuestion, _correctAnswers, _isAnswerCorrect, item)]]">
                <div class="form-check">
                  <input name="answer" class="select__quiz-answer form-check-input" value$="[[item.id]]" id="select__quiz-answer-[[item.id]]" type$="[[ifThenElse(_isSingleChoiceQuestion, 'radio', 'checkbox')]]" disabled$="[[_correctAnswersShown]]" on-change="_selectionChanged"></input>
                  <label class="form-check-label" for$="select__quiz-answer-[[item.id]]">[[item.text]]</label>
                </div>
              </div>
            </template>
          </div>
        </template>

        <div class="container__centered-row">
          <template is="dom-if" if="[[_correctAnswersShown]]">
            <a class="button button__quiz" on-click="_handleSkipClick">[[localize('general--continue')]]</a>
          </template>

          <template is="dom-if" if="[[!_correctAnswersShown]]">
            <a class="button button__quiz" on-click="_handleSkipClick">[[localize('quiz--skip-question')]]</a>
            <a class="button button__quiz" on-click="_handleSubmitClick" disabled$="[[_disableSubmitButton]]">[[localize('quiz--submit')]]</a>
          </template>
        </div>
      </div>
    `;
  }

  static get is() { return 'quiz-overlay'; }

  static get properties() {
    return {
      state: Object,
      questions: Array,
      callback: Object,
      /** Questions that should be shown in the current playback second (could be more than one) */
      _currentQuestions: {
        type: Array,
        value: [],
      },
      /** The first question that has to be shown in the current second. Used for displaying the overlay.*/
      _currentQuestion: {
        type: Object,
        computed: '_getCurrentQuestion(_currentQuestions.splices)',
      },
      /** The last playback position second that questions where added to currentQuestions for */
      _lastProcessedPosition: {
        type: Number,
        value: 0,
      },
      _correctAnswersShown: {
        type: Boolean,
        computed: '_getCorrectAnswersShown(_correctAnswers.splices)',
      },
      _correctAnswers: {
        type: Array,
        value: [],
      },
      _isAnswerCorrect: Boolean,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _isVisible: {
        type: Boolean,
        computed: '_getIsVisible(_currentQuestion)',
      },
      _disableSubmitButton: {
        type: Boolean,
        value: true,
      },
      _isSingleChoiceQuestion: {
        type: Boolean,
        computed: '_getIsSingleChoiceQuestion(_currentQuestion)',
      },
    };
  }

  static get observers() {
    return [
      '_playStateChanged(state.playState)',
      '_positionChanged(state.position)',
      '_setVisibilityInState(_isVisible)',
    ];
  }

  _setVisibilityInState(visible) {
    if(this._stateManager) {
      this._stateManager.setQuizOverlayVisibility(visible);
    }
  }

  _isTextQuestion(question) {
    return question !== null && question.type === 'freetext';
  }

  _getIsSingleChoiceQuestion(question) {
    return question !== null && question.type === 'single-choice';
  }

  _getIsVisible(currentQuestion) {
    return currentQuestion !== null;
  }

  _playStateChanged(playState) {
    if(playState === PLAY_STATES.PAUSED || playState === PLAY_STATES.WAITING)
      return;

    this._currentQuestions = [];
  }

  _positionChanged(position) {
    let flooredPosition = Math.floor(position);

    if(!this.state.isQuizOverlayEnabled) {
      this._lastProcessedPosition = flooredPosition;
      return;
    }

    if(flooredPosition <= this._lastProcessedPosition) {
      return;
    }

    this._addCurrentQuestionsForPosition(flooredPosition, this._lastProcessedPosition);
    this._lastProcessedPosition = flooredPosition;

    if(this._isVisible && this._stateManager) {
      this._stateManager.pause();
    }
  }

  _textAnswerChanged() {
    this._disableSubmitButton = this._getCurrentAnswerText() === '';
  }

  _selectionChanged() {
    let selected = this._getSelectedAnswers();

    this._disableSubmitButton = selected.length === 0;
  }

  _getCorrectAnswersShown() {
    return this._correctAnswers.length > 0;
  }

  _getCurrentQuestion() {
    if(this._currentQuestions.length > 0) {
      let inputs = this.shadowRoot.querySelectorAll('.select__quiz-answer');
      for(let input of inputs) {
        input.checked = false;
      }

      return this._currentQuestions[0];
    } else {
      return null;
    }
  }

  _addCurrentQuestionsForPosition(position, lastPosition) {
    for(let question of this.questions) {
      if(question.position <= position && question.position > lastPosition) {
        this.push('_currentQuestions', question);
      }
    }
  }

  _dismissCurrentQuestion() {
    this._correctAnswers = [];
    this.shift('_currentQuestions');
    this._disableSubmitButton = true;

    if(this._currentQuestion === null) {
      this._stateManager.play();
    }
  }

  _getValidationClass(currentQuestion, correctAnswers, isAnswerCorrect, answer) {
    let correct = false;
    let selected = false;

    if(!this._correctAnswersShown)
      return '';

    if(currentQuestion.type === 'freetext') {
      correct = isAnswerCorrect;
    } else {
      selected = this.shadowRoot.querySelector('#select__quiz-answer-' + answer.id).checked;

      let shouldBeSelected = correctAnswers.some(correctAnswer => correctAnswer.id === answer.id);

      if(selected && shouldBeSelected || !selected && !shouldBeSelected) {
        correct = true;
      }
    }

    if(correct)
      return 'quiz__highlighting-correct';

    if(selected)
      return 'quiz__highlighting-wrong quiz__highlighting-strikethrough';

    return 'quiz__highlighting-wrong';
  }

  _submitCurrentQuestion() {
    let callback = window[this.callback];

    if(this._isTextQuestion(this._currentQuestion)) {
      let retval = callback(this._currentQuestion, this._getCurrentAnswerText());

      this._correctAnswers = retval.correctAnswers;
      this._isAnswerCorrect = retval.isAnswerCorrect;
    } else { // Single or multiple choice question
      let retval = callback(this._currentQuestion, this._getSelectedAnswers());

      this._correctAnswers = retval.correctAnswers;
      this._isAnswerCorrect = retval.isAnswerCorrect;
    }
  }

  _getCurrentAnswerText() {
    return this.shadowRoot.querySelector('#input__freetext-answer').value;
  }

  _getSelectedAnswers() {
    let ids = [];

    let inputs = this.shadowRoot.querySelectorAll('.select__quiz-answer');
    for(let input of inputs) {
      if(input.checked) {
        let answerid = input.value;
        ids.push(parseInt(answerid));
      }
    }

    return this._currentQuestion.answers.filter( (answer) => ids.includes(answer.id) );
  }

  _handleSkipClick(e) {
    this._dismissCurrentQuestion();
    e.preventDefault();
  }

  _handleSubmitClick(e) {
    this._submitCurrentQuestion();
    e.preventDefault();
  }
}

window.customElements.define(QuizOverlay.is, QuizOverlay);
