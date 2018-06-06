/* @polymerMixin */
export const BindingHelpersMixin = (superClass) => class extends superClass {
  static get properties() {
    return {
      showIf: {
        type: Boolean,
        observer: '_showIfChanged',
      },
    };
  }

  _showIfChanged(condition) {
    if(condition) {
      this.classList.remove('-hidden');
    } else {
      this.classList.add('-hidden');
    }
  }

  equals(...values) {
    return values.reduce((x, y) => x === y);
  }

  less(a, b) {
    return a < b;
  }

  lessEquals(a, b) {
    return a <= b;
  }

  greater(a, b) {
    return a > b;
  }

  greaterEquals(a, b) {
    return a >= b;
  }

  and(...values) {
    return Boolean(values.reduce((x, y) => x && y));
  }

  or(...values) {
    return Boolean(values.reduce((x, y) => x || y));
  }

  exists(value) {
    if (value) {
      return true;
    } else {
      return false;
    }
  }

  hasItems(arr, min = 1) {
    // eslint-disable-next-line eqeqeq
    if(arr == null) {
      return false;
    }

    return arr.length >= min;
  }

  ifThen(condition, thenValue) {
    return this.ifThenElse(condition, thenValue, '');
  }

  ifNotThen(condition, thenValue) {
    return this.ifThen(!condition, thenValue);
  }

  ifThenElse(condition, thenValue, elseValue) {
    return condition ? thenValue : elseValue;
  }

  ifEqualsThen(a, b, thenValue) {
    return this.ifEqualsThenElse(a, b, thenValue, '');
  }

  ifNotEqualsThen(a, b, thenValue) {
    return this.ifNotEqualsThenElse(a, b, thenValue, '');
  }

  ifEqualsThenElse(a, b, thenValue, elseValue) {
    return this.equals(a, b) ? thenValue : elseValue;
  }

  ifNotEqualsThenElse(a, b, thenValue, elseValue) {
    return this.equals(a, b) ? elseValue : thenValue;
  }

  toStringOrEmpty(value) {
    if(typeof value === 'undefined') {
      return '';
    }

    return value.toString();
  }

  toFixedOrEmpty(value, digits) {
    if(typeof value === 'undefined') {
      return '';
    }

    return value.toFixed(digits);
  }

  secondsToHms(totalSeconds, maxSeconds) {
    maxSeconds = maxSeconds || totalSeconds;

    let sign = totalSeconds < 0 ? '-' : '';
    totalSeconds = Math.abs(totalSeconds);
    let hours = this.pad(Math.floor(totalSeconds / 3600), 2);
    let minutes = this.pad(Math.floor(totalSeconds % 3600 / 60), 2);
    let seconds = this.pad(Math.floor(totalSeconds % 3600 % 60), 2);
    if(Math.abs(maxSeconds) < 3600) {
      return `${sign}${minutes}:${seconds}`;
    } else {
      return `${sign}${hours}:${minutes}:${seconds}`;
    }
  }

  pad(number, places) {
    let absNumber = Math.abs(number);
    let numZeroes = places - absNumber.toString().length + 1;
    return Array(numZeroes).join(0) + absNumber;
  }

  arrayItem(array, index) {
    return array[index];
  }
};
