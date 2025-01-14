var _jsxFileName = "/Users/nejc/Projects/Influee/react-slider/src/components/ReactSlider/__tests__/ReactSlider.test.js";
import React from 'react';
import renderer from 'react-test-renderer';
import ReactSlider from '../ReactSlider';
describe('<ReactSlider>', function () {
  it('can render', function () {
    var tree = renderer.create(React.createElement(ReactSlider, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      },
      __self: this
    })).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should call onAfterChange callback when onEnd is called', function () {
    var onAfterChange = jest.fn();
    var testRenderer = renderer.create(React.createElement(ReactSlider, {
      onAfterChange: onAfterChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 13
      },
      __self: this
    }));
    var testInstance = testRenderer.root;
    expect(onAfterChange).not.toHaveBeenCalled();
    testInstance.instance.onBlur();
    expect(onAfterChange).toHaveBeenCalledTimes(1);
  });
});