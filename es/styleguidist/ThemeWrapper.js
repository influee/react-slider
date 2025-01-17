var _jsxFileName = "/Users/nejc/Projects/Influee/react-slider/src/styleguidist/ThemeWrapper.jsx";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n    .horizontal-slider {\n        width: 100%;\n        max-width: 500px;\n        height: 50px;\n        border: 1px solid grey;\n    }\n\n    .vertical-slider {\n        height: 380px;\n        width: 50px;\n        border: 1px solid grey;\n    }\n\n    .example-thumb {\n        font-size: 0.9em;\n        text-align: center;\n        background-color: black;\n        color: white;\n        cursor: pointer;\n    }\n\n    .example-thumb.active {\n        background-color: grey;\n    }\n\n    .example-track {\n        position: relative;\n        background: #ddd;\n    }\n\n    .example-track.example-track-1 {\n        background: #f00;\n    }\n\n    .example-track.example-track-2 {\n        background: #0f0;\n    }\n\n    .horizontal-slider .example-track {\n        top: 20px;\n        height: 10px;\n    }\n\n    .horizontal-slider .example-thumb {\n        top: 1px;\n        width: 50px;\n        height: 48px;\n        line-height: 48px;\n    }\n\n    .vertical-slider .example-thumb {\n        left: 1px;\n        width: 48px;\n        line-height: 50px;\n        height: 50px;\n    }\n\n    .vertical-slider .example-track {\n        left: 20px;\n        width: 10px;\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

import React from 'react'; // eslint-disable-next-line zillow/import/no-extraneous-dependencies

import { createGlobalStyle } from 'styled-components';
var GlobalStyle = createGlobalStyle(_templateObject());
export default (function (props) {
  return React.createElement(React.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, React.createElement(GlobalStyle, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }), React.createElement("div", _extends({}, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  })));
});