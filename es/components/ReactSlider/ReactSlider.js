var _jsxFileName = "/Users/nejc/Projects/Influee/react-slider/src/components/ReactSlider/ReactSlider.jsx";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
/**
 * To prevent text selection while dragging.
 * http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
 */

function pauseEvent(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

function stopPropagation(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
}

function ensureArray(x) {
  if (x == null) {
    return [];
  }

  return Array.isArray(x) ? x : [x];
}

function undoEnsureArray(x) {
  return x !== null && x.length === 1 ? x[0] : x;
}

function trimSucceeding(length, nextValue, minDistance, max) {
  for (var i = 0; i < length; i += 1) {
    var padding = max - i * minDistance;

    if (nextValue[length - 1 - i] > padding) {
      // eslint-disable-next-line no-param-reassign
      nextValue[length - 1 - i] = padding;
    }
  }
}

function trimPreceding(length, nextValue, minDistance, min) {
  for (var i = 0; i < length; i += 1) {
    var padding = min + i * minDistance;

    if (nextValue[i] < padding) {
      // eslint-disable-next-line no-param-reassign
      nextValue[i] = padding;
    }
  }
}

function addHandlers(eventMap) {
  Object.keys(eventMap).forEach(function (key) {
    if (typeof document !== 'undefined') {
      document.addEventListener(key, eventMap[key], false);
    }
  });
}

function removeHandlers(eventMap) {
  Object.keys(eventMap).forEach(function (key) {
    if (typeof document !== 'undefined') {
      document.removeEventListener(key, eventMap[key], false);
    }
  });
}

var ReactSlider =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ReactSlider, _React$Component);

  function ReactSlider(_props) {
    var _this;

    _this = _React$Component.call(this, _props) || this;

    _this.onMouseUp = function () {
      _this.onEnd(_this.getMouseEventMap());
    };

    _this.onTouchEnd = function () {
      _this.onEnd(_this.getTouchEventMap());
    };

    _this.onBlur = function () {
      _this.setState({
        index: -1
      }, _this.onEnd(_this.getKeyDownEventMap()));
    };

    _this.onMouseMove = function (e) {
      var position = _this.getMousePosition(e);

      var diffPosition = _this.getDiffPosition(position[0]);

      var newValue = _this.getValueFromPosition(diffPosition);

      _this.move(newValue);
    };

    _this.onTouchMove = function (e) {
      if (e.touches.length > 1) {
        return;
      }

      var position = _this.getTouchPosition(e);

      if (typeof _this.isScrolling === 'undefined') {
        var diffMainDir = position[0] - _this.startPosition[0];
        var diffScrollDir = position[1] - _this.startPosition[1];
        _this.isScrolling = Math.abs(diffScrollDir) > Math.abs(diffMainDir);
      }

      if (_this.isScrolling) {
        _this.setState({
          index: -1
        });

        return;
      }

      pauseEvent(e);

      var diffPosition = _this.getDiffPosition(position[0]);

      var newValue = _this.getValueFromPosition(diffPosition);

      _this.move(newValue);
    };

    _this.onKeyDown = function (e) {
      if (e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'Left':
        case 'Down':
          e.preventDefault();

          _this.moveDownByStep();

          break;

        case 'ArrowRight':
        case 'ArrowUp':
        case 'Right':
        case 'Up':
          e.preventDefault();

          _this.moveUpByStep();

          break;

        case 'Home':
          e.preventDefault();

          _this.move(_this.props.min);

          break;

        case 'End':
          e.preventDefault();

          _this.move(_this.props.max);

          break;

        case 'PageDown':
          e.preventDefault();

          _this.moveDownByStep(_this.props.pageFn(_this.props.step));

          break;

        case 'PageUp':
          e.preventDefault();

          _this.moveUpByStep(_this.props.pageFn(_this.props.step));

          break;

        default:
      }
    };

    _this.onSliderMouseDown = function (e) {
      // do nothing if disabled or right click
      if (_this.props.disabled || e.button === 2) {
        return;
      }

      _this.hasMoved = false;

      if (!_this.props.snapDragDisabled) {
        var position = _this.getMousePosition(e);

        _this.forceValueFromPosition(position[0], function (i) {
          _this.start(i, position[0]);

          _this.fireChangeEvent('onChange');

          addHandlers(_this.getMouseEventMap());
        });
      }

      pauseEvent(e);
    };

    _this.onSliderClick = function (e) {
      if (_this.props.disabled) {
        return;
      }

      if (_this.props.onSliderClick && !_this.hasMoved) {
        var position = _this.getMousePosition(e);

        var valueAtPos = _this.trimAlignValue(_this.calcValue(_this.calcOffsetFromPosition(position[0])));

        _this.props.onSliderClick(valueAtPos);
      }
    };

    _this.createOnKeyDown = function (i) {
      return function (e) {
        if (_this.props.disabled) {
          return;
        }

        _this.start(i);

        addHandlers(_this.getKeyDownEventMap());
        pauseEvent(e);
      };
    };

    _this.createOnMouseDown = function (i) {
      return function (e) {
        // do nothing if disabled or right click
        if (_this.props.disabled || e.button === 2) {
          return;
        }

        var position = _this.getMousePosition(e);

        _this.start(i, position[0]);

        addHandlers(_this.getMouseEventMap());
        pauseEvent(e);
      };
    };

    _this.createOnTouchStart = function (i) {
      return function (e) {
        if (_this.props.disabled || e.touches.length > 1) {
          return;
        }

        var position = _this.getTouchPosition(e);

        _this.startPosition = position; // don't know yet if the user is trying to scroll

        _this.isScrolling = undefined;

        _this.start(i, position[0]);

        addHandlers(_this.getTouchEventMap());
        stopPropagation(e);
      };
    };

    _this.handleResize = function () {
      // setTimeout of 0 gives element enough time to have assumed its new size if
      // it is being resized
      var resizeTimeout = window.setTimeout(function () {
        // drop this timeout from pendingResizeTimeouts to reduce memory usage
        _this.pendingResizeTimeouts.shift();

        _this.resize();
      }, 0);

      _this.pendingResizeTimeouts.push(resizeTimeout);
    };

    _this.renderThumb = function (style, i) {
      var className = _this.props.thumbClassName + " " + _this.props.thumbClassName + "-" + i + " " + (_this.state.index === i ? _this.props.thumbActiveClassName : '');
      var props = {
        'ref': function ref(r) {
          _this["thumb" + i] = r;
        },
        'key': _this.props.thumbClassName + "-" + i,
        className: className,
        style: style,
        'onMouseDown': !_this.props.disabledIndexes.includes(i) ? _this.createOnMouseDown(i) : null,
        'onTouchStart': _this.createOnTouchStart(i),
        'onFocus': _this.createOnKeyDown(i),
        'tabIndex': 0,
        'role': 'slider',
        'aria-orientation': _this.props.orientation,
        'aria-valuenow': _this.state.value[i],
        'aria-valuemin': _this.props.min,
        'aria-valuemax': _this.props.max,
        'aria-label': Array.isArray(_this.props.ariaLabel) ? _this.props.ariaLabel[i] : _this.props.ariaLabel
      };
      var state = {
        index: i,
        value: undoEnsureArray(_this.state.value),
        valueNow: _this.state.value[i]
      };

      if (_this.props.ariaValuetext) {
        props['aria-valuetext'] = typeof _this.props.ariaValuetext === 'string' ? _this.props.ariaValuetext : _this.props.ariaValuetext(state);
      }

      return _this.props.renderThumb(props, state);
    };

    _this.renderTrack = function (i, offsetFrom, offsetTo) {
      var props = {
        key: _this.props.trackClassName + "-" + i,
        className: _this.props.trackClassName + " " + _this.props.trackClassName + "-" + i,
        style: _this.buildTrackStyle(offsetFrom, _this.state.upperBound - offsetTo)
      };
      var state = {
        index: i,
        value: undoEnsureArray(_this.state.value)
      };
      return _this.props.renderTrack(props, state);
    };

    var value = ensureArray(_props.value);

    if (!value.length) {
      value = ensureArray(_props.defaultValue);
    } // reused throughout the component to store results of iterations over `value`


    _this.tempArray = value.slice(); // array for storing resize timeouts ids

    _this.pendingResizeTimeouts = [];
    var zIndices = [];

    for (var i = 0; i < value.length; i += 1) {
      value[i] = _this.trimAlignValue(value[i], _props);
      zIndices.push(i);
    }

    _this.state = {
      index: -1,
      upperBound: 0,
      sliderLength: 0,
      value: value,
      zIndices: zIndices
    };
    return _this;
  }

  var _proto = ReactSlider.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      this.resize();
    }
  } // Keep the internal `value` consistent with an outside `value` if present.
  // This basically allows the slider to be a controlled component.
  ;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    var value = ensureArray(newProps.value);

    if (!value.length) {
      // eslint-disable-next-line prefer-destructuring
      value = this.state.value;
    } // ensure the array keeps the same size as `value`


    this.tempArray = value.slice();

    for (var i = 0; i < value.length; i += 1) {
      this.state.value[i] = this.trimAlignValue(value[i], newProps);
    }

    if (this.state.value.length > value.length) {
      this.state.value.length = value.length;
    } // If an upperBound has not yet been determined (due to the component being hidden
    // during the mount event, or during the last resize), then calculate it now


    if (this.state.upperBound === 0) {
      this.resize();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.clearPendingResizeTimeouts();

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
  };

  _proto.onEnd = function onEnd(eventMap) {
    removeHandlers(eventMap);
    this.fireChangeEvent('onAfterChange');
  };

  _proto.getValue = function getValue() {
    return undoEnsureArray(this.state.value);
  };

  _proto.getClosestIndex = function getClosestIndex(pixelOffset) {
    var minDist = Number.MAX_VALUE;
    var closestIndex = -1;
    var value = this.state.value;
    var l = value.length;

    for (var i = 0; i < l; i += 1) {
      var offset = this.calcOffset(value[i]);
      var dist = Math.abs(pixelOffset - offset);

      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  _proto.getMousePosition = function getMousePosition(e) {
    return [e["page" + this.axisKey()], e["page" + this.orthogonalAxisKey()]];
  };

  _proto.getTouchPosition = function getTouchPosition(e) {
    var touch = e.touches[0];
    return [touch["page" + this.axisKey()], touch["page" + this.orthogonalAxisKey()]];
  };

  _proto.getKeyDownEventMap = function getKeyDownEventMap() {
    return {
      keydown: this.onKeyDown,
      focusout: this.onBlur
    };
  };

  _proto.getMouseEventMap = function getMouseEventMap() {
    return {
      mousemove: this.onMouseMove,
      mouseup: this.onMouseUp
    };
  };

  _proto.getTouchEventMap = function getTouchEventMap() {
    return {
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd
    };
  };

  _proto.getValueFromPosition = function getValueFromPosition(position) {
    var diffValue = position / (this.state.sliderLength - this.state.thumbSize) * (this.props.max - this.props.min);
    return this.trimAlignValue(this.state.startValue + diffValue);
  };

  _proto.getDiffPosition = function getDiffPosition(position) {
    var diffPosition = position - this.state.startPosition;

    if (this.props.invert) {
      diffPosition *= -1;
    }

    return diffPosition;
  } // create the `keydown` handler for the i-th thumb
  ;

  _proto.resize = function resize() {
    var slider = this.slider;
    var thumb = this.thumb0;
    var rect = slider.getBoundingClientRect();
    var sizeKey = this.sizeKey();
    var sliderMax = rect[this.posMaxKey()];
    var sliderMin = rect[this.posMinKey()];
    this.setState({
      upperBound: slider[sizeKey] - thumb[sizeKey],
      sliderLength: Math.abs(sliderMax - sliderMin),
      thumbSize: thumb[sizeKey],
      sliderStart: this.props.invert ? sliderMax : sliderMin
    });
  } // calculates the offset of a thumb in pixels based on its value.
  ;

  _proto.calcOffset = function calcOffset(value) {
    var range = this.props.max - this.props.min;

    if (range === 0) {
      return 0;
    }

    var ratio = (value - this.props.min) / range;
    return ratio * this.state.upperBound;
  } // calculates the value corresponding to a given pixel offset, i.e. the inverse of `calcOffset`.
  ;

  _proto.calcValue = function calcValue(offset) {
    var ratio = offset / this.state.upperBound;
    return ratio * (this.props.max - this.props.min) + this.props.min;
  };

  _proto.calcOffsetFromPosition = function calcOffsetFromPosition(position) {
    var pixelOffset = position - this.state.sliderStart;

    if (this.props.invert) {
      pixelOffset = this.state.sliderLength - pixelOffset;
    }

    pixelOffset -= this.state.thumbSize / 2;
    return pixelOffset;
  } // Snaps the nearest thumb to the value corresponding to `position`
  // and calls `callback` with that thumb's index.
  ;

  _proto.forceValueFromPosition = function forceValueFromPosition(position, callback) {
    var pixelOffset = this.calcOffsetFromPosition(position);
    var closestIndex = this.getClosestIndex(pixelOffset);
    var nextValue = this.trimAlignValue(this.calcValue(pixelOffset)); // Clone this.state.value since we'll modify it temporarily
    // eslint-disable-next-line zillow/react/no-access-state-in-setstate

    var value = this.state.value.slice();
    value[closestIndex] = nextValue; // Prevents the slider from shrinking below `props.minDistance`

    for (var i = 0; i < value.length - 1; i += 1) {
      if (value[i + 1] - value[i] < this.props.minDistance) {
        return;
      }
    }

    this.setState({
      value: value
    }, callback.bind(this, closestIndex));
  } // clear all pending timeouts to avoid error messages after unmounting
  ;

  _proto.clearPendingResizeTimeouts = function clearPendingResizeTimeouts() {
    do {
      var nextTimeout = this.pendingResizeTimeouts.shift();
      clearTimeout(nextTimeout);
    } while (this.pendingResizeTimeouts.length);
  };

  _proto.start = function start(i, position) {
    var thumbRef = this["thumb" + i];
    thumbRef.focus();
    this.hasMoved = false;
    this.fireChangeEvent('onBeforeChange');
    var zIndices = this.state.zIndices; // remove wherever the element is

    zIndices.splice(zIndices.indexOf(i), 1); // add to end

    zIndices.push(i);
    this.setState(function (prevState) {
      return {
        startValue: prevState.value[i],
        startPosition: position !== undefined ? position : prevState.startPosition,
        index: i,
        zIndices: zIndices
      };
    });
  };

  _proto.moveUpByStep = function moveUpByStep(step) {
    if (step === void 0) {
      step = this.props.step;
    }

    var oldValue = this.state.value[this.state.index];
    var newValue = oldValue + step;
    this.move(Math.min(newValue, this.props.max));
  };

  _proto.moveDownByStep = function moveDownByStep(step) {
    if (step === void 0) {
      step = this.props.step;
    }

    var oldValue = this.state.value[this.state.index];
    var newValue = oldValue - step;
    this.move(Math.max(newValue, this.props.min));
  };

  _proto.move = function move(newValue) {
    this.hasMoved = true;
    var _this$state = this.state,
        index = _this$state.index,
        value = _this$state.value;
    var length = value.length;
    var oldValue = value[index];
    var _this$props = this.props,
        pearling = _this$props.pearling,
        minDistance = _this$props.minDistance; // if "pearling" (= thumbs pushing each other) is disabled,
    // prevent the thumb from getting closer than `minDistance` to the previous or next thumb.

    if (!pearling) {
      if (index > 0) {
        var valueBefore = value[index - 1];

        if (newValue < valueBefore + minDistance) {
          // eslint-disable-next-line no-param-reassign
          newValue = valueBefore + minDistance;
        }
      }

      if (index < length - 1) {
        var valueAfter = value[index + 1];

        if (newValue > valueAfter - minDistance) {
          // eslint-disable-next-line no-param-reassign
          newValue = valueAfter - minDistance;
        }
      }
    }

    value[index] = newValue; // if "pearling" is enabled, let the current thumb push the pre- and succeeding thumbs.

    if (pearling && length > 1) {
      var max = this.props.maxAllowed || this.props.max;
      var min = this.props.minAllowed || this.props.min;

      if (newValue > oldValue) {
        this.pushSucceeding(value, minDistance, index);
        trimSucceeding(length, value, minDistance, max);
      } else if (newValue < oldValue) {
        this.pushPreceding(value, minDistance, index);
        trimPreceding(length, value, minDistance, min);
      }
    } // Normally you would use `shouldComponentUpdate`,
    // but since the slider is a low-level component,
    // the extra complexity might be worth the extra performance.


    if (newValue !== oldValue) {
      this.setState({
        value: value
      }, this.fireChangeEvent.bind(this, 'onChange'));
    }
  };

  _proto.pushSucceeding = function pushSucceeding(value, minDistance, index) {
    var i;
    var padding;

    for (i = index, padding = value[i] + minDistance; value[i + 1] !== null && padding > value[i + 1]; i += 1, padding = value[i] + minDistance) {
      // eslint-disable-next-line no-param-reassign
      value[i + 1] = this.alignValue(padding);
    }
  };

  _proto.pushPreceding = function pushPreceding(value, minDistance, index) {
    for (var i = index, padding = value[i] - minDistance; value[i - 1] !== null && padding < value[i - 1]; i -= 1, padding = value[i] - minDistance) {
      // eslint-disable-next-line no-param-reassign
      value[i - 1] = this.alignValue(padding);
    }
  };

  _proto.axisKey = function axisKey() {
    if (this.props.orientation === 'vertical') {
      return 'Y';
    } // Defaults to 'horizontal';


    return 'X';
  };

  _proto.orthogonalAxisKey = function orthogonalAxisKey() {
    if (this.props.orientation === 'vertical') {
      return 'X';
    } // Defaults to 'horizontal'


    return 'Y';
  };

  _proto.posMinKey = function posMinKey() {
    if (this.props.orientation === 'vertical') {
      return this.props.invert ? 'bottom' : 'top';
    } // Defaults to 'horizontal'


    return this.props.invert ? 'right' : 'left';
  };

  _proto.posMaxKey = function posMaxKey() {
    if (this.props.orientation === 'vertical') {
      return this.props.invert ? 'top' : 'bottom';
    } // Defaults to 'horizontal'


    return this.props.invert ? 'left' : 'right';
  };

  _proto.sizeKey = function sizeKey() {
    if (this.props.orientation === 'vertical') {
      return 'clientHeight';
    } // Defaults to 'horizontal'


    return 'clientWidth';
  };

  _proto.trimAlignValue = function trimAlignValue(val, props) {
    return this.alignValue(this.trimValue(val, props), props);
  };

  _proto.trimValue = function trimValue(val, props) {
    if (props === void 0) {
      props = this.props;
    }

    var trimmed = val;
    var max = props.maxAllowed || props.max;
    var min = props.minAllowed || props.min;

    if (trimmed <= min) {
      trimmed = min;
    }

    if (trimmed >= max) {
      trimmed = max;
    }

    return trimmed;
  };

  _proto.alignValue = function alignValue(val, props) {
    if (props === void 0) {
      props = this.props;
    }

    var valModStep = (val - props.min) % props.step;
    var alignValue = val - valModStep;

    if (Math.abs(valModStep) * 2 >= props.step) {
      alignValue += valModStep > 0 ? props.step : -props.step;
    }

    return parseFloat(alignValue.toFixed(5));
  };

  _proto.fireChangeEvent = function fireChangeEvent(event) {
    if (this.props[event]) {
      this.props[event](undoEnsureArray(this.state.value));
    }
  };

  _proto.buildThumbStyle = function buildThumbStyle(offset, i) {
    var style = {
      position: 'absolute',
      willChange: this.state.index >= 0 ? this.posMinKey() : '',
      zIndex: this.state.zIndices.indexOf(i) + 1
    };
    style[this.posMinKey()] = offset + "px";
    return style;
  };

  _proto.buildTrackStyle = function buildTrackStyle(min, max) {
    var obj = {
      position: 'absolute',
      willChange: this.state.index >= 0 ? this.posMinKey() + "," + this.posMaxKey() : ''
    };
    obj[this.posMinKey()] = min;
    obj[this.posMaxKey()] = max;
    return obj;
  };

  _proto.renderThumbs = function renderThumbs(offset) {
    var length = offset.length;
    var styles = this.tempArray;

    for (var i = 0; i < length; i += 1) {
      styles[i] = this.buildThumbStyle(offset[i], i);
    }

    var res = [];

    for (var _i = 0; _i < length; _i += 1) {
      res[_i] = this.renderThumb(styles[_i], _i);
    }

    return res;
  };

  _proto.renderTracks = function renderTracks(offset) {
    var tracks = [];
    var lastIndex = offset.length - 1;
    tracks.push(this.renderTrack(0, 0, offset[0]));

    for (var i = 0; i < lastIndex; i += 1) {
      tracks.push(this.renderTrack(i + 1, offset[i], offset[i + 1]));
    }

    tracks.push(this.renderTrack(lastIndex + 1, offset[lastIndex], this.state.upperBound));
    return tracks;
  };

  _proto.render = function render() {
    var _this2 = this;

    var offset = this.tempArray;
    var value = this.state.value;
    var l = value.length;

    for (var i = 0; i < l; i += 1) {
      offset[i] = this.calcOffset(value[i], i);
    }

    var tracks = this.props.withTracks ? this.renderTracks(offset) : null;
    var thumbs = this.renderThumbs(offset);
    return React.createElement('div', {
      ref: function ref(r) {
        _this2.slider = r;
      },
      style: {
        position: 'relative'
      },
      className: this.props.className + (this.props.disabled ? ' disabled' : ''),
      onMouseDown: this.onSliderMouseDown,
      onClick: this.onSliderClick
    }, tracks, thumbs);
  };

  return ReactSlider;
}(React.Component);

ReactSlider.displayName = 'ReactSlider';
ReactSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  pageFn: function pageFn(step) {
    return step * 10;
  },
  minDistance: 0,
  defaultValue: 0,
  orientation: 'horizontal',
  className: 'slider',
  thumbClassName: 'thumb',
  thumbActiveClassName: 'active',
  trackClassName: 'track',
  withTracks: true,
  pearling: false,
  disabled: false,
  snapDragDisabled: false,
  invert: false,
  renderThumb: function renderThumb(props) {
    return React.createElement("div", _extends({}, props, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 282
      },
      __self: this
    }));
  },
  renderTrack: function renderTrack(props) {
    return React.createElement("div", _extends({}, props, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 283
      },
      __self: this
    }));
  },
  disabledIndexes: [],
  minAllowed: null,
  maxAllowed: null
};
ReactSlider.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * The minimum value of the slider.
   */
  min: PropTypes.number,

  /**
   * The maximum value of the slider.
   */
  max: PropTypes.number,

  /**
   * Value to be added or subtracted on each step the slider makes.
   * Must be greater than zero.
   * `max - min` should be evenly divisible by the step value.
   */
  step: PropTypes.number,

  /**
   * The result of the function is the value to be added or subtracted
   * when the `Page Up` or `Page Down` keys are pressed.
   *
   * The current `step` value will be passed as the only argument.
   * By default, paging will modify `step` by a factor of 10.
   */
  pageFn: PropTypes.func,

  /**
   * The minimal distance between any pair of thumbs.
   * Must be positive, but zero means they can sit on top of each other.
   */
  minDistance: PropTypes.number,

  /**
   * Determines the initial positions of the thumbs and the number of thumbs.
   *
   * If a number is passed a slider with one thumb will be rendered.
   * If an array is passed each value will determine the position of one thumb.
   * The values in the array must be sorted.
   */
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

  /**
   * Like `defaultValue` but for
   * [controlled components](http://facebook.github.io/react/docs/forms.html#controlled-components).
   */
  // eslint-disable-next-line zillow/react/require-default-props
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

  /**
   * Determines whether the slider moves horizontally (from left to right)
   * or vertically (from top to bottom).
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /**
   * The css class set on the slider node.
   */
  className: PropTypes.string,

  /**
   * The css class set on each thumb node.
   *
   * In addition each thumb will receive a numbered css class of the form
   * `${thumbClassName}-${i}`, e.g. `thumb-0`, `thumb-1`, ...
   */
  thumbClassName: PropTypes.string,

  /**
   * The css class set on the thumb that is currently being moved.
   */
  thumbActiveClassName: PropTypes.string,

  /**
   * If `true` tracks between the thumbs will be rendered.
   */
  withTracks: PropTypes.bool,

  /**
   * The css class set on the tracks between the thumbs.
   * In addition track fragment will receive a numbered css class of the form
   * `${trackClassName}-${i}`, e.g. `track-0`, `track-1`, ...
   */
  trackClassName: PropTypes.string,

  /**
   * If `true` the active thumb will push other thumbs
   * within the constraints of `min`, `max`, `step` and `minDistance`.
   */
  pearling: PropTypes.bool,

  /**
   * If `true` the thumbs can't be moved.
   */
  disabled: PropTypes.bool,

  /**
   * Disables thumb move when clicking the slider track
   */
  snapDragDisabled: PropTypes.bool,

  /**
   * Inverts the slider.
   */
  invert: PropTypes.bool,

  /**
   * Callback called before starting to move a thumb.
   */
  // eslint-disable-next-line max-len
  // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
  onBeforeChange: PropTypes.func,

  /**
   * Callback called on every value change.
   */
  // eslint-disable-next-line max-len
  // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
  onChange: PropTypes.func,

  /**
   * Callback called only after moving a thumb has ended.
   */
  // eslint-disable-next-line max-len
  // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
  onAfterChange: PropTypes.func,

  /**
   * Callback called when the the slider is clicked (thumb or tracks).
   * Receives the value at the clicked position as argument.
   */
  // eslint-disable-next-line zillow/react/require-default-props
  onSliderClick: PropTypes.func,

  /**
   * aria-label for screen-readers to apply to the thumbs.
   * Use an array for more than one thumb.
   * The length of the array must match the number of thumbs in the value array.
   */
  // eslint-disable-next-line zillow/react/require-default-props
  ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

  /**
   * aria-valuetext for screen-readers.
   * Can be a static string, or a function that returns a string.
   * The function will be passed a single argument,
   * an object with the following properties:
   *
   *     state => `Value: ${state.value}`
   *
   * - `state.index` {`number`} the index of the thumb
   * - `state.value` {`number` | `array`} the current value state
   * - `state.valueNow` {`number`} the value of the thumb (i.e. aria-valuenow)
   */
  // eslint-disable-next-line zillow/react/require-default-props
  ariaValuetext: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * Provide a custom render function for the track node.
   * The render function will be passed two arguments,
   * an object with props that should be added to your handle node,
   * and an object with track and slider state:
   *
   *     (props, state) => <div {...props} />
   *
   * - `props` {`object`} props to be spread into your track node
   * - `state.index` {`number`} the index of the track
   * - `state.value` {`number` | `array`} the current value state
   */
  renderTrack: PropTypes.func,

  /**
   * Provide a custom render function for dynamic thumb content.
   * The render function will be passed two arguments,
   * an object with props that should be added to your thumb node,
   * and an object with thumb and slider state:
   *
   *     (props, state) => <div {...props} />
   *
   * - `props` {`object`} props to be spread into your thumb node
   * - `state.index` {`number`} the index of the thumb
   * - `state.value` {`number` | `array`} the current value state
   * - `state.valueNow` {`number`} the value of the thumb (i.e. aria-valuenow)
   */
  // eslint-disable-next-line zillow/react/require-default-props
  renderThumb: PropTypes.func,
  disabledIndexes: PropTypes.arrayOf(PropTypes.number),
  minAllowed: PropTypes.number,
  maxAllowed: PropTypes.number
} : {};
export default ReactSlider;