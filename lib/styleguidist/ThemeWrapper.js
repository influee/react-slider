"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = require("styled-components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n    .horizontal-slider {\n        width: 100%;\n        max-width: 500px;\n        height: 50px;\n        border: 1px solid grey;\n    }\n\n    .vertical-slider {\n        height: 380px;\n        width: 50px;\n        border: 1px solid grey;\n    }\n\n    .example-thumb {\n        font-size: 0.9em;\n        text-align: center;\n        background-color: black;\n        color: white;\n        cursor: pointer;\n    }\n\n    .example-thumb.active {\n        background-color: grey;\n    }\n\n    .example-track {\n        position: relative;\n        background: #ddd;\n    }\n\n    .example-track.example-track-1 {\n        background: #f00;\n    }\n\n    .example-track.example-track-2 {\n        background: #0f0;\n    }\n\n    .horizontal-slider .example-track {\n        top: 20px;\n        height: 10px;\n    }\n\n    .horizontal-slider .example-thumb {\n        top: 1px;\n        width: 50px;\n        height: 48px;\n        line-height: 48px;\n    }\n\n    .vertical-slider .example-thumb {\n        left: 1px;\n        width: 48px;\n        line-height: 50px;\n        height: 50px;\n    }\n\n    .vertical-slider .example-track {\n        left: 20px;\n        width: 10px;\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var GlobalStyle = (0, _styledComponents.createGlobalStyle)(_templateObject());

var _default = function _default(props) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(GlobalStyle, null), _react.default.createElement("div", props));
};

exports.default = _default;