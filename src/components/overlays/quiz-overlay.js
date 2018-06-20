import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/overlay--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class QuizOverlay extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(Polymer.Element))) {
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

        .button__quiz {
          margin-top: 10px;
          text-decoration: none;
          color: white;
          font-weight: bold;
        }

        .quiz__highlighting-correct {
          color: lime;
        }

        .quiz__highlighting-wrong {
          color: red;
        }

        .quiz__highlighting-strikethrough label {
          text-decoration: line-through
        }
      </style>

      <div id="container__quiz-overlay" class="overlay" style$="visibility: [[ifThenElse(_isVisible, 'visible', 'hidden')]];">
        <h3 id="text__quiz-question">[[_currentQuestion.text]]</h3>

        <template is="dom-if" if="[[_isTextQuestion(_currentQuestion)]]">
          <div class$="[[_getValidationClass(_currentQuestion, _correctAnswersShown, _correctAnswers, _isAnswerCorrect, null)]]">
            <input id="input__freetext-answer" type="text"></input>
          </div>

          <template is="dom-if" if="[[_correctAnswersShown]]">
            <h5>[[localize('quiz--correct-answers')]]</h5>
            <template is="dom-repeat" items="[[_correctAnswers]]">
                <span class="">[[item.text]]</span>
            </template>
          </template>
        </template>

        <template is="dom-repeat" items="[[_currentQuestion.answers]]">
          <div class$="[[_getValidationClass(_currentQuestion, _correctAnswersShown, _correctAnswers, _isAnswerCorrect, item)]]">
            <div class="form-check">
              <input name="answer" class="select__quiz-answer form-check-input" value$="[[item.id]]" id="select__quiz-answer-[[item.id]]" type$="[[ifThenElse(_isSingleChoiceQuestion, 'radio', 'checkbox')]]" disabled$="[[_correctAnswersShown]]" on-change="_selectionChanged"></input>
              <label class="form-check-label" for$="select__quiz-answer-[[item.id]]">[[item.text]]</label>
            </div>
          </div>
        </template>

        <div class="container__centered-row">
          <template is="dom-if" if="[[_correctAnswersShown]]">
            <a class="button button__quiz" on-click="_handleCancelClick" href="#">[[localize('general--continue')]]</a>
          </template>

          <template is="dom-if" if="[[!_correctAnswersShown]]">
            <a class="button button__quiz" on-click="_handleCancelClick" href="#">[[localize('general--cancel')]]</a>
            <a class="button button__quiz" on-click="_handleSubmitClick" href="#" disabled$="[[_disableSubmitButton]]">[[localize('quiz--submit')]]</a>
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

      _currentQuestions: { // Questions that should be shown in the current playback second (could be more than one)
        type: Array,
        value: [],
      },

      _currentQuestion: { // The first question that has to be shown in the current second. Used for displaying the overlay. Should probably be computed, that didn't work though
        type: Object,
        value: null,
      },

      _lastProcessedPosition: { // The last playback position second that questions where added to currentQuestions for
        type: Number,
        value: 0,
      },

      _correctAnswersShown: { // Could probably be computed from _correctAnswers too
        type: Boolean,
        value: false,
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
    ];
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
    this._setCurrentQuestion();
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

    this._addCurrentQuestionsForPosition(flooredPosition);
    this._lastProcessedPosition = flooredPosition;

    if(this._isVisible) {
      this._stateManager.pause();
    }
  }

  _selectionChanged() {
    let selected = this._getSelectedAnswers();

    if(selected.length === 0) {
      this._disableSubmitButton = true;
    } else {
      this._disableSubmitButton = false;
    }
  }

  _setCurrentQuestion() {
    if(this._currentQuestions.length > 0) {
      this._currentQuestion = this._currentQuestions[0];
    } else {
      this._currentQuestion = null;
    }
  }

  _addCurrentQuestionsForPosition(position) {
    let index = 0;
    for(index = 0; index < this.questions.length; ++index) {
      if(this.questions[index].position === position) {
        this.push('_currentQuestions', this.questions[index]);
      }
    }

    this._setCurrentQuestion();
  }

  _dismissCurrentQuestion() {
    this._correctAnswersShown = false;
    this.shift('_currentQuestions');
    this._setCurrentQuestion();
    this._disableSubmitButton = true;

    if(this._currentQuestion === null) {
      this._stateManager.play();
    }
  }

  _getValidationClass(currentQuestion, correctAnswersShown, correctAnswers, isAnswerCorrect, answer) {
    let correct = false;
    let selected = false;

    if(!correctAnswersShown)
      return '';

    if(currentQuestion.type === 'freetext') {
      correct = isAnswerCorrect;
    } else {
      selected = this.shadowRoot.querySelector('#select__quiz-answer-' + answer.id).checked;

      let shouldBeSelected = false;
      for(let index = 0; index < correctAnswers.length; ++index) {
        if(correctAnswers[index].id === answer.id) {
          shouldBeSelected = true;
          break;
        }
      }

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
      let retval = callback(this._currentQuestion, document.getElementById('input__freetext-answer').value);

      this._correctAnswers = retval.correctAnswers;
      this._isAnswerCorrect = retval.isAnswerCorrect;
    } else { // Single or multiple choice question
      let retval = callback(this._currentQuestion, this._getSelectedAnswers());

      this._correctAnswers = retval.correctAnswers;
      this._isAnswerCorrect = retval.isAnswerCorrect;
    }

    this._correctAnswersShown = true;
  }

  _getSelectedAnswers() {
    let ids = [];

    let inputs = document.getElementsByClassName('select__quiz-answer');
    for(let index = 0; index < inputs.length; ++index) {
      if(inputs[index].checked) {
        let answerid = inputs[index].id.split('-').slice(-1)[0];
        ids.push(parseInt(answerid));
      }
    }

    let filterFunction = function(answer) { return ids.includes(answer.id); };

    return this._currentQuestion.answers.filter(filterFunction);
  }

  _handleCancelClick(e) {
    this._dismissCurrentQuestion();
    e.preventDefault();
  }

  _handleSubmitClick(e) {
    this._submitCurrentQuestion();
    e.preventDefault();
  }
}

window.customElements.define(QuizOverlay.is, QuizOverlay);
