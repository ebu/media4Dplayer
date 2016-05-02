(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.M4DPAudioModules = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeBufferToTextFileWithMatlabFormat = writeBufferToTextFileWithMatlabFormat;
exports.writeBufferToTextFile = writeBufferToTextFile;
exports.fillChannel = fillChannel;
exports.clearBufferChannel = clearBufferChannel;
exports.clearBuffer = clearBuffer;
exports.makeImpulse = makeImpulse;
exports.makeNoise = makeNoise;

var _utils = require("./utils.js");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/**
 * Writes some text into a file.
 * The file can later be downloaded
 * The function returns the download URL
 */
function writeTextDataToFile(text) {
    var textFile = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];


    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
} /************************************************************************************/
/*!
 *   @file       bufferutils.js
 *   @brief      Misc utility functions for AudioBuffer manipulation
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

;

//==============================================================================
/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * The text file is formatted so that it can be easily copy/paste into Matlab
 * 
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFileWithMatlabFormat(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel(" + (i + 1) + ", 1:" + numSamples + ") = ";
        text += "...\n";

        text += "[ ";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += " ];";

        text += "\n";
    }

    return writeTextDataToFile(text);
}

/**
 * Writes a buffer to a text file and returns the URL of the downloadable file
 * @type {AudioBuffer} buffer
 */
function writeBufferToTextFile(buffer) {

    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    var text = "";

    text += "printing buffer :" + "\n";
    text += "numChannels = " + numChannels + "\n";
    text += "numSamples  = " + numSamples + "\n";

    var numDecimals = 9;

    for (var i = 0; i < numChannels; i++) {

        var channel_ = buffer.getChannelData(i);

        text += "channel[" + i + "] = ";
        text += "\n";

        for (var j = 0; j < numSamples; j++) {
            var value = channel_[j];

            var valueAsString = value.toFixed(numDecimals);

            text += valueAsString;
            text += " ";
        }
        text += "\n";
    }

    return writeTextDataToFile(text);
}

//==============================================================================
/**
 * Fills one channel of an AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {number} value
 */
function fillChannel(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var value = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];


    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    var channel_ = buffer.getChannelData(channelIndex);

    for (var j = 0; j < numSamples; j++) {
        channel_[j] = value;
    }
}

//==============================================================================
/**
 * Fills one channel of a buffer with 0
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 */
function clearBufferChannel(buffer, channelIndex) {

    fillChannel(buffer, channelIndex, 0.0);
}

//==============================================================================
/**
 * Fills all channels of a buffer with 0
 * @type {AudioBuffer} buffer
 */
function clearBuffer(buffer) {

    var numChannels = buffer.numberOfChannels;

    for (var i = 0; i < numChannels; i++) {

        clearBufferChannel(buffer, i);
    }
}

/**
 * Creates a Dirac in one given channel of the AudioBuffer
 * @type {AudioBuffer} buffer
 * @type {int} channelIndex
 * @type {int} sampleIndex
 */
function makeImpulse(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var sampleIndex = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];


    var numChannels = buffer.numberOfChannels;
    var numSamples = buffer.length;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    /// boundary check
    if (sampleIndex < 0 || sampleIndex >= numSamples) {
        throw new Error("Invalid sampleIndex");
    }

    /// first clear the channel
    clearBufferChannel(buffer, channelIndex);

    /// then create a Dirac
    var channel_ = buffer.getChannelData(channelIndex);
    channel_[sampleIndex] = 1.0;
}

function makeNoise(buffer) {
    var channelIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var gain = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var numChannels = buffer.numberOfChannels;

    /// boundary check
    if (channelIndex < 0 || channelIndex >= numChannels) {
        throw new Error("Invalid channelIndex");
    }

    var amplitude = _utils2.default.dB2lin(gain);

    var data = buffer.getChannelData(channelIndex);
    data.forEach(function (sample, index) {
        data[index] = amplitude * Math.random() * 2 - 1;
    });
}

//==============================================================================
var bufferutilities = {
    writeBufferToTextFileWithMatlabFormat: writeBufferToTextFileWithMatlabFormat,
    writeBufferToTextFile: writeBufferToTextFile,
    clearBufferChannel: clearBufferChannel,
    clearBuffer: clearBuffer,
    makeImpulse: makeImpulse,
    makeNoise: makeNoise,
    fillChannel: fillChannel
};

exports.default = bufferutilities;
},{"./utils.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//==============================================================================
/**
 * Template for other audio nodes: set the audioContext reference and provide connect/disconnect methods for the audio node.
 */

var AbstractNode = function () {
    /**
     * AbstractNode constructor
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection instance.
     */

    function AbstractNode(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, AbstractNode);

        this._audioContext = audioContext;
        this._audioStreamDescriptionCollection = audioStreamDescriptionCollection;
        /**
         * @type {AudioNode}
         */
        this._input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
    }

    //==============================================================================
    /**
     * Connect the audio node
     * @param {AudioNode} node - an AudioNode to connect to.
     */


    _createClass(AbstractNode, [{
        key: 'connect',
        value: function connect(node) {
            this._output.connect(node);
        }
        /**
         * Disconnect the audio node     
         */

    }, {
        key: 'disconnect',
        value: function disconnect() {
            this._output.disconnect();
        }

        //==============================================================================
        /**
         * Returns the current sample rate of the audio context
         */

    }, {
        key: 'getCurrentSampleRate',
        value: function getCurrentSampleRate() {
            return this._audioContext.sampleRate;
        }
    }]);

    return AbstractNode;
}();

//==============================================================================
/**
 * Container for AudioStreamDescription
 */


exports.default = AbstractNode;

var AudioStreamDescriptionCollection = exports.AudioStreamDescriptionCollection = function () {
    /**
     * AudioStreamDescriptionCollection constructor
     * @param {AudioStreamDescription[]} streams - array of AudioStreamDescription
     */

    function AudioStreamDescriptionCollection(streams) {
        _classCallCheck(this, AudioStreamDescriptionCollection);

        this._streams = streams;
    }

    //==============================================================================
    /**
     * Set the stream description collection
     * @type {AudioStreamDescription[]}
     */


    _createClass(AudioStreamDescriptionCollection, [{
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {}
        /// nothing to do in the base class


        /**
         * Notification when the trim of stream(s) changes
         */

    }, {
        key: 'streamsTrimChanged',
        value: function streamsTrimChanged() {}
        /// nothing to do in the base class  


        //==============================================================================
        /**
         * Get the current dialog audio stream description of the collection
         * @type {AudioStreamDescription}
         */

    }, {
        key: 'isChannelForExtendedDialog',


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended dialog
         *      
         */
        value: function isChannelForExtendedDialog(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.totalNumberOfChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var index = 0;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    var numChannelsForThisStream = stream.numChannels;

                    var isExtendedDialog = stream.isExtendedDialog;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        if (channelIndex === index && isExtendedDialog === true) {
                            return true;
                        }

                        index++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended ambiance
         *      
         */

    }, {
        key: 'isChannelForExtendedAmbiance',
        value: function isChannelForExtendedAmbiance(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.totalNumberOfChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var index = 0;

            /// go through all the streams
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stream = _step2.value;


                    var numChannelsForThisStream = stream.numChannels;

                    var isExtendedAmbiance = stream.isExtendedAmbiance;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        if (channelIndex === index && isExtendedAmbiance === true) {
                            return true;
                        }

                        index++;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if this channel index corresponds to a center channel (of 5.0 or 5.1 stream)
         *      
         */

    }, {
        key: 'isChannelCenter',
        value: function isChannelCenter(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.totalNumberOfChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var index = 0;

            /// go through all the streams
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._streams[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var stream = _step3.value;


                    var numChannelsForThisStream = stream.numChannels;

                    var isMulti = stream.type === 'MultiWithoutLFE' || stream.type === 'MultiWithLFE';

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        if (channelIndex === index && stream.channelIsCenter(k) === true) {
                            return true;
                        }

                        index++;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return false;
        }
    }, {
        key: 'streams',
        set: function set(streams) {
            this._streams = streams;
        }
        /**
         * Get the stream description collection
         * @type {AudioStreamDescription[]}
         */
        ,
        get: function get() {
            return this._streams;
        }

        /**
         * Returns the number of streams in the collection
         */

    }, {
        key: 'numStreams',
        get: function get() {
            return this._streams.length;
        }

        //==============================================================================
        /**
         * Returns the total number of channels (i.e. for all the streams)
         */

    }, {
        key: 'totalNumberOfChannels',
        get: function get() {
            var totalNumberOfChannels_ = 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._streams[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var stream = _step4.value;

                    totalNumberOfChannels_ += stream.numChannels;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return totalNumberOfChannels_;
        }

        //==============================================================================
        /**
         * Get the current active audio stream descriptions of the collection
         * @type {AudioStreamDescription[]}
         */

    }, {
        key: 'actives',
        get: function get() {
            var actives = [];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this._streams[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var stream = _step5.value;

                    if (stream.active) {
                        actives.push(stream);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return actives;
        }

        /**
         * Returns true if at least one stream is currently active
         * @type {boolean}
         */

    }, {
        key: 'hasActiveStream',
        get: function get() {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this._streams[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var stream = _step6.value;

                    if (stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return false;
        }
    }, {
        key: 'extendedDialog',
        get: function get() {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this._streams[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var stream = _step7.value;

                    if (stream.isExtendedDialog === true) {
                        return stream;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return undefined;
        }

        /**
         * Returns true if there is at least one dialog among all the streams     
         */

    }, {
        key: 'hasExtendedDialog',
        get: function get() {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this._streams[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var stream = _step8.value;

                    if (stream.isExtendedDialog === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one dialog among all the streams     
         */

    }, {
        key: 'hasActiveExtendedDialog',
        get: function get() {
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this._streams[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var stream = _step9.value;

                    if (stream.isExtendedDialog === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if there is at least one ambiance among all the streams     
         */

    }, {
        key: 'hasExtendedAmbiance',
        get: function get() {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this._streams[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var stream = _step10.value;

                    if (stream.isExtendedAmbiance === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one ambiance among all the streams     
         */

    }, {
        key: 'hasActiveExtendedAmbiance',
        get: function get() {
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = this._streams[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var stream = _step11.value;

                    if (stream.isExtendedAmbiance === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * Returns true if there is at least one commentary among all the streams     
         */

    }, {
        key: 'hasExtendedCommentary',
        get: function get() {
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this._streams[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var stream = _step12.value;

                    if (stream.isExtendedCommentary === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one commentary among all the streams,
         * and if it is currently active     
         */

    }, {
        key: 'hasActiveExtendedCommentary',
        get: function get() {
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = this._streams[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var stream = _step13.value;

                    if (stream.isExtendedCommentary === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one active 5.0 or 5.1 stream, with dialog
         */

    }, {
        key: 'hasActiveMultiWithDialog',
        get: function get() {
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = this._streams[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var stream = _step14.value;

                    if ((stream.type === 'MultiWithoutLFE' || stream.type === 'MultiWithLFE') && stream.active === true) {

                        // && stream.dialog === true
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            return false;
        }

        /**
         * Returns true if there is at least one active stereo stream, with dialog
         */

    }, {
        key: 'hasActiveStereoWithDialog',
        get: function get() {
            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = this._streams[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var stream = _step15.value;

                    if (stream.type === 'Stereo' && stream.dialog === true && stream.active === true) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                        _iterator15.return();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }

            return false;
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the mono commentary
         * 
         * Returns -1 if there is no commentary
         */

    }, {
        key: 'channelIndexForExtendedCommentary',
        get: function get() {

            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = this._streams[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var stream = _step16.value;


                    if (stream.isExtendedCommentary === true) {

                        if (stream.type !== "Mono") {
                            throw new Error("The commentary must be mono!");
                        }

                        return channelIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        channelIndex += numChannelsForThisStream;
                    }
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }

            return -1;
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the mono dialog
         * 
         * Returns -1 if there is no commentary
         */

    }, {
        key: 'channelIndexForExtendedDialog',
        get: function get() {

            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
                for (var _iterator17 = this._streams[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var stream = _step17.value;


                    if (stream.isExtendedDialog === true) {

                        if (stream.type !== "Mono") {
                            throw new Error("The commentary must be mono!");
                        }

                        return channelIndex;
                    } else {
                        var numChannelsForThisStream = stream.numChannels;

                        channelIndex += numChannelsForThisStream;
                    }
                }
            } catch (err) {
                _didIteratorError17 = true;
                _iteratorError17 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion17 && _iterator17.return) {
                        _iterator17.return();
                    }
                } finally {
                    if (_didIteratorError17) {
                        throw _iteratorError17;
                    }
                }
            }

            return -1;
        }
    }]);

    return AudioStreamDescriptionCollection;
}();

//==============================================================================
/**
 * AudioStreamDescription describes a stream.
 */


var AudioStreamDescription = exports.AudioStreamDescription = function () {
    /**
     * AudioStreamDescription constructor
     * @param {string} type - type.
     * @param {boolean} active - active.
     * @param {number} loudness - loudness.
     * @param {number} maxTruePeak - maxTruePeak.
     * @param {boolean} dialog - dialog.
     * @param {boolean} ambiance - ambiance.
     * @param {number} trim - input trim level (in dB)
     */

    function AudioStreamDescription(type) {
        var active = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var loudness = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
        var maxTruePeak = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
        var dialog = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
        var ambiance = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
        var commentary = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

        _classCallCheck(this, AudioStreamDescription);

        this._type = type;
        this._active = active;
        this._loudness = loudness;
        this._maxTruePeak = maxTruePeak;
        this._dialog = dialog;
        this._ambiance = ambiance;
        this._commentary = commentary;
        this._trim = 0;
    }

    //==============================================================================
    /// if one of the value is NaN, this most likely means the stream was
    /// actually not in the EBU core.
    /// it should thus be considered as inactive   


    _createClass(AudioStreamDescription, [{
        key: 'channelIsCenter',


        //==============================================================================
        /**
         * Returns true if the i-th channel corresponds to center
         * @type {int} channelIndex : index of the channel to query
         */
        value: function channelIsCenter(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            if (this._type === "Mono") {
                return channelIndex === 0 ? true : false;
            } else if (this._type === "MultiWithoutLFE" || this._type === "MultiWithLFE") {
                return channelIndex === 2 ? true : false;
            } else {
                return false;
            }
        }

        /**
         * Returns true if the i-th channel corresponds to LFE
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: 'channelIsLfe',
        value: function channelIsLfe(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            if (this._type === "MultiWithLFE" && channelIndex === 3) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Returns true if the i-th channel corresponds to LEFT
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: 'channelIsLeft',
        value: function channelIsLeft(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === -30 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to RIGHT
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: 'channelIsRight',
        value: function channelIsRight(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === +30 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to LS
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: 'channelIsLeftSurround',
        value: function channelIsLeftSurround(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === -110 ? true : false;
        }

        /**
         * Returns true if the i-th channel corresponds to RS
         * @type {int} channelIndex : index of the channel to query
         */

    }, {
        key: 'channelIsRightSurround',
        value: function channelIsRightSurround(channelIndex) {

            if (channelIndex < 0 || channelIndex >= this.numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            var pos = this.channelPositions;

            return pos[channelIndex] === +110 ? true : false;
        }

        //==============================================================================
        /**
         * Returns the number of channels of the stream
         * @type {number}
         */

    }, {
        key: 'setTrimFromGui',


        //==============================================================================
        /**
         * Sets the trim level, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the trim
         */
        value: function setTrimFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -60;
            var maxValue = 30;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._trim = value;

            return value;
        }

        //==============================================================================
        /**
         * Set the loudness value of audio stream
         * @type {number}
         */

    }, {
        key: 'hasNaN',
        get: function get() {

            return isNaN(this._maxTruePeak) || isNaN(this._loudness);
        }

        //==============================================================================
        /**
         * Get channel position based on audio stream type
         * @type {number[]}
         */

    }, {
        key: 'channelPositions',
        get: function get() {
            switch (this._type) {
                case "Mono":
                    return [0];
                case "Stereo":
                    return [-30, +30];
                case "MultiWithoutLFE":
                    /// L, R, C, Ls, Rs.
                    return [-30, +30, 0, -110, +110];
                case "MultiWithLFE":
                    // L, R, C, Lfe, Ls, Rs.
                    // @n LFE position is irrelevant
                    // but provided so that the array has a length of 6
                    return [-30, +30, 0, 0, -110, +110];
                case "EightChannel":
                    // @todo set correct positions
                    return [1, 2, 3, 4, 5, 6, 7, 8];
            }
        }
    }, {
        key: 'numChannels',
        get: function get() {
            switch (this._type) {
                case "Mono":
                    return 1;
                case "Stereo":
                    return 2;
                case "MultiWithoutLFE":
                    return 5;
                case "MultiWithLFE":
                    return 6;
                case "EightChannel":
                    return 8;
            }
        }

        //==============================================================================
        /**
         * Returns the type of the stream
         * @type {string}
         */

    }, {
        key: 'type',
        get: function get() {
            return this._type;
        }

        //==============================================================================
        /**
         * Set active, if stream is currently playing or not
         * @type {boolean}
         */

    }, {
        key: 'active',
        set: function set(value) {
            this._active = value;
        }
        /**
         * Get active, if stream is currently playing or not
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._active && this.hasNaN === false;
        }

        //==============================================================================
        /**
         * Set the trim level (in dB)
         * @type {number}
         */

    }, {
        key: 'trim',
        set: function set(value) {
            this._trim = value;
        }
        /**
         * Get the trim level (in dB)
         * @type {number}
         */
        ,
        get: function get() {
            return this._trim;
        }
    }, {
        key: 'loudness',
        set: function set(value) {
            this._loudness = value;
        }
        /**
         * Get the loudness of audio stream
         * @type {number}
         */
        ,
        get: function get() {
            return this._loudness;
        }

        //==============================================================================
        /**
         * Set the maxTruePeak of audio stream
         * @type {number}
         */

    }, {
        key: 'maxTruePeak',
        set: function set(value) {
            this._maxTruePeak = value;
        }
        /**
         * Get the maxTruePeak of audio stream
         * @type {number}
         */
        ,
        get: function get() {
            return this._maxTruePeak;
        }

        //==============================================================================
        /**
         * Set dialog, if stream is currently a dialog or not
         * @type {boolean}
         */

    }, {
        key: 'dialog',
        set: function set(value) {
            this._dialog = value;
        }
        /**
         * Returns true if the stream is a dialog
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._dialog;
        }

        /**
         * Returns true if the stream contains ONLY dialog
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: 'isExtendedDialog',
        get: function get() {
            return this._dialog === true && this._ambiance === false && this._commentary === false;
        }

        //==============================================================================
        /**
         * Set ambiance, if stream is currently an ambiance or not
         * @type {boolean}
         */

    }, {
        key: 'ambiance',
        set: function set(value) {
            this._ambiance = value;
        }
        /**
         * Returns if the stream is an ambiance
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._ambiance;
        }

        /**
         * Returns true if the stream contains ONLY the ambiance
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: 'isExtendedAmbiance',
        get: function get() {
            return this._dialog === false && this._ambiance === true && this._commentary === false;
        }

        //==============================================================================
        /**
         * Set commentary, if stream is currently a commentary (audio description) or not
         * @type {boolean}
         */

    }, {
        key: 'commentary',
        set: function set(value) {
            this._commentary = value;
        }
        /**
         * Returns true if the stream is a commentary (audio description)
         * @type {boolean}
         */
        ,
        get: function get() {
            return this._commentary;
        }

        /**
         * Returns true if the stream contains ONLY the commentary (audio description)
         * (in which case, it is most likely a mono stream)
         * @type {boolean}
         */

    }, {
        key: 'isExtendedCommentary',
        get: function get() {
            return this._dialog === false && this._ambiance === false && this._commentary === true;
        }
    }]);

    return AudioStreamDescription;
}();

/**
* @external {AudioContext} https://developer.mozilla.org/fr/docs/Web/API/AudioContext
*/
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mean = mean;
exports.clamp = clamp;
exports.scale = scale;
exports.lin2dB = lin2dB;
exports.lin2dBsafe = lin2dBsafe;
exports.dB2lin = dB2lin;
exports.arrayAlmostEqual = arrayAlmostEqual;
exports.deg2rad = deg2rad;
exports.rad2deg = rad2deg;
exports.modulo = modulo;
exports.nav2trig = nav2trig;
exports.trig2nav = trig2nav;
exports.ms2sec = ms2sec;
exports.sec2ms = sec2ms;
/************************************************************************************/
/*!
 *   @file       utils.js
 *   @brief      Misc utility functions
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function mean(array) {

    if (array.length === 0) {
        throw new Error("pas bon");
    }

    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    var avg = total / array.length;

    return avg;
}

/**
 * Clips a value within a given range
 * @type {number} value the value to be clipped
 * @type {number} min the lower bound
 * @type {number} max the upper bound
 *
 */
function clamp(value, min, max) {

    if (max < min) {
        throw new Error("pas bon");
    }

    return Math.max(min, Math.min(value, max));
}

/**
 * linear rescaling bases on input and output domains
 *
 */
function scale(value, minIn, maxIn, minOut, maxOut) {

    if (maxIn === minIn) {
        throw new Error("pas bon");
    }

    var normalized = (value - minIn) / (maxIn - minIn);

    return minOut + normalized * (maxOut - minOut);
}

/**
 * linear gain to decibel conversion
 *
 */
function lin2dB(value) {

    if (value <= 0) {
        throw new Error("pas bon");
    }

    return 20 * Math.log10(value);
}

/**
 * linear gain to decibel conversion
 *
 */
function lin2dBsafe(value) {

    return 20 * Math.log10(Math.max(value, 1e-9));
}

/**
 * amplitude decibel to linear gain conversion
 *
 */
function dB2lin(value) {
    return Math.pow(10, value / 20);
}

/**
 * Compares two array. Returns true if they are (almost) equal
 */
function arrayAlmostEqual(array1, array2) {
    var tolerance = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];


    if (tolerance < 0.0) {
        throw new Error("pas bon");
    }

    if (array1.length != array2.length) {
        return false;
    }

    var size = array1.length;

    for (var i = 0; i < size; i++) {
        var val1 = array1[i];
        var val2 = array2[i];
        var diff = Math.abs(val1 - val2);

        if (diff > tolerance) {
            return false;
        }
    }

    return true;
}

//==============================================================================
/**
 * degrees to radians conversion
 */
function deg2rad(value) {
    return value * 0.017453292520;
}

/**
 * radians to degrees conversion
 */
function rad2deg(value) {
    return value * 57.295779513082;
}

//==============================================================================
/**
 * modulo (%) binary operator returning positive results
 */
function modulo(x, modu) {

    var y = x;
    while (y < 0.0) {
        y += modu;
    }

    while (y >= modu) {
        y -= modu;
    }

    return y;
}

//==============================================================================
/**
 *  @brief          navigationnal to trigonometric conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
function nav2trig(x) {
    return deg2rad(modulo(270.0 - x, 360.0) - 180.0);
}

/**
 *  @brief          trigonometric to navigationnal conversion
 *
 *  @details        navigationnal is expressed in degrees, clock-wise with 0 deg at (x,y)=(0,1)
 *                  trigonometric is expressed in radians, anticlock-wise with 0 deg at (x,y)=(1,0)
 */
function trig2nav(x) {
    return modulo(270.0 - rad2deg(x), 360.0) - 180.0;
}

//==============================================================================
/**
 * msec -> seconds
 */
function ms2sec(ms) {
    return ms / 1000.;
}

function sec2ms(sec) {
    return sec * 1000;
}

//==============================================================================
var utilities = {
    mean: mean,
    clamp: clamp,
    scale: scale,
    lin2dB: lin2dB,
    lin2dBsafe: lin2dBsafe,
    dB2lin: dB2lin,
    deg2rad: deg2rad,
    rad2deg: rad2deg,
    modulo: modulo,
    nav2trig: nav2trig,
    trig2nav: trig2nav,
    ms2sec: ms2sec,
    sec2ms: sec2ms,
    arrayAlmostEqual: arrayAlmostEqual
};

exports.default = utilities;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _multichannelgain = require('../dsp/multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

var _utils = require('../core/utils.js');

var _centerenhancement = require('../dsp/centerenhancement.js');

var _centerenhancement2 = _interopRequireDefault(_centerenhancement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the DialogEnhancement of M4DP
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

//import utilities from '../core/utils.js';


var DialogEnhancement = function (_AbstractNode) {
    _inherits(DialogEnhancement, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancement(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancement);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancement).call(this, audioContext, audioStreamDescriptionCollection));

        _this._mode = 0;
        _this._balance = 100.0;
        _this._isBypass = false;
        _this._processor1 = new DialogEnhancementProcessorMode1(audioContext, audioStreamDescriptionCollection);
        _this._processor2 = new DialogEnhancementProcessorMode2(audioContext, audioStreamDescriptionCollection);
        _this._processor3 = new DialogEnhancementProcessorMode3(audioContext, audioStreamDescriptionCollection);

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================


    _createClass(DialogEnhancement, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {

            this._chooseAppropriateMode();

            this._updateAudioGraph();
        }

        //==============================================================================

    }, {
        key: '_chooseAppropriateMode',


        //==============================================================================
        value: function _chooseAppropriateMode() {

            var mode = 0; ///< 0 corresponds to bypass

            if (this.hasActiveExtendedDialog === true && this.hasActiveExtendedAmbiance === true) {
                mode = 1;
            } else if (this.hasActiveMultiWithDialog === true) {
                mode = 2;
            } else if (this.hasActiveStereoWithDialog === true) {
                mode = 3;
            }

            /// mode 0 ==> bypass
            /// mode 1 ==> balance entre le Extended dialog et le Extended Ambiance
            /// le flux main est inchange
            /// mode 2 ==> on agit sur la voie centrale du Main, s'il s'agit d'un 5.1 ou 5.0
            /// mode 3 ==> lorsqu'on a juste un flux stereo

            this.mode = mode;
        }

        //==============================================================================
        /**
         * Set Mode - value is 1, 2 or 3
         * @type {number}
         */

    }, {
        key: 'setModeFromString',
        value: function setModeFromString(value) {

            if (value == 'Mode 1') {
                this.mode = 1;
            } else if (value == 'Mode 2') {
                this.mode = 2;
            } else if (value == 'Mode 3') {
                this.mode = 3;
            } else {
                throw new Error("Invalid mode " + value);
            }
        }

        /**
         * Get Mode - value is 0, 1, 2 or 3
         * @type {number}
         */

    }, {
        key: 'setBalanceFromGui',
        value: function setBalanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0;
            var maxValue = 100;

            /// scale from GUI to DSP
            var value = (0, _utils.scale)(valueFader, minFader, maxFader, minValue, maxValue);

            this.balance = value;

            return value;
        }
    }, {
        key: 'getBalanceFromGui',
        value: function getBalanceFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0;
            var maxValue = 100;

            var actualValue = this.balance;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================

    }, {
        key: '_update',
        value: function _update() {

            this._processor1.balance = this.balance;
            this._processor2.balance = this.balance;
            this._processor3.balance = this.balance;
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._processor1.disconnect();
            this._processor2.disconnect();

            var mode = this.mode;

            if (this.bypass === true || mode === 0) {

                this._input.connect(this._output);
            } else {

                if (mode === 1) {
                    this._input.connect(this._processor1._input);
                    this._processor1.connect(this._output);
                } else if (mode === 2) {
                    this._input.connect(this._processor2._input);
                    this._processor2.connect(this._output);
                } else if (mode === 3) {
                    this._input.connect(this._processor3._input);
                    this._processor3.connect(this._output);
                }
            }

            this._update();
        }
    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: 'hasActiveExtendedDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedDialog;
        }
    }, {
        key: 'channelIndexForExtendedDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.channelIndexForExtendedDialog;
        }
    }, {
        key: 'hasActiveExtendedAmbiance',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedAmbiance;
        }
    }, {
        key: 'hasActiveMultiWithDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveMultiWithDialog;
        }
    }, {
        key: 'hasActiveStereoWithDialog',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveStereoWithDialog;
        }
    }, {
        key: 'mode',
        set: function set(value) {

            console.log('DialogEnhancement to mode ' + value);

            if (value < 0 || value > 3) {
                throw new Error("Invalid mode " + value);
            }

            if (value != this._mode) {

                this._mode = value;
                this._updateAudioGraph();
            }
        },
        get: function get() {
            return this._mode;
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'balance',
        set: function set(value) {

            this._balance = value;

            this._update();
        }

        /**
         * Returns the balance (in 0 - 100 %) between dialogs and ambiance
         * @type {number}     
         */
        ,
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancement;
}(_index2.default);

exports.default = DialogEnhancement;

var DialogEnhancementProcessorMode1 = function (_AbstractNode2) {
    _inherits(DialogEnhancementProcessorMode1, _AbstractNode2);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode1(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode1);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode1).call(this, audioContext, audioStreamDescriptionCollection));

        _this2._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this2.getTotalNumberOfChannels();

        _this2._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this2._updateAudioGraph();
        return _this2;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode1, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Returns the current number of channels
         */

    }, {
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._gainsNode.getNumChannels();
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'isChannelForExtendedDialog',


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended dialog
         *      
         */
        value: function isChannelForExtendedDialog(channelIndex) {

            return this._audioStreamDescriptionCollection.isChannelForExtendedDialog(channelIndex);
        }

        //==============================================================================
        /**
         * Returns true if this channel index corresponds to the extended ambiance
         *      
         */

    }, {
        key: 'isChannelForExtendedAmbiance',
        value: function isChannelForExtendedAmbiance(channelIndex) {
            return this._audioStreamDescriptionCollection.isChannelForExtendedAmbiance(channelIndex);
        }

        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */

    }, {
        key: '_update',
        value: function _update() {

            var gainForDialogs = (0, _utils.scale)(this.balance, 0., 100., 0., 1.);
            var gainForAmbiance = 1.0 - gainForDialogs;

            for (var k = 0; k < this.getNumChannels(); k++) {

                if (this.isChannelForExtendedDialog(k) === true) {
                    this._gainsNode.setGain(k, gainForDialogs);
                } else if (this.isChannelForExtendedAmbiance(k) === true) {
                    this._gainsNode.setGain(k, gainForAmbiance);
                } else {
                    this._gainsNode.setGain(k, 1.0);
                }
            }
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);

            this._update();
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> only the dialogs
            /// 0% --> only the ambiance

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode1;
}(_index2.default);

var DialogEnhancementProcessorMode2 = function (_AbstractNode3) {
    _inherits(DialogEnhancementProcessorMode2, _AbstractNode3);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode2(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode2);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode2).call(this, audioContext, audioStreamDescriptionCollection));

        _this3._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this3.getTotalNumberOfChannels();

        _this3._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this3._updateAudioGraph();
        return _this3;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode2, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Returns the current number of channels
         */

    }, {
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._gainsNode.getNumChannels();
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: 'isChannelCenter',


        //==============================================================================
        /**
         * Returns true if this channel index corresponds to a center channel (of 5.0 or 5.1 stream)
         *      
         */
        value: function isChannelCenter(channelIndex) {
            return this._audioStreamDescriptionCollection.isChannelCenter(channelIndex);
        }

        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */

    }, {
        key: '_update',
        value: function _update() {

            var balanceIndB = (0, _utils.scale)(this.balance, 0., 100., -6., 6.);

            var gainForDialogs = (0, _utils.dB2lin)(balanceIndB);

            for (var k = 0; k < this.getNumChannels(); k++) {

                if (this.isChannelCenter(k) === true) {
                    this._gainsNode.setGain(k, gainForDialogs);
                } else {
                    this._gainsNode.setGain(k, 1.0);
                }
            }
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);

            this._update();
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> +6 dB for the dialog
            /// 0% --> -6 dB for the dialog

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode2;
}(_index2.default);

var DialogEnhancementProcessorMode3 = function (_AbstractNode4) {
    _inherits(DialogEnhancementProcessorMode3, _AbstractNode4);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.     
     */

    function DialogEnhancementProcessorMode3(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, DialogEnhancementProcessorMode3);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(DialogEnhancementProcessorMode3).call(this, audioContext, audioStreamDescriptionCollection));

        _this4._balance = 100;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this4.getTotalNumberOfChannels();

        _this4._channelSplitterNode = _this4._audioContext.createChannelSplitter(totalNumberOfChannels_);
        _this4._channelMergerNode = _this4._audioContext.createChannelMerger(totalNumberOfChannels_);

        _this4._input.connect(_this4._channelSplitterNode);

        _this4._channelSplitter2 = _this4._audioContext.createChannelSplitter(2);
        _this4._channelMerger2 = _this4._audioContext.createChannelMerger(2);

        ///
        _this4._centerEnhancement = new _centerenhancement2.default(audioContext);

        {
            _this4._channelSplitterNode.connect(_this4._channelMerger2, 0, 0);
            _this4._channelSplitterNode.connect(_this4._channelMerger2, 1, 1);

            _this4._channelMerger2.connect(_this4._centerEnhancement._input);
            _this4._centerEnhancement.connect(_this4._channelSplitter2);

            _this4._channelSplitter2.connect(_this4._channelMergerNode, 0, 0);
            _this4._channelSplitter2.connect(_this4._channelMergerNode, 1, 1);
        }

        for (var k = 2; k < totalNumberOfChannels_; k++) {
            _this4._channelSplitterNode.connect(_this4._channelMergerNode, k, k);
        }

        _this4._channelMergerNode.connect(_this4._output);

        return _this4;
    }

    //==============================================================================


    _createClass(DialogEnhancementProcessorMode3, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================       
        /**
         * Sets the balance (in 0 - 100 %) between dialogs and ambiance
         *      
         */

    }, {
        key: '_update',


        //==============================================================================
        /**
         * Updates the gains for each channel
         *      
         */
        value: function _update() {

            var balanceIndB = (0, _utils.scale)(this.balance, 0., 100., 0., 12.);

            this._centerEnhancement.gain = balanceIndB;
        }
    }, {
        key: 'balance',
        set: function set(value) {

            /// 100% --> +6 dB for the dialog
            /// 0% --> -6 dB for the dialog

            var percent = (0, _utils.clamp)(value, 0., 100.);

            this._balance = percent;

            this._update();
        },
        get: function get() {
            return this._balance;
        }
    }]);

    return DialogEnhancementProcessorMode3;
}(_index2.default);
},{"../core/index.js":2,"../core/utils.js":3,"../dsp/centerenhancement.js":7,"../dsp/multichannelgain.js":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       analysis.js
 *   @brief      This class implements an audio stream analysis
 *   @author     Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var AnalysisNode = function (_AbstractNode) {
  _inherits(AnalysisNode, _AbstractNode);

  //==============================================================================
  /**
   * @brief This class implements the analysis on a single channel.
   *        The analysis is based on AnalyserNode.
   *
   * @param {AudioContext} audioContext - audioContext instance.
   */

  function AnalysisNode(audioContext) {
    _classCallCheck(this, AnalysisNode);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AnalysisNode).call(this, audioContext));

    _this._analyser = audioContext.createAnalyser();
    _this._input.connect(_this._analyser);

    // default values
    _this._analyser.fftSize = 2048;
    _this._analyser.minDecibels = -100;
    _this._analyser.maxDecibels = -30;
    _this._analyser.smoothingTimeConstant = 0.85;
    _this._voiceMinFrequency = 300;
    _this._voiceMaxFrequency = 4000;

    _this._analyserUpdate();
    return _this;
  }

  //==============================================================================
  /**
   * Set the number of bins of the FFT
   * @type {number} fftSize : a non-zero power of 2 in a range from 32 to 2048
   */


  _createClass(AnalysisNode, [{
    key: 'getRMS',


    //==============================================================================
    /**
     * Get the RMS of the analysed signal.
     * @returns {number} RMS
     */
    value: function getRMS() {
      this._analyser.getFloatTimeDomainData(this._analysed);

      var rms = this._analysed.reduce(function (previous, current) {
        return previous + current * current;
      }, 0);

      return Math.sqrt(rms * this._binsGlobalNormalisation);
    }

    //==============================================================================
    /**
     * Get the emergence of the frequencies corresponding to the voice.
     * @returns {number} emergence : the difference, of the normalised magnitudes,
     * of the frequencies corresponding to the voice to the other frequencies.
     */

  }, {
    key: 'getVoiceEmergence',
    value: function getVoiceEmergence() {
      this._analyser.getFloatFrequencyData(this._analysed);

      var nonVoiceMagnitude = 0;

      var voiceMagnitude = 0;

      var bin = 0;

      for (; bin < this._voiceMinBin; ++bin) {
        nonVoiceMagnitude += this._analysed[bin];
      }

      for (; bin <= this._voiceMaxBin; ++bin) {
        voiceMagnitude += this._analysed[bin];
      }

      for (; bin < this._analyser.frequencyBinCount; ++bin) {
        nonVoiceMagnitude += this._analysed[bin];
      }

      return voiceMagnitude * this._binVoiceNormalisation - nonVoiceMagnitude * this._binNonVoiceNormalisation;
    }

    //==============================================================================
    /**
     * Update memory pre-allocation and pre-computed normalisation factors.
     * @private
     */

  }, {
    key: '_analyserUpdate',
    value: function _analyserUpdate() {
      this._voiceMinBin = Math.max(1, // avoid first FFT bin
      Math.min(this._analyser.frequencyBinCount - 1, Math.round(this._voiceMinFrequency * this._analyser.fftSize / this._audioContext.sampleRate)));

      this._voiceMaxBin = Math.max(this._voiceMinBin, Math.min(this._analyser.frequencyBinCount - 1, Math.round(this._voiceMaxFrequency * this._analyser.fftSize / this._audioContext.sampleRate)));

      this._binsGlobalNormalisation = 1 / this._analyser.frequencyBinCount;

      var voiceBinCount = this._voiceMaxBin - this._voiceMinBin + 1;

      this._binVoiceNormalisation = 1 / voiceBinCount;
      this._binNonVoiceNormalisation = 1 / (this._analyser.frequencyBinCount - voiceBinCount);

      // pre-allocation
      this._analysed = new Float32Array(this._analyser.frequencyBinCount);
    }
  }, {
    key: 'analyserFftSize',
    set: function set(fftSize) {
      this._analyser.fftSize = fftSize;
      this._analyserUpdate();
    }

    /**
     * Set the number of bins of the FFT
     * @type {number} fftSize
     */
    ,
    get: function get() {
      return this._analyser.fftSize;
    }

    //==============================================================================
    /**
     * Set the minimum threshold for the spectrum of the analyser node
     * @type {number} threshold : a value in dB
     */

  }, {
    key: 'analyserMinDecibels',
    set: function set(threshold) {
      this._analyser.minDecibels = threshold;
      this._analyserUpdate();
    }

    /**
     * Get the minimum threshold for the spectrum of the analyser node
     * @type {number} threshold
     */
    ,
    get: function get() {
      return this._analyser.minDecibels;
    }

    //==============================================================================
    /**
     * Set the maximum threshold for the spectrum of the analyser node
     * @type {number} threshold : a value in dB
     */

  }, {
    key: 'analyserMaxDecibels',
    set: function set(threshold) {
      this._analyser.maxDecibels = threshold;
      this._analyserUpdate();
    }

    /**
     * Get the maximum threshold for the spectrum of the analyser node
     * @type {number} threshold
     */
    ,
    get: function get() {
      return this._analyser.maxDecibels;
    }

    //==============================================================================
    /**
     * Set the smoothing time constant for the spectrum of the analyser node
     * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
     */

  }, {
    key: 'analyserSmoothingTimeConstant',
    set: function set(smoothing) {
      this._analyser.smoothingTimeConstant = smoothing;
      this._analyserUpdate();
    }

    /**
     * Get the smoothing time constant for the spectrum of the analyser node
     * @type {number} smoothing : it must be in the range 0 to 1 (0 meaning no time averaging).
     */
    ,
    get: function get() {
      return this._analyser.smoothingTimeConstant;
    }

    //==============================================================================
    /**
     * Set the minimum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */

  }, {
    key: 'voiceMinFrequency',
    set: function set(frequency) {
      this._voiceMinFrequency = frequency;
      this._analyserUpdate();
    }

    /**
     * Get the minimum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */
    ,
    get: function get() {
      return this._voiceMinFrequency;
    }

    //==============================================================================
    /**
     * Set the maximum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */

  }, {
    key: 'voiceMaxFrequency',
    set: function set(frequency) {
      this._voiceMaxFrequency = frequency;
      this._analyserUpdate();
    }

    /**
     * Get the maximum frequency corresponding to the voice
     * @type {number} frequency : in hertz
     */
    ,
    get: function get() {
      return this._voiceMaxFrequency;
    }
  }]);

  return AnalysisNode;
}(_index2.default);

exports.default = AnalysisNode;
},{"../core/index.js":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       cascade.js
 *   @brief      This class implements a cascade of BiquadFilterNodes
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var CascadeNode = function (_AbstractNode) {
    _inherits(CascadeNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a cascade of BiquadFilterNodes
     *        The filtering affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function CascadeNode(audioContext) {
        _classCallCheck(this, CascadeNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CascadeNode).call(this, audioContext));

        _this._isBypass = false;
        _this._biquadNodes = [];

        /// by default, 0 cascades.
        /// this will also update the audio graph
        _this.numCascades = 0;
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(CascadeNode, [{
        key: "setFrequency",


        //==============================================================================
        /**
         * Sets the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */
        value: function setFrequency(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].frequency.value = value;
        }

        /**
         * Returns the frequency of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getFrequency",
        value: function getFrequency(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].frequency;
        }

        //==============================================================================
        /**
         * Sets the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setQ",
        value: function setQ(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].Q.value = value;
        }

        /**
         * Returns the Q of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getQ",
        value: function getQ(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].Q;
        }

        //==============================================================================
        /**
         * Sets the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {float} value
         */

    }, {
        key: "setGain",
        value: function setGain(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].gain.value = value;
        }

        /**
         * Returns the gain of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getGain",
        value: function getGain(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].gain;
        }

        //==============================================================================
        /**
         * Sets the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         * @param {string} value
         */

    }, {
        key: "setType",
        value: function setType(biquadIndex, value) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this._biquadNodes[biquadIndex].type = value;
        }

        /**
         * Returns the type of the i-th biquad in the cascade
         * @param {int} biquadIndex
         */

    }, {
        key: "getType",
        value: function getType(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            return this._biquadNodes[biquadIndex].type;
        }

        //==============================================================================
        /**
         * Resets one biquad to its default
         * @param {int} biquadIndex
         */

    }, {
        key: "resetBiquad",
        value: function resetBiquad(biquadIndex) {

            /// boundary check
            if (biquadIndex < 0 || biquadIndex >= this.numCascades) {
                throw new Error("Invalid biquadIndex");
            }

            this.setType(biquadIndex, "lowpass");
            this.setGain(biquadIndex, 0.0);
            this.setFrequency(biquadIndex, 350);
            this.setQ(biquadIndex, 1);
        }

        /**
         * Resets all biquads
         */

    }, {
        key: "resetAllBiquads",
        value: function resetAllBiquads() {

            var numCascades = this.numCascades;

            for (var i = 0; i < numCascades; i++) {
                this.resetBiquad(i);
            }
        }

        //==============================================================================
        /**
         * Returns the number of biquads in the cascade
         */

    }, {
        key: "_updateAudioGraph",


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            var numCascades_ = this.numCascades;

            /// first of all, disconnect everything
            this._input.disconnect();
            for (var i = 0; i < numCascades_; i++) {
                this._biquadNodes[i].disconnect();
            }

            if (this.bypass === true || numCascades_ === 0) {
                this._input.connect(this._output);
            } else {
                /// connect the last element to the output
                this._biquadNodes[numCascades_ - 1].connect(this._output);

                /// connect the cascades
                for (var _i = numCascades_ - 1; _i > 0; _i--) {
                    this._biquadNodes[_i - 1].connect(this._biquadNodes[_i]);
                }

                /// connect the 1st biquad to the input
                this._input.connect(this._biquadNodes[0]);
            }
        }
    }, {
        key: "bypass",
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: "numCascades",
        get: function get() {
            return this._biquadNodes.length;
        }

        /**
         * Sets the number of cascades
         */
        ,
        set: function set(newNumCascades) {

            var currentNumCascades = this.numCascades;

            if (newNumCascades > currentNumCascades) {

                for (var i = currentNumCascades; i < newNumCascades; i++) {

                    var newBiquadNode = this._audioContext.createBiquadFilter();

                    this._biquadNodes.push(newBiquadNode);
                }
            } else if (newNumCascades < currentNumCascades) {

                this._biquadNodes.length = newNumCascades;
            }

            /// now update the audio connections
            this._updateAudioGraph();
        }
    }]);

    return CascadeNode;
}(_index2.default);

exports.default = CascadeNode;
},{"../core/index.js":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _lrms = require('./lrms.js');

var _lrms2 = _interopRequireDefault(_lrms);

var _phone = require('./phone.js');

var _phone2 = _interopRequireDefault(_phone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       centerenhancement.js
 *   @brief      Enhance the center channel : Start from LR signals, do MS conversion
 *               apply filtering in M, then do MS to LR conversion
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var CenterEnhancementNode = function (_AbstractNode) {
    _inherits(CenterEnhancementNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief Enhance the center channel
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function CenterEnhancementNode(audioContext) {
        _classCallCheck(this, CenterEnhancementNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CenterEnhancementNode).call(this, audioContext));

        _this._lr2ms = undefined;
        _this._phone = undefined;
        _this._ms2lr = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// Start from LR signals, do MS conversion
        /// apply filtering in M, then do MS to LR conversion

        _this._lr2ms = new _lrms2.default(audioContext);
        _this._ms2lr = new _lrms2.default(audioContext);
        _this._phone = new _phone2.default(audioContext);

        _this._channelSplitterNode = _this._audioContext.createChannelSplitter(2);
        _this._channelMergerNode = _this._audioContext.createChannelMerger(2);

        /// first convert from LR to MS
        _this._input.connect(_this._lr2ms._input);

        /// split M and S
        _this._lr2ms.connect(_this._channelSplitterNode);

        /// connect the M to the phone filter
        _this._channelSplitterNode.connect(_this._phone._input, 0, 0);

        /// connect the output of the phone filter to the 1st outlet
        _this._phone.connect(_this._channelMergerNode, 0, 0);

        /// the S signal is unaffected
        _this._channelSplitterNode.connect(_this._channelMergerNode, 1, 1);

        /// merge back the M and S
        _this._channelMergerNode.connect(_this._ms2lr._input);

        /// and perform MS to LR conversion
        _this._ms2lr.connect(_this._output);

        return _this;
    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */


    _createClass(CenterEnhancementNode, [{
        key: 'gain',
        set: function set(gainRequest) {
            this._phone.gain = gainRequest;
        }

        /**
         * Get the boost gain.
         * @type {number} boost
         */
        ,
        get: function get() {
            return this._phone.gain;
        }
    }]);

    return CenterEnhancementNode;
}(_index2.default);

exports.default = CenterEnhancementNode;
},{"../core/index.js":2,"./lrms.js":12,"./phone.js":14}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       compressor.js
 *   @brief      This class implements a multichannel Compressor
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelCompressorNode = function (_AbstractNode) {
    _inherits(MultichannelCompressorNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a multichannel Compressor
     *        The compressor affects all channel similarly
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     * @details It turns out the standard DynamicsCompressorNode from the WAA 
     *          does some weird stuff when the number of channels is 10 ( > 5.1 ?? )
     *
     *  So we created this class which just instanciate 10 mono compressor nodes in parallel
     *
     *  NB : the issues with DynamicsCompressorNode might come from the fact that 
     *  its default Channel count mode is "explicit"
     *  It could be possible (but not tested), to solve the issue
     *  by specifying : 
     *  DynamicsCompressorNode.channelCountMode = "max"
     *  DynamicsCompressorNode.channelCount = 10;
     *
     */

    function MultichannelCompressorNode(audioContext) {
        var numChannels = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, MultichannelCompressorNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelCompressorNode).call(this, audioContext));

        _this._compressorNodes = [];
        _this._splitterNode = undefined;
        _this._mergerNode = undefined;
        _this._isBypass = false;
        _this._drywet = 100;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        _this._gainDry = audioContext.createGain();
        _this._gainWet = audioContext.createGain();

        _this._splitterNode = audioContext.createChannelSplitter(numChannels);

        _this._mergerNode = audioContext.createChannelMerger(numChannels);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != numChannels) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != numChannels || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        /// create N compressorNodes
        for (var i = 0; i < numChannels; i++) {
            var newCompressorNode = audioContext.createDynamicsCompressor();
            _this._compressorNodes.push(newCompressorNode);
        }

        _this._updateAudioGraph();

        /// default it totally wet
        _this.drywet = _this._drywet;
        return _this;
    }

    //==============================================================================


    _createClass(MultichannelCompressorNode, [{
        key: 'getNumChannels',


        //==============================================================================
        value: function getNumChannels() {
            return this._compressorNodes.length;
        }

        //==============================================================================

    }, {
        key: 'getCompressorOfFirstChannel',
        value: function getCompressorOfFirstChannel() {

            if (this.getNumChannels() <= 0) {
                throw new Error("smothing is wrong");
            }

            return this._compressorNodes[0];
        }

        //==============================================================================

    }, {
        key: 'getReductionForChannel',
        value: function getReductionForChannel(channelIndex) {

            /// representing the amount of gain reduction currently applied by the compressor to the signal.

            var numChannels = this.getNumChannels();

            if (channelIndex < 0 || channelIndex >= numChannels) {
                throw new Error("Invalid channel index : " + channelIndex);
            }

            return this._compressorNodes[channelIndex].reduction.value;
        }

        //==============================================================================

    }, {
        key: 'getReduction',
        value: function getReduction() {

            /// returns the minimum reduction among all channels
            var reduction = 0.0;

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {

                var reductionForThisChannel = this.getReductionForChannel(i);

                reduction = Math.min(reduction, reductionForThisChannel);
            }

            return reduction;
        }

        //==============================================================================
        /**
         * Returns the dynamic compression state (i.e. true if actually compressing)
         * @type {boolean}
         */

    }, {
        key: 'setThreshold',


        //==============================================================================
        value: function setThreshold(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].threshold.value = value;
            }
        }
    }, {
        key: 'getThreshold',
        value: function getThreshold() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().threshold.value;
        }

        //==============================================================================

    }, {
        key: 'setRatio',


        //==============================================================================
        value: function setRatio(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].ratio.value = value;
            }
        }
    }, {
        key: 'getRatio',
        value: function getRatio() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().ratio.value;
        }

        //==============================================================================

    }, {
        key: 'setAttack',


        //==============================================================================
        value: function setAttack(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].attack.value = value;
            }
        }
    }, {
        key: 'getAttack',
        value: function getAttack() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().attack.value;
        }

        //==============================================================================

    }, {
        key: 'setRelease',


        //==============================================================================
        value: function setRelease(value) {
            /// the parameter is applied similarly to all channels

            var numChannels = this.getNumChannels();

            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].release.value = value;
            }
        }
    }, {
        key: 'getRelease',
        value: function getRelease() {
            /// the parameter is the same for all channels

            return this.getCompressorOfFirstChannel().release.value;
        }

        //==============================================================================

    }, {
        key: '_updateAudioGraph',


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            var numChannels = this.getNumChannels();

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();
            for (var i = 0; i < numChannels; i++) {
                this._compressorNodes[i].disconnect();
            }

            this._gainWet.disconnect();
            this._gainDry.disconnect();

            if (this.bypass === true || numChannels === 0) {

                this._input.connect(this._output);
            } else {

                /// split the input streams into N independent channels           
                this._input.connect(this._splitterNode);
                this._input.connect(this._gainDry);

                /// connect a compressorNodes to each channel
                for (var _i = 0; _i < numChannels; _i++) {
                    this._splitterNode.connect(this._compressorNodes[_i], _i);
                }

                /// then merge the output of the N compressorNodes
                for (var _i2 = 0; _i2 < numChannels; _i2++) {
                    this._compressorNodes[_i2].connect(this._mergerNode, 0, _i2);
                }

                this._mergerNode.connect(this._gainWet);

                this._gainWet.connect(this._output);
                this._gainDry.connect(this._output);
            }

            /// update the drywet
            this.drywet = this._drywet;
        }
    }, {
        key: 'drywet',
        set: function set(value) {

            /// 100% --> totally wet
            /// 0% --> totally dry

            var percent = _utils2.default.clamp(value, 0, 100);

            this._drywet = percent;

            var wet = percent;
            var dry = 100 - percent;

            this._gainDry.gain.value = dry / 100.;
            this._gainWet.gain.value = wet / 100.;
        },
        get: function get() {
            return this._drywet;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: 'dynamicCompressionState',
        get: function get() {

            var reduction = this.getReduction();

            var state = reduction < -0.5 ? true : false;

            return state;
        }
    }], [{
        key: 'minThreshold',
        get: function get() {
            /// minimum value of the WAA
            return -100;
        }
    }, {
        key: 'maxThreshold',
        get: function get() {
            /// maximum value of the WAA
            return 0;
        }
    }, {
        key: 'defaultThreshold',
        get: function get() {
            /// default value of the WAA
            return -24;
        }
    }, {
        key: 'minRatio',
        get: function get() {
            /// minimum value of the WAA
            return 1;
        }
    }, {
        key: 'maxRatio',
        get: function get() {
            /// maximum value of the WAA
            return 20;
        }
    }, {
        key: 'defaultRatio',
        get: function get() {
            /// default value of the WAA
            return 12;
        }
    }, {
        key: 'minAttack',
        get: function get() {
            /// minimum value of the WAA (in seconds)
            return 0;
        }
    }, {
        key: 'maxAttack',
        get: function get() {
            /// maximum value of the WAA (in seconds)
            return 1;
        }
    }, {
        key: 'defaultAttack',
        get: function get() {
            /// default value of the WAA (in seconds)
            return 0.003;
        }
    }, {
        key: 'minRelease',
        get: function get() {
            /// minimum value of the WAA (in seconds)
            return 0;
        }
    }, {
        key: 'maxRelease',
        get: function get() {
            /// maximum value of the WAA (in seconds)
            return 1;
        }
    }, {
        key: 'defaultRelease',
        get: function get() {
            /// default value of the WAA (in seconds)
            return 0.25;
        }
    }]);

    return MultichannelCompressorNode;
}(_index2.default);

exports.default = MultichannelCompressorNode;
},{"../core/index.js":2,"../core/utils.js":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       headphoneequalization.js
 *   @brief      This class implements the headphone equalization node
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var HeadphonesEqualization = function (_CascadeNode) {
    _inherits(HeadphonesEqualization, _CascadeNode);

    //==============================================================================
    /**
     * @brief This class implements the headphone equalization.
     *        It thus applies filtering on 2 channels (2 in, 2 out)
     *        The filtering is based on parametric filters (BiquadFilterNode); various settings are hard-coded
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function HeadphonesEqualization(audioContext) {
        _classCallCheck(this, HeadphonesEqualization);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HeadphonesEqualization).call(this, audioContext));

        _this._eqPreset = 'none';
        return _this;
    }

    //==============================================================================
    /**
     * Loads a new headphones equalization preset
     * @type {string} value : the name of the preset (they are hard-coded) 
     */


    _createClass(HeadphonesEqualization, [{
        key: '_updateCascade',


        //==============================================================================
        value: function _updateCascade() {

            var presetName = this.eqPreset;

            if (presetName === 'none') {
                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 0, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);
            } else if (presetName === 'eq1') {

                /// whatever settings... waiting for FTV to communicate their specifications

                _set(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'numCascades', 3, this);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'resetAllBiquads', this).call(this);

                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 0, 'highpass');
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 1, 'peaking');
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setType', this).call(this, 2, 'lowpass');

                /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 0, -12);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 1, 6);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setGain', this).call(this, 2, -16);

                /// measured in hertz (Hz)
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 0, 200);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 1, 1000);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setFrequency', this).call(this, 2, 4000);

                /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 0, 1);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 1, 2);
                _get(Object.getPrototypeOf(HeadphonesEqualization.prototype), 'setQ', this).call(this, 2, 1);
            } else {
                throw new Error('Invalid preset name ' + presetName);
            }
        }
    }, {
        key: 'eqPreset',
        set: function set(presetName) {
            this._eqPreset = presetName;
            this._updateCascade();
        }

        /**
         * Returns the name of the current headphones equalization preset
         * @type {string}
         */
        ,
        get: function get() {
            return this._eqPreset;
        }
    }]);

    return HeadphonesEqualization;
}(_cascade2.default);

exports.default = HeadphonesEqualization;
},{"../core/index.js":2,"../dsp/cascade.js":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MultichannelGainNode = exports.VirtualSpeakersNode = exports.TransauralShufflerNode = exports.TransauralFeedforwardNode = exports.TransauralNode = exports.SumDiffNode = exports.HeadphonesEqualization = exports.AnalysisNode = exports.CascadeNode = undefined;

var _cascade = require('./cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _analysis = require('./analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _headphoneequalization = require('./headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

var _transaural = require('./transaural.js');

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _virtualspeakers = require('./virtualspeakers.js');

var _virtualspeakers2 = _interopRequireDefault(_virtualspeakers);

var _multichannelgain = require('./multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _cascade2.default;
exports.AnalysisNode = _analysis2.default;
exports.HeadphonesEqualization = _headphoneequalization2.default;
exports.SumDiffNode = _sumdiff2.default;
exports.TransauralNode = _transaural.TransauralNode;
exports.TransauralFeedforwardNode = _transaural.TransauralFeedforwardNode;
exports.TransauralShufflerNode = _transaural.TransauralShufflerNode;
exports.VirtualSpeakersNode = _virtualspeakers2.default;
exports.MultichannelGainNode = _multichannelgain2.default; /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Exports the dsp modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/
},{"./analysis.js":5,"./cascade.js":6,"./headphoneequalization.js":9,"./multichannelgain.js":13,"./sumdiff.js":15,"./transaural.js":16,"./virtualspeakers.js":17}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.getKemar2btFilters=getKemar2btFilters; /************************************************************************************/ /*!
 *   @file       kemar.js
 *   @brief      Kemar hard-coded filters
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */ /************************************************************************************/function getKemar2btSumFilter(samplerate,speakerSpan){ /// kemar binaural to transaural FIR filter (for shuffler), Sum filter
/// for speaker span = 20 deg (i.e -10 / +10)
var kemar_2bt_fir_44100_sum_20=[0.45217499,-0.10555233,-0.069028854,-0.027416166,0.0030960608,0.016595943,0.014801808,0.0040745577,-0.0075133964,-0.013302729,-0.010770257,-0.0024193162,0.006069439,0.0095740501,0.0067726863,0.00065748446,-0.0040000463,-0.004299181,-0.0012275606,0.0014104891,0.0002168279,-0.0049897116,-0.010946623,-0.013421881,-0.010424616,-0.0036872397,0.0026414809,0.0050017736,0.0028187584,-0.0014236768,-0.0042953026,-0.003967443,-0.0012757069,0.0013262781,0.0018894118,0.00042001891,-0.0013898293,-0.0017511012,-0.00028009916,0.0017948451,0.0027850294,0.0020043319,0.0003113579,-0.00067279127,3.611518e-05,0.0019532901,0.0035328299,0.0034494854,0.0016861944,-0.00045207888,-0.0013857335,-0.00050539011,0.0013800729,0.0027205038,0.002453821,0.00080344104,-0.0009587977,-0.00154908,-0.00065962988,0.00086680695,0.0017640169,0.0013505196,1.6196469e-05,-0.0011584897,-0.0012961173,-0.00039475452,0.00073412718,0.0011646874,0.00059894042,-0.00043831268,-0.001072151,-0.00080092455,0.00012108983,0.00092772534,0.00098205858,0.00028096361,-0.00057306996,-0.00088328955,-0.0004208459,0.0004132285,0.00093591044,0.00073838525,-1.7246351e-06,-0.00068819692,-0.00079752208,-0.0002885006,0.00038987139,0.0006779657,0.00035260443,-0.00031489227,-0.00079900835,-0.00074752374,-0.0002486523,0.00026408827,0.00037396408,9.1789489e-06,-0.00052021298,-0.00078935735,-0.00060126995,-0.00012975032,0.00023935355,0.00022590974,-0.00012835328,-0.00051102065,-0.00060217245,-0.00032920754,8.8408662e-05,0.00032863728,0.00022766829,-9.8700766e-05,-0.0003619726,-0.000339213,-4.6741174e-05,0.00028506029,0.00040532643,0.00024235192,-4.9208091e-05,-0.00022286834,-0.00014035191,0.00012475753,0.00035664882,0.00037576814,0.0001790089,-6.7292058e-05,-0.00016804381,-5.5171866e-05,0.000165643,0.00030831626,0.00025826297,5.9390753e-05,-0.00012916565,-0.00016521131,-3.5047025e-05,0.00014282037,0.00021888615,0.00013289784,-4.3155327e-05,-0.00016918851,-0.00015168118,-1.526935e-05,0.00012313278,0.00015192232,5.292175e-05,-8.92842e-05,-0.00015994335,-0.00010673668,2.2054695e-05,0.00012112471,0.00011454397,1.4244167e-05,-9.4233175e-05,-0.0001235138,-5.3740827e-05,5.5298158e-05,0.000115783,8.289369e-05,-1.2041832e-05,-9.0489186e-05,-9.1459282e-05,-1.88508e-05,6.5169319e-05,9.2583228e-05,4.3741256e-05,-3.9660295e-05,-9.0891568e-05,-7.2363691e-05,-3.7888731e-06,5.6571658e-05,6.0180286e-05,6.181051e-06,-6.0468257e-05,-8.7059212e-05,-5.5284825e-05,6.130464e-06,4.6733083e-05,3.5483943e-05,-1.5703094e-05,-6.372264e-05,-7.0116585e-05,-3.1301584e-05,2.0455855e-05,4.4510307e-05,2.4459636e-05,-2.0198569e-05,-5.1476218e-05,-4.4009525e-05,-4.4931448e-06,3.5329242e-05,4.5137804e-05,1.9953297e-05,-1.7307571e-05,-3.5507532e-05,-2.0408856e-05,1.495331e-05,4.2063974e-05,4.0348619e-05,1.3041322e-05,-1.6660351e-05,-2.5042977e-05,-6.6802063e-06,2.2267601e-05,3.8032616e-05,2.8490669e-05,2.1501719e-06,-1.9687322e-05,-2.0476524e-05,-1.2626481e-06,2.1110496e-05,2.8208819e-05,1.4707269e-05,-8.0898571e-06,-2.2092374e-05,-1.7112638e-05,1.4973352e-06,1.7928463e-05,1.9003939e-05,4.4748854e-06,-1.3481739e-05,-2.058178e-05,-1.1865299e-05,4.8742686e-06,1.5947258e-05,1.2924211e-05,-9.7738905e-07,-1.4077048e-05,-1.594662e-05,-5.6085746e-06,8.1947992e-06,1.4446204e-05,8.6985183e-06,-3.7614486e-06,-1.2629604e-05,-1.101979e-05,-7.3516719e-07,9.6287386e-06,1.1859436e-05,4.6124928e-06,-5.8933547e-06,-1.1208869e-05,-7.4652257e-06,1.8115013e-06,8.8956012e-06,8.2110246e-06,6.3496941e-07,-7.5426619e-06,-9.8911023e-06,-4.9375394e-06,2.9364116e-06,7.2835855e-06,4.8111865e-06,-2.1802632e-06,-7.9205811e-06,-7.9275687e-06,-2.4878175e-06,3.8274698e-06,6.013956e-06,2.6203202e-06,-3.2955427e-06,-6.8339327e-06,-5.2356972e-06,4.5968861e-08,4.7221683e-06,5.2167075e-06,1.4583102e-06,-3.2541532e-06,-5.0484964e-06,-2.5788927e-06,2.0432271e-06,5.107273e-06,4.3281307e-06,5.7853237e-07,-2.9732294e-06,-3.4970512e-06,-7.2436433e-07,2.9778369e-06,4.6247806e-06,3.0122073e-06,-4.2509598e-07,-2.8913948e-06,-2.516967e-06,2.1203944e-07,2.9670964e-06,3.5223784e-06,1.5133825e-06,-1.3738606e-06,-2.8480872e-06,-1.8595147e-06,6.3647752e-07,2.54508e-06,2.353423e-06,2.9786483e-07,-1.9174679e-06,-2.5496699e-06,-1.1996832e-06,9.4411973e-07,2.1328042e-06,1.4721971e-06,-4.1537848e-07,-1.9663833e-06,-1.9658353e-06,-4.9133644e-07,1.2177395e-06,1.8042298e-06,8.7407898e-07,-7.4400242e-07,-1.7214155e-06,-1.3094075e-06,9.8873699e-08,1.3412401e-06,1.4483935e-06,4.0115833e-07,-9.0572081e-07,-1.4216811e-06,-7.8085577e-07,4.4521184e-07,1.2510652e-06,1.0173629e-06,-1.9208407e-08,-9.9944589e-07,-1.1556061e-06,-4.1436098e-07,5.8286048e-07,1.0267732e-06,5.905319e-07,-3.3726602e-07,-9.9888803e-07,-8.8748385e-07,-1.3491335e-07,6.2726428e-07,7.9506844e-07,2.6901228e-07,-4.9438427e-07,-8.7430118e-07,-5.8632816e-07,1.1032444e-07,6.4739078e-07,6.1423077e-07,7.4435206e-08,-5.1031395e-07,-6.6759526e-07,-2.8917572e-07,3.0279611e-07,6.3408612e-07,4.6211497e-07,-4.4510816e-08,-4.6184738e-07,-4.6027515e-07,-6.0537069e-08,4.0159529e-07,5.5829736e-07,3.0278622e-07,-1.4017259e-07,-4.1017e-07,-3.0390376e-07,7.2341621e-08,4.0368329e-07,4.274082e-07,1.3833365e-07,-2.209138e-07,-3.6538296e-07,-1.9570896e-07,1.3328622e-07,3.4903309e-07,2.8354225e-07,8.7466528e-10,-2.6608984e-07,-3.0919847e-07,-1.0853854e-07,1.6197693e-07,2.8284398e-07,1.6529698e-07,-8.5453919e-08,-2.6405647e-07,-2.3310892e-07,-2.8353503e-08,1.7895546e-07,2.249857e-07,8.2658246e-08,-1.2433054e-07,-2.2767227e-07,-1.5020967e-07,3.7837811e-08,1.8242525e-07,1.7220162e-07,2.4380492e-08,-1.3585928e-07,-1.8037383e-07,-7.9725595e-08,7.8827441e-08,1.6675278e-07,1.1828708e-07,-2.0856762e-08,-1.3571032e-07,-1.3684382e-07,-2.9807765e-08,9.4411618e-08,1.3609535e-07,6.6268036e-08,-5.4155553e-08,-1.2746047e-07,-9.8503953e-08,3.919947e-09,9.4434391e-08,1.0177257e-07,2.4472531e-08,-7.1731527e-08,-1.0960504e-07,-6.2211626e-08,2.846569e-08,8.8497927e-08,7.2288394e-08,-2.8490781e-09,-7.3812295e-08,-8.4177508e-08,-2.8542319e-08,4.5940503e-08,7.974068e-08,4.8761908e-08,-1.8496188e-08,-6.6363413e-08,-5.7571341e-08,-1.7864624e-09,5.457639e-08,6.7099798e-08,2.8435558e-08,-2.7879203e-08,-5.619566e-08,-3.5564685e-08,1.500624e-08,5.3770911e-08,5.0544219e-08,9.9922222e-09,-3.3940829e-08,-4.6495021e-08,-1.96654e-08,2.2909452e-08,4.6387537e-08,3.293318e-08,-5.0682791e-09,-3.6448103e-08,-3.6952674e-08,-8.0768592e-09,2.5514579e-08,3.6778253e-08,1.7843439e-08,-1.4788264e-08,-3.4630126e-08,-2.6730053e-08,1.10816e-09,2.5734035e-08,2.7814872e-08,6.9403798e-09,-1.9077348e-08,-2.9300102e-08,-1.6420525e-08,8.1831235e-09,2.4466111e-08,2.0059879e-08,-3.4829581e-10,-1.9651946e-08,-2.2548427e-08,-7.5643838e-09,1.2522931e-08,2.1575287e-08,1.3057368e-08,-5.3057727e-09,-1.8418094e-08,-1.616794e-08,-1.1675265e-09,1.4004462e-08,1.7305867e-08,6.7418067e-09,-8.5967029e-09,-1.6331235e-08,-1.0777057e-08,2.9170237e-09,1.3433574e-08,1.2585468e-08,1.632795e-09,-1.0224734e-08,-1.3563037e-08,-6.2099863e-09,5.426219e-09,1.1896689e-08,8.3605212e-09,-1.829877e-09,-1.0227197e-08,-1.0256025e-08,-2.3206506e-09,6.8915655e-09,1.0045894e-08,5.0042002e-09,-3.763037e-09,-9.07563e-09,-6.8782686e-09,7.1535883e-10,7.42939e-09,8.0211091e-09,2.3773221e-09,-4.6735389e-09,-7.4532887e-09,-3.9777683e-09,2.6709823e-09,7.0596964e-09,5.8346674e-09,2.6604163e-10,-5.007788e-09,-5.8358505e-09,-1.8158187e-09,3.5902878e-09,6.0076037e-09,3.6635404e-09];var kemar_2bt_fir_44100_sum_40=[0.483219,-0.029019328,-0.018102882,-0.011331501,-0.015331033,-0.030668585,-0.050735217,-0.064747244,-0.063270479,-0.043345142,-0.010416521,0.024069751,0.048166562,0.055013325,0.045470588,0.026541747,0.0068469434,-0.0079216138,-0.016887993,-0.022497885,-0.027193425,-0.030867925,-0.030892,-0.024485994,-0.011490822,0.0046267016,0.018331109,0.025051398,0.023588154,0.01633144,0.0073406603,-0.00020183601,-0.0053857993,-0.0090681426,-0.012188249,-0.014414829,-0.014215186,-0.01021562,-0.0026832239,0.0061127925,0.013006348,0.015722789,0.01407407,0.0097682374,0.0050829933,0.0014405758,-0.0011162431,-0.0033199841,-0.0055893543,-0.0074004149,-0.0076116375,-0.005434955,-0.0012372645,0.0034830004,0.0069370624,0.0080745602,0.0070625138,0.0049337759,0.002756052,0.00098411716,-0.00056291121,-0.0021945243,-0.0038158875,-0.0048425263,-0.0046253372,-0.0030135454,-0.00057617691,0.0017081632,0.0030513783,0.0032838939,0.0028068824,0.0021557536,0.0015598052,0.00085304771,-0.00022538997,-0.001634441,-0.002904719,-0.0034127636,-0.0028425374,-0.0014563669,5.4215619e-05,0.0010305473,0.001265315,0.0010599624,0.00089581683,0.0010003994,0.0011648657,0.00095496973,0.00013293597,-0.001065339,-0.0020365324,-0.0022282787,-0.001545242,-0.00042431432,0.00048110262,0.00076349464,0.00051647553,0.00019740297,0.00022132718,0.00061543542,0.0010055886,0.00093721563,0.00026778702,-0.00068471354,-0.0013564868,-0.0013483755,-0.00071393326,9.3274954e-05,0.00056471676,0.00050334388,0.000133515,-0.00011612254,2.7139833e-05,0.00046355021,0.00081172999,0.00072474085,0.00017597427,-0.00050924433,-0.00089589122,-0.00076183211,-0.00025127249,0.00025161169,0.00042057657,0.00022174942,-9.059583e-05,-0.00019982833,1.3102281e-05,0.00038032507,0.00059059088,0.00044334607,9.5776195e-06,-0.00042352345,-0.0005737493,-0.00037362019,-7.6162733e-06,0.00024351882,0.00022158626,5.7927031e-07,-0.00019156603,-0.00016741343,6.8359142e-05,0.00032798384,0.00039632665,0.00020432411,-0.0001176512,-0.00034439695,-0.00033074775,-0.00011735837,0.00011208127,0.00018192934,6.0602324e-05,-0.00012449827,-0.00019911809,-8.6743596e-05,0.00013075842,0.0002818169,0.0002442493,4.2012412e-05,-0.00017588552,-0.00025412903,-0.00015085902,3.5704343e-05,0.00015123827,0.0001095526,-4.2465123e-05,-0.00016832619,-0.00015547253,-6.2903518e-06,0.00016515983,0.00022553556,0.00012810959,-5.1975734e-05,-0.00017904514,-0.00016384153,-3.0718165e-05,0.00010637903,0.0001372129,4.2119042e-05,-9.576141e-05,-0.00016009145,-9.5267336e-05,5.0263068e-05,0.00016408481,0.00015942956,4.2458269e-05,-9.4978765e-05,-0.00014922854,-8.5477346e-05,3.8127255e-05,0.00011980625,9.5760144e-05,-1.1016054e-05,-0.00011187989,-0.00012469519,-3.8649014e-05,7.8938305e-05,0.00013733354,9.3820803e-05,-1.4593857e-05,-0.00010266536,-0.00010482282,-2.5204334e-05,6.8593472e-05,0.00010107059,4.8394788e-05,-4.4791897e-05,-0.00010293217,-8.0082144e-05,4.8533429e-06,8.490702e-05,9.889264e-05,3.8863607e-05,-4.5693752e-05,-8.8620145e-05,-5.925708e-05,1.5182308e-05,7.3390263e-05,6.949158e-05,8.5278189e-06,-5.9390877e-05,-8.0132319e-05,-3.8279759e-05,3.2036856e-05,7.5555748e-05,5.9838687e-05,-2.5224912e-07,-5.6012384e-05,-6.4318694e-05,-2.1141215e-05,3.6906913e-05,6.2980347e-05,3.7290582e-05,-1.8277156e-05,-5.887256e-05,-5.2797979e-05,-6.0183647e-06,4.3786546e-05,5.7871512e-05,2.6822612e-05,-2.3157865e-05,-5.2141415e-05,-3.8325117e-05,5.5357741e-06,4.3465789e-05,4.5461442e-05,1.094182e-05,-3.1785956e-05,-4.8787231e-05,-2.7401487e-05,1.4497267e-05,4.3555716e-05,3.7641792e-05,2.8078684e-06,-3.2471158e-05,-4.0464205e-05,-1.5944026e-05,2.0508769e-05,3.9610382e-05,2.67326e-05,-7.0646311e-06,-3.4579043e-05,-3.4386103e-05,-7.4857635e-06,2.422487e-05,3.5835179e-05,1.9058547e-05,-1.1854556e-05,-3.2096083e-05,-2.6147745e-05,3.5959428e-07,2.5809404e-05,3.0141773e-05,1.05709e-05,-1.6802658e-05,-3.0267211e-05,-1.9729832e-05,5.7593338e-06,2.5759198e-05,2.4855604e-05,4.5636871e-06,-1.8464656e-05,-2.6041995e-05,-1.2770105e-05,1.0176219e-05,2.4404919e-05,1.8999443e-05,-1.1681119e-06,-1.9803563e-05,-2.2367241e-05,-7.4145314e-06,1.2731202e-05,2.212546e-05,1.3828517e-05,-4.9799637e-06,-1.9141944e-05,-1.7699738e-05,-2.343493e-06,1.4366934e-05,1.9246643e-05,8.8575052e-06,-8.1357202e-06,-1.8189297e-05,-1.3676504e-05,1.3414245e-06,1.4718114e-05,1.603789e-05,4.72182e-06,-9.8746732e-06,-1.6162492e-05,-9.4959169e-06,4.4287804e-06,1.4414214e-05,1.2748887e-05,1.1385865e-06,-1.0964939e-05,-1.4056003e-05,-6.0362649e-06,6.4028095e-06,1.3345109e-05,9.5472151e-06,-1.6139616e-06,-1.1101343e-05,-1.1515934e-05,-2.849217e-06,7.7717414e-06,1.1933422e-05,6.5886306e-06,-3.7390564e-06,-1.0772939e-05,-9.1129286e-06,-3.7294157e-07,8.3343339e-06,1.0176018e-05,3.9534921e-06,-5.1562492e-06,-9.8915561e-06,-6.6826592e-06,1.6743354e-06,8.4364656e-06,8.3474242e-06,1.7132351e-06,-6.0324046e-06,-8.7735234e-06,-4.5369916e-06,3.1042355e-06,8.0312129e-06,6.4723677e-06,-1.1814934e-07,-6.3860775e-06,-7.4181971e-06,-2.584846e-06,4.1154849e-06,7.3573224e-06,4.7156118e-06,-1.5318919e-06,-6.3571583e-06,-6.024859e-06,-9.7874397e-07,4.6536893e-06,6.4306046e-06,3.0934498e-06,-2.5571883e-06,-6.0028278e-06,-4.6145387e-06,3.4961951e-07,4.8684665e-06,5.4110005e-06,1.6906598e-06,-3.2237456e-06,-5.4345214e-06,-3.3031727e-06,1.3434347e-06,4.769191e-06,4.3284267e-06,5.0390167e-07,-3.5825435e-06,-4.7134531e-06,-2.1045653e-06,2.065337e-06,4.4689036e-06,3.2821858e-06,-4.3690196e-07,-3.6805868e-06,-3.9206493e-06,-1.0756165e-06,2.5119004e-06,3.9996166e-06,2.2941022e-06,-1.1528542e-06,-3.5737776e-06,-3.1042728e-06,-2.1455017e-07,2.7420861e-06,3.4428592e-06,1.4175668e-06,-1.6478482e-06,-3.3108122e-06,-2.3160298e-06,4.6126237e-07,2.7776991e-06,2.8311117e-06,6.5955919e-07,-1.9535996e-06,-2.9412834e-06,-1.5853453e-06,9.6730957e-07,2.6708508e-06,2.2181616e-06,4.0786485e-08,-2.091225e-06,-2.5060233e-06,-9.3883551e-07,1.3099104e-06,2.4507067e-06,1.6270156e-06,-4.4525945e-07,-2.0952477e-06,-2.04246e-06,-3.8823529e-07,1.5125187e-06,2.1591172e-06,1.0882645e-06,-7.9884592e-07,-1.9920794e-06,-1.5792781e-06,5.8790135e-08,1.5929334e-06,1.8224046e-06,6.1297965e-07,-1.0352544e-06,-1.8129399e-06,-1.1401975e-06,4.038599e-07,1.576546e-06,1.4704623e-06,2.1397075e-07,-1.166067e-06,-1.5820145e-06,-7.4136926e-07,6.5165489e-07,1.4840487e-06,1.1221059e-06,-1.0801438e-07,-1.2101297e-06,-1.3236137e-06,-3.9418597e-07,8.1188716e-07,1.338188e-06,7.9558743e-07,-3.5230562e-07,-1.1831144e-06,-1.0558853e-06,-1.0428128e-07,8.9564924e-07,1.1572821e-06,5.012534e-07,-5.2515509e-07,-1.1032201e-06,-7.9499887e-07,1.2633657e-07,9.1599679e-07,9.5881751e-07,2.4755016e-07,-6.3289406e-07,-9.8545217e-07,-5.5201747e-07,2.9944957e-07,8.8583624e-07,7.5620159e-07,3.7550059e-08,-6.852477e-07,-8.446965e-07,-3.3551373e-07,4.1903738e-07,8.1803256e-07,5.60844e-07,-1.2748248e-07,-6.914272e-07,-6.9271198e-07,-1.5018777e-07,4.9109423e-07,7.2426616e-07,3.8069257e-07,-2.4959255e-07,-6.6173237e-07,-5.3991585e-07,1.3960217e-09,5.2249885e-07,6.1506876e-07,2.2157049e-07,-3.3195863e-07,-6.0536956e-07,-3.9392771e-07,1.1928459e-07,5.2076376e-07,4.9930026e-07,8.6658488e-08,-3.7945577e-07,-5.3127485e-07,-2.6071405e-07,2.0494643e-07,4.9329844e-07,3.8425264e-07,-2.2572442e-08,-3.9732535e-07,-4.469658e-07,-1.4399363e-07,2.613302e-07,4.4722728e-07,2.7551027e-07,-1.0641897e-07,-3.9134673e-07];var kemar_2bt_fir_44100_sum_60=[0.48273599,-0.056345515,-0.081869952,-0.045420207,0.041839734,0.096784942,0.061388832,-0.022359053,-0.064277075,-0.035953552,0.0040262006,-0.0053372392,-0.049953304,-0.067228064,-0.032004707,0.013482011,0.017855918,-0.015491643,-0.03908325,-0.024242969,0.0078612491,0.019962737,0.0056456444,-0.0097826729,-0.0067690588,0.0064006993,0.011233836,0.0056630028,0.0030431817,0.0098512825,0.016314374,0.011912158,0.0015686937,-0.0009221487,0.0075715897,0.014633712,0.0087375091,-0.0053914334,-0.012752451,-0.0069533512,0.0025577024,0.0031320355,-0.005744413,-0.013253485,-0.011295626,-0.0033189417,0.0016410369,0.0001694611,-0.003134897,-0.0029791265,0.00042358544,0.0033278263,0.0040436038,0.0041873842,0.0051432024,0.005813953,0.0047780611,0.0030504593,0.00297456,0.0047360961,0.0056418059,0.0034956012,-0.00036156943,-0.0024831009,-0.0014737374,0.00039938814,6.8733527e-05,-0.0026914701,-0.0052324445,-0.0052979901,-0.0034335125,-0.0019214047,-0.0020168356,-0.0028801579,-0.0030109796,-0.0019981838,-0.00059117586,0.00045963813,0.0010825499,0.0015106529,0.0017779951,0.0018487908,0.0019482474,0.0023631973,0.0029216364,0.0030057025,0.0022668578,0.001157062,0.00050594861,0.00058363267,0.00079220126,0.0003785587,-0.0006869401,-0.00169509,-0.0020073808,-0.0017085572,-0.0014033678,-0.001502115,-0.0018439569,-0.0019851557,-0.0017026666,-0.0011478055,-0.00060389907,-0.00021845782,3.3280063e-05,0.00023854709,0.00047360043,0.00078607601,0.0011563681,0.0014618021,0.0015463622,0.0013780312,0.0011145716,0.00096118817,0.00095355796,0.00091733312,0.00066498364,0.00021178546,-0.00023264097,-0.00048100608,-0.00054581324,-0.00059259986,-0.00074461673,-0.00096159067,-0.0011030065,-0.001077825,-0.00091709394,-0.00072059763,-0.00056090817,-0.00044013988,-0.00031464669,-0.00014302718,8.1162427e-05,0.00032206986,0.00051972258,0.00062917825,0.0006562905,0.00065381115,0.0006712469,0.00070352945,0.00069426774,0.00059506006,0.0004196043,0.00023434598,9.5971911e-05,2.7887907e-06,-9.1179463e-05,-0.00021969652,-0.00036711714,-0.00048489383,-0.00053781486,-0.00053120201,-0.00049773807,-0.00046430822,-0.0004320197,-0.00038258615,-0.00029930929,-0.00018334558,-5.4598848e-05,6.1150233e-05,0.00014897558,0.00021303786,0.00026923718,0.00032758858,0.00038004291,0.00040612303,0.0003918994,0.00034376307,0.00028299174,0.00022663173,0.00017411979,0.00011249587,3.3555556e-05,-5.5090288e-05,-0.00013529888,-0.0001931967,-0.00022848431,-0.00025062743,-0.00026758475,-0.00027834423,-0.00027501961,-0.00025100182,-0.00020738519,-0.00015272333,-9.7143566e-05,-4.5979279e-05,2.0615182e-06,5.100992e-05,0.00010156979,0.00014833659,0.00018295589,0.00020041833,0.00020261062,0.00019578627,0.00018451382,0.00016802803,0.00014233305,0.00010561203,6.143588e-05,1.6813983e-05,-2.2677677e-05,-5.5940913e-05,-8.5089341e-05,-0.0001116606,-0.00013410665,-0.00014864722,-0.0001523008,-0.00014520394,-0.00013034158,-0.00011120964,-8.9554946e-05,-6.5029002e-05,-3.6837348e-05,-5.7772208e-06,2.5202746e-05,5.2430689e-05,7.3643248e-05,8.8913512e-05,9.9608558e-05,0.00010645601,0.0001085868,0.00010440554,9.3351693e-05,7.6815828e-05,5.7384179e-05,3.7211033e-05,1.7051882e-05,-3.2779387e-06,-2.3644265e-05,-4.2811767e-05,-5.8828413e-05,-7.0137678e-05,-7.6386023e-05,-7.8276316e-05,-7.670898e-05,-7.202565e-05,-6.3987027e-05,-5.2419404e-05,-3.7887716e-05,-2.1771042e-05,-5.6747881e-06,9.2976943e-06,2.2791299e-05,3.4803117e-05,4.5072684e-05,5.2856354e-05,5.7290737e-05,5.7985177e-05,5.5285538e-05,4.9986833e-05,4.2791689e-05,3.4015004e-05,2.3759501e-05,1.2331708e-05,4.7006964e-07,-1.0829783e-05,-2.0722779e-05,-2.8793733e-05,-3.4995996e-05,-3.9355124e-05,-4.1733074e-05,-4.1860418e-05,-3.9584895e-05,-3.5094778e-05,-2.8912636e-05,-2.1668615e-05,-1.3853286e-05,-5.7527091e-06,2.4090207e-06,1.0282939e-05,1.7356249e-05,2.3104818e-05,2.7200309e-05,2.959081e-05,3.039838e-05,2.9744455e-05,2.7667034e-05,2.4192272e-05,1.947364e-05,1.3855421e-05,7.7968416e-06,1.7232446e-06,-4.0708674e-06,-9.4003099e-06,-1.4093431e-05,-1.7926124e-05,-2.0651196e-05,-2.2095677e-05,-2.223817e-05,-2.1200542e-05,-1.9166522e-05,-1.6300961e-05,-1.273488e-05,-8.616069e-06,-4.164775e-06,3.2697508e-07,4.5589668e-06,8.2980096e-06,1.1405705e-05,1.3805656e-05,1.5431171e-05,1.6206948e-05,1.6080867e-05,1.5073002e-05,1.3294086e-05,1.091543e-05,8.1160542e-06,5.0496451e-06,1.8514795e-06,-1.3325617e-06,-4.3307705e-06,-6.9640842e-06,-9.0855474e-06,-1.0609381e-05,-1.1508846e-05,-1.1790066e-05,-1.1468185e-05,-1.0566451e-05,-9.1352185e-06,-7.2689581e-06,-5.1017169e-06,-2.7815001e-06,-4.4249376e-07,1.8056215e-06,3.8687713e-06,5.6549538e-06,7.0733367e-06,8.0495438e-06,8.5447045e-06,8.5623078e-06,8.1380604e-06,7.3225178e-06,6.1708583e-06,4.7455869e-06,3.1251502e-06,1.406243e-06,-3.0595194e-07,-1.9141148e-06,-3.3406557e-06,-4.528581e-06,-5.4346492e-06,-6.0240077e-06,-6.2726294e-06,-6.1755204e-06,-5.7528305e-06,-5.0476683e-06,-4.1166468e-06,-3.0199947e-06,-1.8174718e-06,-5.7029672e-07,6.5627819e-07,1.7952259e-06,2.7853373e-06,3.5794565e-06,4.1480193e-06,4.4766784e-06,4.5616157e-06,4.4072967e-06,4.0282007e-06,3.4517911e-06,2.7186079e-06,1.8778878e-06,9.8096257e-07,7.6300111e-08,-7.9179193e-07,-1.5821639e-06,-2.2566462e-06,-2.7825433e-06,-3.136747e-06,-3.3086355e-06,-3.2998e-06,-3.1211778e-06,-2.7900264e-06,-2.3287046e-06,-1.7651118e-06,-1.1328859e-06,-4.6963606e-07,1.8669276e-07,8.015686e-07,1.3459349e-06,1.7962933e-06,2.1340895e-06,2.3459293e-06,2.4249568e-06,2.3723348e-06,2.1974231e-06,1.9162369e-06,1.5490597e-06,1.1185401e-06,6.488857e-07,1.6561398e-07,-3.0517128e-07,-7.3848486e-07,-1.1126476e-06,-1.410933e-06,-1.6220368e-06,-1.7396276e-06,-1.7618056e-06,-1.6910699e-06,-1.5346515e-06,-1.304535e-06,-1.0166339e-06,-6.8923379e-07,-3.4135758e-07,8.343255e-09,3.4210339e-07,6.4340469e-07,8.9765177e-07,1.093196e-06,1.2222854e-06,1.2814563e-06,1.2712512e-06,1.1955836e-06,1.0611948e-06,8.7737135e-07,6.5571925e-07,4.0965097e-07,1.5346367e-07,-9.877219e-08,-3.3414079e-07,-5.4141242e-07,-7.112738e-07,-8.3652554e-07,-9.1241168e-07,-9.3699373e-07,-9.1131926e-07,-8.3921361e-07,-7.2675653e-07,-5.8167706e-07,-4.1286754e-07,-2.3002923e-07,-4.3301103e-08,1.3726235e-07,3.0234307e-07,4.4397032e-07,5.5591653e-07,6.3384016e-07,6.7528418e-07,6.7966766e-07,6.4830965e-07,5.8440099e-07,4.9281033e-07,3.7969542e-07,2.520114e-07,1.1705063e-07,-1.7912923e-08,-1.4590537e-07,-2.6054136e-07,-3.5635648e-07,-4.2913416e-07,-4.7613025e-07,-4.9613544e-07,-4.8939819e-07,-4.5748618e-07,-4.0314941e-07,-3.3018139e-07,-2.4322949e-07,-1.475168e-07,-4.8494925e-08,4.8502745e-08,1.3854282e-07,2.1729258e-07,2.8117151e-07,3.2749102e-07,3.5458476e-07,3.6189184e-07,3.4995176e-07,3.2030303e-07,2.7531951e-07,2.1803075e-07,1.519511e-07,8.0907654e-08,8.8448111e-09,-6.0398641e-08,-1.2331422e-07,-1.7691072e-07,-2.1883946e-07,-2.4746285e-07,-2.6188903e-07,-2.6198828e-07,-2.4838639e-07,-2.2241535e-07,-1.8601072e-07,-1.4156568e-07,-9.1768527e-08,-3.9447716e-08,1.2567866e-08,6.1580991e-08,1.051581e-07,1.4125578e-07,1.6832399e-07,1.8536861e-07,1.9196906e-07,1.8826151e-07,1.7490144e-07,1.5301268e-07,1.2411887e-07,9.0051174e-08,5.283373e-08,1.4559242e-08,-2.2729093e-08,-5.7138578e-08,-8.7010321e-08,-1.1098946e-07,-1.2808424e-07,-1.3770864e-07,-1.3970022e-07,-1.3430822e-07,-1.2215567e-07,-1.0418442e-07,-8.1591743e-08,-5.5761426e-08];var kemar_2bt_fir_48000_sum_20=[0.45217499,-0.061479366,-0.11741419,-0.0015141842,-0.033499387,0.034432229,0.0026357325,0.019947388,-0.0053406091,-0.0074689136,-0.014306418,-0.01004014,-0.0021751141,0.0056956874,0.0094996695,0.0078357806,0.0025512817,-0.00266748,-0.0047431763,-0.0031235101,4.7223988e-05,0.0015507658,-0.00061629662,-0.0058244767,-0.011184568,-0.013426681,-0.011012807,-0.0051030052,0.0011881666,0.0047315136,0.0042290078,0.00081151055,-0.0028991618,-0.0045508489,-0.0034594701,-0.00079219865,0.0014553649,0.0018933963,0.0005932071,-0.0011498466,-0.0018520921,-0.00092238346,0.00098169185,0.0025133301,0.0026552098,0.0014475747,-7.7997274e-05,-0.00067773194,0.00019352683,0.0019914107,0.0034743559,0.0035824966,0.0021770574,0.0001381637,-0.0012397684,-0.0011248881,0.00030671649,0.0020174278,0.0028260449,0.0021950227,0.00055720077,-0.0010163838,-0.0015559158,-0.00082361982,0.00057376736,0.0016346169,0.001650855,0.00065916279,-0.00063226326,-0.001361457,-0.0011008355,-0.00011575493,0.00086089328,0.0011561448,0.00061072147,-0.0003453355,-0.0010221475,-0.00095657134,-0.0002200715,0.00065615474,0.0010678685,0.00075636351,-2.9303787e-05,-0.00072561736,-0.00085474773,-0.00034831023,0.00042307157,0.00092157387,0.00081407285,0.00018956158,-0.00051834461,-0.00083975894,-0.00058779808,2.8158146e-05,0.0005625625,0.00064597744,0.0002308578,-0.00039227566,-0.00080778469,-0.00076148348,-0.00032228887,0.00018142778,0.00039670819,0.00018611672,-0.00029048647,-0.00069970125,-0.00076956026,-0.00047070522,-2.3581971e-05,0.00026427901,0.00021159361,-0.00012024707,-0.00048197427,-0.00061515028,-0.00042805932,-5.0428442e-05,0.00026525569,0.00032113328,0.00010567606,-0.00020764702,-0.0003874139,-0.00030451251,-1.5040274e-05,0.00028667963,0.00040679613,0.00028244871,1.8177126e-05,-0.0001929373,-0.00020444977,-1.3563657e-05,0.00024398775,0.00039277778,0.00033860547,0.00012834888,-8.8831933e-05,-0.00016765512,-6.487307e-05,0.00013718368,0.00029253953,0.00029364251,0.00014256073,-5.5738957e-05,-0.00016959262,-0.00013119714,2.0664137e-05,0.00017237527,0.00021644076,0.00012418255,-3.8780079e-05,-0.00016190411,-0.00016658061,-5.7903686e-05,8.2830059e-05,0.00015699025,0.00011637613,-6.5633256e-06,-0.00012474983,-0.00015831413,-8.8484034e-05,3.2684581e-05,0.00012112471,0.00011938831,3.3866044e-05,-7.2526725e-05,-0.00012582036,-9.1729502e-05,3.0031512e-06,9.1717338e-05,0.00011500397,6.0632107e-05,-3.0520245e-05,-9.4866898e-05,-9.0379344e-05,-2.397575e-05,5.5781709e-05,9.3523791e-05,6.4964363e-05,-8.1162887e-06,-7.4883119e-05,-9.1339791e-05,-4.981916e-05,1.7639585e-05,6.3034772e-05,5.5794961e-05,2.660093e-06,-5.8771845e-05,-8.7101711e-05,-6.5234027e-05,-1.0803716e-05,3.7478877e-05,4.7121239e-05,1.3589199e-05,-3.7993278e-05,-7.1362042e-05,-6.4281573e-05,-2.2942374e-05,2.3653365e-05,4.4500264e-05,2.770507e-05,-1.2547629e-05,-4.6806015e-05,-5.1105397e-05,-2.2971124e-05,1.793887e-05,4.424265e-05,3.9779304e-05,1.0004315e-05,-2.2802362e-05,-3.5505253e-05,-1.9854611e-05,1.267664e-05,3.9691561e-05,4.3517004e-05,2.296935e-05,-6.6442596e-06,-2.4714025e-05,-1.9565779e-05,4.064508e-06,2.9064452e-05,3.8181357e-05,2.5743495e-05,9.3285137e-07,-1.9192837e-05,-2.1643604e-05,-6.0432128e-06,1.5715314e-05,2.8146233e-05,2.2859179e-05,3.9106819e-06,-1.5554291e-05,-2.26656e-05,-1.3542827e-05,4.5246648e-06,1.8586554e-05,1.9102802e-05,6.2316453e-06,-1.0790428e-05,-2.0321267e-05,-1.633549e-05,-2.2390962e-06,1.1900295e-05,1.650805e-05,8.971065e-06,-4.9385261e-06,-1.5402274e-05,-1.542329e-05,-5.4326476e-06,7.3820063e-06,1.4285192e-05,1.0964541e-05,2.4410446e-07,-1.0181835e-05,-1.3208517e-05,-7.1132704e-06,3.5401547e-06,1.1309385e-05,1.1066786e-05,3.3627316e-06,-6.2332134e-06,-1.1165605e-05,-8.3757945e-06,-1.8878368e-07,7.5178032e-06,9.4769061e-06,4.5768538e-06,-3.5863753e-06,-9.3789123e-06,-9.0508389e-06,-3.1853538e-06,3.9150926e-06,7.3356868e-06,4.9148244e-06,-1.4348101e-06,-7.2292393e-06,-8.5663604e-06,-4.7475147e-06,1.4051427e-06,5.6353351e-06,5.2103374e-06,6.9914903e-07,-4.5784827e-06,-6.9429711e-06,-4.8703226e-06,8.2061914e-08,4.489691e-06,5.4689876e-06,2.5990028e-06,-1.9118805e-06,-4.8535912e-06,-4.2421261e-06,-6.0636396e-07,3.4938659e-06,5.3046993e-06,3.7559173e-06,1.0219816e-07,-3.0454164e-06,-3.5603342e-06,-1.2112233e-06,2.2757494e-06,4.4798767e-06,3.9628592e-06,1.1968724e-06,-1.8489228e-06,-3.1175235e-06,-1.8634889e-06,9.0723945e-07,3.2082325e-06,3.4701091e-06,1.5844459e-06,-1.0988823e-06,-2.7567203e-06,-2.3484198e-06,-2.8394269e-07,1.9256611e-06,2.7477333e-06,1.6692708e-06,-5.0512337e-07,-2.2644795e-06,-2.4518547e-06,-1.0313659e-06,9.4411973e-07,2.1033497e-06,1.6978235e-06,7.8448806e-08,-1.5957736e-06,-2.1836695e-06,-1.3354721e-06,3.0843316e-07,1.6005444e-06,1.6896985e-06,5.8351569e-07,-9.0014185e-07,-1.7290364e-06,-1.3680137e-06,-1.1399684e-07,1.144928e-06,1.5596779e-06,8.943238e-07,-3.4394914e-07,-1.2854336e-06,-1.3058544e-06,-4.3777827e-07,6.842436e-07,1.2844239e-06,9.7917954e-07,1.7464955e-08,-9.209241e-07,-1.2057592e-06,-6.8063589e-07,2.5389742e-07,9.3943675e-07,9.1917564e-07,2.38053e-07,-6.1242224e-07,-1.0497705e-06,-8.0021351e-07,-6.8807212e-08,6.2392161e-07,8.1134068e-07,3.9225662e-07,-3.1762303e-07,-8.2017972e-07,-7.817153e-07,-2.5133465e-07,3.9110681e-07,7.0898118e-07,5.0788369e-07,-4.4642024e-08,-5.5103241e-07,-6.6505273e-07,-3.2414041e-07,2.2351506e-07,6.0144714e-07,5.6634049e-07,1.6655964e-07,-3.0500325e-07,-5.2169473e-07,-3.4644135e-07,8.4600237e-08,4.6801953e-07,5.4737457e-07,2.8477054e-07,-1.2457632e-07,-3.9668259e-07,-3.5481654e-07,-4.4143982e-08,3.0972802e-07,4.6266875e-07,3.1861244e-07,-1.2489755e-08,-2.9940178e-07,-3.5247538e-07,-1.5018634e-07,1.5477764e-07,3.4795789e-07,3.0173224e-07,5.677952e-08,-2.1324405e-07,-3.2599447e-07,-2.1452344e-07,3.2975079e-08,2.4063775e-07,2.6859124e-07,1.0607425e-07,-1.2771232e-07,-2.7100907e-07,-2.3136912e-07,-4.4830942e-08,1.5529678e-07,2.3307217e-07,1.4228333e-07,-4.6604312e-08,-1.9998986e-07,-2.1490533e-07,-8.7396084e-08,8.9677172e-08,1.9444831e-07,1.6015896e-07,1.7642501e-08,-1.3059185e-07,-1.8347456e-07,-1.0950183e-07,3.5189556e-08,1.4917074e-07,1.5674119e-07,5.8027899e-08,-7.4827463e-08,-1.5017314e-07,-1.1999686e-07,-1.0306759e-08,1.0024854e-07,1.3640999e-07,7.7124447e-08,-3.3097834e-08,-1.1734083e-07,-1.2006077e-07,-4.3705182e-08,5.5799026e-08,1.0962804e-07,8.3403383e-08,-1.1860356e-09,-8.3896329e-08,-1.0873235e-07,-6.1707257e-08,2.1831893e-08,8.369837e-08,8.3244915e-08,2.4116426e-08,-5.0392179e-08,-8.8654902e-08,-6.6157426e-08,-8.0139549e-10,6.1336773e-08,7.8666029e-08,4.2064544e-08,-2.0579166e-08,-6.5186485e-08,-6.2138316e-08,-1.555424e-08,4.1089572e-08,6.9100889e-08,5.1070526e-08,1.637376e-09,-4.4023057e-08,-5.5082601e-08,-2.5761083e-08,2.2007525e-08,5.4851487e-08,5.1181301e-08,1.5191693e-08,-2.7299921e-08,-4.7335306e-08,-3.2622438e-08,4.9469996e-09,3.8555336e-08,4.5393053e-08,2.1942223e-08,-1.4590349e-08,-3.8979346e-08,-3.5492615e-08,-8.0768592e-09,2.3337598e-08,3.713616e-08,2.4704988e-08,-4.341265e-09,-2.9571975e-08,-3.4130213e-08,-1.5994556e-08,1.1380186e-08,2.8958642e-08,2.5317323e-08,4.0107288e-09,-1.9597642e-08,-2.9365415e-08,-1.9315431e-08,2.823615e-09,2.1505809e-08,2.429503e-08,1.0146711e-08,-1.0444371e-08,-2.3134944e-08,-1.9657663e-08,-3.1295167e-09,1.4632024e-08,2.1562468e-08,1.3545882e-08,-3.2192599e-09,-1.692942e-08,-1.8430596e-08,-7.3041154e-09,8.2774727e-09,1.7516805e-08,1.4447632e-08,1.7453422e-09,-1.1516734e-08,-1.6342166e-08,-9.9092683e-09,2.8290938e-09,1.2908201e-08,1.3608806e-08,4.8964854e-09,-6.8757562e-09,-1.3588467e-08,-1.0949996e-08,-1.2198602e-09,8.647839e-09,1.1955969e-08,6.7955381e-09,-2.8997663e-09,-1.0316868e-08,-1.0533654e-08,-3.7396586e-09,5.1377561e-09,1.0000906e-08,7.7754126e-09,3.470594e-10,-6.9617178e-09,-9.1731234e-09,-5.0151655e-09,2.3992517e-09,7.9034405e-09,7.8844908e-09,2.6543129e-09,-3.9693818e-09,-7.4161804e-09,-5.494463e-09,2.3611335e-10,5.7032027e-09,7.2170157e-09,3.9491317e-09,-1.6632501e-09,-5.6812005e-09,-5.5018422e-09,-1.4300146e-09,3.5347635e-09,5.9740841e-09,4.3803313e-09,6.2102359e-10];var kemar_2bt_fir_48000_sum_40=[0.483219,0.013827632,-0.059527223,0.021814867,-0.03999381,-0.0029738074,-0.055033745,-0.049417882,-0.071136972,-0.057394993,-0.038672035,-0.0065864259,0.024844217,0.047245282,0.055154656,0.048673232,0.032673297,0.013984023,-0.0018563103,-0.012601946,-0.01918883,-0.023897286,-0.028119349,-0.031160823,-0.030747455,-0.024794978,-0.013202576,0.0015122728,0.015114231,0.023624128,0.025156749,0.020583618,0.012729484,0.0046975536,-0.0016205291,-0.0060173801,-0.0093117978,-0.012170374,-0.01429037,-0.014492527,-0.011597489,-0.005470258,0.0025286425,0.010020261,0.014734383,0.015593507,0.013107586,0.0088908857,0.0046634929,0.001385148,-0.0009756607,-0.0029997918,-0.0050841427,-0.0069600149,-0.0077926305,-0.0067667142,-0.0037332663,0.00053677715,0.0046697192,0.0073726119,0.0080495735,0.0069839583,0.0050196262,0.0029946325,0.001308263,-0.00012795339,-0.0015852717,-0.0031253443,-0.004423273,-0.0049321957,-0.0042619846,-0.0024935959,-0.00020146572,0.0018357532,0.0030418844,0.0033013564,0.0029158779,0.0023183097,0.0017589961,0.0011834424,0.00037047585,-0.00079157039,-0.0021098645,-0.0031291566,-0.0033921551,-0.0027393139,-0.0014367318,-3.8008879e-05,0.00093334841,0.0012677731,0.0011406991,0.00093078379,0.00092067457,0.0010918936,0.0011546976,0.00078684195,-9.1580278e-05,-0.0012054816,-0.0020602145,-0.0022397331,-0.0016677802,-0.00065859467,0.00027581154,0.00073754103,0.00066811243,0.00034376977,0.00015309937,0.00031384859,0.00072215341,0.0010330518,0.00091230823,0.00028458583,-0.00059266429,-0.00127894,-0.0014228009,-0.00098021928,-0.00023448012,0.00039100678,0.00059992989,0.00039440542,4.3273635e-05,-0.00012222606,5.7880978e-05,0.00046647352,0.00079788286,0.00077311774,0.00033545815,-0.00030398349,-0.00079955854,-0.0008912519,-0.00056494121,-4.980718e-05,0.0003394272,0.00040604123,0.00018570019,-9.8514938e-05,-0.00020231253,-2.989458e-05,0.00030481536,0.00056175686,0.0005427992,0.00022789778,-0.0002110519,-0.00052432555,-0.00054654912,-0.00029795782,3.9536863e-05,0.00024997274,0.00022535682,2.7131944e-05,-0.00016855831,-0.00019923474,-2.9251453e-05,0.00022870443,0.00039472455,0.00034676309,0.00010346274,-0.00018994289,-0.00036003895,-0.00031904271,-0.00011735837,9.7749639e-05,0.0001851186,0.00010301471,-6.8822255e-05,-0.00019080819,-0.00016350903,3.5247223e-06,0.00020003648,0.0002924621,0.00021570165,1.6435224e-05,-0.0001800406,-0.00025490004,-0.00017343895,-4.142045e-06,0.00013172364,0.0001441201,3.3808365e-05,-0.00011199593,-0.00018285664,-0.00012241289,3.3326146e-05,0.0001817431,0.00022429467,0.00013307557,-3.1856692e-05,-0.00016426329,-0.000183158,-8.5604959e-05,5.4406892e-05,0.00013860664,0.00011162183,-3.0301246e-06,-0.00012149991,-0.00015856446,-8.5960137e-05,4.9327479e-05,0.00015816461,0.00016967847,7.8201174e-05,-5.4382295e-05,-0.00014151882,-0.00013010006,-3.4456471e-05,7.5808615e-05,0.00012455082,8.0526845e-05,-2.3076324e-05,-0.00011311306,-0.00012715878,-5.5195521e-05,5.4729397e-05,0.00012992785,0.00012221314,3.9307173e-05,-6.1982223e-05,-0.00011509683,-8.8246455e-05,-4.1706669e-06,7.7229023e-05,0.00010046425,5.1560951e-05,-3.4126089e-05,-9.7216821e-05,-9.4926218e-05,-2.9434182e-05,5.4791759e-05,0.00010193849,8.2431672e-05,1.1769582e-05,-6.1387367e-05,-8.8849195e-05,-5.4974797e-05,1.421777e-05,7.0197233e-05,7.5220495e-05,2.7318412e-05,-3.9539298e-05,-7.9473938e-05,-6.5965863e-05,-9.1144615e-06,5.225399e-05,7.7503891e-05,5.142255e-05,-6.520995e-06,-5.6470433e-05,-6.5629778e-05,-2.9799296e-05,2.4827971e-05,6.0349828e-05,5.3100614e-05,9.1430286e-06,-4.0772047e-05,-6.2717266e-05,-4.255198e-05,5.1716789e-06,4.7891038e-05,5.7462713e-05,2.8871021e-05,-1.7293356e-05,-4.9462837e-05,-4.6621091e-05,-1.2078065e-05,2.9584345e-05,4.9788478e-05,3.53714e-05,-3.0152425e-06,-3.8824562e-05,-4.7993617e-05,-2.5065374e-05,1.3726005e-05,4.2067353e-05,4.1459895e-05,1.3377702e-05,-2.2349177e-05,-4.1447402e-05,-3.1661098e-05,-6.0575455e-07,3.0002552e-05,3.9428368e-05,2.185813e-05,-1.0147993e-05,-3.4677437e-05,-3.5503317e-05,-1.2724366e-05,1.7745962e-05,3.5329418e-05,2.8733397e-05,3.2361556e-06,-2.3386147e-05,-3.3202022e-05,-2.0178371e-05,6.1519228e-06,2.760541e-05,2.9852377e-05,1.1926104e-05,-1.3589204e-05,-2.9377536e-05,-2.5147181e-05,-4.3325847e-06,1.8629889e-05,2.8328929e-05,1.8746073e-05,-3.0128988e-06,-2.1919188e-05,-2.5371032e-05,-1.1570246e-05,9.6358466e-06,2.3763228e-05,2.1517394e-05,4.8771756e-06,-1.4574513e-05,-2.3721754e-05,-1.6765563e-05,1.116793e-06,1.7598304e-05,2.1704622e-05,1.1128602e-05,-6.5164448e-06,-1.9141944e-05,-1.8454398e-05,-5.3413729e-06,1.0988574e-05,1.9455143e-05,1.4606695e-05,1.0409001e-07,-1.4026874e-05,-1.8330868e-05,-1.0251121e-05,4.3827042e-06,1.5546656e-05,1.5887883e-05,5.5643882e-06,-8.1392378e-06,-1.5906915e-05,-1.2709141e-05,-1.046438e-06,1.0971418e-05,1.525431e-05,9.1674485e-06,-2.8746811e-06,-1.2603526e-05,-1.3575664e-05,-5.4363632e-06,6.0502329e-06,1.3080235e-05,1.1088177e-05,1.7114769e-06,-8.5057945e-06,-1.266652e-05,-8.1669005e-06,1.6913292e-06,1.0110708e-05,1.1480031e-05,5.105904e-06,-4.4837368e-06,-1.0753851e-05,-9.6182686e-06,-2.0759969e-06,6.6042149e-06,1.0558777e-05,7.2866057e-06,-7.7761054e-07,-8.0575675e-06,-9.684323e-06,-4.7459612e-06,3.22838e-06,8.7852209e-06,8.2728279e-06,2.2331232e-06,-5.1118017e-06,-8.7941541e-06,-6.4603104e-06,1.2952787e-07,6.4135357e-06,8.1820088e-06,4.3945657e-06,-2.2230541e-06,-7.1328561e-06,-7.0924939e-06,-2.2899635e-06,3.8978357e-06,7.2787846e-06,5.6719154e-06,3.1203341e-07,-5.0853379e-06,-6.8971271e-06,-4.0232985e-06,1.4546457e-06,5.7742205e-06,6.0737986e-06,2.2849382e-06,-2.9140845e-06,-5.9881393e-06,-4.9465388e-06,-6.1622174e-07,3.9927975e-06,5.777967e-06,3.6305872e-06,-8.8248036e-07,-4.6562862e-06,-5.1826183e-06,-2.2151982e-06,2.1390577e-06,4.9124605e-06,4.2971205e-06,8.1900701e-07,-3.0985201e-06,-4.8119293e-06,-3.2406161e-06,4.5628865e-07,3.7291991e-06,4.3947963e-06,2.0908103e-06,-1.5395812e-06,-4.0168132e-06,-3.7173846e-06,-9.35006e-07,2.3818485e-06,3.9928189e-06,2.8713693e-06,-1.423761e-07,-2.9644201e-06,-3.7059253e-06,-1.9357701e-06,1.0765232e-06,3.2685043e-06,3.1959398e-06,9.8231901e-07,-1.8161817e-06,-3.3035779e-06,-2.5270652e-06,-7.9560184e-08,2.3424741e-06,3.1136802e-06,1.769154e-06,-7.2015288e-07,-2.6456376e-06,-2.7326871e-06,-9.8283656e-07,1.3691128e-06,2.7250827e-06,2.2085649e-06,2.2839398e-07,-1.8412779e-06,-2.6085245e-06,-1.5999545e-06,4.5028203e-07,2.1319224e-06,2.3275751e-06,9.5403031e-07,-1.0153217e-06,-2.2388793e-06,-1.9199772e-06,-3.236124e-07,1.4375845e-06,2.1778584e-06,1.4328941e-06,-2.4989495e-07,-1.7107609e-06,-1.9759518e-06,-9.0594347e-07,7.3752388e-07,1.8322848e-06,1.6613144e-06,3.8099351e-07,-1.1128612e-06,-1.8113207e-06,-1.272432e-06,1.032893e-07,1.3657927e-06,1.6711248e-06,8.4490629e-07,-5.2175301e-07,-1.4937831e-06,-1.4314031e-06,-4.1031582e-07,8.5258376e-07,1.5017994e-06,1.1221059e-06,2.2485686e-09,-1.0835274e-06,-1.4074746e-06,-7.7634468e-07,3.5566428e-07,1.2124692e-06,1.2276922e-06,4.184177e-07,-6.4517027e-07,-1.2408362e-06,-9.842992e-07,-7.5943266e-08,8.5365678e-07,1.1806947e-06,7.0481091e-07,-2.2899543e-07,-9.7919562e-07,-1.0479843e-06,-4.1110596e-07,4.8101195e-07,1.0211666e-06,8.5834184e-07,1.2500054e-07,-6.6791151e-07,-9.8677208e-07,-6.334532e-07,1.3375077e-07,7.8665919e-07,8.9058383e-07,3.9331751e-07,-3.5193868e-07,-8.3680169e-07,-7.4422638e-07,-1.5525181e-07,5.184934e-07,8.2212691e-07,5.6429509e-07,-6.3535818e-08,-6.2865891e-07,-7.5373703e-07,-3.688371e-07,2.5130549e-07,6.8275058e-07,6.4190224e-07,1.7151627e-07,-3.986022e-07,-6.8251183e-07,-4.9915028e-07,1.2955121e-08,4.9963028e-07,6.3545308e-07,3.4042364e-07,-1.7366828e-07,-5.5466828e-07,-5.5103078e-07,-1.7759505e-07,3.0292307e-07,5.6443309e-07,4.3857573e-07,2.2590931e-08,-3.9479728e-07,-5.3371126e-07,-3.1014165e-07,1.1444489e-07,4.4862956e-07,4.7093837e-07,1.7559569e-07,-2.2539737e-07,-4.6738647e-07,-3.7925734e-07,-5.138851e-08,3.1464763e-07,4.4344356e-07,2.7858233e-07,-5.8426227e-08,-4.0199987e-07,-9.9514816e-08];var kemar_2bt_fir_48000_sum_60=[0.48273599,-0.010042056,-0.12018805,-0.027281372,-0.014708147,0.10423673,0.075746979,0.034381643,-0.050156217,-0.060057108,-0.027657582,0.0058593448,-0.0062470256,-0.047603487,-0.068181595,-0.042765341,0.0025065149,0.022252943,0.0018954712,-0.030300121,-0.037827718,-0.01472541,0.01297301,0.019241212,0.0046551754,-0.0095471084,-0.0079723469,0.0040426719,0.01126551,0.0080886752,0.0030224488,0.0054841483,0.013311481,0.0162036,0.0094697691,0.00037324827,-0.00057978917,0.0075061057,0.014460935,0.010658123,-0.0019160149,-0.011809032,-0.010614267,-0.0016599302,0.0042776894,0.00071480833,-0.0083484552,-0.013657675,-0.010626097,-0.0031742695,0.0015309447,0.00065113643,-0.0025723807,-0.0034987729,-0.001049392,0.0022273205,0.0038694523,0.0040470599,0.0043928037,0.0053766154,0.0057855712,0.0046994411,0.0030975202,0.0028595389,0.0043478005,0.0056572592,0.0046245551,0.0013394567,-0.0017624627,-0.0024025683,-0.00081390886,0.00058613713,-0.00023614386,-0.0029103311,-0.005213904,-0.0054039117,-0.0038015564,-0.0021694591,-0.0018242451,-0.0025332991,-0.0030989926,-0.00269898,-0.0015196655,-0.0002735785,0.00059419946,0.0011297649,0.0015153595,0.0017666948,0.0018452867,0.0019040807,0.002198874,0.0027231011,0.0030658555,0.0027729278,0.0018630518,0.00089881322,0.00047164365,0.00061868914,0.00079087141,0.00041360541,-0.00053898812,-0.001532039,-0.0019996172,-0.001856228,-0.0015045887,-0.0013979305,-0.0016307343,-0.0019272845,-0.0019588542,-0.0016333192,-0.0011110348,-0.00061285437,-0.00024990233,-6.4287533e-06,0.00018453236,0.00038580893,0.00064326442,0.00096790604,0.0013012813,0.0015211693,0.0015256766,0.0013344603,0.0010947495,0.00096078849,0.00095243981,0.00093454654,0.00074833553,0.00036753903,-7.1352051e-05,-0.00039085032,-0.00052440683,-0.00055609403,-0.00062322144,-0.00078597984,-0.00098422102,-0.0011049954,-0.0010831293,-0.0009427873,-0.00076114352,-0.00060300845,-0.00048349043,-0.00037582871,-0.00024242009,-6.2504427e-05,0.00015458168,0.00037157025,0.00054089463,0.00063272392,0.00065626365,0.00065379248,0.00066603866,0.00069652951,0.00070670405,0.0006501142,0.00051588361,0.00034147073,0.000182911,7.0285756e-05,-1.1291199e-05,-0.00010033256,-0.00021969652,-0.00035557526,-0.00046980092,-0.00053152596,-0.0005384267,-0.00051276039,-0.00048025209,-0.00045136626,-0.00041796313,-0.00036397318,-0.00027967549,-0.00016976256,-5.1423658e-05,5.5302109e-05,0.00013858354,0.00020033825,0.00025244116,0.00030539882,0.00035802104,0.00039676159,0.00040595644,0.00038069392,0.00033125686,0.00027519871,0.00022399411,0.00017584921,0.00012032946,5.0130642e-05,-3.0721827e-05,-0.00010887832,-0.00017110951,-0.00021274008,-0.00023855906,-0.00025666236,-0.00027110291,-0.00027908805,-0.00027402233,-0.00025122312,-0.00021185545,-0.0001623414,-0.00011079319,-6.2452534e-05,-1.7643814e-05,2.6606624e-05,7.2594884e-05,0.00011864023,0.00015906429,0.00018755859,0.0002013101,0.00020255733,0.00019639414,0.00018644537,0.00017248519,0.00015148396,0.00012112345,8.2695157e-05,4.0984531e-05,1.4388532e-06,-3.2900367e-05,-6.2292159e-05,-8.8615237e-05,-0.00011277758,-0.00013338945,-0.00014748838,-0.00015254849,-0.00014823375,-0.00013648049,-0.00012014324,-0.00010128227,-8.032674e-05,-5.6616717e-05,-2.980466e-05,-9.9648153e-07,2.72576e-05,5.212471e-05,7.1928888e-05,8.6635731e-05,9.7283565e-05,0.00010466603,0.00010845552,0.00010744387,0.00010064503,8.8309894e-05,7.202577e-05,5.3864876e-05,3.5309789e-05,1.6796867e-05,-1.8650421e-06,-2.061903e-05,-3.8595676e-05,-5.4305145e-05,-6.6348315e-05,-7.4083856e-05,-7.7769101e-05,-7.8132599e-05,-7.5753815e-05,-7.0723679e-05,-6.2805081e-05,-5.1921996e-05,-3.8575761e-05,-2.3829306e-05,-8.9396181e-06,5.1388882e-06,1.8000942e-05,2.9615083e-05,3.991107e-05,4.8482697e-05,5.4647894e-05,5.7808464e-05,5.7811988e-05,5.5029604e-05,5.010792e-05,4.3597572e-05,3.5737661e-05,2.6603326e-05,1.6366987e-05,5.5022875e-06,-5.2529643e-06,-1.5139698e-05,-2.3636162e-05,-3.0547488e-05,-3.5885651e-05,-3.9658649e-05,-4.1742012e-05,-4.1941067e-05,-4.0110656e-05,-3.6357865e-05,-3.104843e-05,-2.4673935e-05,-1.7672523e-05,-1.0331229e-05,-2.8282701e-06,4.6378806e-06,1.1749922e-05,1.8089886e-05,2.3262724e-05,2.7038496e-05,2.9377765e-05,3.0365175e-05,3.0102507e-05,2.8632508e-05,2.5963792e-05,2.2161226e-05,1.7420332e-05,1.2062212e-05,6.4514428e-06,8.9804506e-07,-4.3886204e-06,-9.273764e-06,-1.3632304e-05,-1.7289709e-05,-2.0049785e-05,-2.1755113e-05,-2.2348127e-05,-2.1885487e-05,-2.0498018e-05,-1.8328881e-05,-1.549553e-05,-1.20985e-05,-8.2616863e-06,-4.164775e-06,-3.37805e-08,3.8989403e-06,7.4430094e-06,1.0476368e-05,1.2930111e-05,1.475298e-05,1.5887693e-05,1.627856e-05,1.5902797e-05,1.4798874e-05,1.3068478e-05,1.0849961e-05,8.2837802e-06,5.4853607e-06,2.5581336e-06,-3.8793019e-07,-3.223809e-06,-5.808031e-06,-8.010803e-06,-9.7393284e-06,-1.0947708e-05,-1.1627065e-05,-1.1786103e-05,-1.1437962e-05,-1.0603918e-05,-9.3230998e-06,-7.6627686e-06,-5.7231791e-06,-3.6192303e-06,-1.4607391e-06,6.5923705e-07,2.6629463e-06,4.4786676e-06,6.0343059e-06,7.2611225e-06,8.1059207e-06,8.5432175e-06,8.5807276e-06,8.2417879e-06,7.5644133e-06,6.5904052e-06,5.3656796e-06,3.9459065e-06,2.4005257e-06,8.0979741e-07,-7.4477918e-07,-2.1912711e-06,-3.4732572e-06,-4.5487717e-06,-5.3874398e-06,-5.9614236e-06,-6.2498654e-06,-6.2451149e-06,-5.9571415e-06,-5.4138097e-06,-4.6558612e-06,-3.7297303e-06,-2.6824533e-06,-1.560802e-06,-4.1320337e-07,7.0907831e-07,1.7547654e-06,2.6774752e-06,3.4390232e-06,4.0140592e-06,4.3886914e-06,4.5574445e-06,4.5210268e-06,4.2865563e-06,3.8695488e-06,3.2953655e-06,2.5981542e-06,1.8171937e-06,9.9241342e-07,1.6063845e-07,-6.4412931e-07,-1.3896139e-06,-2.0453967e-06,-2.5842322e-06,-2.9847275e-06,-3.233883e-06,-3.3279878e-06,-3.2714811e-06,-3.074743e-06,-2.752294e-06,-2.3222407e-06,-1.8069388e-06,-1.2313771e-06,-6.2437291e-07,-1.5647678e-08,5.6689857e-07,1.0989647e-06,1.5603367e-06,1.9345557e-06,2.208699e-06,2.3738822e-06,2.4263124e-06,2.3681214e-06,2.2076913e-06,1.9572093e-06,1.6316517e-06,1.2482811e-06,8.2559775e-07,3.8316934e-07,-5.8680291e-08,-4.797638e-07,-8.6144356e-07,-1.1880492e-06,-1.4477356e-06,-1.6325782e-06,-1.7383614e-06,-1.7642269e-06,-1.7112295e-06,-1.584331e-06,-1.3919714e-06,-1.145681e-06,-8.5916216e-07,-5.4715116e-07,-2.2446812e-07,9.4538839e-08,3.9626543e-07,6.6813392e-07,8.9910038e-07,1.0808734e-06,1.2070262e-06,1.2743691e-06,1.2826663e-06,1.2342184e-06,1.1334777e-06,9.868147e-07,8.0238385e-07,5.8990062e-07,3.6017378e-07,1.2440837e-07,-1.0654189e-07,-3.2292708e-07,-5.1620385e-07,-6.7891963e-07,-8.0512771e-07,-8.9055553e-07,-9.3287997e-07,-9.3192153e-07,-8.8962399e-07,-8.0979482e-07,-6.9770367e-07,-5.596836e-07,-4.0282311e-07,-2.347297e-07,-6.3121122e-08,1.0426542e-07,2.6005814e-07,3.9775399e-07,5.1202982e-07,5.9889565e-07,6.5572795e-07,6.8126357e-07,6.7560818e-07,6.4024621e-07,5.7798964e-07,4.9281033e-07,3.8964088e-07,2.7361386e-07,1.5036056e-07,2.5555813e-08,-9.5273424e-08,-2.0693732e-07,-3.0480186e-07,-3.8502392e-07,-4.447513e-07,-4.8223399e-07,-4.9682962e-07,-4.8892979e-07,-4.5997436e-07,-4.1197276e-07,-3.4770776e-07,-2.7066754e-07,-1.8481726e-07,-9.4377623e-08,-3.5856034e-09,8.351979e-08,1.6326245e-07,2.3244948e-07,2.8846889e-07,3.2938068e-07,3.5405755e-07,3.6213624e-07,3.5386175e-07,3.3029516e-07,2.931257e-07,2.4455627e-07,1.8718996e-07,1.2391746e-07,5.779316e-08,-8.1079221e-09,-7.0845888e-08,-1.2776352e-07,-1.7661032e-07,-2.1570804e-07,-2.4368694e-07,-2.5976169e-07,-2.6368903e-07,-2.5577289e-07,-2.3684534e-07,-2.082136e-07,-1.7157399e-07,-1.2890497e-07,-8.2356241e-08,-3.4145582e-08,1.3534279e-08,5.8645914e-08,9.9319545e-08,1.3391981e-07,1.6115545e-07,1.801236e-07,1.9033242e-07,1.9169958e-07,1.8453396e-07,1.695064e-07,1.4761041e-07,1.2010933e-07,8.846813e-08,5.4273818e-08,1.9115207e-08,-1.5430942e-08,-4.7868152e-08,-7.6851236e-08,-1.0129823e-07,-1.1998817e-07,-1.3309824e-07,-1.3891492e-07,-1.3954567e-07,-1.3251827e-07,-1.2139179e-07,-1.0452134e-07,-8.2904626e-08,-6.3870655e-08,-1.1150482e-08];if(samplerate===44100){if(speakerSpan===20){return kemar_2bt_fir_44100_sum_20;}else if(speakerSpan===40){return kemar_2bt_fir_44100_sum_40;}else if(speakerSpan===60){return kemar_2bt_fir_44100_sum_60;}else {throw new Error("Invalid speakerSpan "+speakerSpan);}}else if(samplerate===48000){if(speakerSpan===20){return kemar_2bt_fir_48000_sum_20;}else if(speakerSpan===40){return kemar_2bt_fir_48000_sum_40;}else if(speakerSpan===60){return kemar_2bt_fir_48000_sum_60;}else {throw new Error("Invalid speakerSpan "+speakerSpan);}}else { ///@n we dont implement resampling here...
throw new Error("Invalid samplerate "+samplerate);}}function getKemar2btDiffFilter(samplerate,speakerSpan){ /// kemar binaural to transaural FIR filter (for shuffler), Sum filter
/// for speaker span = 20 deg (i.e -10 / +10)
var kemar_2bt_fir_44100_diff_20=[0.51929098,0.018192239,0.04265229,0.073031649,0.099252678,0.11345918,0.11255411,0.099201255,0.080520436,0.064636581,0.056662425,0.056412905,0.059308354,0.059884898,0.055527538,0.047879919,0.041075725,0.038257483,0.03905772,0.039907545,0.036847606,0.028632322,0.017760858,0.0087060863,0.0047434946,0.0057733422,0.0086796107,0.0098066162,0.0075962776,0.0034500533,0.00034540897,0.00044360087,0.0035656956,0.0075834491,0.010220639,0.010735445,0.010201211,0.010323666,0.011893058,0.014161034,0.015577188,0.015177807,0.013426747,0.011823456,0.011642168,0.012870532,0.014219167,0.01417324,0.012210404,0.0091989618,0.0066787219,0.0056323605,0.0057432503,0.0057143597,0.0043579205,0.0015629418,-0.0016230044,-0.00383093,-0.0044314284,-0.0039752517,-0.0036933112,-0.0044906018,-0.0062476047,-0.0079635372,-0.008588287,-0.0078551155,-0.0064588226,-0.0054714386,-0.0054932423,-0.0062203659,-0.0067474162,-0.0063277278,-0.0049671405,-0.0033909329,-0.0024428272,-0.0024213148,-0.0028824152,-0.0030415072,-0.0024250196,-0.0012416437,-0.00019130373,0.00010966956,-0.00038776404,-0.0011529835,-0.0015226854,-0.0012309796,-0.0005978687,-0.00024235866,-0.00057010917,-0.0014530602,-0.002346932,-0.0027337135,-0.0025235363,-0.0020992693,-0.001984996,-0.0024185709,-0.0031715368,-0.0037477184,-0.0037856102,-0.0033362946,-0.0028025203,-0.0026030133,-0.0028407553,-0.0032377357,-0.0033752497,-0.0030349186,-0.0023654688,-0.0017512949,-0.0015009301,-0.0016106165,-0.0017865861,-0.0016959795,-0.0012365992,-0.00061071839,-0.00015364151,-6.4432352e-05,-0.00025682317,-0.00044277741,-0.00037147527,-2.6953147e-05,0.00037030393,0.00054980407,0.00040881702,8.7293884e-05,-0.00015280899,-0.00013901325,8.12418e-05,0.00029073792,0.00028490837,3.5672972e-05,-0.00029238264,-0.000479437,-0.00042537731,-0.00022186965,-6.9290683e-05,-0.00011167053,-0.0003243385,-0.00054085552,-0.000591341,-0.00043731299,-0.00019631257,-4.1950181e-05,-6.4418076e-05,-0.00020384521,-0.00030585073,-0.00024947777,-4.2665582e-05,0.00018891979,0.00030586193,0.00026503252,0.00014821949,9.0509238e-05,0.00016992314,0.00034762078,0.0005036954,0.00053569704,0.00043884147,0.00030518681,0.00024623392,0.00030388954,0.00042089738,0.00049136049,0.00044752349,0.00031230372,0.00017752263,0.00012856507,0.00017768198,0.00025837743,0.0002824399,0.00021145305,8.5411863e-05,-1.2230889e-05,-2.2401233e-05,4.4186716e-05,0.00011898495,0.00013275804,7.0505157e-05,-1.9264326e-05,-6.6100089e-05,-3.4677203e-05,4.8610567e-05,0.00011918638,0.00012695398,7.4989068e-05,1.4258917e-05,6.3389791e-07,5.0046921e-05,0.00012743783,0.00017666427,0.000165751,0.00011089578,6.1206927e-05,5.8118043e-05,0.00010283996,0.00015726897,0.00017605606,0.00014295006,8.2403305e-05,3.8399507e-05,3.8820948e-05,7.4272633e-05,0.00010746168,0.0001042551,6.077372e-05,5.2282126e-06,-2.5775345e-05,-1.6483587e-05,1.6642301e-05,3.9612558e-05,2.8775177e-05,-1.0845926e-05,-5.0828712e-05,-6.2952917e-05,-4.15541e-05,-6.9708449e-06,1.1760035e-05,2.7077994e-07,-3.051115e-05,-5.4298376e-05,-5.1095438e-05,-2.285142e-05,9.0142375e-06,2.1402318e-05,7.8223056e-06,-1.7337796e-05,-3.1283183e-05,-2.1351083e-05,5.3642298e-06,2.8511091e-05,3.1195406e-05,1.318227e-05,-9.7145739e-06,-1.8922447e-05,-7.949674e-06,1.3058453e-05,2.6173866e-05,2.0299962e-05,-3.1007116e-07,-2.009765e-05,-2.5011243e-05,-1.3520851e-05,2.8095551e-06,9.1529055e-06,-6.2944542e-07,-1.9489344e-05,-3.3362547e-05,-3.2616514e-05,-1.9453923e-05,-5.5941764e-06,-2.5278191e-06,-1.2417429e-05,-2.6826363e-05,-3.3914352e-05,-2.7997827e-05,-1.3785323e-05,-2.1805122e-06,-1.3750373e-06,-1.0511715e-05,-2.0818959e-05,-2.2965054e-05,-1.4509852e-05,-1.5422213e-06,6.5218787e-06,4.5365227e-06,-4.5156471e-06,-1.2285669e-05,-1.1940347e-05,-3.5154928e-06,6.4308319e-06,1.032206e-05,5.618781e-06,-3.3997585e-06,-9.3397348e-06,-7.6889755e-06,-2.4529709e-07,6.6191556e-06,7.238536e-06,1.1261948e-06,-6.8679278e-06,-1.0637664e-05,-7.7056948e-06,-1.0038414e-06,3.716222e-06,2.5838385e-06,-3.4036204e-06,-9.3946574e-06,-1.0706718e-05,-6.5281447e-06,-3.7980843e-07,2.8772438e-06,9.5408961e-07,-4.1778208e-06,-8.0557857e-06,-7.3872734e-06,-2.6123048e-06,2.6127791e-06,4.4564677e-06,1.9492018e-06,-2.3903945e-06,-4.7229646e-06,-3.0000585e-06,1.4909184e-06,5.2994233e-06,5.6449257e-06,2.586846e-06,-1.1574617e-06,-2.4918315e-06,-4.124955e-07,3.2962989e-06,5.6100193e-06,4.7225667e-06,1.424187e-06,-1.6428849e-06,-2.1614103e-06,4.3982482e-08,2.9730541e-06,4.1421044e-06,2.5795187e-06,-4.7135927e-07,-2.6384382e-06,-2.3511589e-06,-4.5235293e-08,2.2788938e-06,2.7164951e-06,9.6445558e-07,-1.5136416e-06,-2.7310389e-06,-1.7780011e-06,5.0648327e-07,2.2803015e-06,2.203567e-06,4.7490397e-07,-1.4005766e-06,-1.8679885e-06,-5.5972424e-07,1.4668002e-06,2.6322155e-06,2.1097044e-06,4.4332262e-07,-9.4906443e-07,-9.4177722e-07,4.1940672e-07,2.0081507e-06,2.5609527e-06,1.6851839e-06,1.2972478e-07,-8.6166517e-07,-5.5861176e-07,7.0210996e-07,1.8348235e-06,1.9019161e-06,8.5131967e-07,-4.8257351e-07,-1.0806842e-06,-5.5446469e-07,5.7689851e-07,1.3416873e-06,1.1079975e-06,6.9332813e-08,-9.4702904e-07,-1.1651645e-06,-4.7287656e-07,5.2064627e-07,1.0015126e-06,6.0562354e-07,-3.1424511e-07,-1.002233e-06,-9.1800672e-07,-1.5551659e-07,6.6063893e-07,8.9455352e-07,4.028943e-07,-3.7531498e-07,-7.9468157e-07,-5.2527093e-07,2.002059e-07,7.9686538e-07,8.0744655e-07,2.5847513e-07,-3.8368898e-07,-6.0326977e-07,-2.4621767e-07,3.7477054e-07,7.5019233e-07,5.8704035e-07,3.112298e-08,-4.6883994e-07,-5.3079367e-07,-1.386874e-07,3.6237049e-07,5.5698621e-07,2.9237216e-07,-2.1258417e-07,-5.5800587e-07,-4.8823756e-07,-8.7492715e-08,3.0303931e-07,3.678249e-07,6.5944455e-08,-3.4936576e-07,-5.4528789e-07,-3.7702495e-07,6.1724164e-09,2.9300006e-07,2.6430811e-07,-3.7707917e-08,-3.5543238e-07,-4.3034797e-07,-2.0818281e-07,1.2748148e-07,3.117182e-07,2.1189344e-07,-7.3581589e-08,-3.042511e-07,-2.9499373e-07,-6.0235962e-08,2.0680589e-07,2.9564518e-07,1.4616226e-07,-1.1080091e-07,-2.6609308e-07,-2.0165899e-07,2.0241773e-08,2.1494454e-07,2.2759623e-07,5.4591354e-08,-1.6058064e-07,-2.4788253e-07,-1.4665319e-07,5.1547801e-08,1.8275485e-07,1.4403795e-07,-2.771986e-08,-1.9158023e-07,-2.1911482e-07,-9.5587239e-08,7.372379e-08,1.5261166e-07,8.3341831e-08,-7.1301592e-08,-1.8348095e-07,-1.6473221e-07,-3.427958e-08,1.0121337e-07,1.3624361e-07,4.9981505e-08,-8.1256189e-08,-1.4911733e-07,-1.006517e-07,2.2280494e-08,1.2060747e-07,1.1922978e-07,2.5392961e-08,-8.0945554e-08,-1.1392177e-07,-5.0103502e-08,5.5876004e-08,1.1830182e-07,8.9793112e-08,-2.9246932e-09,-8.3663743e-08,-8.9460485e-08,-1.9830749e-08,6.5814611e-08,9.8106476e-08,5.3198406e-08,-3.0444827e-08,-8.543919e-08,-7.0227728e-08,-7.8478907e-10,6.4767271e-08,7.4221411e-08,2.2396602e-08,-4.69621e-08,-7.8156198e-08,-4.8245791e-08,1.6302643e-08,6.2908818e-08,5.5771654e-08,3.4439578e-09,-5.0046651e-08,-6.177806e-08,-2.3918032e-08,3.1702395e-08,6.0668803e-08,4.1764618e-08,-7.315986e-09,-4.5833755e-08,-4.3388091e-08,-3.5343983e-09,4.0625256e-08,5.4065382e-08,2.7687939e-08,-1.5685023e-08,-4.0899042e-08,-2.8907088e-08,8.8964054e-09,4.1145114e-08,4.2309033e-08,1.2663782e-08,-2.313271e-08,-3.672228e-08,-1.8689068e-08,1.487631e-08,3.63375e-08,2.8967262e-08,-3.0124395e-10,-2.7477407e-08,-3.1326703e-08,-1.0069122e-08,1.8126457e-08,3.0481864e-08];var kemar_2bt_fir_44100_diff_40=[0.462809,-0.063444443,-0.019792382,0.020613821,0.054439794,0.075048141,0.078060672,0.065770894,0.046836898,0.031593911,0.026442505,0.031062294,0.039894566,0.046383474,0.046942249,0.042298336,0.035945632,0.031292845,0.029575996,0.029663354,0.029425221,0.027423847,0.023772487,0.01981785,0.017121006,0.016516991,0.017772529,0.019870102,0.021606268,0.022151122,0.021364648,0.019816365,0.018525753,0.018486697,0.020131409,0.02299601,0.025842585,0.02728142,0.026602158,0.024298599,0.021876279,0.020964922,0.022253504,0.02495998,0.027252035,0.027408058,0.024972444,0.021112053,0.017891165,0.016920071,0.018283678,0.020489147,0.021482702,0.020047255,0.0166231,0.012989716,0.011035703,0.011474616,0.013394188,0.014936564,0.014615353,0.012339238,0.0094339401,0.0076698042,0.0080004381,0.0099071376,0.011799009,0.012164329,0.010643035,0.0082609234,0.0066731884,0.0069697676,0.0088972645,0.011044664,0.011849845,0.010704915,0.0083778845,0.0064605665,0.0062422785,0.0078072394,0.0099854069,0.011179586,0.010478904,0.0082790926,0.0059875674,0.0050355634,0.0058955061,0.0077822153,0.0092268484,0.0091044921,0.007394718,0.0051597506,0.0037803634,0.0040001483,0.0054425574,0.0069160713,0.0072678174,0.0061760568,0.0043368512,0.0029396701,0.00282294,0.0039073667,0.0052893693,0.00590397,0.0052739996,0.0038203916,0.0025334014,0.0022573927,0.0031025552,0.0043905522,0.0051544141,0.0048251231,0.0036187686,0.0023627218,0.0018991446,0.002494965,0.0036699397,0.0045506367,0.0044886111,0.0035050223,0.0022577413,0.0015678618,0.0018471337,0.0028259023,0.0037603755,0.0039605685,0.0032637457,0.0021284369,0.0012972994,0.001276538,0.0019973398,0.0028858834,0.0032782143,0.0028807533,0.0019571648,0.0011235259,0.00090880139,0.0013935586,0.0021733944,0.0026592242,0.0024930069,0.001786337,0.0010236109,0.0007102344,0.0010200809,0.0016871245,0.0022072643,0.0021983506,0.0016621219,0.00096936262,0.0005885156,0.00075565343,0.001317494,0.0018507318,0.0019653111,0.001574621,0.0009459891,0.00050375587,0.00052985823,0.00097301306,0.0014950967,0.001714555,0.0014716161,0.00093107915,0.00045728378,0.00035572928,0.00066461012,0.0011384104,0.0014278113,0.0013244089,0.00089888991,0.00044135805,0.00025262,0.00043631272,0.00083538715,0.0011511467,0.0011553776,0.00084524084,0.00043606601,0.00020343788,0.00028983699,0.00061114546,0.00092390791,0.0010004914,0.00078652514,0.0004320727,0.00017967704,0.00019233731,0.00044306394,0.00074042974,0.00086743076,0.00073316559,0.00043158527,0.00016984795,0.00012061065,0.00030340586,0.00057633768,0.00073996867,0.00067745365,0.00043256892,0.00017380861,7.3456795e-05,0.00018835584,0.00042478452,0.00060868054,0.00060880772,0.00042578211,0.00018669701,5.259032e-05,0.00010597437,0.0002969015,0.00048260589,0.00052974117,0.00040614011,0.0001990624,5.0155239e-05,5.5334694e-05,0.00020021238,0.00037437954,0.00045161581,0.00037794485,0.00020624763,5.5495831e-05,2.5722995e-05,0.00012934218,0.00028580686,0.00038094592,0.00034742412,0.00020975292,6.3945001e-05,8.3150217e-06,7.519011e-05,0.00021084218,0.00031580558,0.00031545176,0.00021082173,7.5210446e-05,8.2840734e-07,3.4284079e-05,0.00014596294,0.00025326881,0.00027967998,0.00020744609,8.770125e-05,2.5675035e-06,7.2376406e-06,9.2836824e-05,0.00019497017,0.000240332,0.00019771246,9.7961754e-05,1.0280949e-05,-7.1034242e-06,5.3213138e-05,0.00014464938,0.00020094852,0.00018278985,0.00010397159,1.9817637e-05,-1.2728313e-05,2.5386636e-05,0.00010355892,0.00016461023,0.00016541495,0.00010626717,2.9059785e-05,-1.330016e-05,6.0221701e-06,7.0141934e-05,0.00013175735,0.00014704489,0.00010590434,3.7732407e-05,-1.0378481e-05,-6.9050311e-06,4.2838125e-05,0.00010171614,0.00012764111,0.00010288582,4.5461235e-05,-4.6582072e-06,-1.4000906e-05,2.1486596e-05,7.4726653e-05,0.00010739815,9.6860633e-05,5.1224524e-05,2.5843894e-06,-1.6084619e-05,6.2311378e-06,5.1797375e-05,8.749171e-05,8.8305118e-05,5.4338583e-05,9.7778293e-06,-1.4763296e-05,-3.6805693e-06,3.338531e-05,6.9179623e-05,7.8373909e-05,5.5036602e-05,1.6012713e-05,-1.1599714e-05,-9.6072354e-06,1.900471e-05,5.2926513e-05,6.7967791e-05,5.3924352e-05,2.1132104e-05,-7.4500517e-06,-1.2609594e-05,7.9481815e-06,3.8631155e-05,5.741488e-05,5.1330178e-05,2.5110588e-05,-2.7355759e-06,-1.3244898e-05,-1.4215576e-07,2.6284713e-05,4.6917139e-05,4.736349e-05,2.7741873e-05,2.0578686e-06,-1.2004716e-05,-5.4572206e-06,1.6100184e-05,3.6900896e-05,4.2303585e-05,2.8881168e-05,6.3696707e-06,-9.5661871e-06,-8.3985906e-06,8.1698981e-06,2.784593e-05,3.665491e-05,2.8679473e-05,9.8534802e-06,-6.5923132e-06,-9.5665737e-06,2.2812326e-06,1.998952e-05,3.0876305e-05,2.7461734e-05,1.2455376e-05,-3.4991381e-06,-9.490811e-06,-1.9086606e-06,1.3327223e-05,2.5218093e-05,2.5491308e-05,1.4228528e-05,-4.9940297e-07,-8.5160646e-06,-4.6633422e-06,7.8127814e-06,1.9820161e-05,2.2930901e-05,1.5190554e-05,2.2306856e-06,-6.9109024e-06,-6.1722135e-06,3.4481957e-06,1.4845573e-05,1.9954012e-05,1.5364601e-05,4.5103448e-06,-4.9661985e-06,-6.6603543e-06,2.0807683e-07,1.0465783e-05,1.6790305e-05,1.4859507e-05,6.23099e-06,-2.9568841e-06,-6.406653e-06,-2.0279688e-06,6.77252e-06,1.3655666e-05,1.3848991e-05,7.3929882e-06,-1.0665208e-06,-5.6673498e-06,-3.4359598e-06,3.7607001e-06,1.0687941e-05,1.249344e-05,8.05325e-06,6.1177582e-07,-4.6268701e-06,-4.1751032e-06,1.386847e-06,7.9634301e-06,1.0909685e-05,8.2674678e-06,2.0213861e-06,-3.4215088e-06,-4.3725722e-06,-3.8832835e-07,5.5432247e-06,9.1986449e-06,8.0884965e-06,3.1158365e-06,-2.1754704e-06,-4.1523872e-06,-1.610807e-06,3.4817369e-06,7.4665932e-06,7.5898224e-06,3.8746921e-06,-9.9838644e-07,-3.6469032e-06,-2.3542302e-06,1.804241e-06,5.8100454e-06,6.8641257e-06,4.3166019e-06,3.6439104e-08,-2.9767014e-06,-2.7116923e-06,4.9834154e-07,4.2940446e-06,5.999003e-06,4.484797e-06,8.94751e-07,-2.2322561e-06,-2.7716881e-06,-4.6904586e-07,2.9533865e-06,5.0624735e-06,4.4252884e-06,1.5640541e-06,-1.47807e-06,-2.608075e-06,-1.1340027e-06,1.8080873e-06,4.1085814e-06,4.1809694e-06,2.040651e-06,-7.6539254e-07,-2.2865765e-06,-1.5340555e-06,8.7060823e-07,3.1857876e-06,3.7972191e-06,2.3307132e-06,-1.3512785e-07,-1.8698613e-06,-1.7135035e-06,1.4173662e-07,2.3350333e-06,3.322705e-06,2.4537576e-06,3.8723877e-07,-1.412977e-06,-1.7217627e-06,-3.9207083e-07,1.5834703e-06,2.8023346e-06,2.4384667e-06,7.9274457e-07,-9.5734038e-07,-1.6056321e-06,-7.5352148e-07,9.441132e-07,2.271539e-06,2.3147873e-06,1.0832342e-06,-5.3124478e-07,-1.4046091e-06,-9.6752876e-07,4.2107368e-07,1.7570477e-06,2.1102187e-06,1.2656064e-06,-1.5436925e-07,-1.1519733e-06,-1.0588642e-06,1.3486611e-08,1.2800184e-06,1.8506668e-06,1.3504487e-06,1.5984422e-07,-8.7678387e-07,-1.0530383e-06,-2.8437216e-07,8.5658223e-07,1.5609678e-06,1.3524901e-06,4.0474481e-07,-6.0322424e-07,-9.759093e-07,-4.8347789e-07,4.9647866e-07,1.2630264e-06,1.2892393e-06,5.8052751e-07,-3.489599e-07,-8.5128084e-07,-5.9830347e-07,2.0302046e-07,9.7387533e-07,1.1781857e-06,6.921839e-07,-1.2525288e-07,-6.9904905e-07,-6.4414104e-07,-2.5006116e-08,7.0571161e-07,1.0350358e-06,7.4705588e-07,6.1347855e-08];var kemar_2bt_fir_44100_diff_60=[0.47647801,-0.063929588,-0.074820414,-0.032471903,0.049557157,0.088441692,0.039550189,-0.039314426,-0.054948371,0.0089313891,0.077150315,0.07897687,0.028697714,-0.0045457412,0.012738067,0.045189608,0.044326108,0.011229603,-0.012254901,-0.0018835698,0.021511629,0.025219526,0.0076204394,-0.0047242865,0.0047668596,0.023033094,0.028406475,0.019261869,0.012364838,0.017727863,0.026372451,0.025393449,0.016604638,0.012992834,0.019818705,0.027446337,0.025054801,0.015552399,0.011533327,0.018453753,0.027688513,0.027948549,0.019410232,0.012620917,0.014826569,0.021710189,0.023961831,0.018911371,0.012614761,0.011380053,0.014537934,0.016763873,0.015305617,0.012484276,0.011541327,0.012467215,0.013018324,0.012376468,0.011956417,0.012761273,0.013637593,0.013020007,0.011460269,0.011126105,0.012845392,0.014793653,0.014721606,0.012837034,0.011580197,0.012601989,0.014794291,0.015737399,0.014597578,0.012916016,0.012585718,0.013698469,0.014737925,0.014519227,0.013385257,0.012487129,0.012382742,0.012660786,0.012701124,0.012369904,0.011905781,0.011464348,0.011040509,0.010709134,0.010635288,0.010772385,0.010764284,0.010333113,0.0096926745,0.0093818232,0.0096403556,0.010089338,0.010144987,0.0096892091,0.0091961129,0.0091763102,0.0096092215,0.010007008,0.0099815885,0.009635929,0.0093807532,0.0094621535,0.0097464221,0.0099301049,0.0098649738,0.0096489787,0.0094670709,0.0094129443,0.0094522685,0.0094899703,0.0094403578,0.0092700832,0.0090246759,0.0088131689,0.0087240422,0.0087308455,0.0086998437,0.0085211592,0.0082329661,0.0079924623,0.007912579,0.0079420684,0.0079235919,0.0077642775,0.0075297137,0.0073650917,0.0073404349,0.0073886621,0.0073889853,0.0072914558,0.0071528493,0.0070647039,0.0070626996,0.0071048066,0.0071218223,0.0070794336,0.0069985026,0.0069285855,0.006904664,0.0069201724,0.0069334479,0.0069024884,0.0068216077,0.0067276889,0.0066666128,0.006648805,0.0066380152,0.0065870374,0.0064853719,0.0063696341,0.0062859305,0.0062439251,0.00620995,0.0061439788,0.0060400395,0.0059294514,0.0058474313,0.0057997536,0.0057614245,0.005704191,0.0056230784,0.0055379416,0.0054726512,0.0054337303,0.0054068384,0.0053714197,0.0053189001,0.005258935,0.0052095233,0.0051803431,0.0051640258,0.0051430375,0.0051058219,0.0050571528,0.0050128452,0.0049839662,0.004966021,0.0049436176,0.0049056108,0.0048554456,0.0048067966,0.0047696335,0.0047409376,0.0047086761,0.0046640523,0.0046095587,0.0045556673,0.004510486,0.004472746,0.0044341488,0.0043878257,0.0043345909,0.0042816671,0.0042358148,0.0041974941,0.004161106,0.0041206111,0.004075144,0.0040295837,0.0039898199,0.0039572851,0.0039278441,0.0038959079,0.0038597051,0.0038226785,0.0037898493,0.0037628622,0.0037385137,0.0037119752,0.003681334,0.0036490485,0.003619168,0.0035932905,0.0035691687,0.0035430396,0.0035131623,0.0034811813,0.0034502663,0.0034220426,0.0033952307,0.0033670664,0.0033359651,0.0033029064,0.0032703895,0.0032400941,0.0032114622,0.0031824308,0.0031515032,0.0031191702,0.0030874044,0.0030578033,0.0030301868,0.0030029339,0.0029746392,0.0029454536,0.002916869,0.0028902465,0.0028655604,0.0028415229,0.0028168694,0.0027915167,0.0027665193,0.0027429657,0.0027209274,0.0026994334,0.0026774057,0.0026546158,0.0026317805,0.0026097831,0.0025888071,0.0025681835,0.0025470362,0.002525076,0.0025028016,0.0024809677,0.002459859,0.0024390549,0.002417868,0.0023960068,0.0023738306,0.0023519876,0.0023308103,0.00231005,0.0022891725,0.0022679011,0.0022464807,0.0022254363,0.0022050869,0.0021852853,0.0021656104,0.0021457926,0.0021259668,0.0021065236,0.0020877351,0.0020695138,0.0020515202,0.0020334905,0.002015467,0.0019977256,0.0019804912,0.0019637195,0.0019471423,0.0019305146,0.0019138231,0.0018972653,0.0018810355,0.0018651296,0.0018493492,0.0018334871,0.0018175098,0.001801568,0.0017858368,0.0017703474,0.001754966,0.0017395306,0.0017240047,0.0017085059,0.0016931898,0.0016781094,0.0016631803,0.0016482773,0.0016333613,0.0016185171,0.0016038733,0.0015894882,0.001575307,0.0015612277,0.0015472034,0.0015332855,0.0015195716,0.0015061134,0.001492872,0.0014797597,0.0014667225,0.0014537843,0.0014410156,0.0014284592,0.0014160873,0.0014038266,0.0013916232,0.0013794847,0.0013674628,0.0013555955,0.0013438679,0.0013322236,0.0013206165,0.0013090478,0.0012975587,0.0012861862,0.0012749275,0.0012637444,0.0012526009,0.0012414964,0.0012304648,0.0012195415,0.0012087326,0.0011980132,0.0011873551,0.0011767558,0.0011662408,0.0011558409,0.0011455651,0.001135396,0.0011253094,0.0011152987,0.0011053805,0.0010955782,0.0010858999,0.0010763315,0.001066851,0.0010574477,0.0010481309,0.0010389166,0.0010298115,0.0010208039,0.0010118749,0.0010030124,0.00099422061,0.00098551146,0.00097689126,0.00096835237,0.0009598796,0.0009514626,0.00094310357,0.00093481271,0.00092659699,0.00091845309,0.00091037032,0.00090234092,0.00089436647,0.00088645611,0.00087861728,0.00087084965,0.00086314615,0.00085550069,0.00084791414,0.00084039371,0.00083294627,0.00082557247,0.000818267,0.00081102439,0.00080384407,0.00079673069,0.00078968937,0.00078272063,0.00077581982,0.00076898141,0.00076220336,0.00075548817,0.00074883905,0.00074225635,0.00073573593,0.00072927261,0.00072286365,0.00071651023,0.00071021472,0.00070397748,0.00069779553,0.0006916647,0.00068558246,0.00067954959,0.00067356823,0.00066763931,0.00066176121,0.00065593084,0.00065014651,0.00064440881,0.00063871994,0.00063308113,0.0006274918,0.00062194979,0.00061645382,0.00061100425,0.00060560292,0.00060025108,0.00059494842,0.00058969326,0.00058448419,0.00057932129,0.00057420565,0.00056913804,0.00056411809,0.00055914425,0.00055421505,0.00054932991,0.00054448924,0.00053969352,0.00053494226,0.00053023396,0.00052556716,0.00052094104,0.00051635568,0.00051181135,0.00050730759,0.00050284335,0.0004984173,0.00049402873,0.00048967765,0.00048536432,0.00048108865,0.00047684985,0.00047264702,0.00046847959,0.00046434766,0.00046025158,0.0004561914,0.00045216666,0.0004481767,0.00044422108,0.00044029989,0.00043641339,0.00043256168,0.00042874439,0.00042496095,0.00042121095,0.00041749424,0.00041381098,0.00041016113,0.00040654434,0.00040295999,0.00039940761,0.00039588686,0.00039239775,0.00038894013,0.00038551359,0.00038211758,0.00037875152,0.00037541508,0.00037210813,0.00036883052,0.00036558186,0.00036236172,0.00035916956,0.0003560051,0.0003528682,0.00034975869,0.00034667642,0.00034362095,0.00034059197,0.00033758915,0.00033461244,0.00033166178,0.00032873699,0.00032583784,0.00032296398,0.00032011521,0.00031729147,0.00031449267,0.00031171867,0.00030896926,0.00030624415,0.00030354311,0.00030086603,0.00029821278,0.00029558325,0.00029297711,0.00029039418,0.00028783415,0.00028529685,0.00028278213,0.00028028979,0.00027781964,0.00027537133,0.00027294466,0.00027053937,0.0002681553,0.0002657923,0.00026345017];var kemar_2bt_fir_48000_diff_20=[0.51929098,0.060848985,-0.0023643877,0.10025987,0.063873736,0.13022775,0.1005319,0.11686679,0.087913578,0.077950659,0.061648111,0.056317813,0.056469626,0.059159501,0.060076745,0.056861216,0.050252994,0.043257479,0.038934653,0.038281103,0.039566297,0.039508729,0.0354756,0.027248353,0.017218694,0.0089195882,0.0048971572,0.0052893005,0.0079049817,0.009751687,0.0089214612,0.0056405194,0.0018901083,-3.9642587e-05,0.00095269608,0.0041937342,0.0078483154,0.010210792,0.010753787,0.010281187,0.010152059,0.011219691,0.013229543,0.015068972,0.015634494,0.014661469,0.012920694,0.011660534,0.011712037,0.012899383,0.014162652,0.01430161,0.01279323,0.010138877,0.0075051241,0.0059219266,0.0055989027,0.0058225873,0.0054867817,0.0038747243,0.0011527663,-0.0017502628,-0.0037766473,-0.0044356784,-0.0040933376,-0.0036855525,-0.0040585236,-0.005400721,-0.0071439814,-0.008380201,-0.0084902583,-0.007551629,-0.0062596823,-0.005438028,-0.0054869562,-0.0061445872,-0.0067094206,-0.0065397753,-0.0054947496,-0.004013282,-0.0027963266,-0.0023261764,-0.0025568171,-0.0029777783,-0.0029907269,-0.002327964,-0.0012257941,-0.00024337422,0.00012393806,-0.00022047349,-0.00092616396,-0.001452289,-0.0014417549,-0.00095383996,-0.00040295331,-0.00025755362,-0.00071430558,-0.0015704119,-0.0023727307,-0.0027302366,-0.0025717456,-0.0021753222,-0.0019612276,-0.0021975475,-0.0028213226,-0.0034922719,-0.003833005,-0.0036848393,-0.0032048748,-0.0027452094,-0.0026057156,-0.0028334127,-0.0032029606,-0.0033837096,-0.0031679362,-0.0026094941,-0.0019785372,-0.0015716942,-0.0015125874,-0.0016784464,-0.0017971405,-0.0016412543,-0.0011830785,-0.00060694272,-0.00017581576,-5.374114e-05,-0.00019892638,-0.00040237678,-0.00043775238,-0.00021622463,0.0001589608,0.00047101368,0.00054217623,0.00035346865,5.1627518e-05,-0.00015657824,-0.00014591147,4.7595196e-05,0.00025952782,0.00031535979,0.00015078388,-0.0001478406,-0.00040709551,-0.00048661779,-0.000371765,-0.0001770754,-6.2034345e-05,-0.00012019498,-0.00031812586,-0.00052355838,-0.00059887266,-0.00049455725,-0.00027930846,-8.8720232e-05,-3.0873847e-05,-0.0001147291,-0.00024896331,-0.00030901791,-0.00022384796,-2.2570702e-05,0.00018891979,0.00030252629,0.00028019446,0.00017613854,9.5589234e-05,0.00012068526,0.00025525729,0.00042520683,0.0005318759,0.00051990117,0.00041283454,0.00029372732,0.00024627243,0.00029810706,0.0004051363,0.00048459699,0.00047314615,0.00036946959,0.00023296996,0.00014131128,0.00013737725,0.00020210922,0.00027055821,0.00027836935,0.000205788,8.9355326e-05,-5.1246138e-06,-2.797343e-05,2.1402677e-05,9.6365972e-05,0.00013677849,0.00011041786,3.3632438e-05,-4.1910451e-05,-6.5929637e-05,-2.3738567e-05,5.5176543e-05,0.00011891004,0.00012910927,8.6084786e-05,2.6705443e-05,-2.3352658e-06,2.3162493e-05,8.9231479e-05,0.00015465497,0.00017993994,0.00015389954,9.9891775e-05,5.8361066e-05,5.8579965e-05,9.922303e-05,0.0001507394,0.00017646402,0.0001578378,0.00010630358,5.4341918e-05,3.262239e-05,4.9370613e-05,8.5868418e-05,0.00011044954,0.00010068018,5.8298013e-05,7.0624489e-06,-2.4217061e-05,-2.1226362e-05,6.8095489e-06,3.4476433e-05,3.8175529e-05,1.21193e-05,-2.8460005e-05,-5.852654e-05,-6.0646373e-05,-3.6490996e-05,-4.8813496e-06,1.1709767e-05,2.5185257e-06,-2.4836196e-05,-5.0310211e-05,-5.5623217e-05,-3.6653001e-05,-5.6981691e-06,1.750214e-05,1.941833e-05,1.5806077e-06,-2.1175108e-05,-3.1412352e-05,-2.1085968e-05,3.3861304e-06,2.6091713e-05,3.2749068e-05,2.0316043e-05,-1.43276e-06,-1.7087222e-05,-1.6296685e-05,-5.6747512e-07,1.828799e-05,2.6638378e-05,1.8390408e-05,-1.178538e-06,-1.9474454e-05,-2.5414243e-05,-1.6803723e-05,-1.4291859e-06,8.6795315e-06,5.6237267e-06,-9.1508659e-06,-2.620968e-05,-3.485495e-05,-3.0423478e-05,-1.7174545e-05,-4.9988372e-06,-2.452538e-06,-1.1018849e-05,-2.4440831e-05,-3.3267131e-05,-3.1417914e-05,-2.0179677e-05,-7.0336291e-06,-3.3032001e-07,-3.6027625e-06,-1.3395986e-05,-2.1935694e-05,-2.2612454e-05,-1.4432804e-05,-2.4525183e-06,5.8922616e-06,5.902579e-06,-1.3215688e-06,-9.884987e-06,-1.3310762e-05,-8.9676347e-06,3.0465145e-07,8.3568668e-06,1.0047848e-05,4.6916424e-06,-3.6690078e-06,-9.2098871e-06,-8.3407574e-06,-2.0232905e-06,5.0762637e-06,7.9195324e-06,4.5408802e-06,-2.7393721e-06,-9.0633457e-06,-1.0432622e-05,-6.3759449e-06,-1.0706669e-07,3.8247525e-06,2.6867688e-06,-2.6655004e-06,-8.5248145e-06,-1.0953969e-05,-8.4687321e-06,-2.9406764e-06,1.814877e-06,2.7095066e-06,-5.5617231e-07,-5.413601e-06,-8.2987139e-06,-7.1188055e-06,-2.6123048e-06,2.2757291e-06,4.476847e-06,2.8748175e-06,-1.0226291e-06,-4.2230139e-06,-4.3474747e-06,-1.2230594e-06,3.0911459e-06,5.7952124e-06,5.2788154e-06,2.160557e-06,-1.2306153e-06,-2.5124701e-06,-8.6070132e-07,2.5014167e-06,5.218185e-06,5.4502424e-06,3.103125e-06,-1.8039794e-07,-2.2069033e-06,-1.7418633e-06,6.970425e-07,3.2707366e-06,4.1275035e-06,2.6624318e-06,-1.2823582e-07,-2.3881516e-06,-2.6916874e-06,-9.9208994e-07,1.4067028e-06,2.7935137e-06,2.2294032e-06,1.5206824e-07,-1.9808507e-06,-2.7258296e-06,-1.632976e-06,4.9178406e-07,2.1890478e-06,2.3598967e-06,9.927094e-07,-8.7531155e-07,-1.9079444e-06,-1.3910044e-06,3.0799711e-07,2.0342969e-06,2.6623436e-06,1.8572483e-06,2.6638646e-07,-9.6393908e-07,-9.896001e-07,1.755599e-07,1.7042437e-06,2.5504835e-06,2.1688913e-06,8.6368012e-07,-4.5368622e-07,-9.0867345e-07,-2.5507667e-07,9.858289e-07,1.9133348e-06,1.8759035e-06,9.0286564e-07,-3.4612531e-07,-1.0531058e-06,-8.0192614e-07,1.5689026e-07,1.1051573e-06,1.3649748e-06,7.5764504e-07,-2.9607492e-07,-1.0871781e-06,-1.1119263e-06,-4.0451933e-07,5.099306e-07,9.9366125e-07,7.3152592e-07,-6.9102455e-08,-8.411702e-07,-1.0583266e-06,-5.9079018e-07,2.2308019e-07,8.2609998e-07,8.294464e-07,2.6877862e-07,-4.3898491e-07,-7.9571558e-07,-5.6413714e-07,8.4122855e-08,7.0095832e-07,8.7718598e-07,5.1840545e-07,-1.0446325e-07,-5.5472374e-07,-5.3344861e-07,-7.6421453e-08,4.847403e-07,7.6066269e-07,5.7106968e-07,5.7937365e-08,-4.2534771e-07,-5.6147535e-07,-2.8264486e-07,1.9412189e-07,5.2658441e-07,4.8512052e-07,1.0397944e-07,-3.531163e-07,-5.8172413e-07,-4.449111e-07,-5.8676585e-08,2.9806922e-07,3.8003136e-07,1.394409e-07,-2.4950205e-07,-5.182307e-07,-4.9008668e-07,-1.9635424e-07,1.5378047e-07,3.227611e-07,2.07018e-07,-9.8691617e-08,-3.7440098e-07,-4.2980584e-07,-2.3217686e-07,7.8882057e-08,2.9267241e-07,2.7331632e-07,4.8682615e-08,-2.1558413e-07,-3.3444807e-07,-2.299731e-07,2.0346068e-08,2.4289445e-07,2.8993722e-07,1.3870385e-07,-9.8730501e-08,-2.5750093e-07,-2.3347348e-07,-5.1346373e-08,1.5758626e-07,2.4911854e-07,1.6461772e-07,-3.277526e-08,-2.0617692e-07,-2.4099592e-07,-1.216623e-07,6.222037e-08,1.813988e-07,1.5637798e-07,8.8205862e-09,-1.5714363e-07,-2.2906653e-07,-1.6281762e-07,-9.6138763e-09,1.2282136e-07,1.4579977e-07,4.9030056e-08,-9.5828794e-08,-1.8740827e-07,-1.6473221e-07,-4.6797633e-08,8.3995832e-08,1.4005443e-07,8.8278093e-08,-2.9830923e-08,-1.2954235e-07,-1.4228492e-07,-6.1528094e-08,5.5433888e-08,1.2911587e-07,1.1273026e-07,2.2471707e-08,-7.6304293e-08,-1.1554971e-07,-7.0589468e-08,2.4911908e-08,1.0426639e-07,1.144292e-07,5.1430016e-08,-3.9019061e-08,-9.467383e-08,-7.9702934e-08,-7.8316671e-09,6.9169067e-08,9.8321794e-08,6.137651e-08,-1.4410811e-08,-7.6559974e-08,-8.4046298e-08,-3.4637612e-08,3.5255112e-08,7.695335e-08,6.3086905e-08,5.2545407e-09,-5.5542529e-08,-7.8010757e-08,-4.8591321e-08,1.0597341e-08,5.8348292e-08,6.2987749e-08,2.3489982e-08,-3.1137061e-08,-6.2825509e-08,-5.0682155e-08,-4.4434171e-09,4.3445196e-08,6.0826875e-08,3.7632582e-08,-8.2703057e-09,-4.4465282e-08,-4.6562487e-08,-1.4345537e-08,2.9069602e-08,5.3907333e-08,4.4220009e-08,8.1215642e-09,-2.8749666e-08,-4.1386223e-08,-2.2354272e-08,1.3933052e-08,4.1959878e-08,4.2919939e-08,1.7133453e-08,-1.7006587e-08,-3.6225063e-08,-2.8367775e-08,-1.3160246e-10,2.8016071e-08,3.7222832e-08,2.1016907e-08,-7.4731701e-09,-3.016504e-08,-3.035054e-08,-1.0371453e-08,1.5166764e-08,3.2546289e-08,7.1237383e-09];var kemar_2bt_fir_48000_diff_40=[0.462809,-0.021436742,-0.067710851,0.046124442,0.016485861,0.089593328,0.06438528,0.083234924,0.054352442,0.044326757,0.028927338,0.026561385,0.031264493,0.039405266,0.04580359,0.047337724,0.044027555,0.038277258,0.033042742,0.030123695,0.029475656,0.029695077,0.029152531,0.027005661,0.023561266,0.019926897,0.017316019,0.016448983,0.017266243,0.019076361,0.020929018,0.022015741,0.021952647,0.020887275,0.019426365,0.018404926,0.018546211,0.020115781,0.022716939,0.025414261,0.027095716,0.027040427,0.025345179,0.022953581,0.021211801,0.02114938,0.022875499,0.02545523,0.027377618,0.027383512,0.025182564,0.021670666,0.018445692,0.016921302,0.017527991,0.01946759,0.021176691,0.021235141,0.019189135,0.015805936,0.012613525,0.011002459,0.011419349,0.013142239,0.01473848,0.014921785,0.013318658,0.010667414,0.0083466251,0.0075288976,0.008476928,0.01040396,0.01197184,0.012112783,0.010670325,0.0084727824,0.006824241,0.006693264,0.0081262287,0.010221273,0.011678244,0.011586513,0.0099716979,0.0077732303,0.006272254,0.0063203025,0.007833699,0.0098484332,0.011109879,0.010806883,0.0090487122,0.0067888368,0.0052506584,0.0052044579,0.0065261359,0.0082924311,0.0093435215,0.0089690488,0.0073102185,0.0052478953,0.0038674549,0.003821138,0.0049592719,0.0064492848,0.0072905149,0.0069097933,0.0054830848,0.0038023457,0.0027828214,0.002916196,0.0039960236,0.005267424,0.0058967571,0.0054713153,0.0042272069,0.0028885382,0.0022176972,0.0025564476,0.0036327769,0.0047413591,0.00517851,0.0046636039,0.0034952005,0.0023565636,0.0018946421,0.0023417065,0.0033813356,0.0043502292,0.0046407237,0.0040604947,0.0029366977,0.0019091144,0.0015434659,0.001999345,0.0029478778,0.0037801007,0.0039730364,0.0033945459,0.0023678943,0.0014680701,0.0011766216,0.0016021227,0.0024294984,0.0031206137,0.0032391305,0.002703398,0.0018207154,0.00109107,0.0009046194,0.0013170169,0.0020314875,0.0025846469,0.0026279836,0.0021301086,0.0013836399,0.00081938131,0.00074499587,0.0011663071,0.0017946061,0.0022288961,0.0021983506,0.0017179314,0.0010711275,0.00063218775,0.00064103155,0.0010642042,0.0016226425,0.0019648518,0.001878085,0.0014106766,0.00083551576,0.0004814094,0.00053668211,0.00094177334,0.0014335566,0.0017052396,0.0015887236,0.0011499318,0.00064274085,0.00035330339,0.0004302761,0.00080184601,0.0012257174,0.0014378903,0.0013088273,0.00091442666,0.00048355943,0.00025877088,0.00035252401,0.00068577226,0.001041533,0.0011980891,0.0010602293,0.00071084933,0.00035519256,0.0001947248,0.00030801488,0.00060885836,0.0009034038,0.0010091585,0.00086176073,0.00054965464,0.00025647699,0.0001487802,0.00027757223,0.00055177547,0.00079702339,0.00086197726,0.0007073736,0.00042555866,0.00018104928,0.0001115085,0.0002469674,0.00049518144,0.00070003106,0.00073592286,0.0005812023,0.0003276868,0.00012269344,8.0133841e-05,0.00021437569,0.00043519913,0.0006045944,0.00061974654,0.00047212747,0.00024941742,8.0663426e-05,5.8728418e-05,0.00018671806,0.00037929609,0.00051624589,0.00051474184,0.00037687878,0.00018525629,5.114849e-05,4.766682e-05,0.00016863733,0.00033445665,0.0004418907,0.0004260128,0.00029734956,0.00013302254,2.868923e-05,4.1159097e-05,0.00015607475,0.0002989379,0.00038136867,0.00035385624,0.00023366189,9.2409736e-05,1.198011e-05,3.5650949e-05,0.00014366092,0.00026694042,0.00032965179,0.00029435268,0.00018289384,6.1486904e-05,4.0470743e-08,3.0666117e-05,0.00013024322,0.00023579478,0.00028282511,0.0002435477,0.00014211375,3.8621879e-05,-7.6158178e-06,2.6896527e-05,0.00011720596,0.0002063704,0.00024022452,0.00019922101,0.00010861047,2.2054167e-05,-1.1012522e-05,2.5568693e-05,0.00010626303,0.00018038302,0.00020296018,0.00016116287,8.074865e-05,9.431065e-06,-1.2147926e-05,2.5802686e-05,9.7529129e-05,0.00015835123,0.00017149151,0.00012966202,5.8415093e-05,-8.4661523e-08,-1.260847e-05,2.57345e-05,8.9554823e-05,0.00013925991,0.00014498791,0.00010393755,4.1041782e-05,-6.6956225e-06,-1.2382851e-05,2.5144454e-05,8.1468547e-05,0.00012186573,0.00012219553,8.2838988e-05,2.7648321e-05,-1.0965163e-05,-1.1489513e-05,2.436366e-05,7.3492835e-05,0.00010581605,0.0001021951,6.5349765e-05,1.7550177e-05,-1.3202038e-05,-9.9276529e-06,2.3662617e-05,6.6080737e-05,9.1397759e-05,8.4735186e-05,5.0659949e-05,9.7778293e-06,-1.4065521e-05,-7.8425505e-06,2.3250899e-05,5.9494456e-05,7.8800359e-05,6.9872277e-05,3.8531733e-05,3.684423e-06,-1.4331359e-05,-5.8396173e-06,2.2821454e-05,5.361695e-05,6.7893923e-05,5.7401883e-05,2.8800868e-05,-7.4346367e-07,-1.4060977e-05,-4.1447169e-06,2.2032878e-05,4.8114373e-05,5.8360145e-05,4.6944075e-05,2.1056277e-05,-3.8044742e-06,-1.3290863e-05,-2.6138475e-06,2.098512e-05,4.2860524e-05,4.9877829e-05,3.813221e-05,1.4951949e-05,-5.8162542e-06,-1.2223334e-05,-1.2206249e-06,1.9851113e-05,3.7970852e-05,4.2332388e-05,3.0634779e-05,1.0126439e-05,-6.9775559e-06,-1.0882751e-05,7.1625022e-08,1.8703028e-05,3.353764e-05,3.5750968e-05,2.4299877e-05,6.2658303e-06,-7.6236225e-06,-9.4682008e-06,1.2319346e-06,1.7577119e-05,2.9557446e-05,3.0078514e-05,1.9067951e-05,3.2864091e-06,-7.9040945e-06,-8.173228e-06,2.1316267e-06,1.6421393e-05,2.598229e-05,2.5203592e-05,1.4780779e-05,1.0730255e-06,-7.8264119e-06,-6.9303017e-06,2.793196e-06,1.5188667e-05,2.2728477e-05,2.1014881e-05,1.1276789e-05,-5.5155788e-07,-7.5052394e-06,-5.7422825e-06,3.2977545e-06,1.3937264e-05,1.9755364e-05,1.7389691e-05,8.4306384e-06,-1.6836604e-06,-7.0139254e-06,-4.6521215e-06,3.6609029e-06,1.2727044e-05,1.7087942e-05,1.4261953e-05,6.1037749e-06,-2.4537756e-06,-6.4091843e-06,-3.644908e-06,3.9125644e-06,1.1566944e-05,1.4724295e-05,1.1609908e-05,4.2237051e-06,-2.9736787e-06,-5.7870981e-06,-2.7597684e-06,4.0625506e-06,1.0466214e-05,1.2634175e-05,9.3765162e-06,2.7518523e-06,-3.256265e-06,-5.1604967e-06,-2.018027e-06,4.0964747e-06,9.4217692e-06,1.0794447e-05,7.4995086e-06,1.6065091e-06,-3.3535533e-06,-4.5260234e-06,-1.3812108e-06,4.0403144e-06,8.4206216e-06,9.1694598e-06,5.9330246e-06,7.281866e-07,-3.3321889e-06,-3.9194197e-06,-8.3915109e-07,3.9294712e-06,7.4810849e-06,7.7338592e-06,4.6221162e-06,7.0751959e-08,-3.2077497e-06,-3.3442028e-06,-3.9096384e-07,3.7736216e-06,6.6194611e-06,6.4850376e-06,3.5303991e-06,-4.219302e-07,-3.0237348e-06,-2.8089026e-06,-2.1467975e-08,3.5840612e-06,5.8270917e-06,5.4062251e-06,2.6405223e-06,-7.7337649e-07,-2.8123374e-06,-2.3358048e-06,2.6958636e-07,3.3722745e-06,5.1045734e-06,4.4748065e-06,1.9194409e-06,-1.0035091e-06,-2.5693806e-06,-1.913022e-06,4.8758952e-07,3.1388482e-06,4.4498562e-06,3.6775497e-06,1.3372265e-06,-1.1463644e-06,-2.3136769e-06,-1.5340555e-06,6.5144216e-07,2.8936968e-06,3.8535143e-06,2.9949933e-06,8.7601455e-07,-1.218308e-06,-2.0608343e-06,-1.2069375e-06,7.6927759e-07,2.6503091e-06,3.3181099e-06,2.4113828e-06,5.1124813e-07,-1.2358011e-06,-1.811202e-06,-9.2291643e-07,8.4568851e-07,2.4101203e-06,2.8435844e-06,1.9204346e-06,2.2575714e-07,-1.2190956e-06,-1.5761051e-06,-6.7957128e-07,8.9004014e-07,2.1762837e-06,2.421939e-06,1.5099143e-06,1.1928927e-08,-1.1725346e-06,-1.3596064e-06,-4.7869704e-07,9.065844e-07,1.9539308e-06,2.050443e-06,1.1669161e-06,-1.4578825e-07,-1.1036776e-06,-1.1578628e-06,-3.1170951e-07,8.9924843e-07,1.7417036e-06,1.7251653e-06,8.841858e-07,-2.5994031e-07,-1.024524e-06,-9.7508103e-07,-1.7350849e-07,8.762172e-07,1.5418961e-06,1.4397288e-06,6.5207915e-07,-3.359797e-07,-9.3695017e-07,-8.1201931e-07,-6.3325363e-08,8.4144528e-07,1.3584851e-06,1.1923642e-06,4.6204242e-07,-3.8421092e-07,-8.457391e-07,-6.6628767e-07,2.3862735e-08,7.9664726e-07,1.1894521e-06,9.7886169e-07,3.114208e-07,-4.1308686e-07,-7.5356411e-07,-5.434074e-07,9.5689557e-08,7.4320106e-07,1.0339146e-06,8.077624e-07,1.4826152e-07,-2.6718369e-08];var kemar_2bt_fir_48000_diff_60=[0.47647801,-0.018325061,-0.11553053,-0.01451469,-0.0041997553,0.10335278,0.058816378,0.011925501,-0.060059499,-0.041327058,0.023491987,0.08106233,0.078112485,0.031716161,-0.0030043712,0.0056676105,0.037326415,0.049831098,0.028151502,-0.0031563366,-0.012047728,0.00533395,0.024583109,0.023671935,0.0066310479,-0.0046632109,0.0028083074,0.019977069,0.028772426,0.023234331,0.014011795,0.01359521,0.021680559,0.027369726,0.02356639,0.015380692,0.013187641,0.019758428,0.027089638,0.026222329,0.017897263,0.011598455,0.014563907,0.023680116,0.029204285,0.025557414,0.016976788,0.012318542,0.015454663,0.021817471,0.024057548,0.019902039,0.013718948,0.011098947,0.013100916,0.016119474,0.01649528,0.014196626,0.011937096,0.011634663,0.012590457,0.013007038,0.012406112,0.011936756,0.012524252,0.013488609,0.013424524,0.012118619,0.011018993,0.01159795,0.013549293,0.014991201,0.014501881,0.012696582,0.011581943,0.012416404,0.014431554,0.015698402,0.015142639,0.013527502,0.012510789,0.012932851,0.014130594,0.014805068,0.014349361,0.01327094,0.012480369,0.012366807,0.012617151,0.012720952,0.012490961,0.012078473,0.011658872,0.011261332,0.010888262,0.01064734,0.010646357,0.010782642,0.010754554,0.010358187,0.0097610302,0.009391044,0.0095112163,0.0099327971,0.010181761,0.0099649945,0.0094573151,0.0091188892,0.0092402072,0.0096766739,0.010017203,0.0099854342,0.0096700842,0.0093985867,0.0094024642,0.009636538,0.0098704994,0.0099181163,0.0097742042,0.0095692862,0.0094340041,0.0094100167,0.0094541795,0.0094897888,0.0094460955,0.0092994893,0.0090783293,0.0088623146,0.0087350253,0.0087138099,0.008722117,0.008646744,0.0084402004,0.0081718857,0.0079713825,0.0079115356,0.0079390495,0.007930221,0.0078037447,0.0075911875,0.0074036364,0.0073278179,0.0073532718,0.0073920712,0.0073625607,0.0072560545,0.0071325173,0.0070608419,0.0070612827,0.007097861,0.0071186957,0.007090828,0.0070217731,0.0069473289,0.0069033166,0.0069011431,0.0069209816,0.0069259267,0.0068885419,0.0068118157,0.0067276889,0.0066679693,0.0066465041,0.0066382358,0.0066041508,0.0065250006,0.0064179819,0.0063214462,0.0062615642,0.0062308606,0.0061969406,0.006132078,0.0060365996,0.0059340188,0.0058537861,0.0058043487,0.0057690398,0.0057236767,0.0056568054,0.005577196,0.0055046989,0.0054539104,0.0054238746,0.0054004846,0.0053681665,0.005320161,0.0052634822,0.0052143847,0.0051823007,0.0051645647,0.0051486199,0.0051219465,0.0050818533,0.0050372181,0.0050007295,0.0049781041,0.0049633427,0.0049436947,0.004908155,0.0048616434,0.0048145682,0.0047763632,0.0047477915,0.0047209964,0.0046866409,0.0046416561,0.0045912245,0.0045439614,0.0045048442,0.0044717368,0.0044358205,0.0043930075,0.0043439162,0.0042937016,0.0042484124,0.004210411,0.0041769556,0.0041427687,0.0041043701,0.0040627481,0.0040223916,0.0039875873,0.0039578977,0.003929837,0.0039002385,0.0038670678,0.0038322254,0.0037997693,0.00377245,0.0037494753,0.0037272795,0.0037024982,0.0036745838,0.0036459489,0.0036193583,0.0035944605,0.0035714732,0.0035474359,0.003520471,0.0034911569,0.0034618464,0.0034346511,0.0034097926,0.0033855747,0.00335986,0.0033317815,0.0033023326,0.0032718062,0.00324294,0.0032158173,0.0031889381,0.0031608506,0.0031313605,0.0031016717,0.0030733997,0.0030473021,0.0030227557,0.0029983615,0.002973128,0.0029462889,0.002919156,0.0028937142,0.0028701733,0.0028477034,0.0028251794,0.0028021014,0.0027789381,0.0027566621,0.0027359099,0.0027164648,0.0026974501,0.0026776527,0.0026560304,0.0026343797,0.0026134526,0.0025935697,0.002574386,0.002555195,0.0025354974,0.0025153658,0.0024953354,0.0024759349,0.00245725,0.0024388655,0.0024188724,0.0023982665,0.0023774129,0.0023568347,0.0023369156,0.0023176256,0.0022985939,0.0022794462,0.0022601208,0.0022409096,0.0022222092,0.002204198,0.0021858961,0.0021672737,0.0021486212,0.0021300073,0.0021117277,0.0020940698,0.0020770931,0.0020606023,0.0020443184,0.0020280985,0.0020120281,0.0019963193,0.0019807444,0.0019647955,0.001949109,0.0019334916,0.0019178972,0.0019024532,0.0018873432,0.001872651,0.0018582924,0.0018440822,0.0018298757,0.0018156674,0.001801568,0.0017866187,0.0017719382,0.0017574482,0.0017430253,0.0017286131,0.0017142714,0.0017001282,0.0016862787,0.0016727157,0.0016593436,0.0016460599,0.0016328323,0.0016190384,0.0016051572,0.0015915582,0.0015782238,0.0015650835,0.0015520839,0.001539237,0.0015266113,0.0015142751,0.0015022404,0.0014904519,0.001478827,0.0014669708,0.0014546934,0.001442606,0.0014307611,0.0014191587,0.0014077535,0.0013964941,0.0013853636,0.0013743868,0.0013636026,0.0013530239,0.0013426195,0.0013322673,0.0013212446,0.0013102966,0.001299465,0.0012887914,0.0012782904,0.0012679434,0.0012577186,0.0012475985,0.0012375924,0.0012277253,0.001218013,0.0012084437,0.0011984275,0.0011883336,0.0011783352,0.001168458,0.0011587339,0.0011491816,0.0011397976,0.0011305633,0.0011214616,0.0011124898,0.0011036569,0.0010949706,0.0010861209,0.0010770432,0.0010680818,0.0010592347,0.001050512,0.0010419306,0.001033503,0.0010252276,0.0010170903,0.0010090737,0.0010011662,0.00099336485,0.00098557706,0.00097739055,0.00096930751,0.00096132453,0.00095343812,0.00094565145,0.00093797402,0.00093041485,0.00092297571,0.0009156489,0.00090842154,0.00090128226,0.00089422403,0.00088679187,0.00087936539,0.00087203548,0.00086480343,0.00085766803,0.00085063077,0.00084369723,0.00083687394,0.00083016329,0.00082356075,0.0008170563,0.00081063835,0.00080403653,0.00079729053,0.0007906354,0.00078407849,0.00077762143,0.00077126279,0.00076500131,0.00075883801,0.00075277472,0.00074681114,0.00074094239,0.0007351585,0.00072934599,0.0007232621,0.00071725033,0.00071131869,0.00070547254,0.00069971348,0.00069404025,0.00068845089,0.00068294424,0.00067751995,0.00067217636,0.00066690878,0.0006617086,0.00065620088,0.00065072263,0.00064531047,0.00063997061,0.00063470759,0.00062952363,0.00062441851,0.00061939069,0.00061443856,0.00060956033,0.00060475351,0.00060001303,0.00059511095,0.00059012852,0.00058520798,0.00058035363,0.00057556953,0.0005708587,0.00056622256,0.00056166062,0.00055717087,0.00055275053,0.00054839612,0.00054410332,0.00053976631,0.00053525703,0.0005308034,0.00052640863,0.00052207524,0.00051780536,0.0005136007,0.00050946177,0.00050538767,0.00050137612,0.00049742361,0.00049352589,0.00048967765,0.00048558103,0.0004815322,0.00047753491,0.00047359169,0.00046970432,0.00046587421,0.00046210238,0.00045838901,0.00045473306,0.00045113219,0.00044758276,0.00044408008,0.00044043532,0.00043675132,0.00043311393,0.00042952619,0.00042599,0.00042250659,0.00041907663,0.00041570035,0.00041237729,0.00040910591,0.00040588341,0.00040270566,0.0003994752,0.00039613465,0.00039283534,0.00038958038,0.00038637185,0.00038321103,0.0003800984,0.00037703402,0.00037401739,0.00037104741,0.00036812198,0.00036523784,0.00036237389,0.00035934267,0.00035634694,0.00035338974,0.00035047326,0.00034759912,0.00034476812,0.00034198046,0.00033923583,0.00033653331,0.00033387142,0.00033124771,0.00032865869,0.00032594927,0.00032322581,0.00032053652,0.00031788369,0.00031526898,0.00031269342,0.00031015749,0.00030766112,0.0003052036,0.00030278368,0.00030039937,0.00029804785,0.0002956434,0.00029317123,0.00029072962,0.00028832068,0.00028594594,0.00028417878,0.00028054988,0.00028062122,0.0002747507,0.00027731048,0.00026973672,0.00027225191,0.00026872468,0.00025937121,0.00028841379,5.9165068e-05];if(samplerate===44100){if(speakerSpan===20){return kemar_2bt_fir_44100_diff_20;}else if(speakerSpan===40){return kemar_2bt_fir_44100_diff_40;}else if(speakerSpan===60){return kemar_2bt_fir_44100_diff_60;}else {throw new Error("Invalid speakerSpan "+speakerSpan);}}else if(samplerate===48000){if(speakerSpan===20){return kemar_2bt_fir_48000_diff_20;}else if(speakerSpan===40){return kemar_2bt_fir_48000_diff_40;}else if(speakerSpan===60){return kemar_2bt_fir_48000_diff_60;}else {throw new Error("Invalid speakerSpan "+speakerSpan);}}else { ///@n we dont implement resampling here...
throw new Error("Invalid samplerate "+samplerate);}}function getKemar2btFilters(audioContext,speakerSpan){ /// 1st channel contains the sum filter;
/// 2nd channel contains the diff filter
var numChannels=2;var samplerate=audioContext.sampleRate;var filterLength=0;if(samplerate===44100){filterLength=512;}else if(samplerate===48000){filterLength=558;}else { ///@n we dont implement resampling here...
throw new Error("Invalid samplerate "+samplerate);} ///@n actually we could use shorter filters
var buffer=audioContext.createBuffer(2,filterLength,samplerate); /// now fill the buffer
var sumFilter=getKemar2btSumFilter(samplerate,speakerSpan);var diffFilter=getKemar2btDiffFilter(samplerate,speakerSpan);var sumBuffer_=buffer.getChannelData(0);var diffBuffer_=buffer.getChannelData(1);for(var i=0;i<filterLength;i++){sumBuffer_[i]=sumFilter[i];diffBuffer_[i]=diffFilter[i];}return buffer;}
},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       lrms.js
 *   @brief      LR to MS or MS to LR
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var LRMSNode = function (_AbstractNode) {
    _inherits(LRMSNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief LR to MS or MS to LR
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function LRMSNode(audioContext) {
        _classCallCheck(this, LRMSNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LRMSNode).call(this, audioContext));

        _this._gainNode = undefined;
        _this._sumdiff = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// out[0] = ( in[0] + in[1] ) / 2
        /// out[1] = ( in[0] - in[1] ) / 2

        /// M = ( L + R ) / 2
        /// S = ( L - R ) / 2
        ///
        /// L = ( M + S ) / 2
        /// R = ( M - S ) / 2

        _this._gainNode = _this._audioContext.createGain();
        //this._gainNode.gain.value = 0.5;
        _this._gainNode.gain.value = 0.707;

        _this._sumdiff = new _sumdiff2.default(audioContext);

        _this._input.connect(_this._sumdiff._input);

        _this._sumdiff.connect(_this._gainNode);

        _this._gainNode.connect(_this._output);
        return _this;
    }

    return LRMSNode;
}(_index2.default);

exports.default = LRMSNode;
},{"../core/index.js":2,"./sumdiff.js":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       multichannelgain.js
 *   @brief      This class implements a multichannel GainNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelGainNode = function (_AbstractNode) {
    _inherits(MultichannelGainNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a multichannel GainNode
     *        Each channel can have independent gain level
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {int} numChannels - number of channels to instanciate
     *
     *
     */

    function MultichannelGainNode(audioContext) {
        var numChannels = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, MultichannelGainNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelGainNode).call(this, audioContext));

        _this._gainNodes = [];
        _this._splitterNode = undefined;
        _this._mergerNode = undefined;
        _this._isBypass = false;

        /// sanity checks
        if (numChannels <= 0) {
            throw new Error("Pas bon");
        }

        _this._splitterNode = audioContext.createChannelSplitter(numChannels);

        _this._mergerNode = audioContext.createChannelMerger(numChannels);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != numChannels) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != numChannels || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        /// create N gainNodes
        for (var i = 0; i < numChannels; i++) {
            var newGainNode = audioContext.createGain();
            _this._gainNodes.push(newGainNode);
        }

        /// create the audio graph
        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(MultichannelGainNode, [{
        key: 'getNumChannels',


        //==============================================================================
        /**
            * Returns the current number of channels
            */
        value: function getNumChannels() {
            return this._gainNodes.length;
        }

        //==============================================================================
        /**
         * Sets the same gain to all channels
         * @param {float} value: linear gain
         */

    }, {
        key: 'setAllGains',
        value: function setAllGains(value) {

            for (var k = 0; k < this.getNumChannels(); k++) {
                this.setGain(k, value);
            }
        }

        //==============================================================================
        /**
         * Sets the gain of the i-th channel
         * @param {int} channelIndex
         * @param {float} value: linear gain
         */

    }, {
        key: 'setGain',
        value: function setGain(channelIndex, value) {

            /// boundary check
            if (channelIndex < 0 || channelIndex >= this.getNumChannels()) {
                throw new Error("Invalid channelIndex");
            }

            this._gainNodes[channelIndex].gain.value = value;
        }

        /**
         * Returns the gain of the i-th channel
         * @param {int} channelIndex
         */

    }, {
        key: 'getGain',
        value: function getGain(channelIndex) {

            /// boundary check
            if (channelIndex < 0 || channelIndex >= this.getNumChannels()) {
                throw new Error("Invalid channelIndex");
            }

            return this._gainNodes[channelIndex].gain.value;
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            var numChannels = this.getNumChannels();

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._mergerNode.disconnect();
            for (var i = 0; i < numChannels; i++) {
                this._gainNodes[i].disconnect();
            }

            if (this.bypass === true || numChannels === 0) {

                this._input.connect(this._output);
            } else {

                /// split the input streams into N independent channels
                this._input.connect(this._splitterNode);

                /// connect a gainNode to each channel
                for (var _i = 0; _i < numChannels; _i++) {
                    this._splitterNode.connect(this._gainNodes[_i], _i);
                }

                /// then merge the output of the N gainNodes
                for (var _i2 = 0; _i2 < numChannels; _i2++) {
                    this._gainNodes[_i2].connect(this._mergerNode, 0, _i2);
                }

                this._mergerNode.connect(this._output);
            }
        }
    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }]);

    return MultichannelGainNode;
}(_index2.default);

exports.default = MultichannelGainNode;
},{"../core/index.js":2,"../core/utils.js":3}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; }; /************************************************************************************/
/*!
 *   @file       phone.js
 *   @brief      This class implements the voice enhancement node
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhoneNode = function (_CascadeNode) {
    _inherits(PhoneNode, _CascadeNode);

    //==============================================================================
    /**
     * @brief This class implements the phone effect, for boosting the frequencies of the voice.
     *        It applies filtering on any number of channels
     *        The filtering is based on parametric filters (BiquadFilterNode).
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function PhoneNode(audioContext) {
        _classCallCheck(this, PhoneNode);

        // default values

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PhoneNode).call(this, audioContext));

        _this._gain = 0; // in dB
        _this._frequency = 1200; // in hertz (in-between 300 and 4800)
        _this._q = 1;

        _set(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', 1, _this); // add more for steeper boost
        _get(Object.getPrototypeOf(PhoneNode.prototype), 'setType', _this).call(_this, 0, 'peaking');
        _this._updateCascades();
        return _this;
    }

    //==============================================================================
    /**
     * Set the boost gain. It has a default value of 0 and can take a value in a nominal range of -40 to 40
     * @type {number} gainRequest : the gain in dB (0 for no gain)
     */


    _createClass(PhoneNode, [{
        key: '_updateCascades',


        //==============================================================================
        value: function _updateCascades() {
            var gain = this._gain / _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this);
            for (var c = 0; c < _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this); ++c) {
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setGain', this).call(this, c, gain);
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setFrequency', this).call(this, c, this._frequency);
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setQ', this).call(this, c, this._q);
            }
        }
    }, {
        key: 'gain',
        set: function set(gainRequest) {
            this._gain = gainRequest;
            this._updateCascades();
        }

        /**
         * Get the boost gain.
         * @type {number} boost
         */
        ,
        get: function get() {
            return this._gain;
        }

        //==============================================================================
        /**
         * Set the central frequency.
         * @type {number} frequencyRequest : the central frequency in hertz
         */

    }, {
        key: 'frequency',
        set: function set(frequencyRequest) {
            this._frequency = frequencyRequest;
            this._updateCascades();
        }

        /**
         * Get the central frequency.
         * @type {number} frequency
         */
        ,
        get: function get() {
            return this._frequency;
        }

        //==============================================================================
        /**
         * Set the Q factor.
         * @type {number} qRequest : dimensionless in [0.0001, 1000.], 1 is default.
         */

    }, {
        key: 'q',
        set: function set(qRequest) {
            this._q = qRequest;
            this._updateCascades();
        }

        /**
         * Get the Q factor.
         * @type {number} q
         */
        ,
        get: function get() {
            return this._q;
        }

        //==============================================================================
        /**
         * Set the number of cascading filters.
         * @type {number} numCascadesRequest : 1 is the default.
         */

    }, {
        key: 'numCascades',
        set: function set(numCascadesRequest) {
            _set(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', numCascadesRequest, this);
            for (var c = 0; c < _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this); ++c) {
                _get(Object.getPrototypeOf(PhoneNode.prototype), 'setType', this).call(this, c, 'peaking');
            }
            this._updateCascades();
        }

        /**
         * Get the number of cascading filters.
         * @type {number} numCascades
         */
        ,
        get: function get() {
            return _get(Object.getPrototypeOf(PhoneNode.prototype), 'numCascades', this);
        }
    }]);

    return PhoneNode;
}(_cascade2.default);

exports.default = PhoneNode;
},{"../core/index.js":2,"../dsp/cascade.js":6}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       sumdiff.js
 *   @brief      Helper class for Transaural (shuffler)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var SumDiffNode = function (_AbstractNode) {
    _inherits(SumDiffNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief Helper class for Transaural (shuffler)
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function SumDiffNode(audioContext) {
        _classCallCheck(this, SumDiffNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SumDiffNode).call(this, audioContext));

        _this._channelSplitterNode = undefined;

        /// The class has 2 input signals and 2 output signals
        /// It performs the following processing :
        /// out[0] = in[0] + in[1]
        /// out[1] = in[0] - in[1]

        _this._channelSplitterNode = _this._audioContext.createChannelSplitter(2);
        _this._channelMergerNode = _this._audioContext.createChannelMerger(2);

        _this._input.connect(_this._channelSplitterNode);

        /// a gain node used for -1 multiplication
        _this._gainNode = _this._audioContext.createGain();
        _this._gainNode.gain.value = -1.0;

        _this._channelSplitterNode.connect(_this._gainNode, 1, 0);

        /// out[0] = in[0] + in[1]
        _this._channelSplitterNode.connect(_this._channelMergerNode, 0, 0);
        _this._channelSplitterNode.connect(_this._channelMergerNode, 1, 0);

        /// out[1] = in[0] - in[1]
        _this._channelSplitterNode.connect(_this._channelMergerNode, 0, 1);
        _this._gainNode.connect(_this._channelMergerNode, 0, 1);

        _this._channelMergerNode.connect(_this._output);
        return _this;
    }

    return SumDiffNode;
}(_index2.default);

exports.default = SumDiffNode;
},{"../core/index.js":2}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransauralFeedforwardNode = exports.TransauralShufflerNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _sumdiff = require('./sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _kemar = require('./kemar.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       transaural.js
 *   @brief      This class implements the transaural decoder node(s)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var TransauralNode = function (_AbstractNode) {
    _inherits(TransauralNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder (abstract)
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralNode(audioContext) {
        _classCallCheck(this, TransauralNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralNode).call(this, audioContext));

        _this._isBypass = false;
        _this._speakersSpan = 60;
        /// span between speaker angles
        /// e.g. 60 corresponds to speakers at azimuth +/-30 deg

        return _this;
    }

    //==============================================================================
    /**
     * Returns the span between speaker (angles in degress)
     * @type {number}
     */


    _createClass(TransauralNode, [{
        key: '_updateAudioGraph',


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */
        value: function _updateAudioGraph() {

            if (this.bypass === true) {
                this._input.disconnect();
                this._input.connect(this._output);
            } else {
                //this._updateTransauralAudioGraph();

            }
        }
    }, {
        key: 'speakersSpan',
        get: function get() {
            return this._speakersSpan;
        }

        //==============================================================================
        /**
         * Sets the span between speaker (angles in degress)
         * @type {number}
         */
        ,
        set: function set(spanInDegress) {

            if (0 < spanInDegress && spanInDegress <= 60) {
                this._speakersSpan = spanInDegress;

                this._updateAudioGraph();
            } else {
                throw new Error("Invalid speakerSpan " + spanInDegress);
            }
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }]);

    return TransauralNode;
}(_index2.default);

exports.default = TransauralNode;

var TransauralShufflerNode = exports.TransauralShufflerNode = function (_TransauralNode) {
    _inherits(TransauralShufflerNode, _TransauralNode);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with feedforward topology
     *        Restricted to symmetrical speakers setup
     *
     *
     * @param {AudioContext} audioContext - audioContext instance.
     *
     * @n TC : this class is OK (01/02/2016)
     */

    function TransauralShufflerNode(audioContext) {
        _classCallCheck(this, TransauralShufflerNode);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralShufflerNode).call(this, audioContext));

        _this2._sumDiffNode1 = undefined;
        _this2._convolverNode = undefined;
        _this2._sumDiffNode2 = undefined;

        /// create the nodes
        {
            _this2._sumDiffNode1 = new _sumdiff2.default(audioContext);
            _this2._sumDiffNode2 = new _sumdiff2.default(audioContext);

            _this2._convolverNode = audioContext.createConvolver();
            _this2._convolverNode.normalize = false;
        }

        /// shuffling input
        _this2._input.disconnect();
        _this2._input.connect(_this2._sumDiffNode1._input);

        /// filtering
        _this2._sumDiffNode1.connect(_this2._convolverNode);

        /// shuffling output
        _this2._convolverNode.connect(_this2._sumDiffNode2._input);

        /// connect to the output
        _this2._sumDiffNode2.connect(_this2._output);

        _this2.speakersSpan = 60;
        return _this2;
    }

    //==============================================================================
    /**
     * Updates the connections of the audio graph
     */


    _createClass(TransauralShufflerNode, [{
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            if (this.bypass === true) {
                this._input.disconnect();
                this._input.connect(this._output);
            } else {
                this._updateTransauralAudioGraph();
            }
        }
    }, {
        key: '_updateTransauralAudioGraph',
        value: function _updateTransauralAudioGraph() {

            this._input.disconnect();

            this._input.connect(this._sumDiffNode1._input);

            /// (the rest of the graph is already connected in the constructor)

            /// updates the convolution kernels
            this._updateFilters();
        }
    }, {
        key: '_updateFilters',
        value: function _updateFilters() {

            var span = this.speakersSpan;

            var firBuffer = undefined;

            if (span <= 20) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 20);
            } else if (span <= 40) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 40);
            } else if (span <= 60) {
                firBuffer = (0, _kemar.getKemar2btFilters)(this._audioContext, 60);
            } else {
                throw new Error("Invalid speakerSpan " + speakerSpan);
            }

            this._convolverNode.buffer = firBuffer;
        }
    }]);

    return TransauralShufflerNode;
}(TransauralNode);

var TransauralFeedforwardNode = exports.TransauralFeedforwardNode = function (_TransauralNode2) {
    _inherits(TransauralFeedforwardNode, _TransauralNode2);

    //==============================================================================
    /**
     * @brief This class implements a transaural decoder with shuffler topology
     *        Restricted to symmetrical speakers setup
     *
     * @param {AudioContext} audioContext - audioContext instance.
     */

    function TransauralFeedforwardNode(audioContext) {
        _classCallCheck(this, TransauralFeedforwardNode);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TransauralFeedforwardNode).call(this, audioContext));

        ///@todo : not yet implemented 
    }

    return TransauralFeedforwardNode;
}(TransauralNode);
},{"../core/index.js":2,"./kemar.js":11,"./sumdiff.js":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       virtualspeakers.js
 *   @brief      This class implements the 5.1 to binaural virtual speakers
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var VirtualSpeakersNode = function (_AbstractNode) {
    _inherits(VirtualSpeakersNode, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class implements the 5.1 to binaural virtual speakers
     *
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */

    function VirtualSpeakersNode(audioContext, audioStreamDescriptionCollection) {
        _classCallCheck(this, VirtualSpeakersNode);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VirtualSpeakersNode).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = undefined;
        _this._gainNodes = [];

        /// retrieves the positions of all streams
        var horizontalPositions = _this._getHorizontalPlane();

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// retrieves the positions of all streams
        var sofaPositions = _this._getSofaPositions();

        /// at the moment, we load the whole HRTF file
        _this._binauralPanner = new _binaural2.default.audio.BinauralPanner({
            audioContext: audioContext,
            coordinateSystem: 'sofaSpherical',
            //filterPositions: horizontalPositions,
            //filterPositionsType : 'sofaSpherical',
            crossfadeDuration: 0.01,
            sourceCount: totalNumberOfChannels_,
            sourcePositions: sofaPositions
        });

        /// connect the outputs
        _this._binauralPanner.connectOutputs(_this._output);

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        /// create one gain Node for each virtual speaker
        /// i.e. each virtual speaker has an independent gain setting
        for (var i = 0; i < totalNumberOfChannels_; i++) {
            var newGainNode = audioContext.createGain();
            _this._gainNodes.push(newGainNode);

            /// also initialize the gain to 1.0
            _this._gainNodes[i].gain.value = 1.0;
        }

        /// connect the output of the splitter to the respective gain nodes
        for (var _i = 0; _i < totalNumberOfChannels_; _i++) {
            _this._splitterNode.connect(_this._gainNodes[_i], _i);
        }

        /// connect the output of the gain nodes to the respective binaural source
        for (var _i2 = 0; _i2 < totalNumberOfChannels_; _i2++) {
            _this._binauralPanner.connectInputByIndex(_i2, _this._gainNodes[_i2], 0, 0);
        }

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        _this._input.connect(_this._splitterNode);

        /// an HRTF set is loaded upon initialization of the application...

        _this._listenerYaw = 0.0;
        return _this;
    }

    //==============================================================================


    _createClass(VirtualSpeakersNode, [{
        key: 'getNumChannels',
        value: function getNumChannels() {
            return this._gainNodes.length;
        }

        //==============================================================================

    }, {
        key: 'setGainForVirtualSource',
        value: function setGainForVirtualSource(sourceIndex, linearGain) {

            var numChannels = this.getNumChannels();

            if (sourceIndex < 0 || sourceIndex >= numChannels) {
                throw new Error("Invalid source index : " + sourceIndex);
            }

            this._gainNodes[sourceIndex].gain.value = linearGain;
        }

        //==============================================================================
        /**
         * Set listenerYaw
         * @type {number} yaw angle in degrees
         */

    }, {
        key: 'getFallbackUrl',


        //==============================================================================
        /**
         * Returns a fallabck url in case bili2 is not accessible
         * @type {string} url
         */
        value: function getFallbackUrl() {
            var sampleRate = this._audioContext.sampleRate;

            var sofaUrl = './hrtf/IRC_1147_C_HRIR_M_' + sampleRate + '.sofa.json';

            return sofaUrl;
        }

        //==============================================================================
        /**
         * Load a new HRTF from a given URL
         * @type {string} url
         */

    }, {
        key: 'loadHrtfSet',
        value: function loadHrtfSet(url) {
            var _this2 = this;

            return this._binauralPanner.loadHrtfSet(url).then(function () {
                if (typeof _this2._binauralPanner.filterPositions !== 'undefined') {
                    console.log('loaded hrtf from ' + url + ' with ' + _this2._binauralPanner.filterPositions.length + ' positions');
                } else {
                    console.log('loaded hrtf from ' + url);
                }

                /// update the listener yaw
                _this2.listenerYaw = _this2._listenerYaw;
            }).catch(function () {
                console.log('could not access bili2.ircam.fr...');
                /// using default data instead                   

                var sampleRate = _this2._audioContext.sampleRate;

                var sofaUrl = _this2.getFallbackUrl();
                console.log('using ' + sofaUrl + ' instead');

                return _this2._binauralPanner.loadHrtfSet(sofaUrl).then(function () {
                    if (typeof _this2._binauralPanner.filterPositions !== 'undefined') {
                        console.log('loaded hrtf from ' + sofaUrl + ' with ' + _this2._binauralPanner.filterPositions.length + ' positions');
                    } else {
                        console.log('loaded hrtf from ' + sofaUrl);
                    }

                    _this2.listenerYaw = _this2._listenerYaw;
                });
            });
        }

        //==============================================================================
        /// Returns an array of positions in the horizontal plane only.

    }, {
        key: '_getHorizontalPlane',
        value: function _getHorizontalPlane() {

            var sofaPositions = [];

            for (var i = -180; i <= 180; i += 1) {

                /// positions expressed with Spat4 navigation coordinate
                var azimuth = i;

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * azimuth;
                var sofaElev = 0.;
                var sofaDist = 1.;

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                sofaPositions.push(sofaPos);
            }

            return sofaPositions;
        }

        //==============================================================================
        /// returns all the source positions, with the SOFA spherical coordinate

    }, {
        key: '_getSofaPositions',
        value: function _getSofaPositions() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var channelIndex = 0;

            var sofaPositions = [];

            /// go through all the streams and mute/unmute according to their 'active' flag
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    /// positions expressed with Spat4 navigation coordinate
                    var azimuths = stream.channelPositions;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {

                        /// positions expressed with Spat4 navigation coordinate
                        var azimuth = azimuths[i];

                        /// convert to SOFA spherical coordinate
                        var sofaAzim = -1. * azimuth;
                        var sofaElev = 0.;
                        var sofaDist = 1.;

                        var sofaPos = [sofaAzim, sofaElev, sofaDist];

                        sofaPositions.push(sofaPos);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return sofaPositions;
        }
    }, {
        key: 'listenerYaw',
        set: function set(value) {
            this._listenerYaw = value;

            /// the view vector must be expressed in sofaSpherical
            var viewPos = [-1. * this._listenerYaw, 0., 1.];

            /*
            /// making the listener yaw rotation 'a la mano'
            {
                const sofaPositions = this._getSofaPositions();
                var relativePositions = [];
                 for( let i = 0; i < sofaPositions.length; i++ )
                {
                    /// relative position in sofa spherical coordinates
                    const az = sofaPositions[i][0] + this._listenerYaw;
                    const el = sofaPositions[i][1];
                    const di = sofaPositions[i][2];
                     const pos = [az, el, di];
                     relativePositions.push( pos );
                }
                 this._binauralPanner.sourcePositions = relativePositions;
                this._binauralPanner.update();
            }
            */

            {
                this._binauralPanner.listenerView = viewPos;
                this._binauralPanner.update();
            }
        }

        /**
         * Get listenerYaw
         * @type {number} yaw angle in degrees
         */
        ,
        get: function get() {
            return this._listenerYaw;
        }
    }]);

    return VirtualSpeakersNode;
}(_index2.default);

exports.default = VirtualSpeakersNode;
},{"../core/index.js":2,"binaural":48}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.binaural = exports.unittests = exports.utilities = exports.AudioStreamDescription = exports.AudioStreamDescriptionCollection = exports.SmartFader = exports.ObjectSpatialiserAndMixer = exports.NoiseAdaptation = exports.MultichannelSpatialiser = exports.DialogEnhancement = exports.ReceiverMix = exports.StreamSelector = exports.HeadphonesEqualization = exports.CenterEnhancementNode = exports.LRMSNode = exports.SumDiffNode = exports.CascadeNode = undefined;

var _index = require('./dialog-enhancement/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./multichannel-spatialiser/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./noise-adaptation/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./object-spatialiser-and-mixer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./smart-fader/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./core/index.js');

var _index12 = require('./stream-selector/index.js');

var _index13 = _interopRequireDefault(_index12);

var _index14 = require('./receiver-mix/index.js');

var _index15 = _interopRequireDefault(_index14);

var _index16 = require('./dsp/index.js');

var _utils = require('./core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _index17 = require('./testing/index.js');

var _index18 = _interopRequireDefault(_index17);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CascadeNode = _index16.CascadeNode;
exports.SumDiffNode = _index16.SumDiffNode;
exports.LRMSNode = _index16.LRMSNode;
exports.CenterEnhancementNode = _index16.CenterEnhancementNode;
exports.HeadphonesEqualization = _index16.HeadphonesEqualization;
exports.StreamSelector = _index13.default;
exports.ReceiverMix = _index15.default;
exports.DialogEnhancement = _index2.default;
exports.MultichannelSpatialiser = _index4.default;
exports.NoiseAdaptation = _index6.default;
exports.ObjectSpatialiserAndMixer = _index8.default;
exports.SmartFader = _index10.default;
exports.AudioStreamDescriptionCollection = _index11.AudioStreamDescriptionCollection;
exports.AudioStreamDescription = _index11.AudioStreamDescription;
exports.utilities = _utils2.default;
exports.unittests = _index18.default;
exports.binaural = _binaural2.default;
},{"./core/index.js":2,"./core/utils.js":3,"./dialog-enhancement/index.js":4,"./dsp/index.js":10,"./multichannel-spatialiser/index.js":19,"./noise-adaptation/index.js":21,"./object-spatialiser-and-mixer/index.js":22,"./receiver-mix/index.js":23,"./smart-fader/index.js":24,"./stream-selector/index.js":25,"./testing/index.js":26,"binaural":48}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _headphoneequalization = require('../dsp/headphoneequalization.js');

var _headphoneequalization2 = _interopRequireDefault(_headphoneequalization);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _transaural = require('../dsp/transaural.js');

var _routing = require('../multichannel-spatialiser/routing.js');

var _routing2 = _interopRequireDefault(_routing);

var _virtualspeakers = require('../dsp/virtualspeakers.js');

var _virtualspeakers2 = _interopRequireDefault(_virtualspeakers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the MultichannelSpatialiser of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

var MultichannelSpatialiser = function (_AbstractNode) {
    _inherits(MultichannelSpatialiser, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'     
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listenerYaw - yaw angle in degrees
     */

    function MultichannelSpatialiser(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'binaural' : arguments[2];
        var headphoneEqPresetName = arguments.length <= 3 || arguments[3] === undefined ? 'none' : arguments[3];
        var offsetGain = arguments.length <= 4 || arguments[4] === undefined ? 0.0 : arguments[4];
        var listenerYaw = arguments.length <= 5 || arguments[5] === undefined ? 0.0 : arguments[5];

        _classCallCheck(this, MultichannelSpatialiser);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultichannelSpatialiser).call(this, audioContext, audioStreamDescriptionCollection));

        _this._headphonesEqualizationNode = new _headphoneequalization2.default(audioContext);
        _this._transauralNode = new _transaural.TransauralShufflerNode(audioContext);
        _this._discreteRouting = new _routing2.default(audioContext, audioStreamDescriptionCollection);
        _this._virtualSpeakers = new _virtualspeakers2.default(audioContext, audioStreamDescriptionCollection);

        /// creates a gain Node. This node is used to process the so-called 'offset gain'
        _this._gainNode = audioContext.createGain();

        /// set the offset gain
        _this.offsetGain = offsetGain;

        /// loads the proper headphone equalization preset
        _this.eqPreset = headphoneEqPresetName;

        /// set the output type (this will create the audio graph)
        _this.outputType = outputType;

        /// sets the listener yaw
        _this.listenerYaw = listenerYaw;
        return _this;
    }

    //==============================================================================
    /**
     * Load a new HRTF from a given URL
     * @type {string} url
     */


    _createClass(MultichannelSpatialiser, [{
        key: 'loadHrtfSet',
        value: function loadHrtfSet(url) {
            return this._virtualSpeakers.loadHrtfSet(url);
        }

        //==============================================================================
        /**
         * Set outputType: 'binaural' or 'transaural' or 'multichannel'
         * @type {string}
         */

    }, {
        key: 'activeStreamsChanged',


        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {}
        /// nothing to do, for the moment


        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            this._updateGainOffset();

            this._disconnectEverything();

            if (this.isInBinauralMode() === true) {

                /// binaural + headphone EQ + gain offset
                this._input.connect(this._virtualSpeakers._input);
                this._virtualSpeakers.connect(this._headphonesEqualizationNode._input);
                this._headphonesEqualizationNode.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else if (this.isInTransauralMode() === true) {

                /// binaural + transaural + gain offset
                this._input.connect(this._virtualSpeakers._input);
                this._virtualSpeakers.connect(this._transauralNode._input);
                this._transauralNode.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else if (this.isInMultichannelMode() === true) {

                /// discrete routing in the multichannel mode
                this._input.connect(this._discreteRouting._input);
                this._discreteRouting.connect(this._gainNode);
                this._gainNode.connect(this._output);
            } else {
                throw new Error("Pas normal!");
            }
        }

        //==============================================================================
        /**
         * Disconnect the whole audio graph
         */

    }, {
        key: '_disconnectEverything',
        value: function _disconnectEverything() {

            this._input.disconnect();
            this._virtualSpeakers.disconnect();
            this._headphonesEqualizationNode.disconnect();
            this._discreteRouting.disconnect();
            this._transauralNode.disconnect();
            this._gainNode.disconnect();
        }

        //==============================================================================
        /**
         * Updates the gainNode which actually process the so-called 'offset gain'
         */

    }, {
        key: '_updateGainOffset',
        value: function _updateGainOffset() {

            /// the so-called 'offset gain' is only applied for transaural or binaural
            if (this.isInBinauralMode() === true || this.isInTransauralMode() === true) {
                var gainIndB = this.offsetGain;
                var gainLinear = _utils2.default.dB2lin(gainIndB);

                this._gainNode.gain.value = gainLinear;
            } else {
                /// this is the multichannel mode; no gain offset applied
                this._gainNode.gain.value = 1.0;
            }
        }

        //==============================================================================
        /**
         * Returns true if we are currently in binaural mode
         */

    }, {
        key: 'isInBinauralMode',
        value: function isInBinauralMode() {
            return this.outputType === 'binaural' ? true : false;
        }

        /**
         * Returns true if we are currently in transaural mode
         */

    }, {
        key: 'isInTransauralMode',
        value: function isInTransauralMode() {
            return this.outputType === 'transaural' ? true : false;
        }

        /**
         * Returns true if we are currently in multichannel mode
         */

    }, {
        key: 'isInMultichannelMode',
        value: function isInMultichannelMode() {
            return this.outputType === 'multichannel' ? true : false;
        }

        //==============================================================================
        /**
         * Loads a new headphones equalization preset
         * @type {string} presetName : the name of the preset (they are hard-coded) 
         */

    }, {
        key: 'bypassHeadphoneEqualization',


        /**
         * Enable or bypass the headphone equalization
         * @type {boolean}
         */
        value: function bypassHeadphoneEqualization(value) {
            this._headphonesEqualizationNode.bypass = value;
        }

        //==============================================================================
        /**
         * Set the offset gain (expressed in dB)
         * (un gain d’offset afin de maintenir un niveau subjectif apres l’enclenchement du process de spatialisation)
         * @type {number} value
         */

    }, {
        key: 'outputType',
        set: function set(value) {

            if (value === 'binaural' || value === 'transaural' || value === 'multichannel') {

                console.log("MultichannelSpatialiser switching to mode " + value);

                this._outputType = value;

                this._updateAudioGraph();
            } else {
                throw new Error("Invalid output type " + value);
            }
        }
        /**
         * Returns the current output type: 'binaural' or 'transaural' or 'multichannel'
         * @type {string}
         */
        ,
        get: function get() {
            return this._outputType;
        }
    }, {
        key: 'eqPreset',
        set: function set(presetName) {
            this._headphonesEqualizationNode.eqPreset = presetName;
        }

        /**
         * Returns the name of the current headphones equalization preset
         * @type {string}
         */
        ,
        get: function get() {
            return this._headphonesEqualizationNode.eqPreset;
        }
    }, {
        key: 'offsetGain',
        set: function set(value) {

            /// precaution : the value in clipped in the [-12 +12] dB range
            this._offsetGain = _utils2.default.clamp(value, -12, 12);

            /// update the DSP processor
            this._updateGainOffset();
        }

        /**
         * Returns the offset gain (expressed in dB)
         * @type {number}
         */
        ,
        get: function get() {
            return this._offsetGain;
        }

        //==============================================================================
        /**
         * Set listenerYaw
         * @type {number} yaw angle in degrees
         */

    }, {
        key: 'listenerYaw',
        set: function set(value) {
            this._virtualSpeakers.listenerYaw = value;
        }
        /**
         * Get listenerYaw
         * @type {number} yaw angle in degrees
         */
        ,
        get: function get() {
            return this._virtualSpeakers.listenerYaw;
        }
    }]);

    return MultichannelSpatialiser;
}(_index2.default);

exports.default = MultichannelSpatialiser;
},{"../core/index.js":2,"../core/utils.js":3,"../dsp/headphoneequalization.js":9,"../dsp/transaural.js":16,"../dsp/virtualspeakers.js":17,"../multichannel-spatialiser/routing.js":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../core/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var StreamRouting = function (_AbstractNode) {
    _inherits(StreamRouting, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class takes the 10 audio streams and produces a 5.1 output stream (discrete routing)
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     *
     * @details With the WebAudioAPI specifications, the 5.1 output stream is arranged as : 
     *
     *   0: L: left
     *   1: R: right
     *   2: C: center
     *   3: LFE: subwoofer
     *   4: SL: surround left
     *   5: SR: surround right
     *
     */

    function StreamRouting(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamRouting);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamRouting).call(this, audioContext, audioStreamDescriptionCollection));

        _this._splitterNode = undefined;
        _this._mergerNode = undefined;

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        var numOutputChannels = 6; /// 5.1

        _this._mergerNode = audioContext.createChannelMerger(numOutputChannels);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// split the input streams into 10 independent channels
        _this._input.connect(_this._splitterNode);

        /// index of the destination channels, according to the WAA specifications
        var outputIndexL = 0;
        var outputIndexR = 1;
        var outputIndexC = 2;
        var outputIndexLFE = 3;
        var outputIndexLS = 4;
        var outputIndexRS = 5;

        /// hard-coded version
        /*
        {
            //==============================================================================
            /// main video L
            this._splitterNode.connect( this._mergerNode, 0, outputIndexL );
             /// main video R
            this._splitterNode.connect( this._mergerNode, 1, outputIndexR );
             //==============================================================================
            /// extended ambience L
            this._splitterNode.connect( this._mergerNode, 2, outputIndexL );
             /// extended ambience R
            this._splitterNode.connect( this._mergerNode, 3, outputIndexR );
             /// extended ambience C
            this._splitterNode.connect( this._mergerNode, 4, outputIndexC );
             /// extended ambience LS
            this._splitterNode.connect( this._mergerNode, 5, outputIndexLS );
             /// extended ambience RS
            this._splitterNode.connect( this._mergerNode, 6, outputIndexRS );
             /// extended ambience LFE
            this._splitterNode.connect( this._mergerNode, 7, outputIndexLFE );
             //==============================================================================
            /// extended audio comments (mono)
            this._splitterNode.connect( this._mergerNode, 8, outputIndexC );
             //==============================================================================
            /// extended audio dialogs (mono)
            this._splitterNode.connect( this._mergerNode, 9, outputIndexC );
        }
        */

        /// flexible version
        {
            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = _this._audioStreamDescriptionCollection.streams;

            /// input channel index (in the splitter node)
            var channelIndex = 0;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    var numChannelsForThisStream = stream.numChannels;

                    for (var k = 0; k < numChannelsForThisStream; k++) {

                        /// destination index (in the merger node)
                        var destinationIndex = undefined;

                        if (stream.channelIsLeft(k) === true) {
                            destinationIndex = outputIndexL;
                        } else if (stream.channelIsRight(k) === true) {
                            destinationIndex = outputIndexR;
                        } else if (stream.channelIsCenter(k) === true) {
                            destinationIndex = outputIndexC;
                        } else if (stream.channelIsLfe(k) === true) {
                            destinationIndex = outputIndexLFE;
                        } else if (stream.channelIsLeftSurround(k) === true) {
                            destinationIndex = outputIndexLS;
                        } else if (stream.channelIsRightSurround(k) === true) {
                            destinationIndex = outputIndexRS;
                        } else {
                            throw new Error("Pas bon...");
                        }

                        _this._splitterNode.connect(_this._mergerNode, channelIndex, destinationIndex);

                        channelIndex++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /// connect the merger node to the output
        _this._mergerNode.connect(_this._output);
        return _this;
    }

    return StreamRouting;
}(_index2.default);

exports.default = StreamRouting;
},{"../core/index.js":2}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NoiseAdaptation = function (_AbstractNode) {
  _inherits(NoiseAdaptation, _AbstractNode);

  /**
   * @param {AudioContext} audioContext - audioContext instance.
   * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
   * @param {boolean} headphone - true is headphone, else, false.
   */

  function NoiseAdaptation(audioContext, audioStreamDescriptionCollection) {
    var headphone = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, NoiseAdaptation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NoiseAdaptation).call(this, audioContext, audioStreamDescriptionCollection));

    _this._headphone = headphone;
    return _this;
  }
  /**
   * Process:
   * @todo: track noise, add compression, improve voice if no headphone
   */


  _createClass(NoiseAdaptation, [{
    key: '_process',
    value: function _process() {}
    /**
     * Set headphone - true is headphone, else, false.
     * @type {boolean}
     */

  }, {
    key: 'headphone',
    set: function set(value) {
      this._headphone = value;
    }
    /**
     * Get headphone, return True if headphone is connected, else, false
     * @type {boolean}
     */
    ,
    get: function get() {
      return this._headphone;
    }
  }]);

  return NoiseAdaptation;
}(_index2.default);

exports.default = NoiseAdaptation;
},{"../core/index.js":2}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../multichannel-spatialiser/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       
 *   @brief      Implements the ObjectSpatialiserAndMixer of M4DP
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/


var ObjectSpatialiserAndMixer = function (_MultichannelSpatiali) {
    _inherits(ObjectSpatialiserAndMixer, _MultichannelSpatiali);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     * @param {string} outputType - output type 'binaural' or 'transaural' or 'multichannel'     
     * @param {string} headphoneEqPresetName - the name of the headphone equalization preset (they are hard-coded) 
     * @param {number} offsetGain - the offset gain (expressed in dB)
     * @param {number} listenerYaw - yaw angle in degrees
     */

    function ObjectSpatialiserAndMixer(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var outputType = arguments.length <= 2 || arguments[2] === undefined ? 'binaural' : arguments[2];
        var headphoneEqPresetName = arguments.length <= 3 || arguments[3] === undefined ? 'none' : arguments[3];
        var offsetGain = arguments.length <= 4 || arguments[4] === undefined ? 0.0 : arguments[4];
        var listenerYaw = arguments.length <= 5 || arguments[5] === undefined ? 0.0 : arguments[5];

        _classCallCheck(this, ObjectSpatialiserAndMixer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectSpatialiserAndMixer).call(this, audioContext, audioStreamDescriptionCollection, outputType, headphoneEqPresetName, offsetGain, listenerYaw));

        _this._DialogDistance = 1;
        _this._CommentaryDistance = 1;
        return _this;
    }

    //==============================================================================
    /**
     * Set the position of the additionnal mono commentary     
     * @param {number} azimuth - azimuth @todo values to be defined
     * @param {number} elevation - elevation @todo values to be defined
     * @param {number} distance - distance @todo values to be defined
     *
     * @details The values are expressed with Spat4 navigational coordinates
     */


    _createClass(ObjectSpatialiserAndMixer, [{
        key: 'setCommentaryPosition',
        value: function setCommentaryPosition(azimuth, elevation, distance) {
            this._CommentaryAzimuth = azimuth;
            this._CommentaryElevation = elevation;
            this._CommentaryDistance = distance;

            this._updateCommentaryPosition();
        }
    }, {
        key: 'setCommentaryAzimuth',
        value: function setCommentaryAzimuth(azim) {
            this.setCommentaryPosition(azim, this._CommentaryElevation, this._CommentaryDistance);
        }
    }, {
        key: 'setCommentaryElevation',
        value: function setCommentaryElevation(elev) {
            this.setCommentaryPosition(this._CommentaryAzimuth, elev, this._CommentaryDistance);
        }
    }, {
        key: 'setCommentaryDistance',
        value: function setCommentaryDistance(dist) {
            this.setCommentaryPosition(this._CommentaryAzimuth, this._CommentaryElevation, dist);
        }
    }, {
        key: 'setCommentaryAzimuthFromGui',
        value: function setCommentaryAzimuthFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -180;
            var maxValue = 180;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryAzimuth(value);

            return Math.round(value);
        }
    }, {
        key: 'setCommentaryElevationFromGui',
        value: function setCommentaryElevationFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -40;
            var maxValue = 90;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryElevation(value);

            return Math.round(value);
        }
    }, {
        key: 'setCommentaryDistanceFromGui',
        value: function setCommentaryDistanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0.5;
            var maxValue = 10;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCommentaryDistance(value);

            return value;
        }

        /**
         * Returns the position of the additionnal mono commentary     
         * @return {array}
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'getCommentaryPosition',
        value: function getCommentaryPosition() {
            return [this._CommentaryAzimuth, this._CommentaryElevation, this._CommentaryDistance];
        }

        //==============================================================================

    }, {
        key: '_updateCommentaryPosition',
        value: function _updateCommentaryPosition() {

            var channelIndex = this._getChannelIndexForExtendedCommentary();

            if (channelIndex >= 0) {

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * this._CommentaryAzimuth;
                var sofaElev = this._CommentaryElevation;
                var sofaDist = 1.; /// fow now, the distance is not take into account

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                if (typeof this._virtualSpeakers._binauralPanner !== 'undefined') {
                    this._virtualSpeakers._binauralPanner.setSourcePositionByIndex(channelIndex, sofaPos);
                    this._virtualSpeakers._binauralPanner.update();

                    /// now, apply a simple gain to attenuate according to distance
                    var drop = ObjectSpatialiserAndMixer.distanceToDrop(this._CommentaryDistance);
                    var dropLin = _utils2.default.dB2lin(drop);

                    this._virtualSpeakers.setGainForVirtualSource(channelIndex, dropLin);
                }
            } else {
                /// there is no commentary stream
            }
        }

        //==============================================================================
        /**
         * The binaural processor handles up to 10 sources, considering all the streams.
         * This function returns the index of the source which corresponds to the commentary
         * (that needs to be spatialized)
         * Returns -1 if there is no commentary
         */

    }, {
        key: '_getChannelIndexForExtendedCommentary',
        value: function _getChannelIndexForExtendedCommentary() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection;

            return asdc.channelIndexForExtendedCommentary;
        }

        //==============================================================================
        /**
         * Set the position of the additionnal mono dialog     
         * @param {number} azimuth - azimuth @todo values to be defined
         * @param {number} elevation - elevation @todo values to be defined
         * @param {number} distance - distance @todo values to be defined
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'setDialogPosition',
        value: function setDialogPosition(azimuth, elevation, distance) {
            this._DialogAzimuth = azimuth;
            this._DialogElevation = elevation;
            this._DialogDistance = distance;

            this._updateDialogPosition();
        }
    }, {
        key: 'setDialogAzimuth',
        value: function setDialogAzimuth(azim) {
            this.setDialogPosition(azim, this._DialogElevation, this._DialogDistance);
        }
    }, {
        key: 'setDialogElevation',
        value: function setDialogElevation(elev) {
            this.setDialogPosition(this._DialogAzimuth, elev, this._DialogDistance);
        }
    }, {
        key: 'setDialogDistance',
        value: function setDialogDistance(dist) {
            this.setDialogPosition(this._DialogAzimuth, this._DialogElevation, dist);
        }
    }, {
        key: 'setDialogAzimuthFromGui',
        value: function setDialogAzimuthFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -180;
            var maxValue = 180;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setDialogAzimuth(value);

            return Math.round(value);
        }
    }, {
        key: 'setDialogElevationFromGui',
        value: function setDialogElevationFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = -40;
            var maxValue = 90;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setDialogElevation(value);

            return Math.round(value);
        }
    }, {
        key: 'setDialogDistanceFromGui',
        value: function setDialogDistanceFromGui(theSlider) {
            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 0.5;
            var maxValue = 10;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setDialogDistance(value);

            return value;
        }

        /**
         * Returns the position of the additionnal mono dialog     
         * @return {array}
         *
         * @details The values are expressed with Spat4 navigational coordinates
         */

    }, {
        key: 'getDialogPosition',
        value: function getDialogPosition() {
            return [this._DialogAzimuth, this._DialogElevation, this._DialogDistance];
        }

        //==============================================================================

    }, {
        key: '_updateDialogPosition',
        value: function _updateDialogPosition() {

            var channelIndex = this._getChannelIndexForExtendedDialog();

            if (channelIndex >= 0) {

                /// convert to SOFA spherical coordinate
                var sofaAzim = -1. * this._DialogAzimuth;
                var sofaElev = this._DialogElevation;
                var sofaDist = 1.; /// fow now, the distance is not take into account

                var sofaPos = [sofaAzim, sofaElev, sofaDist];

                if (typeof this._virtualSpeakers._binauralPanner !== 'undefined') {
                    this._virtualSpeakers._binauralPanner.setSourcePositionByIndex(channelIndex, sofaPos);
                    this._virtualSpeakers._binauralPanner.update();

                    /// now, apply a simple gain to attenuate according to distance
                    var drop = ObjectSpatialiserAndMixer.distanceToDrop(this._DialogDistance);
                    var dropLin = _utils2.default.dB2lin(drop);

                    this._virtualSpeakers.setGainForVirtualSource(channelIndex, dropLin);
                }
            } else {
                /// there is no dialog stream
            }
        }

        //==============================================================================
        /**
         * The binaural processor handles up to 10 sources, considering all the streams.
         * This function returns the index of the source which corresponds to the dialog
         * (that needs to be spatialized)
         * Returns -1 if there is no dialog
         */

    }, {
        key: '_getChannelIndexForExtendedDialog',
        value: function _getChannelIndexForExtendedDialog() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection;

            return asdc.channelIndexForExtendedDialog;
        }

        /**
         * Computes a drop in dB, according to distance
         * @type {number} value : the distance in meters
         */

    }, {
        key: '_process',


        //==============================================================================
        /**
         * Process: "position" + "gain"
         * @todo: how to automatically set the gain, how to have RMS from "the other signal" here
         */
        value: function _process() {}
    }], [{
        key: 'distanceToDrop',
        value: function distanceToDrop(value) {

            var clampDist = _utils2.default.clamp(value, 0.5, 10.0);
            var refDist = 1.0;

            /// 6dB each time the distance is x2

            var drop = -6.0 * Math.log2(clampDist / refDist);

            return drop;
        }
    }]);

    return ObjectSpatialiserAndMixer;
}(_index2.default);

exports.default = ObjectSpatialiserAndMixer;
},{"../core/utils.js":3,"../multichannel-spatialiser/index.js":19}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _analysis = require('../dsp/analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _compressor = require('../dsp/compressor.js');

var _compressor2 = _interopRequireDefault(_compressor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Implements the Receiver-Mix : the so-called Receiver-Mix 
 *				 corresponds to the 2nd part of the “OBJECT SPATIALISER AND MIXER”
 *				 This module inspects the RMS of the main programme, the RMS of the commentary
 *				 and it applies dynamic compression on the main programme if necessary
 *
 *   @author     Thibaut Carpentier, Samuel Goldszmidt
 *   @date       01/2016
 *
 */
/************************************************************************************/

var ReceiverMix = function (_AbstractNode) {
    _inherits(ReceiverMix, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection.
     */

    function ReceiverMix(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, ReceiverMix);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReceiverMix).call(this, audioContext, audioStreamDescriptionCollection));

        _this._isBypass = false;
        _this._shouldCompress = false;
        _this._rmsRefreshInterval = 100; /// interval (in msec for refreshing the RMS measurement)
        _this._durationHold = 0; /// how long (in msec) the compressor has been on hold
        _this._minimumHoldTime = 1500; /// hold time in msec) for the compressor

        if (typeof audioStreamDescriptionCollection === "undefined") {
            throw new Error("the audioStreamDescriptionCollection must be defined !");
        }

        /// first of all, check if there is a commentary stream.
        /// if not, the Receiver-Mix has nothing to do (just bypass)

        /// create an analyzer node for computing the RMS of the main programme
        _this._analysisNodeMain = new _analysis2.default(audioContext);

        /// create a mono analyzer node for computing the RMS of the commentary
        _this._analysisNodeCommentary = new _analysis2.default(audioContext);

        /// several mono analyzers for analyzing the main program
        _this._analysisNodeProgram = [];

        /// this is the N value in the .pdf :
        /// when the RMS of the commentary is > N (expressed in dB), the programme P must be analyzed
        _this._thresholdForCommentary = ReceiverMix.defaultForCommentaryThreshold;

        /// this is the X value in the .pdf :
        /// when the RMS of the programme P is > X, the programme is compressed
        _this._thresholdForProgramme = ReceiverMix.defaultForProgrammeThreshold;

        /// the actual number of channels will be later overriden
        _this._dynamicCompressorNode = new _compressor2.default(audioContext, 1);
        _this._dynamicCompressorNode.setRatio(ReceiverMix.defaultCompressionRatio);
        _this._dynamicCompressorNode.setAttack(_utils2.default.ms2sec(ReceiverMix.defaultAttackTime));
        _this._dynamicCompressorNode.setRelease(_utils2.default.ms2sec(ReceiverMix.defaultReleaseTime));

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        /// main splitter node, at the entrance of the ReceiverMix
        _this._splitterNode = audioContext.createChannelSplitter(totalNumberOfChannels_);

        /// main channel merger, at the output of the ReceiverMix
        _this._mergerNode = audioContext.createChannelMerger(totalNumberOfChannels_);

        /// sanity checks
        if (_this._splitterNode.numberOfInputs != 1 || _this._splitterNode.numberOfOutputs != totalNumberOfChannels_) {
            throw new Error("Pas bon");
        }

        /// sanity checks
        if (_this._mergerNode.numberOfInputs != totalNumberOfChannels_ || _this._mergerNode.numberOfOutputs != 1) {
            throw new Error("Pas bon");
        }

        _this._updateAudioGraph();

        /*
        window.setInterval( () => {
            this._updateCompressor();
        }, 100);
        */

        _this._updateCompressor();
        return _this;
    }

    //==============================================================================


    _createClass(ReceiverMix, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         * (i.e. whenever a check box is modified)
         */
        value: function activeStreamsChanged() {
            this._updateAudioGraph();
        }

        //==============================================================================
        /**
         * Returns true if there is at least one commentary among all the streams     
         */

    }, {
        key: 'getNumberOfChannelsInTheProgramme',


        //==============================================================================
        /**
         * Returns the number of channels in the "main" programme.
         * The 
         */
        value: function getNumberOfChannelsInTheProgramme() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            if (asdc.hasActiveStream === false) {

                throw new Error("no programme running !");
                return 0;
            }

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            for (var i = 0; i < asd.length; i++) {

                var stream_ = asd[i];

                if (stream_.type === "Stereo" && stream_.active === true) {
                    /// this is the right one
                    return stream_.numChannels();
                }
            }

            throw new Error("no programme running !");
            return 0;
        }

        //==============================================================================
        /**
         * Set the gate threshold (in dB) for the commentary
         * @type {number}
         */

    }, {
        key: 'setThresholdForCommentaryFromGui',


        /**
         * Sets the gate threshold (in dB) for the commentary, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the gate threshold (in dB) for the commentary
         */
        value: function setThresholdForCommentaryFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor[0];
            var maxValue = _ReceiverMix$rangeFor[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.thresholdForCommentary = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getThresholdForCommentaryFromGui',
        value: function getThresholdForCommentaryFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor2 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor2[0];
            var maxValue = _ReceiverMix$rangeFor2[1];


            var actualValue = this.thresholdForCommentary;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        /**
         * Get the dB range
         * @type {array}     
         */

    }, {
        key: 'setThresholdForProgrammeFromGui',


        /**
         * Sets the gate threshold (in dB) for the programme, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the gate threshold (in dB) for the programme
         */
        value: function setThresholdForProgrammeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor3 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor3[0];
            var maxValue = _ReceiverMix$rangeFor3[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.thresholdForProgramme = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getThresholdForProgrammeFromGui',
        value: function getThresholdForProgrammeFromGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$rangeFor4 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor4[0];
            var maxValue = _ReceiverMix$rangeFor4[1];


            var actualValue = this.thresholdForProgramme;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        /**
         * Get the dB range
         * @type {array}     
         */

    }, {
        key: 'setCompressorThreshold',


        //==============================================================================
        value: function setCompressorThreshold(value) {
            this._dynamicCompressorNode.setThreshold(value);
        }
    }, {
        key: 'getCompressorThreshold',
        value: function getCompressorThreshold() {
            return this._dynamicCompressorNode.getThreshold();
        }

        /**
         * Get the compression threshold range
         * @type {array}     
         */

    }, {
        key: 'setCompressorRatio',
        value: function setCompressorRatio(value) {
            this._dynamicCompressorNode.setRatio(value);
        }
    }, {
        key: 'getCompressorRatio',
        value: function getCompressorRatio() {
            return this._dynamicCompressorNode.getRatio();
        }
    }, {
        key: 'setCompressorAttack',
        value: function setCompressorAttack(valueInMilliseconds) {

            var value = _utils2.default.ms2sec(valueInMilliseconds);

            //console.log("compressor attack = " + value.toString() + ' sec');

            this._dynamicCompressorNode.setAttack(value);
        }
    }, {
        key: 'getCompressorAttack',
        value: function getCompressorAttack() {
            return _utils2.default.sec2ms(this._dynamicCompressorNode.getAttack());
        }
    }, {
        key: 'setCompressorRelease',
        value: function setCompressorRelease(valueInMilliseconds) {

            var value = _utils2.default.ms2sec(valueInMilliseconds);

            //console.log("compressor release = " + value.toString() + ' sec');

            this._dynamicCompressorNode.setRelease(value);
        }
    }, {
        key: 'getCompressorRelease',
        value: function getCompressorRelease() {
            return _utils2.default.sec2ms(this._dynamicCompressorNode.getRelease());
        }

        //==============================================================================
        /**
         * Sets the release time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the release time (in msec)
         */

    }, {
        key: 'setCompressorThresholdFromGui',
        value: function setCompressorThresholdFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress = _slicedToArray(ReceiverMix.compressionThresholdRange, 2);

            var minValue = _ReceiverMix$compress[0];
            var maxValue = _ReceiverMix$compress[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorThreshold(value);

            return value;
        }

        /**
         * Returns the current value of release time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getCompressorThresholdForGui',
        value: function getCompressorThresholdForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress2 = _slicedToArray(ReceiverMix.compressionThresholdRange, 2);

            var minValue = _ReceiverMix$compress2[0];
            var maxValue = _ReceiverMix$compress2[1];


            var actualValue = this.getCompressorThreshold();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the release time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the release time (in msec)
         */

    }, {
        key: 'setReleaseTimeFromGui',
        value: function setReleaseTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$releaseT = _slicedToArray(ReceiverMix.releaseTimeRange, 2);

            var minValue = _ReceiverMix$releaseT[0];
            var maxValue = _ReceiverMix$releaseT[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorRelease(value);

            return value;
        }

        /**
         * Returns the current value of release time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getReleaseTimeForGui',
        value: function getReleaseTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$releaseT2 = _slicedToArray(ReceiverMix.releaseTimeRange, 2);

            var minValue = _ReceiverMix$releaseT2[0];
            var maxValue = _ReceiverMix$releaseT2[1];


            var actualValue = this.getCompressorRelease();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the refresh interval for RMS measurement (in msec)
         * theSlider : the slider
         * return the actual value of the refresh interval (in msec)
         */

    }, {
        key: 'setRefreshRmsTimeFromGui',
        value: function setRefreshRmsTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 20;
            var maxValue = 500;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._rmsRefreshInterval = value;

            return value;
        }

        /**
         * Returns the refresh interval for RMS measurement (in msec)
         * theSlider : the slider
         */

    }, {
        key: 'getRefreshRmsTimeForGui',
        value: function getRefreshRmsTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 20;
            var maxValue = 500;


            var actualValue = this._rmsRefreshInterval;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the attack time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the attack time (in msec)
         */

    }, {
        key: 'setAttackTimeFromGui',
        value: function setAttackTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$attackTi = _slicedToArray(ReceiverMix.attackTimeRange, 2);

            var minValue = _ReceiverMix$attackTi[0];
            var maxValue = _ReceiverMix$attackTi[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorAttack(value);

            return value;
        }

        /**
         * Returns the current value of attack time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getAttackTimeForGui',
        value: function getAttackTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$attackTi2 = _slicedToArray(ReceiverMix.attackTimeRange, 2);

            var minValue = _ReceiverMix$attackTi2[0];
            var maxValue = _ReceiverMix$attackTi2[1];


            var actualValue = this.getCompressorAttack();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the compression ratio, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the compression ratio
         */

    }, {
        key: 'setCompressionRatioFromGui',
        value: function setCompressionRatioFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress3 = _slicedToArray(ReceiverMix.compressionRatioRange, 2);

            var minValue = _ReceiverMix$compress3[0];
            var maxValue = _ReceiverMix$compress3[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.setCompressorRatio(value);

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getCompressionRatioForGui',
        value: function getCompressionRatioForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _ReceiverMix$compress4 = _slicedToArray(ReceiverMix.compressionRatioRange, 2);

            var minValue = _ReceiverMix$compress4[0];
            var maxValue = _ReceiverMix$compress4[1];


            var actualValue = this.getCompressorRatio();

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the minimum hold time (in msec)
         * theSlider : the slider
         * return the actual value of the hold time
         */

    }, {
        key: 'setMinimumHoldTimeFromGui',
        value: function setMinimumHoldTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 1000;
            var maxValue = 5000;

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this._minimumHoldTime = value;

            return value;
        }

        /**
         * Returns the minimum hold time (in msec)
         * theSlider : the slider
         */

    }, {
        key: 'getMinimumHoldTimeForGui',
        value: function getMinimumHoldTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter
            var minValue = 1000;
            var maxValue = 5000;


            var actualValue = this._minimumHoldTime;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Returns the RMS value for the commentary, in dB
         */

    }, {
        key: 'getRmsForCommentary',
        value: function getRmsForCommentary() {

            if (this._hasExtendedCommentaryToAnalyze() === true) {
                return _utils2.default.lin2dBsafe(this._analysisNodeCommentary.getRMS());
            } else {
                return -200;
            }
        }

        /**
         * Returns the RMS value for the commentary, as a string
         */

    }, {
        key: 'getRmsForCommentaryAsString',
        value: function getRmsForCommentaryAsString() {
            return 'RMS comments = ' + this.getRmsForCommentary().toFixed(1) + ' dB';
        }

        //==============================================================================
        /**
         * This function returns the index of the source which corresponds to the commentary
         * (that needs to be analyzed)
         * Returns -1 if there is no commentary
         */

    }, {
        key: '_getChannelIndexForExtendedCommentary',
        value: function _getChannelIndexForExtendedCommentary() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection;

            return asdc.channelIndexForExtendedCommentary;
        }

        /**
         * Returns true if there is a commentary stream and if it is active
         */

    }, {
        key: '_hasExtendedCommentaryToAnalyze',
        value: function _hasExtendedCommentaryToAnalyze() {

            var indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

            return this.hasActiveExtendedCommentary === true && indexForExtendedCommentary >= 0;
        }

        //==============================================================================
        /**
         * The current program is either Stereo or MultiWithLFE
         */

    }, {
        key: '_getProgramStream',
        value: function _getProgramStream() {

            var asdc = this._audioStreamDescriptionCollection;

            /// go through all the streams
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    if (stream.type === "Stereo" && stream.active === true) {

                        return stream;
                    } else if (stream.type === "MultiWithLFE" && stream.active === true) {

                        return stream;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return undefined;
        }

        /**
         * Among all the streams, this returns an array containing the indices of channels
         * to analyze for the program.
         */

    }, {
        key: '_getChannelsIndicesForProgram',
        value: function _getChannelsIndicesForProgram() {

            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return [];
            } else {

                ///@todo : skip the LFE in case of 5.1

                var channelIndex = 0;

                var indices = [];

                var asdc = this._audioStreamDescriptionCollection;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = asdc.streams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var stream = _step2.value;


                        var numChannelsForThisStream = stream.numChannels;

                        if (stream === programStream) {

                            for (var k = 0; k < numChannelsForThisStream; k++) {

                                var index = channelIndex + k;
                                indices.push(index);
                            }
                        } else {
                            channelIndex += numChannelsForThisStream;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return indices;
            }
        }
    }, {
        key: '_hasProgramToAnalyze',
        value: function _hasProgramToAnalyze() {

            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return false;
            } else {
                return true;
            }
        }

        //==============================================================================

    }, {
        key: 'getRmsForProgram',
        value: function getRmsForProgram() {
            if (this._hasProgramToAnalyze() === true) {

                var rms = [];

                /// average rms among all channels

                for (var i = 0; i < this._analysisNodeProgram.length; i++) {

                    var lin = this._analysisNodeProgram[i].getRMS();

                    rms.push(lin);
                }

                var avg = _utils2.default.mean(rms);

                return _utils2.default.lin2dBsafe(avg);
            } else {
                return -200;
            }
        }

        /**
         * Returns the RMS value for the commentary, as a string
         */

    }, {
        key: 'getRmsForProgramAsString',
        value: function getRmsForProgramAsString() {
            return 'RMS program = ' + this.getRmsForProgram().toFixed(1) + ' dB';
        }

        //==============================================================================
        /**
         * The number of channels of the current program (i.e. the number of channels) that have to be analyzed
         * or 0 if there is no active program at the moment
         */

    }, {
        key: '_getNumChannelsForProgramStream',
        value: function _getNumChannelsForProgramStream() {

            var programStream = this._getProgramStream();

            if (typeof programStream === "undefined") {
                return 0;
            } else {
                return programStream.numChannels;
            }
        }

        //==============================================================================
        /**
         * returns true if the program is being compressed
         */

    }, {
        key: '_updateCompressor',


        //==============================================================================
        /**
         * This method should be called once, and then it repeats itself periodically
         */
        value: function _updateCompressor() {
            var _this2 = this;

            /// execute this function again, after a given interval       
            window.setTimeout(function () {
                _this2._updateCompressor();
            }, this._rmsRefreshInterval);

            /// in msec
            /// once the compression gets activated,
            /// we will hold it for at least 1500 msec
            /// i.e. for 1500 msec, we suspend the RMS comparison,
            /// and the compression remains with a dry/wet of 100%
            var minimumHoldTime = this._minimumHoldTime;

            ///@todo : the hold time could also appear in the GUI

            if (this.bypass === false && this._shouldCompress === true && this._durationHold <= minimumHoldTime) {
                /// hold the compressor for at least 1000 msec

                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;

                return;
            }

            /// the hold period is over; now, really compare the RMS,
            /// to activate or not the compression

            this._shouldCompress = false;

            if (this.bypass === true) {
                this._shouldCompress = false;
            } else {

                if (this._hasExtendedCommentaryToAnalyze() === true) {

                    var C = this.getRmsForCommentary();
                    var P = this.getRmsForProgram();

                    var N = this.thresholdForCommentary;
                    var X = this.thresholdForProgramme;

                    if (C > N && P > X) {
                        this._shouldCompress = true;
                    }
                } else {
                    this._shouldCompress = false;
                }
            }

            if (this._shouldCompress === true) {
                //ratio = this._compressionRatio;
                //this._dynamicCompressorNode.bypass = false;
                this._dynamicCompressorNode.drywet = 100;

                /// increment the counter
                this._durationHold += this._rmsRefreshInterval;
            } else {
                //ratio = 1.0;
                //this._dynamicCompressorNode.bypass = true;
                this._dynamicCompressorNode.drywet = 0;

                /// increment the counter
                this._durationHold = 0;
            }
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._splitterNode.disconnect();
            this._analysisNodeCommentary.disconnect();
            this._mergerNode.disconnect();
            this._dynamicCompressorNode.disconnect();

            if (typeof this._splitterAfterCompressor !== "undefined") {
                this._splitterAfterCompressor.disconnect();
            }
            if (typeof this._mergerBeforeCompressor !== "undefined") {
                this._mergerBeforeCompressor.disconnect();
            }

            for (var i = 0; i < this._analysisNodeProgram.length; i++) {
                this._analysisNodeProgram[i].disconnect();
            }

            var indexForExtendedCommentary = this._getChannelIndexForExtendedCommentary();

            /// split the input streams into N independent channels
            this._input.connect(this._splitterNode);

            /// connect the analyzer for the commentary
            if (this._hasExtendedCommentaryToAnalyze() === true) {
                this._splitterNode.connect(this._analysisNodeCommentary._input, indexForExtendedCommentary, 0);
            }

            var indicesForProgram = this._getChannelsIndicesForProgram();

            /// connect the analyzers for the program
            if (this._hasProgramToAnalyze() === true) {

                var numChannelsForProgramStream = this._getNumChannelsForProgramStream();

                /// sanity check
                if (indicesForProgram.length !== numChannelsForProgramStream) {
                    throw new Error("Ca parait pas bon...");
                }

                /// delete the previous analyzers
                this._analysisNodeProgram = [];

                /// create N (mono) analyzers
                for (var _i = 0; _i < numChannelsForProgramStream; _i++) {
                    var newAnalyzer = new _analysis2.default(this._audioContext);
                    this._analysisNodeProgram.push(newAnalyzer);
                }

                /// connect the (mono) analyzers to the channel splitter
                for (var _i2 = 0; _i2 < numChannelsForProgramStream; _i2++) {

                    var splitterOutputIndex = indicesForProgram[_i2];

                    this._splitterNode.connect(this._analysisNodeProgram[_i2]._input, splitterOutputIndex, 0);
                }

                /// re-build the compressor if needed
                if (this._dynamicCompressorNode.getNumChannels() !== numChannelsForProgramStream) {

                    /// preserve the old state
                    var ratio = this._dynamicCompressorNode.getRatio();
                    var attack = this._dynamicCompressorNode.getAttack();
                    var release = this._dynamicCompressorNode.getRelease();
                    var threshold = this._dynamicCompressorNode.getThreshold();

                    /// destroy the compressor
                    this._dynamicCompressorNode = "undefined";

                    var audioContext = this._audioContext;

                    /// create a new one
                    this._dynamicCompressorNode = new _compressor2.default(audioContext, numChannelsForProgramStream);

                    /// restore the settings
                    this._dynamicCompressorNode.setRatio(ratio);
                    this._dynamicCompressorNode.setAttack(attack);
                    this._dynamicCompressorNode.setRelease(release);
                    this._dynamicCompressorNode.setThreshold(threshold);

                    /// delete these nodes
                    this._splitterAfterCompressor = "undefined";
                    this._mergerBeforeCompressor = "undefined";

                    /// a channel splitter at the output of the compressor
                    this._splitterAfterCompressor = audioContext.createChannelSplitter(numChannelsForProgramStream);

                    this._mergerBeforeCompressor = audioContext.createChannelMerger(numChannelsForProgramStream);
                }
            }

            if (this.bypass === true || this._hasProgramToAnalyze() === false) {
                this._input.connect(this._output);
            } else {

                /// sanity checks
                var _numChannelsForProgramStream = this._getNumChannelsForProgramStream();

                if (_numChannelsForProgramStream <= 0) {
                    throw new Error("pas bon !");
                }

                if (typeof this._dynamicCompressorNode === "undefined") {
                    throw new Error("pas bon !");
                }

                if (typeof this._splitterAfterCompressor === "undefined") {
                    throw new Error("pas bon !");
                }

                if (typeof this._mergerBeforeCompressor === "undefined") {
                    throw new Error("pas bon !");
                }

                if (this._dynamicCompressorNode.getNumChannels() !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                if (this._splitterAfterCompressor.numberOfInputs != 1 || this._splitterAfterCompressor.numberOfOutputs != _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                if (this._mergerBeforeCompressor.numberOfInputs != _numChannelsForProgramStream || this._mergerBeforeCompressor.numberOfOutputs != 1) {
                    throw new Error("pas bon !");
                }

                if (indicesForProgram.length !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                var totalNumberOfChannels_ = this.getTotalNumberOfChannels();

                this._mergerBeforeCompressor.connect(this._dynamicCompressorNode._input);
                this._dynamicCompressorNode.connect(this._splitterAfterCompressor);

                var compressorIndex = 0;

                for (var _i3 = 0; _i3 < totalNumberOfChannels_; _i3++) {

                    /// is this a channel that goes into the compressor ?

                    var shouldGoToCompressor = indicesForProgram.includes(_i3);

                    if (shouldGoToCompressor === true) {

                        this._splitterNode.connect(this._mergerBeforeCompressor, _i3, compressorIndex);

                        this._splitterAfterCompressor.connect(this._mergerNode, compressorIndex, _i3);

                        compressorIndex++;
                    } else {
                        /// not going to the compressor
                        this._splitterNode.connect(this._mergerNode, _i3, _i3);
                    }
                }

                /// sanity check
                if (compressorIndex !== _numChannelsForProgramStream) {
                    throw new Error("pas bon !");
                }

                this._mergerNode.connect(this._output);
            }
        }
    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }
    }, {
        key: 'hasExtendedCommentary',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasExtendedCommentary;
        }

        /**
         * Returns true if there is at least one commentary among all the streams,
         * and if it is currently active     
         */

    }, {
        key: 'hasActiveExtendedCommentary',
        get: function get() {
            return this._audioStreamDescriptionCollection.hasActiveExtendedCommentary;
        }
    }, {
        key: 'thresholdForCommentary',
        set: function set(valueIndB) {
            var _ReceiverMix$rangeFor5 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor5[0];
            var maxValue = _ReceiverMix$rangeFor5[1];


            this._thresholdForCommentary = _utils2.default.clamp(valueIndB, minValue, maxValue);
        }

        /**
         * Get the gate threshold (in dB) for the commentary
         * @type {number}
         */
        ,
        get: function get() {
            return this._thresholdForCommentary;
        }
    }, {
        key: 'thresholdForProgramme',


        //==============================================================================
        /**
         * Set the gate threshold (in dB) for the commentary
         * @type {number}
         */
        set: function set(valueIndB) {
            this._thresholdForProgramme = valueIndB;
        }
        /**
         * Get the gate threshold (in dB) for the commentary
         * @type {number}
         */
        ,
        get: function get() {
            return this._thresholdForProgramme;
        }
    }, {
        key: 'shouldCompressProgram',
        get: function get() {
            return this._shouldCompress;
        }

        //==============================================================================
        /**
         * Returns the dynamic compression state
         * @type {boolean}
         */

    }, {
        key: 'dynamicCompressionState',
        get: function get() {

            //return this._dynamicCompressorNode.dynamicCompressionState && this._shouldCompress;
            return this._shouldCompress;
        }
    }], [{
        key: 'rangeForCommentaryThreshold',
        get: function get() {
            return [-60, 0];
        }
    }, {
        key: 'minForCommentaryThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor6 = _slicedToArray(ReceiverMix.rangeForCommentaryThreshold, 2);

            var minValue = _ReceiverMix$rangeFor6[0];
            var maxValue = _ReceiverMix$rangeFor6[1];

            return minValue;
        }
    }, {
        key: 'maxForCommentaryThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor7 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor7[0];
            var maxValue = _ReceiverMix$rangeFor7[1];

            return maxValue;
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: 'defaultForCommentaryThreshold',


        /**
         * Returns the default value (in dB)
         * @type {number}
         */
        get: function get() {
            return -30;
        }
    }, {
        key: 'rangeForProgrammeThreshold',
        get: function get() {
            return [-60, 0];
        }
    }, {
        key: 'minForProgrammeThreshold',
        get: function get() {
            var _ReceiverMix$rangeFor8 = _slicedToArray(ReceiverMix.rangeForProgrammeThreshold, 2);

            var minValue = _ReceiverMix$rangeFor8[0];
            var maxValue = _ReceiverMix$rangeFor8[1];

            return minValue;
        }
    }, {
        key: 'defaultForProgrammeThreshold',
        get: function get() {
            return -35;
        }
    }, {
        key: 'compressionThresholdRange',
        get: function get() {
            return [ReceiverMix.minCompressionThresholdRange, ReceiverMix.maxCompressionThresholdRange];
        }
    }, {
        key: 'minCompressionThresholdRange',
        get: function get() {
            return _compressor2.default.minThreshold;
        }
    }, {
        key: 'maxCompressionThresholdRange',
        get: function get() {
            return _compressor2.default.maxThreshold;
        }

        /**
         * Returns the default threshold ratio
         * @type {number}
         */

    }, {
        key: 'defaultCompressionThreshold',
        get: function get() {
            return _compressor2.default.defaultThreshold;
        }

        /**
         * Get the compression ratio range
         * @type {array}     
         */

    }, {
        key: 'compressionRatioRange',
        get: function get() {
            return [ReceiverMix.minCompressionRatioRange, ReceiverMix.maxCompressionRatioRange];
        }
    }, {
        key: 'minCompressionRatioRange',
        get: function get() {
            return _compressor2.default.minRatio;
        }
    }, {
        key: 'maxCompressionRatioRange',
        get: function get() {
            return _compressor2.default.maxRatio;
        }

        /**
         * Returns the default compression ratio
         * @type {number}
         */

    }, {
        key: 'defaultCompressionRatio',
        get: function get() {
            return 5;
        }

        /**
         * Get the attack time range (in msec)
         * @type {array}     
         */

    }, {
        key: 'attackTimeRange',
        get: function get() {
            return [ReceiverMix.minAttackTimeRange, ReceiverMix.maxAttackTimeRange];
        }

        /**
         * Returns the minimum attack time (in msec)  
         */

    }, {
        key: 'minAttackTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minAttack);
        }

        /**
         * Returns the maximum attack time (in msec)  
         */

    }, {
        key: 'maxAttackTimeRange',
        get: function get() {

            return _utils2.default.sec2ms(_compressor2.default.maxAttack);
        }

        /**
         * Returns the default attack time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultAttackTime',
        get: function get() {
            return 5;
        }

        /**
         * Get the release time range (in msec)
         * @type {array}     
         */

    }, {
        key: 'releaseTimeRange',
        get: function get() {
            return [ReceiverMix.minReleaseTimeRange, ReceiverMix.maxReleaseTimeRange];
        }

        /**
         * Returns the minimum release time (in msec)  
         */

    }, {
        key: 'minReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minRelease);
        }

        /**
         * Returns the maximum release time (in msec)  
         */

    }, {
        key: 'maxReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.maxRelease);
        }

        /**
         * Returns the default release time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultReleaseTime',
        get: function get() {
            return 20;
        }
    }]);

    return ReceiverMix;
}(_index2.default);

exports.default = ReceiverMix;
},{"../core/index.js":2,"../core/utils.js":3,"../dsp/analysis.js":5,"../dsp/compressor.js":8}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _compressor = require('../dsp/compressor.js');

var _compressor2 = _interopRequireDefault(_compressor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class implements the so-called SmartFader module of M4DP
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/


var SmartFader = function (_AbstractNode) {
    _inherits(SmartFader, _AbstractNode);

    //==============================================================================
    /**
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     * @param {number} dB - dB value for the SmartFader.
     */

    function SmartFader(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
        var dB = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];

        _classCallCheck(this, SmartFader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartFader).call(this, audioContext, audioStreamDescriptionCollection));

        _this._dB = undefined;
        _this._compressionRatio = SmartFader.defaultCompressionRatio;
        _this._attackTime = SmartFader.defaultAttackTime;
        _this._releaseTime = SmartFader.defaultReleaseTime;
        _this._isBypass = false;

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this._audioStreamDescriptionCollection.totalNumberOfChannels;

        ///@n the gain and dynamic compression are applied similarly to all channels
        _this._gainNode = audioContext.createGain();
        _this._dynamicCompressorNode = new _compressor2.default(audioContext, totalNumberOfChannels_);

        /// connect the audio nodes
        _this._updateAudioGraph();

        /// initialization
        {
            _this.dB = dB;
            _this._updateCompressorSettings();
        }
        return _this;
    }

    //==============================================================================
    /**
     * Enable or bypass the processor
     * @type {boolean}
     */


    _createClass(SmartFader, [{
        key: 'setdBFromGui',


        //==============================================================================
        /**
         * Sets the compression ratio, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the compression ratio
         */
        value: function setdBFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$dBRange = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange[0];
            var maxValue = _SmartFader$dBRange[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.dB = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getdBForGui',
        value: function getdBForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$dBRange2 = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange2[0];
            var maxValue = _SmartFader$dBRange2[1];


            var actualValue = this.dB;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Returns the dynamic compression state
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        /**
         * Notification when the active stream(s) changes
         */
        value: function activeStreamsChanged() {
            this._updateCompressorSettings();
        }

        //==============================================================================
        /**
         * Sets the compression ratio
         * representing the amount of change, in dB, needed in the input for a 1 dB change in the output
         */

    }, {
        key: 'setCompressionRatioFromGui',


        //==============================================================================
        /**
         * Sets the compression ratio, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the compression ratio
         */
        value: function setCompressionRatioFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$compressi = _slicedToArray(SmartFader.compressionRatioRange, 2);

            var minValue = _SmartFader$compressi[0];
            var maxValue = _SmartFader$compressi[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.compressionRatio = value;

            return value;
        }

        /**
         * Returns the current value of compression ratio, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getCompressionRatioForGui',
        value: function getCompressionRatioForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$compressi2 = _slicedToArray(SmartFader.compressionRatioRange, 2);

            var minValue = _SmartFader$compressi2[0];
            var maxValue = _SmartFader$compressi2[1];


            var actualValue = this.compressionRatio;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the attack time (in msec)
         * representing the amount of time, in seconds, required to reduce the gain by 10 dB
         */

    }, {
        key: 'setAttackTimeFromGui',


        //==============================================================================
        /**
         * Sets the attack time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the attack time (in msec)
         */
        value: function setAttackTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$attackTim = _slicedToArray(SmartFader.attackTimeRange, 2);

            var minValue = _SmartFader$attackTim[0];
            var maxValue = _SmartFader$attackTim[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.attackTime = value;

            return value;
        }

        /**
         * Returns the current value of attack time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getAttackTimeForGui',
        value: function getAttackTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$attackTim2 = _slicedToArray(SmartFader.attackTimeRange, 2);

            var minValue = _SmartFader$attackTim2[0];
            var maxValue = _SmartFader$attackTim2[1];


            var actualValue = this.attackTime;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }

        //==============================================================================
        /**
         * Sets the release time (in msec)
         * representing the amount of time, in seconds, required to increase the gain by 10 dB
         */

    }, {
        key: 'setReleaseTimeFromGui',


        //==============================================================================
        /**
         * Sets the release time, according to a slider in the GUI
         * theSlider : the slider
         * return the actual value of the release time (in msec)
         */
        value: function setReleaseTimeFromGui(theSlider) {

            /// the value of the fader
            var valueFader = parseFloat(theSlider.value);

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$releaseTi = _slicedToArray(SmartFader.releaseTimeRange, 2);

            var minValue = _SmartFader$releaseTi[0];
            var maxValue = _SmartFader$releaseTi[1];

            /// scale from GUI to DSP

            var value = M4DPAudioModules.utilities.scale(valueFader, minFader, maxFader, minValue, maxValue);

            this.releaseTime = value;

            return value;
        }

        /**
         * Returns the current value of release time, already scaled for the GUI
         * theSlider : the slider
         */

    }, {
        key: 'getReleaseTimeForGui',
        value: function getReleaseTimeForGui(theSlider) {

            // get the bounds of the fader (GUI)
            var minFader = parseFloat(theSlider.min);
            var maxFader = parseFloat(theSlider.max);

            // get the actual bounds for this parameter

            var _SmartFader$releaseTi2 = _slicedToArray(SmartFader.releaseTimeRange, 2);

            var minValue = _SmartFader$releaseTi2[0];
            var maxValue = _SmartFader$releaseTi2[1];


            var actualValue = this.releaseTime;

            /// scale from DSP to GUI
            var value = M4DPAudioModules.utilities.scale(actualValue, minValue, maxValue, minFader, maxFader);

            return value;
        }
    }, {
        key: '_updateCompressorSettings',
        value: function _updateCompressorSettings() {

            /// retrieves the AudioStreamDescriptionCollection
            var asdc = this._audioStreamDescriptionCollection;

            if (asdc.hasActiveStream === false) {
                //console.log( "no active streams !!");
                return;
            }

            ///@todo : que faire si plusieurs streams sont actifs ??

            /// retrieves the active AudioStreamDescription(s)
            var asd = asdc.actives;

            /// sanity check
            if (asd.length <= 0) {
                throw new Error("Y'a un bug qq part...");
            }

            /// use the first active stream (???)
            var activeStream = asd[0];

            /**
            Le reglage du volume doit se comporter de la facon suivante :
            - attenuation classique du volume sonore entre le niveau nominal (gain = 0) et en deca
            - augmentation classique du volume sonore entre le niveau nominal et le niveau max (niveau max = niveau nominal + I MaxTruePeak I)
            - limiteur/compresseur multicanal au dela du niveau max
            */

            /// retrieves the MaxTruePeak (ITU­R BS.1770­3) of the active AudioStreamDescription
            /// (expressed in dBTP)
            var maxTruePeak = activeStream.maxTruePeak;

            /// integrated loudness (in LUFS)
            var nominal = activeStream.loudness;

            /// sanity check
            if (nominal >= 0.0) {
                throw new Error("Ca parait pas bon...");
            }

            var threshold = nominal + Math.abs(maxTruePeak);

            /**
            Matthieu :
            Dans mon papier sur le sujet j'avais défini les ordres de grandeur d'une matrice pour expliciter
            la progression de la compression en fonction du niveau d'entrée. 
            Ça donne un ratio de 2:1 sur les premiers 6 dB de dépassement puis 3:1 au delà. 
            Est-ce plus simple pour vous d'user de cette matrice ou d'appeler un compresseur multicanal 
            et lui passer des paramètres classiques ?
             On aurait alors :
            Threshold à -18 dBFS
            Ratio à 2:1
            Attack à 20 ms
            Release à 200 ms
            */

            /// representing the decibel value above which the compression will start taking effect
            this._dynamicCompressorNode.setThreshold(threshold);

            /// representing the amount of change, in dB, needed in the input for a 1 dB change in the output
            this._dynamicCompressorNode.setRatio(this._compressionRatio);

            /// representing the amount of time, in seconds, required to reduce the gain by 10 dB
            var attackInSeconds = _utils2.default.ms2sec(this._attackTime);
            this._dynamicCompressorNode.setAttack(attackInSeconds);

            /// representing the amount of time, in seconds, required to increase the gain by 10 dB
            var releaseInSeconds = _utils2.default.ms2sec(this._releaseTime);
            this._dynamicCompressorNode.setRelease(releaseInSeconds);
        }
    }, {
        key: '_update',
        value: function _update() {

            //console.log( "_update" );

            /// the current fader value, in dB
            var fader = this._dB;

            if (typeof fader === "undefined" || isNaN(fader) === true) {
                /// this can happen during the construction...
                return;
            }

            var lin = _utils2.default.dB2lin(fader);

            this._gainNode.gain.value = lin;
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._gainNode.disconnect();
            this._dynamicCompressorNode.disconnect();

            if (this.bypass === true) {
                this._input.connect(this._output);
            } else {

                this._input.connect(this._gainNode);
                this._gainNode.connect(this._dynamicCompressorNode._input);
                this._dynamicCompressorNode.connect(this._output);
            }
        }
    }, {
        key: 'bypass',
        set: function set(value) {

            if (value !== this._isBypass) {
                this._isBypass = value;
                this._updateAudioGraph();
            }
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._isBypass;
        }

        //==============================================================================
        /**
         * Set the dB value
         * @type {number}
         */

    }, {
        key: 'dB',
        set: function set(value) {

            /// clamp the incoming value
            this._dB = SmartFader.clampdB(value);

            /// update the DSP processor
            this._update();
        }

        /**
         * Get the dB value
         * @type {number}
         */
        ,
        get: function get() {
            return this._dB;
        }

        /**
         * Clips a value within the proper dB range
         * @type {number} value the value to be clipped
         */

    }, {
        key: 'dynamicCompressionState',
        get: function get() {

            /// representing the amount of gain reduction currently applied by the compressor to the signal.

            /**
            Intended for metering purposes, it returns a value in dB, or 0 (no gain reduction) if no signal is fed
            into the DynamicsCompressorNode. The range of this value is between -20 and 0 (in dB).
            */

            return this._dynamicCompressorNode.dynamicCompressionState;
        }
    }, {
        key: 'compressionRatio',
        set: function set(value) {
            var _SmartFader$compressi3 = _slicedToArray(SmartFader.compressionRatioRange, 2);

            var minValue = _SmartFader$compressi3[0];
            var maxValue = _SmartFader$compressi3[1];


            this._compressionRatio = _utils2.default.clamp(value, minValue, maxValue);

            this._updateCompressorSettings();
        }

        /**
         * Returns the compression ratio     
         */
        ,
        get: function get() {
            return this._compressionRatio;
        }

        /**
         * Get the compression ratio range
         * @type {array}     
         */

    }, {
        key: 'attackTime',
        set: function set(value) {
            var _SmartFader$attackTim3 = _slicedToArray(SmartFader.attackTimeRange, 2);

            var minValue = _SmartFader$attackTim3[0];
            var maxValue = _SmartFader$attackTim3[1];


            this._attackTime = _utils2.default.clamp(value, minValue, maxValue);

            this._updateCompressorSettings();
        }

        /**
         * Returns the attack time (in msec)  
         */
        ,
        get: function get() {
            return this._attackTime;
        }

        /**
         * Get the attack time range (in msec)
         * @type {array}     
         */

    }, {
        key: 'releaseTime',
        set: function set(value) {
            var _SmartFader$releaseTi3 = _slicedToArray(SmartFader.releaseTimeRange, 2);

            var minValue = _SmartFader$releaseTi3[0];
            var maxValue = _SmartFader$releaseTi3[1];


            this._releaseTime = _utils2.default.clamp(value, minValue, maxValue);

            this._updateCompressorSettings();
        }

        /**
         * Returns the release time (in msec)  
         */
        ,
        get: function get() {
            return this._releaseTime;
        }

        /**
         * Get the release time range (in msec)
         * @type {array}     
         */

    }], [{
        key: 'clampdB',
        value: function clampdB(value) {
            var _SmartFader$dBRange3 = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange3[0];
            var maxValue = _SmartFader$dBRange3[1];


            return _utils2.default.clamp(value, minValue, maxValue);
        }

        //==============================================================================
        /**
         * Get the dB range
         * @type {array}
         * @details +8 dB suffisent, pour passer du -23 au -15 LUFS (iTunes), c'est l'idée.
         */

    }, {
        key: 'dBRange',
        get: function get() {
            return [-60, 8];
        }
    }, {
        key: 'mindBRange',
        get: function get() {
            var _SmartFader$dBRange4 = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange4[0];
            var maxValue = _SmartFader$dBRange4[1];

            return minValue;
        }
    }, {
        key: 'maxdBRange',
        get: function get() {
            var _SmartFader$dBRange5 = _slicedToArray(SmartFader.dBRange, 2);

            var minValue = _SmartFader$dBRange5[0];
            var maxValue = _SmartFader$dBRange5[1];

            return maxValue;
        }

        /**
         * Returns the default value (in dB)
         * @type {number}
         */

    }, {
        key: 'dBDefault',
        get: function get() {
            return 0;
        }
    }, {
        key: 'compressionRatioRange',
        get: function get() {
            return [SmartFader.minCompressionRatioRange, SmartFader.maxCompressionRatioRange];
        }
    }, {
        key: 'minCompressionRatioRange',
        get: function get() {
            return _compressor2.default.minRatio;
        }
    }, {
        key: 'maxCompressionRatioRange',
        get: function get() {
            return _compressor2.default.maxRatio;
        }

        /**
         * Returns the default compression ratio
         * @type {number}
         */

    }, {
        key: 'defaultCompressionRatio',
        get: function get() {
            return 2;
        }
    }, {
        key: 'attackTimeRange',
        get: function get() {
            return [SmartFader.minAttackTimeRange, SmartFader.maxAttackTimeRange];
        }

        /**
         * Returns the minimum attack time (in msec)  
         */

    }, {
        key: 'minAttackTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minAttack);
        }

        /**
         * Returns the maximum attack time (in msec)  
         */

    }, {
        key: 'maxAttackTimeRange',
        get: function get() {

            return _utils2.default.sec2ms(_compressor2.default.maxAttack);
        }

        /**
         * Returns the default attack time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultAttackTime',
        get: function get() {
            return 20;
        }
    }, {
        key: 'releaseTimeRange',
        get: function get() {
            return [SmartFader.minReleaseTimeRange, SmartFader.maxReleaseTimeRange];
        }

        /**
         * Returns the minimum release time (in msec)  
         */

    }, {
        key: 'minReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.minRelease);
        }

        /**
         * Returns the maximum release time (in msec)  
         */

    }, {
        key: 'maxReleaseTimeRange',
        get: function get() {
            return _utils2.default.sec2ms(_compressor2.default.maxRelease);
        }

        /**
         * Returns the default release time (in msec)
         * @type {number}
         */

    }, {
        key: 'defaultReleaseTime',
        get: function get() {
            return 200;
        }
    }]);

    return SmartFader;
}(_index2.default);

exports.default = SmartFader;
},{"../core/index.js":2,"../core/utils.js":3,"../dsp/compressor.js":8}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../core/index.js');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _multichannelgain = require('../dsp/multichannelgain.js');

var _multichannelgain2 = _interopRequireDefault(_multichannelgain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      This class mutes/unmutes the incoming streams according to the checkbox selections
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var StreamSelector = function (_AbstractNode) {
    _inherits(StreamSelector, _AbstractNode);

    //==============================================================================
    /**
     * @brief This class mutes/unmutes the incoming streams according to the checkbox selections
     * @param {AudioContext} audioContext - audioContext instance.
     * @param {AudioStreamDescriptionCollection} audioStreamDescriptionCollection - audioStreamDescriptionCollection
     */

    function StreamSelector(audioContext) {
        var audioStreamDescriptionCollection = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        _classCallCheck(this, StreamSelector);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StreamSelector).call(this, audioContext, audioStreamDescriptionCollection));

        _this._gainsNode = 'undefined';

        /// the total number of incoming channels, including all the streams
        /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
        var totalNumberOfChannels_ = _this.getTotalNumberOfChannels();

        /// sanity check
        /// mainAudio (2) + extendedAmbience (6) + extendedComments (1) + extendedDialogs (1) = 10
        if (totalNumberOfChannels_ != 10) {
            console.log("warning : total number of channels = " + totalNumberOfChannels_);
        }

        _this._gainsNode = new _multichannelgain2.default(audioContext, totalNumberOfChannels_);

        _this._updateAudioGraph();
        return _this;
    }

    //==============================================================================


    _createClass(StreamSelector, [{
        key: 'getTotalNumberOfChannels',
        value: function getTotalNumberOfChannels() {
            return this._audioStreamDescriptionCollection.totalNumberOfChannels;
        }

        //==============================================================================
        /**
         * Enable or bypass the processor
         * @type {boolean}
         */

    }, {
        key: 'activeStreamsChanged',


        //==============================================================================
        /**
         * Notification when the active stream(s) changes
         * (i.e. whenever a check box is modified)
         */
        value: function activeStreamsChanged() {
            this._update();
        }
    }, {
        key: 'streamsTrimChanged',
        value: function streamsTrimChanged() {
            this._update();
        }

        //==============================================================================
        /**
         * Mute/unmute the streams, depending on the user selection
         * in the check boxes
         */

    }, {
        key: '_update',
        value: function _update() {

            /// retrieves the AudioStreamDescriptionCollection
            /// (mainAudio, extendedAmbience, extendedComments and extendedDialogs)
            var asdc = this._audioStreamDescriptionCollection.streams;

            var channelIndex = 0;

            /// go through all the streams and mute/unmute according to their 'active' flag
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = asdc[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;


                    var isActive = stream.active;

                    /// linear gain value
                    var gainValue = isActive ? 1.0 : 0.0;

                    var trimIndB = stream.trim;
                    var trimLevel = _utils2.default.dB2lin(trimIndB);

                    var overallGain = gainValue * trimLevel;

                    var numChannelsForThisStream = stream.numChannels;

                    for (var i = 0; i < numChannelsForThisStream; i++) {

                        if (channelIndex >= this._gainsNode.getNumChannels()) {
                            throw new Error("Y'a un bug qq part...");
                        }

                        this._gainsNode.setGain(channelIndex, overallGain);

                        channelIndex++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        //==============================================================================
        /**
         * Updates the connections of the audio graph
         */

    }, {
        key: '_updateAudioGraph',
        value: function _updateAudioGraph() {

            /// first of all, disconnect everything
            this._input.disconnect();
            this._gainsNode.disconnect();

            this._input.connect(this._gainsNode._input);
            this._gainsNode.connect(this._output);
        }
    }, {
        key: 'bypass',
        set: function set(value) {
            this._gainsNode.bypass = value;
        }

        /**
         * Returns true if the processor is bypassed
         */
        ,
        get: function get() {
            return this._gainsNode.bypass;
        }
    }]);

    return StreamSelector;
}(_index2.default);

exports.default = StreamSelector;
},{"../core/index.js":2,"../core/utils.js":3,"../dsp/multichannelgain.js":13}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _testbiquad = require('./testbiquad.js');

var _testbiquad2 = _interopRequireDefault(_testbiquad);

var _testcascade = require('./testcascade.js');

var _testcascade2 = _interopRequireDefault(_testcascade);

var _testanalysis = require('./testanalysis.js');

var _testanalysis2 = _interopRequireDefault(_testanalysis);

var _testphone = require('./testphone.js');

var _testphone2 = _interopRequireDefault(_testphone);

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _testbinaural = require('./testbinaural.js');

var _testbinaural2 = _interopRequireDefault(_testbinaural);

var _testsumdiff = require('./testsumdiff.js');

var _testsumdiff2 = _interopRequireDefault(_testsumdiff);

var _testtransaural = require('./testtransaural.js');

var _testtransaural2 = _interopRequireDefault(_testtransaural);

var _testmultichannel = require('./testmultichannel.js');

var _testmultichannel2 = _interopRequireDefault(_testmultichannel);

var _testrouting = require('./testrouting.js');

var _testrouting2 = _interopRequireDefault(_testrouting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       index.js
 *   @brief      Export test modules
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var unittests = {
    biquadtests: _testbiquad2.default,
    cascadetests: _testcascade2.default,
    analysistests: _testanalysis2.default,
    phonetests: _testphone2.default,
    sofatests: _testsofa2.default,
    binauraltests: _testbinaural2.default,
    sumdifftests: _testsumdiff2.default,
    transauraltests: _testtransaural2.default,
    multichanneltests: _testmultichannel2.default,
    routingtests: _testrouting2.default
};

exports.default = unittests;
},{"./testanalysis.js":27,"./testbinaural.js":28,"./testbiquad.js":29,"./testcascade.js":30,"./testmultichannel.js":31,"./testphone.js":32,"./testrouting.js":33,"./testsofa.js":34,"./testsumdiff.js":35,"./testtransaural.js":36}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testAnalysisNode = testAnalysisNode;

var _analysis = require('../dsp/analysis.js');

var _analysis2 = _interopRequireDefault(_analysis);

var _phone = require('../dsp/phone.js');

var _phone2 = _interopRequireDefault(_phone);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
function testAnalysisNode() {

    var numChannels = 4;

    /// create an online audio context, for the analyser node
    var audioContext1 = new AudioContext();

    /// create a test buffer
    var sampleRate = audioContext1.sampleRate;
    var bufferSize = 3 * sampleRate; // 3 seconds
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    _bufferutils2.default.makeNoise(buffer, 1, 0);
    _bufferutils2.default.makeNoise(buffer, 2, -6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();
    bufferSource.loop = true;

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var analysisNode = new _analysis2.default(audioContext1);

    // global references for testing
    window.test = typeof window.test !== 'undefined' ? window.test : {};

    window.test.analysisNode = analysisNode;

    /// configure the analysis node
    {
        // default values
        analysisNode.analyserFftSize = 2048;
        analysisNode.analyserMinDecibels = -100;
        analysisNode.analyserMaxDecibels = -30;
        analysisNode.analyserSmoothingTimeConstant = 0.85;
        analysisNode.voiceMinFrequency = 300;
        analysisNode.voiceMaxFrequency = 4000;
    }

    /// connect the node to the buffer source
    var phoneNode = new _phone2.default(audioContext1);
    window.test.phoneNode = phoneNode;

    phoneNode.gain = 6;

    bufferSource.connect(phoneNode._input);

    var splitterNode = audioContext1.createChannelSplitter(4);

    phoneNode._output.connect(splitterNode);

    splitterNode.connect(analysisNode._input, 1, 0);

    /// connect the node to the destination of the audio context
    analysisNode._output.connect(audioContext1.destination);

    /// start the rendering
    bufferSource.start(0);

    window.setInterval(function () {
        var rms = analysisNode.getRMS();
        console.log('RMS: ' + rms);

        var emergence = analysisNode.getVoiceEmergence();
        console.log('Voice emergence: ' + emergence);
    }, 100);
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testanalyser.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier, Jean-Philippe Lambert
 *   @date       04/2016
 *
 */
/************************************************************************************/

var analysistests = {
    testAnalysisNode: testAnalysisNode
};

exports.default = analysistests;
},{"../core/bufferutils.js":1,"../dsp/analysis.js":5,"../dsp/phone.js":14}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.testBinauralNode = testBinauralNode;

var _testsofa = require('./testsofa.js');

var _testsofa2 = _interopRequireDefault(_testsofa);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
/************************************************************************************/
/*!
 *   @file       testbinaural.js
 *   @brief      Misc test function for binaural
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testBinauralNode() {

	var sampleRate = 44100;

	_testsofa2.default.getHrir(1147, sampleRate, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var bufferSize = 4096;
		var numChannels = 2;

		/// create an offline audio context
		var audioContext1 = new OfflineAudioContext(2, bufferSize, sampleRate);

		/// create a test buffer
		var buffer = audioContext1.createBuffer(1, bufferSize, sampleRate);

		/// just a precaution
		_bufferutils2.default.clearBuffer(buffer);
		_bufferutils2.default.makeImpulse(buffer, 0, 0);

		var convolver = audioContext1.createConvolver();

		/// create a buffer source
		var bufferSource = audioContext1.createBufferSource();

		/// reference the test buffer with the buffer source
		bufferSource.buffer = buffer;

		{
			convolver.normalize = false;
			convolver.buffer = hrir;
		}

		/// connect the node to the buffer source
		bufferSource.connect(convolver);

		/// connect the node to the destination of the audio context
		convolver.connect(audioContext1.destination);

		/// prepare the rendering
		var localTime = 0;
		bufferSource.start(localTime);

		/// receive notification when the rendering is completed
		audioContext1.oncomplete = function (output) {

			var buf = output.renderedBuffer;

			var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
			console.log("buffer URL :  " + bufUrl);

			debugger;
		};

		/// start rendering
		audioContext1.startRendering();

		debugger;
	});
}

//==============================================================================
var binauraltests = {
	testBinauralNode: testBinauralNode
};

exports.default = binauraltests;
},{"../core/bufferutils.js":1,"./testsofa.js":34}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testBiquadNode = testBiquadNode;

var _bufferutils = require("../core/bufferutils.js");

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/// This does not test anything; this just enters in debug mode, to inspect the buffers
function testBiquadNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var biquadNode = audioContext1.createBiquadFilter();

    /// configure the biquad filter
    {
        biquadNode.type = "lowpass";

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        biquadNode.gain.value = 10;

        /// measured in hertz (Hz)
        biquadNode.frequency.value = 1000;

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        biquadNode.Q.value = 10;
    }

    /// connect the node to the buffer source
    bufferSource.connect(biquadNode);

    /// connect the node to the destination of the audio context
    biquadNode.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testbiquad.js
 *   @brief      Misc test functions for BiquadFilterNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var biquadtests = {
    testBiquadNode: testBiquadNode
};

exports.default = biquadtests;
},{"../core/bufferutils.js":1}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testCascadeNode = testCascadeNode;

var _cascade = require('../dsp/cascade.js');

var _cascade2 = _interopRequireDefault(_cascade);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testcascade.js
 *   @brief      Misc test functions for M4DPAudioModules.CascadeNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testCascadeNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var cascadeNode = new M4DPAudioModules.CascadeNode(audioContext1);

    /// configure the cascade filter
    {
        cascadeNode.numCascades = 2;

        cascadeNode.setType(0, "peaking");
        cascadeNode.setType(1, "peaking");

        /// It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40
        cascadeNode.setGain(0, 6);
        cascadeNode.setGain(1, 6);

        /// measured in hertz (Hz)
        cascadeNode.setFrequency(0, 1000);
        cascadeNode.setFrequency(1, 8000);

        /// It is a dimensionless value with a default value of 1 and a nominal range of 0.0001 to 1000.
        cascadeNode.setQ(0, 10);
        cascadeNode.setQ(1, 10);
    }

    /// connect the node to the buffer source
    bufferSource.connect(cascadeNode.input);

    /// connect the node to the destination of the audio context
    cascadeNode._output.connect(audioContext1.destination);

    cascadeNode.bypass = true;

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var cascadetests = {
    testCascadeNode: testCascadeNode
};

exports.default = cascadetests;
},{"../core/bufferutils.js":1,"../dsp/cascade.js":6}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testMultiChannel = testMultiChannel;

var _bufferutils = require("../core/bufferutils.js");

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
function testMultiChannel() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 6; /// 5.1

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.fillChannel(buffer, 0, 0.1);
    _bufferutils2.default.fillChannel(buffer, 1, 0.2);
    _bufferutils2.default.fillChannel(buffer, 2, 0.3);
    _bufferutils2.default.fillChannel(buffer, 3, 0.4);
    _bufferutils2.default.fillChannel(buffer, 4, 0.5);
    _bufferutils2.default.fillChannel(buffer, 5, 0.6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    bufferSource.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        ///@n it seems that the audioContext1.destination has only 2 channels
        /// as long as no multichannel audio device is plugged ?

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testmultichannel.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

var multichanneltests = {
    testMultiChannel: testMultiChannel
};

exports.default = multichanneltests;
},{"../core/bufferutils.js":1}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testPhoneNode = testPhoneNode;

var _phone = require('../dsp/phone.js');

var _phone2 = _interopRequireDefault(_phone);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testphone.js
 *   @brief      Misc test functions for M4DPAudioModules.PhoneNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testPhoneNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 4;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 0, 0);
    _bufferutils2.default.makeImpulse(buffer, 1, 10);
    _bufferutils2.default.makeNoise(buffer, 2, 0);
    _bufferutils2.default.makeNoise(buffer, 3, -6);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var phoneNode = new _phone2.default(audioContext1);

    /// configure the phone filter
    {
        phoneNode.gain = 6; // NOT default, default is 0

        phoneNode.frequency = 1200; // default
        phoneNode.q = 1; // default
    }

    /// connect the node to the buffer source
    bufferSource.connect(phoneNode._input);

    /// connect the node to the destination of the audio context
    phoneNode._output.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var phonetests = {
    testPhoneNode: testPhoneNode
};

exports.default = phonetests;
},{"../core/bufferutils.js":1,"../dsp/phone.js":14}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testRouting = testRouting;

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

var _routing = require('../multichannel-spatialiser/routing.js');

var _routing2 = _interopRequireDefault(_routing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testrouting.js
 *   @brief      Misc test functions for 5.1
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testRouting() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numInputs = 10;
    var numOutputs = 6; /// 5.1

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numOutputs, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numInputs, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    for (var i = 0; i < numInputs; i++) {
        _bufferutils2.default.fillChannel(buffer, i, (i + 1) * 0.1);
    }

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var routingNode = new _routing2.default(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(routingNode.input);

    routingNode.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        ///@n it seems that the audioContext1.destination has only 2 channels
        /// as long as no multichannel audio device is plugged ?

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var routingtests = {
    testRouting: testRouting
};

exports.default = routingtests;
},{"../core/bufferutils.js":1,"../multichannel-spatialiser/routing.js":20}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getHrir = getHrir;
exports.testHrtfFromSofaServer = testHrtfFromSofaServer;

var _utils = require('../core/utils.js');

var _utils2 = _interopRequireDefault(_utils);

var _binaural = require('binaural');

var _binaural2 = _interopRequireDefault(_binaural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IRC_1147, COMPENSATED, 44.1 kHz
// left ear, navigation = [-30 , 0]
/************************************************************************************/
/*!
 *   @file       testsofa.js
 *   @brief      Misc test functions for SOFA
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function getLeftTestBuffer() {

	var l_hrir_1 = [1.4132325e-05, -0.00028193564, 0.00067406708, -0.0015438328, 0.002343185, -0.0042546899, 0.0056989877, -0.008909386, 0.013256035, -0.023441048, 0.087901132, 0.11658128, -0.35129103, 0.19038613, -0.2640219, 0.10525886, 0.57169504, -0.092018661, 0.42129788, -0.065709863, -0.07198246, -0.12831281, -0.020194215, -0.086181897, 0.062725271, -0.064106033, -0.01786496, 0.005976978, 0.028849113, -0.078114624, 0.026099128, -0.087937849, 0.0065339186, 0.05093279, 0.030594884, 0.039333248, 0.01397383, 0.015451287, -0.0063663534, -0.031407839, -0.047616841, -0.05624593, -0.076982806, -0.045545539, -0.027926149, 0.0096117733, -0.019553812, -0.0053279059, -0.00072523411, -0.0042109865, 0.007578094, 0.00087990009, -0.0090000561, -0.0025798772, -0.012783602, -0.01307241, -0.008798917, -0.0022054303, -0.0012807811, -0.011876543, -0.0065112824, -0.0027094041, -0.00077164441, 0.0047712326, -0.0091772907, -0.00011162587, -0.0087647848, -0.0019659258, -0.0077792026, 0.0019471927, -0.011084985, -0.0031365027, -0.0081186278, -0.0040242879, 0.018169449, -0.017944612, -0.02320988, 0.025028598, -0.01209448, 0.0140731, 0.025226283, -0.0044313805, -0.02983553, -0.028062748, 0.02292914, -0.0073565672, -0.062286153, -0.016325469, -0.021853672, -0.025748605, 0.039503251, -0.0071338104, -0.012957448, 0.0027250638, 0.00057076822, 0.0088403969, 0.0070754822, 0.0017877444, -0.011529959, -0.0060916068, 0.00039970116, -0.004718351, 0.0021941501, 0.0073960195, 0.0078633152, -0.0037722073, -0.0020280923, 0.0024727472, 0.0040769741, -0.0088956118, -0.013589519, -0.015253273, -0.016183901, -0.014050537, -0.00077704794, -0.010080476, -0.0081755161, -0.00013398205, -0.0011617567, -0.0032983648, 0.001784743, -0.001853997, 0.00086518345, -0.00080255618, -0.0032587134, -0.006735632, -0.0039407294, -0.0023791482, -0.0023593784, -0.004234867, -0.0021589755, -0.0020311512, 0.0028884383, 0.0036012488, 0.0014631257, 0.0018751034, 0.0017227931, 0.00051738804, 0.0021896845, 0.00049943606, 1.0966705e-05, 0.00037674853, -0.00035357145, -0.00014751668, 0.00028273055, 0.0015553956, 0.0014225591, 0.00027374144, 6.608697e-05, 0.00088551602, -0.00023514595, 0.0010984583, -0.00060469367, -0.00070795743, -0.00031130607, -0.00060267295, 0.00023590805, 6.9737479e-05, 0.00020767466, 0.0008352928, 0.00079262047, 0.00097429446, 0.00080321626, 0.00070339281, 0.0015355398, 0.001640927, 0.0018574026, 0.0025194618, 0.0022518159, 0.002439559, 0.0025438101, 0.0025306775, 0.0012282241, 0.00076979102, 0.0016917955, 0.00020163211, 0.0013003565, 0.0011392531, 0.00034046515, 0.00092837517, 0.0013007193, 0.0025138302, 0.00225188, 0.00037036302, 0.0012363485, 0.001418706, -0.00033464148, -0.0011334823, -0.0023804675, -0.00084712007, 0.00047495138, -0.00088687785, -0.0008213348, -0.0015033938, -0.00034491047, 0.0028352889, 0.0015820507, -0.00045588497, 0.0019047109, 0.0016433937, 0.0023967951, 0.0030677286, 0.0016212255, 0.00067536607, 0.00056772145, 0.0023526029, 0.0023253294, 0.001265578, 0.0018626356, 0.0025865504, 0.0019152023, 0.0027284475, 0.0031230506, 0.0026063655, 0.0022076346, 0.0031534104, 0.0022533534, 0.002360121, 0.0023081289, 0.0015604217, 0.00028087266, 0.0012829569, 0.0025858152, 0.0024347331, 0.0024768574, 0.0019402217, 0.0019329428, 0.0017125467, 0.0021164292, 0.0023189209, 0.0022441678, 0.002281207, 0.0019270001, 0.0019101536, 0.0019457384, 0.0020941367, 0.0021620486, 0.0022751852, 0.002181841, 0.0021200512, 0.0021993275, 0.0022301065, 0.0022912639, 0.0023209664, 0.0023138248, 0.0022012276, 0.0022802624, 0.0023726213, 0.0023012339, 0.0023521343, 0.0023377394, 0.002329234, 0.0023337045, 0.0023899119, 0.0023956238, 0.0023943337, 0.0024504968, 0.0024591743, 0.002379553, 0.0023931324, 0.0024138623, 0.0024429628, 0.0024506776, 0.0024294081, 0.0025010581, 0.0024492333, 0.0024117822, 0.0025161464, 0.0024681916, 0.0024792035, 0.0025135702, 0.002509866, 0.0024992894, 0.0023943188, 0.0024773506, 0.0025059016, 0.0024466945, 0.0025561351, 0.0024834416, 0.0024270383, 0.0025362142, 0.0024925992, 0.0025092834, 0.0025545123, 0.0024576699, 0.0024201599, 0.0024324636, 0.002444449, 0.0024545475, 0.0024346217, 0.0024273692, 0.0024091401, 0.0024106196, 0.0024468292, 0.0024578748, 0.0025000462, 0.0025032307, 0.0024541375, 0.0024677904, 0.0024722175, 0.0024659798, 0.0024948565, 0.0024845532, 0.0024656299, 0.0024793853, 0.0024802626, 0.0024924863, 0.0024986545, 0.0025015132, 0.0024999871, 0.0024926892, 0.002497768, 0.0024802209, 0.0024757889, 0.0024738991, 0.0024496608, 0.0024471857, 0.0024370001, 0.0024280072, 0.0024337007, 0.0024232517, 0.0024193624, 0.0024188729, 0.0024099797, 0.0024108243, 0.0024010682, 0.0023983161, 0.0023935951, 0.0023798536, 0.0023811779, 0.0023638962, 0.0023584906, 0.0023653113, 0.0023514024, 0.0023506768, 0.002346809, 0.0023374804, 0.0023433229, 0.002335763, 0.0023318705, 0.0023264555, 0.002316075, 0.0023173819, 0.0023068362, 0.0023026365, 0.0023019171, 0.0022877156, 0.0022910339, 0.0022854109, 0.0022738959, 0.0022733597, 0.0022602595, 0.0022586726, 0.0022559675, 0.0022442002, 0.002240857, 0.0022253136, 0.0022201978, 0.0022185263, 0.0022005082, 0.0021990985, 0.0021900658, 0.0021771229, 0.0021779418, 0.0021645466, 0.0021572173, 0.0021508015, 0.0021399013, 0.0021412745, 0.0021259733, 0.002116817, 0.002115298, 0.0021022752, 0.0021016962, 0.0020932519, 0.0020825594, 0.002081538, 0.0020692666, 0.0020663853, 0.0020613294, 0.0020515068, 0.0020524276, 0.0020412507, 0.0020334773, 0.0020275079, 0.0020184131, 0.0020162555, 0.0020037346, 0.0019976744, 0.0019928761, 0.0019750451, 0.0019736669, 0.0019652988, 0.0019522491, 0.0019495258, 0.0019341785, 0.0019279217, 0.0019206054, 0.0019060989, 0.0019051637, 0.0018904792, 0.0018807618, 0.0018779237, 0.0018601919, 0.0018578088, 0.0018488808, 0.0018353839, 0.0018325771, 0.0018178601, 0.0018132888, 0.0018066897, 0.0017923985, 0.001791381, 0.0017780474, 0.0017700043, 0.0017673612, 0.0017524239, 0.0017501613, 0.0017394455, 0.0017276664, 0.0017270026, 0.0017126261, 0.0017079723, 0.0017010197, 0.0016870315, 0.0016859443, 0.0016727244, 0.0016656708, 0.001661932, 0.0016466513, 0.0016445389, 0.0016333183, 0.0016223732, 0.0016213635, 0.0016064604, 0.0016017837, 0.0015940824, 0.001580486, 0.0015792676, 0.0015656264, 0.0015588572, 0.0015541604, 0.0015389375, 0.0015372586, 0.001525836, 0.0015157399, 0.0015137158, 0.0014985183, 0.0014950168, 0.001486801, 0.0014739018, 0.0014729755, 0.001458909, 0.0014526821, 0.0014479139, 0.0014332436, 0.0014318913, 0.0014202454, 0.0014109932, 0.0014086943, 0.0013935839, 0.0013909494, 0.0013824579, 0.0013702119, 0.0013694038, 0.0013553578, 0.0013499712, 0.0013449543, 0.001331045, 0.0013301002, 0.0013183484, 0.0013100663, 0.0013074225, 0.0012931439, 0.0012909019, 0.0012825466, 0.0012704581, 0.0012711589, 0.0012547963, 0.0012541793, 0.0012432118, 0.001260351, 0.0012651742, 0.0011898277, 0.0012121985, 0.0011467912, 0.001190836, 0.0012960485, 0.0012957851, 0.00137487, 0.0013533976, 0.0013261806, 0.0012895107, 0.0012720223, 0.0012509781, 0.0012517398, 0.0012316866, 0.0012200168, 0.0012147902, 0.0012115598, 0.0011884508, 0.0011828257, 0.0011572048, 0.001152301, 0.0011577943, 0.0011595037, 0.0011610896, 0.0011592228, 0.0011544405, 0.001145801, 0.0011302032, 0.0011103414, 0.0010884807, 0.0010624005, 0.0010437097, 0.0010316636, 0.0010250325, 0.0010146388, 0.0010063865, 0.00099888219, 0.00099232371, 0.00098659229, 0.00098013715, 0.00097178101, 0.00096331966, 0.00095429316, 0.00094382654, 0.0009352253, 0.000928641, 0.00092058906, 0.00091184622, 0.00090372161, 0.00089591584, 0.00089065344, 0.00088376279, 0.00087615295, 0.00086932036, 0.0008604701, 0.00085405582, 0.00084575095, 0.00083930525, 0.00083122509, 0.00082305679, 0.00081547156, 0.00080905689, 0.00080592979, 0.00079543327, 0.00078491522, 0.00078376031, 0.0007756691, 0.00077368799, 0.00077327282, 0.00076556101, 0.00075145489, 0.00074082488, 0.00073907934, 0.00072966698, 0.00070942925, 0.00069919749, 0.0006867929, 0.00067751247, 0.00067955473, 0.00067219669, 0.00066383089, 0.00065863181, 0.00065346753, 0.00065020049, 0.00064618855, 0.00064087363, 0.00063238562, 0.00062573618, 0.00061997955, 0.00061362004, 0.00060894745, 0.00060553288, 0.00060170954, 0.00059567854, 0.00058975548, 0.00058542346, 0.00058062076, 0.00057298977, 0.00056428224, 0.00055498824, 0.00054558277, 0.00053744366, 0.00053149546, 0.00052403183, 0.00051707499, 0.00051189146, 0.00050656558, 0.00050090136, 0.00049627311, 0.00049104949, 0.00048623429, 0.00048118162, 0.00047532785, 0.00046889154, 0.00046317813, 0.00045773227, 0.00045237058, 0.0004466226, 0.00044135139, 0.00043641006, 0.00043250529, 0.00042879763, 0.00042465621, 0.00042055884, 0.00041652026, 0.00041218941, 0.00040826413, 0.00040395274, 0.00039951655, 0.00039525394, 0.00039078628, 0.00038639563, 0.00038227564, 0.00037828917, 0.00037441069, 0.00037022621, 0.00036604239, 0.00036207505, 0.0003578722, 0.00035394471, 0.00034969687, 0.00034539505, 0.0003412672, 0.00033708113, 0.00033309664, 0.00032914256, 0.00032521773, 0.00032150832, 0.00031779163, 0.00031413383, 0.00031048266, 0.00030680773, 0.00030341003, 0.00030003638, 0.00029674968, 0.00029367275, 0.00029049759, 0.00028744553, 0.00028444402, 0.00028136304, 0.00027806757, 0.00027467924, 0.00027143576, 0.00026800854, 0.00026475314, 0.00026150194, 0.00025813242, 0.00025484846, 0.00025180255, 0.00024899565, 0.00024608272, 0.00024285408, 0.00023978163, 0.00023673459, 0.00023331418, 0.00022963275, 0.0002257992, 0.00022234468, 0.00021914099, 0.00021570684, 0.00021224273, 0.00020869845, 0.00020556199, 0.00020309383, 0.00020029842, 0.00019717804, 0.00019456944, 0.00019195216, 0.00018957534, 0.00018729103, 0.00018468716, 0.00018187886, 0.00017913337, 0.0001767945, 0.00017444766, 0.00017188919, 0.00016952782, 0.00016730299, 0.00016499683, 0.00016290001, 0.00016089583, 0.0001587657, 0.00015662962, 0.00015466079, 0.0001525357, 0.00015044904, 0.00014833481, 0.00014602587, 0.00014348439, 0.0001412355, 0.00013927063, 0.00013732575, 0.00013536514, 0.00013331278, 0.00013127103, 0.00012920522, 0.00012725748, 0.00012537265, 0.00012348115, 0.00012161244, 0.00011968064, 0.00011775736, 0.00011587425, 0.00011402996, 0.00011222746, 0.00011047156, 0.00010869748, 0.00010694134, 0.00010521547, 0.00010350794, 0.00010184013, 0.00010019222, 9.8557534e-05, 9.6916422e-05, 9.5311094e-05, 9.3737256e-05, 9.2167319e-05, 9.0626551e-05, 8.9097008e-05, 8.7580795e-05, 8.6084446e-05, 8.4610097e-05, 8.3161151e-05, 8.1725966e-05, 8.0316477e-05, 7.892995e-05, 7.7528984e-05, 7.6151177e-05, 7.4799664e-05, 7.3461694e-05, 7.2146308e-05, 7.0841689e-05, 6.9558749e-05, 6.82868e-05, 6.7019597e-05, 6.5789212e-05, 6.4566799e-05, 6.3354135e-05, 6.216748e-05, 6.0995697e-05, 5.9826548e-05, 5.8656867e-05, 5.7517682e-05, 5.6391344e-05, 5.5275024e-05, 5.4191468e-05, 5.3104781e-05, 5.202328e-05, 5.097535e-05, 4.9930884e-05, 4.8906517e-05, 4.7901965e-05, 4.6887109e-05, 4.5878057e-05, 4.488247e-05, 4.3901135e-05, 4.2938161e-05, 4.1980499e-05, 4.1033143e-05, 4.0097034e-05, 3.916836e-05, 3.8263505e-05, 3.7376392e-05, 3.6508509e-05, 3.5654459e-05, 3.4799873e-05, 3.3958385e-05, 3.3132592e-05, 3.2315845e-05, 3.1518549e-05, 3.0730051e-05, 2.9946272e-05, 2.9178726e-05, 2.8422964e-05, 2.7681325e-05, 2.6953193e-05, 2.62361e-05, 2.5528081e-05, 2.4829963e-05, 2.4143857e-05, 2.3464886e-05, 2.2794801e-05, 2.2134406e-05, 2.1477402e-05, 2.0830966e-05, 2.019298e-05, 1.9562312e-05, 1.8944459e-05, 1.8332188e-05, 1.7728731e-05, 1.7137224e-05, 1.655181e-05, 1.5977265e-05, 1.5410854e-05, 1.4850332e-05, 1.4300358e-05, 1.3756461e-05, 1.3221478e-05, 1.2693428e-05, 1.2171671e-05, 1.1660745e-05, 1.115659e-05, 1.0660526e-05, 1.0173886e-05, 9.6936033e-06, 9.2226845e-06, 8.7595274e-06, 8.3036173e-06, 7.8561784e-06, 7.414669e-06, 6.9817113e-06, 6.5547767e-06, 6.1347073e-06, 5.7237002e-06, 5.3179345e-06, 4.9207513e-06, 4.5308335e-06, 4.1452405e-06, 3.7681377e-06, 3.3965984e-06, 3.0319377e-06, 2.6755198e-06, 2.322879e-06, 1.9769963e-06, 1.6361625e-06, 1.3011104e-06, 9.7374029e-07, 6.4954342e-07, 3.3154137e-07, 1.9555108e-08, -2.8850005e-07, -5.8860957e-07, -8.8453573e-07, -1.1758724e-06, -1.4609756e-06, -1.7420382e-06, -2.0155012e-06, -2.2851187e-06, -2.5506943e-06, -2.8093978e-06, -3.0646216e-06, -3.3135098e-06, -3.5566563e-06, -3.7963791e-06, -4.0294944e-06, -4.2588645e-06, -4.48314e-06, -4.7011579e-06, -4.9152947e-06, -5.1229738e-06, -5.3266195e-06, -5.5266958e-06, -5.7215527e-06, -5.9119823e-06, -6.097324e-06, -6.2789952e-06, -6.4566069e-06, -6.6295672e-06, -6.8005867e-06, -6.9661368e-06, -7.1275151e-06, -7.2866647e-06, -7.4406839e-06, -7.5927009e-06, -7.7408537e-06, -7.8845557e-06, -8.0264568e-06, -8.1632978e-06, -8.2977973e-06, -8.4301417e-06, -8.5568669e-06, -8.6824851e-06, -8.8041358e-06, -8.9217352e-06, -9.0381256e-06, -9.150212e-06, -9.2597435e-06, -9.3660792e-06, -9.4686523e-06, -9.5693644e-06, -9.6663171e-06, -9.7606456e-06, -9.852218e-06, -9.9398596e-06, -1.0025643e-05, -1.0107832e-05, -1.0188117e-05, -1.0265668e-05, -1.0339241e-05, -1.0411657e-05, -1.0480168e-05, -1.0546331e-05, -1.0611318e-05, -1.0671897e-05, -1.0731203e-05, -1.0787938e-05, -1.0840991e-05, -1.089383e-05, -1.0942747e-05, -1.098984e-05, -1.1035688e-05, -1.1077302e-05, -1.111831e-05, -1.1157191e-05, -1.1192876e-05, -1.122799e-05, -1.126004e-05, -1.1290234e-05, -1.1318981e-05, -1.1345133e-05, -1.1370284e-05, -1.139272e-05, -1.1413761e-05, -1.1433097e-05, -1.1450233e-05, -1.1466382e-05, -1.1479952e-05, -1.1492275e-05, -1.1503153e-05, -1.1511377e-05, -1.1519723e-05, -1.1525182e-05, -1.1528944e-05, -1.1532651e-05, -1.153272e-05, -1.1532863e-05, -1.153163e-05, -1.1527603e-05, -1.1528536e-05, -1.152206e-05, -1.1511412e-05, -1.1510731e-05, -1.1484279e-05, -1.1502042e-05, -1.1444652e-05, -1.1496561e-05, -1.1401e-05, -1.1300933e-05];

	return l_hrir_1;
}

// IRC_1147, COMPENSATED, 44.1 kHz
// right ear, navigation = [-30 , 0]
function getRightTestBuffer() {

	var r_hrir_1 = [0.00012968447, -4.4833788e-05, 8.5615178e-05, 5.2901694e-05, -6.6440116e-06, 0.00023888806, -2.8313273e-05, -4.2645389e-06, 0.00012126938, -2.1980022e-05, -2.1957093e-06, 0.00011809272, 2.6500596e-05, 7.0864197e-05, 0.00011691406, -0.00026727003, 0.00038585979, -0.00087029932, 0.0010163673, -0.0016523712, 0.0023054694, -0.0029419215, 0.02964541, 0.0060411226, -0.06344479, 0.027112967, -0.0080826665, -0.019840752, 0.11743281, 0.042333728, 0.034297803, 0.094531388, 0.037250009, -0.0037743261, -0.0094662558, 0.0074441826, -0.002948507, -0.036766379, -0.0034563663, 0.016807154, -0.014027366, 0.0035911231, 0.0018989791, 0.013578715, 0.014343985, 0.010805275, 0.0017550988, 0.0074502748, 0.0035782603, -0.006502539, 0.0055554395, -0.0051867008, -0.0077680597, -0.00063252901, -0.0098461853, -0.011175415, -0.0053015536, -0.0081243965, -0.012826758, -0.021176968, -0.020040944, -0.008780459, -0.007149576, -0.0023101265, -0.0079937236, -0.0048443179, -0.0068382159, -0.0078493971, -0.0023994799, -0.0061057738, -0.0073136081, -0.0023773567, -0.0059973386, -0.0054297321, -0.001735636, -0.0052404751, -0.00048804818, -0.0022025927, -0.00099874898, 0.0064416961, -0.013730736, -0.0047333692, 0.0062401785, -0.0058429281, 0.0010514925, -0.002056349, -0.0030489554, -0.011757925, -0.0052199476, -0.0095679235, 0.0071277114, -0.019357755, -0.022061019, -0.0017161931, -0.0093587057, -0.0079322517, 0.009942682, -0.01321086, -0.0052761264, 0.00072435802, -0.0027481885, -7.5230251e-05, -0.00022060311, -0.014667933, -0.0030626816, -0.0026752634, -0.012888399, -0.018657888, -0.011077874, -0.016408245, -0.0095450282, -0.0046633224, -0.0055801768, -0.0083926211, -0.0031749941, -0.0054011488, -0.0030097948, -0.0023267575, 7.9327681e-05, -0.0015963236, -0.00097387318, 6.2268467e-05, -0.00040731921, 0.00036794444, 0.0016603111, 0.00086353469, -0.0005586378, -0.0033754013, -0.0021049967, -0.00073923132, 0.0012426978, 0.00048173329, -0.0013443229, -0.0032725884, -0.0019374721, 0.00055878145, 0.00010709605, -0.0023751592, -0.0031964437, -0.003138411, -0.003779512, -0.0023188085, -0.0027534361, -0.0032227256, -0.0027060221, -0.0009767624, -0.00029449009, -0.0015156205, -0.0016212052, -0.00083772424, -0.00051142355, -0.00087454151, -0.00082778176, -0.00087696032, -0.0005240417, -0.0010908106, -0.00060439314, 0.00049582734, -0.00022234685, -0.001076809, -0.0011043286, 0.00010021065, 0.0003510776, 0.00054787386, -0.00015454513, -0.00027695372, 0.00059145676, -0.00092269794, 0.00038142433, 0.0026431155, 0.0017825192, -0.0016865821, 0.00040997076, 0.00031288566, 0.0011209374, -0.00056213687, -0.0021413163, -0.00048407112, 0.0015524018, 0.00099149104, -0.0015391124, 2.3607917e-05, 0.00063025081, 0.0020399874, 0.0011285819, -0.00023675074, -0.0013372991, 0.0011111901, 0.00058305655, -0.00095981433, -0.0024444119, -0.0022328691, -0.0020971316, -0.0020945863, -0.0012388034, -0.0005692108, -0.0014941334, -0.0013966204, 0.00038663071, -6.5744303e-05, -0.0002194957, 0.00036541771, -0.00078601483, -0.00069451153, 0.0003469499, 0.00075997592, 7.4945015e-05, 0.00098961018, 0.001622136, 0.0011897596, 0.0016066994, 0.0018443016, 0.0010589289, 0.00090713392, 0.00090913781, 0.00099631402, 0.00069363213, 0.0007172969, 0.00069799042, 0.00065530833, 0.00044603324, 0.00023525355, 0.00082289652, 0.00083974303, 0.00072033696, 0.0010272059, 0.000694426, 0.00061945878, 0.00072450046, 0.00067908585, 0.00087421185, 0.00067820348, 0.00061537406, 0.00056530067, 0.00060326247, 0.00061357627, 0.00058757944, 0.00066320578, 0.00066578856, 0.0006869487, 0.00073921523, 0.00079197216, 0.00084638441, 0.00096455355, 0.00096418034, 0.00095147682, 0.0010188184, 0.0010686564, 0.0011374242, 0.0011457252, 0.0012067451, 0.0012186938, 0.0012421307, 0.0012696035, 0.0012774542, 0.0012976373, 0.0013118302, 0.0012846557, 0.0012700042, 0.0012938418, 0.0012889062, 0.0013061971, 0.0013155606, 0.0013232455, 0.0013150025, 0.0013273987, 0.0013581082, 0.0013455696, 0.0013849935, 0.0014073932, 0.0013834305, 0.0013974272, 0.0014054978, 0.001392369, 0.0014238558, 0.0014348065, 0.0014331656, 0.0014592002, 0.001429469, 0.0014245059, 0.0014917667, 0.0014767126, 0.0014466019, 0.0014673353, 0.0014431901, 0.0014458889, 0.0014635539, 0.0014462352, 0.0014721369, 0.0014880508, 0.0014736709, 0.0014981523, 0.0015268875, 0.0015316907, 0.0015510023, 0.001574997, 0.0015802422, 0.0015923924, 0.0016238457, 0.0016247143, 0.0016264677, 0.0016500061, 0.0016575305, 0.001662676, 0.0016788868, 0.0016853736, 0.0016765222, 0.0016853522, 0.0016938253, 0.0016920553, 0.0016955402, 0.0016963586, 0.0016859962, 0.0016794113, 0.0016723978, 0.0016749097, 0.0016734549, 0.0016646565, 0.0016590366, 0.0016597643, 0.0016601148, 0.0016602048, 0.0016601534, 0.0016631011, 0.001663515, 0.0016633881, 0.0016665934, 0.001669197, 0.0016774124, 0.0016837142, 0.0016842757, 0.0016877638, 0.0016939821, 0.0016994184, 0.001704174, 0.0017107124, 0.0017185124, 0.0017214578, 0.0017231655, 0.0017248615, 0.0017275463, 0.0017321063, 0.0017319864, 0.001728176, 0.0017290723, 0.001726488, 0.001726774, 0.0017281492, 0.0017259034, 0.0017235558, 0.0017225531, 0.0017206711, 0.0017192281, 0.0017192947, 0.0017164425, 0.0017155723, 0.0017187522, 0.0017162077, 0.0017077174, 0.0017105726, 0.0017124353, 0.0017108461, 0.0017082778, 0.0017029993, 0.001701386, 0.0017012992, 0.0016966711, 0.001694226, 0.0016932734, 0.001689505, 0.0016867262, 0.001684639, 0.0016828094, 0.0016824862, 0.0016824416, 0.0016792258, 0.0016755921, 0.0016750747, 0.0016737919, 0.0016706676, 0.0016711408, 0.001671641, 0.001669541, 0.0016663534, 0.0016652009, 0.0016671451, 0.0016648808, 0.0016614346, 0.0016610357, 0.0016564142, 0.0016528732, 0.0016520689, 0.0016475924, 0.0016431885, 0.0016403089, 0.0016362902, 0.0016310136, 0.0016278932, 0.0016257612, 0.0016203349, 0.0016152911, 0.0016118715, 0.0016073313, 0.0016030659, 0.0015986747, 0.0015933165, 0.0015895632, 0.001584777, 0.0015796373, 0.0015765975, 0.0015718899, 0.0015669377, 0.0015633044, 0.0015585903, 0.001554603, 0.0015505579, 0.0015465482, 0.0015428877, 0.0015381819, 0.0015346206, 0.001530824, 0.0015269124, 0.0015239447, 0.0015195987, 0.0015159148, 0.0015124543, 0.0015083753, 0.0015050984, 0.0015010558, 0.0014971819, 0.001493347, 0.0014887044, 0.001484724, 0.0014803579, 0.0014760734, 0.0014717858, 0.0014666051, 0.0014623749, 0.0014575611, 0.0014525443, 0.0014484185, 0.0014431992, 0.0014385824, 0.0014340053, 0.0014286917, 0.0014243781, 0.0014194645, 0.0014146681, 0.0014103174, 0.0014051177, 0.0014007867, 0.0013960355, 0.0013911306, 0.0013871143, 0.0013820917, 0.0013777034, 0.0013732681, 0.0013682012, 0.0013641619, 0.0013593904, 0.0013547699, 0.0013505959, 0.0013456026, 0.0013413429, 0.0013367484, 0.0013320703, 0.0013279857, 0.0013232181, 0.0013190107, 0.001314463, 0.0013097356, 0.0013058519, 0.0013010446, 0.0012967476, 0.0012925999, 0.0012876908, 0.0012837795, 0.0012791685, 0.0012746597, 0.0012708011, 0.0012658884, 0.0012617699, 0.0012575065, 0.0012527556, 0.0012488655, 0.0012441726, 0.0012397652, 0.0012356095, 0.0012307267, 0.001226769, 0.0012220057, 0.0012176242, 0.001213742, 0.0012124143, 0.0012074452, 0.0011971156, 0.0011951736, 0.001189256, 0.0011852494, 0.0011937217, 0.0011946776, 0.001195935, 0.001202345, 0.001202101, 0.0011973804, 0.0011921972, 0.0011886733, 0.0011833686, 0.001175074, 0.0011707554, 0.001167823, 0.0011622943, 0.0011582985, 0.0011544876, 0.0011518865, 0.0011493143, 0.0011462351, 0.0011422655, 0.0011387751, 0.0011347149, 0.0011297663, 0.0011258477, 0.0011207866, 0.0011155495, 0.0011108386, 0.0011051477, 0.0010993477, 0.0010942124, 0.001088599, 0.0010823677, 0.0010752187, 0.0010683608, 0.0010626757, 0.0010574017, 0.0010524184, 0.0010469693, 0.0010418095, 0.0010363114, 0.001030947, 0.0010260291, 0.0010206907, 0.0010153807, 0.0010104217, 0.001005132, 0.0010000609, 0.0009951667, 0.00099010484, 0.00098554187, 0.00098062861, 0.00097624493, 0.00097210414, 0.00096603669, 0.00096123183, 0.00095712158, 0.00095211179, 0.00094763708, 0.000942872, 0.00093784114, 0.00093202446, 0.00092668947, 0.00092138784, 0.00091725714, 0.00091029231, 0.00090345699, 0.00089853564, 0.00089283046, 0.00088775093, 0.00088399884, 0.00087807413, 0.00087303247, 0.00086855006, 0.00086375685, 0.00085936393, 0.00085453323, 0.00084852814, 0.00084367115, 0.00083871297, 0.00083252788, 0.0008259946, 0.00081998583, 0.00081365626, 0.00080813276, 0.00080309055, 0.00079792392, 0.00079265161, 0.00078779632, 0.00078283065, 0.00077811576, 0.00077350782, 0.00076919383, 0.00076470019, 0.00076030412, 0.00075604884, 0.00075171767, 0.00074753595, 0.00074352061, 0.00073937133, 0.00073505314, 0.00073048249, 0.00072601349, 0.00072178833, 0.00071778192, 0.00071366474, 0.00070934348, 0.00070483403, 0.00070050811, 0.0006964801, 0.00069237485, 0.00068798633, 0.00068355492, 0.00067907319, 0.00067457917, 0.00067028375, 0.00066589849, 0.00066150117, 0.00065722842, 0.0006530973, 0.00064908157, 0.00064495545, 0.0006408145, 0.00063680572, 0.00063281742, 0.00062879181, 0.00062482539, 0.00062084226, 0.00061691144, 0.00061295354, 0.00060904914, 0.00060527795, 0.00060145801, 0.00059752487, 0.00059364015, 0.00058991089, 0.00058618791, 0.00058252286, 0.00057879214, 0.0005750773, 0.00057143506, 0.00056767413, 0.00056408052, 0.00056077747, 0.00055729632, 0.00055352011, 0.00054997564, 0.00054641851, 0.00054295684, 0.00053931331, 0.00053551895, 0.00053195492, 0.00052863606, 0.00052517081, 0.00052153565, 0.00051806077, 0.00051469329, 0.00051148616, 0.00050816332, 0.00050466961, 0.00050115617, 0.00049787153, 0.00049453044, 0.00049103215, 0.0004873464, 0.00048372139, 0.00048013208, 0.00047655406, 0.00047310396, 0.00046973281, 0.0004662385, 0.00046284334, 0.00045962747, 0.00045637374, 0.0004531491, 0.00044995436, 0.00044665298, 0.00044342175, 0.00044029465, 0.00043722386, 0.00043412649, 0.00043111871, 0.00042820065, 0.00042527698, 0.0004223964, 0.0004195497, 0.00041663902, 0.00041369662, 0.0004107952, 0.00040790928, 0.00040499581, 0.0004021129, 0.00039922476, 0.00039633879, 0.00039346665, 0.00039057125, 0.00038775961, 0.00038497593, 0.0003821672, 0.00037941674, 0.00037665518, 0.00037388251, 0.00037114418, 0.00036842017, 0.00036570402, 0.00036300561, 0.00036030492, 0.00035760887, 0.00035494213, 0.00035227235, 0.00034961568, 0.00034700292, 0.00034437986, 0.0003417836, 0.00033921813, 0.00033664253, 0.00033410688, 0.00033160594, 0.0003291026, 0.00032662405, 0.00032416444, 0.0003217087, 0.00031929489, 0.00031688918, 0.00031450056, 0.00031213764, 0.00030977467, 0.00030742997, 0.00030512027, 0.00030280236, 0.00030050895, 0.00029823527, 0.00029594522, 0.0002936886, 0.00029145057, 0.00028921501, 0.00028700329, 0.00028480171, 0.00028259936, 0.00028043082, 0.00027826905, 0.00027611871, 0.00027399472, 0.00027186925, 0.00026975794, 0.00026767713, 0.00026558941, 0.00026352268, 0.00026148016, 0.00025942513, 0.00025740035, 0.00025539348, 0.00025338586, 0.00025139981, 0.00024942823, 0.00024745722, 0.00024551216, 0.00024357175, 0.00024164119, 0.00023973128, 0.00023781952, 0.00023592309, 0.00023405476, 0.00023218314, 0.00023033034, 0.00022849847, 0.00022666017, 0.00022484975, 0.00022305538, 0.00022126774, 0.00021949982, 0.00021774036, 0.00021598884, 0.00021426317, 0.00021254069, 0.00021083331, 0.00020914501, 0.00020745475, 0.00020578273, 0.00020413285, 0.00020247995, 0.00020084592, 0.00019922805, 0.00019760386, 0.00019600417, 0.00019441597, 0.00019283158, 0.00019126355, 0.00018970019, 0.00018814285, 0.00018660839, 0.00018507457, 0.00018355261, 0.00018204726, 0.00018053906, 0.000179047, 0.00017757352, 0.00017609967, 0.00017464214, 0.0001731975, 0.00017174969, 0.00017032394, 0.00016890892, 0.00016750044, 0.00016610763, 0.00016471978, 0.00016333948, 0.00016198053, 0.0001606235, 0.0001592795, 0.00015795133, 0.00015662102, 0.00015530638, 0.00015400796, 0.00015271057, 0.00015142833, 0.00015015699, 0.00014888377, 0.00014762993, 0.00014638409, 0.00014514453, 0.00014391918, 0.0001426972, 0.00014148229, 0.00014028576, 0.00013908976, 0.00013790545, 0.00013673453, 0.00013556092, 0.00013440209, 0.00013325716, 0.00013211343, 0.00013098211, 0.00012986029, 0.00012873877, 0.00012763427, 0.00012653632, 0.00012544427, 0.00012436466, 0.00012328797, 0.00012221837, 0.00012116492, 0.00012011182, 0.00011906946, 0.00011803888, 0.00011700592, 0.00011598665, 0.00011497902, 0.00011397367, 0.00011297976, 0.00011199329, 0.00011100798, 0.00011003781, 0.00010907316, 0.00010811505, 0.00010716834, 0.00010622381, 0.0001052866, 0.00010436392, 0.00010344163, 0.00010252967, 0.00010162818, 0.00010072465, 9.9833587e-05, 9.8952038e-05, 9.8073177e-05, 9.720437e-05, 9.6341608e-05, 9.5480631e-05, 9.4632666e-05, 9.3788986e-05, 9.2951352e-05, 9.2123497e-05, 9.1297042e-05, 9.0477523e-05, 8.9670463e-05, 8.8862948e-05, 8.8064769e-05, 8.7275711e-05, 8.6484342e-05, 8.5704505e-05, 8.4932515e-05, 8.4163072e-05, 8.3402678e-05, 8.2647239e-05, 8.1893933e-05, 8.1152152e-05, 8.0413887e-05, 7.9681333e-05, 7.8957317e-05, 7.823448e-05, 7.7518487e-05, 7.6812958e-05, 7.6107688e-05, 7.541077e-05, 7.4721987e-05, 7.4031368e-05, 7.33513e-05, 7.2677937e-05, 7.2007493e-05, 7.1344966e-05, 7.0686699e-05, 7.0031075e-05, 6.9385528e-05, 6.8742952e-05, 6.8105745e-05, 6.7476069e-05, 6.6847278e-05, 6.6224915e-05, 6.5611424e-05, 6.4998486e-05, 6.4392835e-05, 6.3793885e-05, 6.3193822e-05, 6.2602985e-05, 6.2017607e-05, 6.1435065e-05, 6.0859425e-05, 6.0287094e-05, 5.9717572e-05, 5.9156751e-05, 5.8598236e-05, 5.8044791e-05, 5.7497848e-05, 5.6951554e-05, 5.641125e-05, 5.587837e-05, 5.5346481e-05, 5.4820933e-05, 5.4301001e-05, 5.3780738e-05, 5.3268445e-05, 5.2760811e-05, 5.2256002e-05, 5.1776413e-05, 5.1280016e-05, 5.0775267e-05, 5.031772e-05, 4.9771142e-05, 4.9407774e-05, 4.8752217e-05, 4.8548765e-05, 4.7756157e-05, 4.6932342e-05];

	return r_hrir_1;
}

//==============================================================================
/**
 * Returns the name of the database for a given IRCAM subject
 * @param {int} subjectNumber
 */
function getDatabaseFromSubjectId(subjectNumber) {

	if (1002 <= subjectNumber && subjectNumber <= 1059) {
		return "LISTEN";
	} else if (1062 <= subjectNumber && subjectNumber <= 1089) {
		return "CROSSMOD";
	} else if (1100 <= subjectNumber && subjectNumber <= 1157) {
		return "BILI";
	} else {
		throw new Error("Not a valid IRCAM human subject id " + subjectNumber);
	}
}

//==============================================================================
/**
 * Returns an audio buffer containing left/right HRIR
 * @param {int} subjectNumber
 * @param {float} samplerate
 * @param {float} azimuth : expressed with navigational (Spat4) convention
 * @param {float} elevation : expressed with navigational (Spat4) convention
 */
function getHrir(subjectNumber, samplerate, azimuth, elevation) {

	var subjectAsString = subjectNumber.toString();

	var positionsType = 'sofaSpherical';

	/// position expressed with Spat navigation system
	/// distance is not relevant; just use 1 meter
	var navigation = [azimuth, elevation, 1];

	/// convert Spat navigation to Sofa coordinates (spherical)
	var sofaCoordinates = [-1 * azimuth, elevation, 1];

	/// create an offline audio context
	var audioContext = new OfflineAudioContext(1, 512, samplerate);

	var hrtfSet = new _binaural2.default.sofa.HrtfSet({
		audioContext: audioContext,
		filterPositions: [sofaCoordinates],
		positionsType: positionsType
	});

	var serverDataBase = new _binaural2.default.sofa.ServerDataBase();

	return serverDataBase.loadCatalogue().then(function () {

		var urls = serverDataBase.getUrls({
			convention: 'HRIR',
			dataBase: 'BILI',
			equalisation: 'COMPENSATED',
			sampleRate: samplerate,
			freePattern: subjectAsString
		});

		return urls;
	}).then(function (urls) {

		if (urls.length <= 0) {
			throw new Error("no url");
		}

		return hrtfSet.load(urls[0]);
	}).then(function () {

		return hrtfSet.nearestFir(sofaCoordinates);
	});
}

//==============================================================================
function testHrtfFromSofaServer() {

	getHrir(1147, 44100, -30, 0).then(function (hrir) {
		var leftHrir = hrir.getChannelData(0);
		var rightHrir = hrir.getChannelData(1);

		var leftExpected = getLeftTestBuffer();
		var rightExpected = getRightTestBuffer();

		var tolerance = 1e-6;

		var leftAreEqual = _utils2.default.arrayAlmostEqual(leftHrir, leftExpected, tolerance);
		if (leftAreEqual === false) {
			new Error("test failed");
		}

		var rightAreEqual = _utils2.default.arrayAlmostEqual(rightHrir, rightExpected, tolerance);
		if (rightAreEqual === false) {
			new Error("test failed");
		}

		debugger;
	});
}

//==============================================================================
var sofatests = {
	getHrir: getHrir,
	testHrtfFromSofaServer: testHrtfFromSofaServer
};

exports.default = sofatests;
},{"../core/utils.js":3,"binaural":48}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testSumDiffNode = testSumDiffNode;

var _sumdiff = require('../dsp/sumdiff.js');

var _sumdiff2 = _interopRequireDefault(_sumdiff);

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testcascade.js
 *   @brief      Misc test functions for M4DPAudioModules.SumDiffNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testSumDiffNode() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 2;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.fillChannel(buffer, 0, 0.2);
    _bufferutils2.default.fillChannel(buffer, 1, 0.7);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var sumDiffNode_ = new M4DPAudioModules.SumDiffNode(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(sumDiffNode_.input);

    /// connect the node to the destination of the audio context
    sumDiffNode_._output.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var sumdifftests = {
    testSumDiffNode: testSumDiffNode
};

exports.default = sumdifftests;
},{"../core/bufferutils.js":1,"../dsp/sumdiff.js":15}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testTransauralShuffler = testTransauralShuffler;

var _transaural = require('../dsp/transaural.js');

var _bufferutils = require('../core/bufferutils.js');

var _bufferutils2 = _interopRequireDefault(_bufferutils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//==============================================================================
/************************************************************************************/
/*!
 *   @file       testtransaural.js
 *   @brief      Misc test functions for M4DPAudioModules.TransauralShufflerNode
 *   @author     Thibaut Carpentier
 *   @date       01/2016
 *
 */
/************************************************************************************/

function testTransauralShuffler() {

    var sampleRate = 44100;
    var bufferSize = 512;
    var numChannels = 2;

    /// create an offline audio context
    var audioContext1 = new OfflineAudioContext(numChannels, bufferSize, sampleRate);

    /// create a test buffer
    var buffer = audioContext1.createBuffer(numChannels, bufferSize, sampleRate);

    /// just a precaution
    _bufferutils2.default.clearBuffer(buffer);
    _bufferutils2.default.makeImpulse(buffer, 1, 0);

    /// create a buffer source
    var bufferSource = audioContext1.createBufferSource();

    /// reference the test buffer with the buffer source
    bufferSource.buffer = buffer;

    /// create a node
    var transauralNode_ = new _transaural.TransauralShufflerNode(audioContext1);

    /// connect the node to the buffer source
    bufferSource.connect(transauralNode_.input);

    /// connect the node to the destination of the audio context
    transauralNode_._output.connect(audioContext1.destination);

    /// prepare the rendering
    var localTime = 0;
    bufferSource.start(localTime);

    /// receive notification when the rendering is completed
    audioContext1.oncomplete = function (output) {

        var buf = output.renderedBuffer;

        var bufUrl = _bufferutils2.default.writeBufferToTextFileWithMatlabFormat(buf);
        console.log("buffer URL :  " + bufUrl);

        debugger;
    };

    /// start rendering
    audioContext1.startRendering();
}

//==============================================================================
var transauraltests = {
    testTransauralShuffler: testTransauralShuffler
};

exports.default = transauraltests;
},{"../core/bufferutils.js":1,"../dsp/transaural.js":16}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BinauralPanner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Multi-source binaural panner.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license BSD-3-Clause
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _templateObject = _taggedTemplateLiteral(['for use with BinauralPannerNode'], ['for use with BinauralPannerNode']);

var _glMatrix = require('gl-matrix');

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _coordinates = require('../geometry/coordinates');

var _HrtfSet = require('../sofa/HrtfSet');

var _HrtfSet2 = _interopRequireDefault(_HrtfSet);

var _Source = require('./Source');

var _Source2 = _interopRequireDefault(_Source);

var _Listener = require('../geometry/Listener');

var _Listener2 = _interopRequireDefault(_Listener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Binaural panner with multiple sources and a listener.
 */

var BinauralPanner = exports.BinauralPanner = function () {

  /**
   * Constructs an HRTF set. Note that the filter positions are applied
   * during the load of an HRTF URL.
   *
   * @see {@link HrtfSet}
   * @see {@link BinauralPanner#loadHrtfSet}
   *
   * @param {Object} options
   * @param {AudioContext} options.audioContext mandatory for the creation
   * of FIR audio buffers
   * @param {CoordinateSystem} [options.coordinateSystem='gl']
   * {@link BinauralPanner#coordinateSystem}
   * @param {Number} [options.sourceCount=1]
   * @param {Array.<coordinates>} [options.sourcePositions=undefined] must
   * be of length options.sourceCount {@link BinauralPanner#sourcePositions}
   * @param {Number} [options.crossfadeDuration] in seconds.
   * @param {HrtfSet} [options.hrtfSet] refer an external HRTF set.
   * {@link BinauralPanner#hrtfSet}
   * @param {CoordinateSystem} [options.filterCoordinateSystem=options.coordinateSystem]
   * {@link BinauralPanner#filterCoordinateSystem}
   * @param {Array.<coordinates>} [options.filterPositions=undefined]
   * array of positions to filter. Use undefined to use all positions from the HRTF set.
   * {@link BinauralPanner#filterPositions}
   * @param {Boolean} [options.filterAfterLoad=false] true to filter after
   * full load of SOFA file
   * @param {Listener} [options.listener] refer an external listener.
   * {@link BinauralPanner#listener}
   * @param {CoordinateSystem} [options.listenerCoordinateSystem=options.coordinateSystem]
   * {@link BinauralPanner#listenerCoordinateSystem}
   * @param {Coordinates} [options.listenerPosition=[0,0,0]]
   * {@link BinauralPanner#listenerPosition}
   * @param {Coordinates} [options.listenerUp=[0,1,0]]
   * {@link BinauralPanner#listenerUp}
   * @param {Coordinates} [options.listenerView=[0,0,-1]]
   * {@link BinauralPanner#listenerView}
   * @param {Boolean} [options.listenerViewIsRelative=false]
   * {@link Listener#viewIsRelative}
    */

  function BinauralPanner() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BinauralPanner);

    this._audioContext = options.audioContext;

    this.coordinateSystem = options.coordinateSystem;

    var sourceCount = typeof options.sourceCount !== 'undefined' ? options.sourceCount : 1;
    // allocate first
    this._listener = typeof options.listener !== 'undefined' ? options.listener : new _Listener2.default();

    // set coordinate system, that defaults to BinauralPanner's own system
    this.listenerCoordinateSystem = options.listenerCoordinateSystem;

    // use setters for internal or external listener
    this.listenerPosition = typeof options.listenerPosition !== 'undefined' ? options.listenerPosition : (0, _coordinates.glToSystem)([], [0, 0, 0], this._listener.coordinateSystem);

    this.listenerView = typeof options.listenerView !== 'undefined' ? options.listenerView : (0, _coordinates.glToSystem)([], [0, 0, -1], this._listener.coordinateSystem);
    // undefined is fine
    this.listenerViewIsRelative = options.listenerViewIsRelative;

    this.listenerUp = typeof options.listenerUp !== 'undefined' ? options.listenerUp : (0, _coordinates.glToSystem)([], [0, 1, 0], this._listener.coordinateSystem);

    this._sourcesOutdated = new Array(sourceCount).fill(true);

    this._sources = this._sourcesOutdated.map(function () {
      return new _Source2.default({
        audioContext: _this._audioContext,
        crossfadeDuration: options.crossfadeDuration
      });
    });

    this._sourcePositionsAbsolute = this._sourcesOutdated.map(function () {
      return [0, 0, 1]; // allocation and default value
    });

    this._sourcePositionsRelative = this._sourcesOutdated.map(function () {
      return [0, 0, 1]; // allocation and default value
    });

    this.hrtfSet = typeof options.hrtfSet !== 'undefined' ? options.hrtfSet : new _HrtfSet2.default({
      audioContext: this._audioContext,
      coordinateSystem: 'gl'
    });

    this.filterCoordinateSystem = options.filterCoordinateSystem;
    this.filterPositions = options.filterPositions;
    this.filterAfterLoad = options.filterAfterLoad;

    if (typeof options.sourcePositions !== 'undefined') {
      this.sourcePositions = options.sourcePositions;
    }

    this.update();
  }

  // ----------- accessors

  /**
   * Set coordinate system.
   *
   * @param {CoordinateSystem} [system='gl']
   */


  _createClass(BinauralPanner, [{
    key: 'setSourcePositionByIndex',


    /**
     * Set the position of one source. It will update the corresponding
     * relative position after a call to the update method.
     *
     * @see {@link BinauralPanner#update}
     *
     * @param {Number} index
     * @param {Coordinates} positionRequest
     * @returns {this}
     */
    value: function setSourcePositionByIndex(index, positionRequest) {
      this._sourcesOutdated[index] = true;
      (0, _coordinates.systemToGl)(this._sourcePositionsAbsolute[index], positionRequest, this.coordinateSystem);

      return this;
    }

    /**
     * Get the position of one source.
     *
     * @param {Number} index
     * @returns {Coordinates}
     */

  }, {
    key: 'getSourcePositionByIndex',
    value: function getSourcePositionByIndex(index) {
      return (0, _coordinates.glToSystem)([], this._sourcePositionsAbsolute[index], this.coordinateSystem);
    }

    // ----------- public methods

    /**
     * Load an HRTF set form an URL, and update sources.
     *
     * @see {@link HrtfSet#load}
     *
     * @param {String} sourceUrl
     * @returns {Promise.<this|Error>} resolve when URL successfully
     * loaded.
     */

  }, {
    key: 'loadHrtfSet',
    value: function loadHrtfSet(sourceUrl) {
      var _this2 = this;

      return this._hrtfSet.load(sourceUrl).then(function () {
        _this2._sourcesOutdated.fill(true);
        _this2.update();
        return _this2;
      });
    }

    /**
     * Connect the input of a source.
     *
     * @param {Number} index
     * @param {(AudioNode|Array.<AudioNode>)} nodesToConnect
     * @param {Number} [output=0] output to connect from
     * @param {Number} [input=0] input to connect to
     * @returns {this}
     */

  }, {
    key: 'connectInputByIndex',
    value: function connectInputByIndex(index, nodesToConnect, output, input) {
      this._sources[index].connectInput(nodesToConnect, output, input);

      return this;
    }

    /**
     * Disconnect the input of one source.
     *
     * @param {Number} index
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect disconnect
     * all when undefined.
     * @returns {this}
     */

  }, {
    key: 'disconnectInputByIndex',
    value: function disconnectInputByIndex(index, nodesToDisconnect) {
      this._sources[index].disconnectInput(nodesToDisconnect);

      return this;
    }

    /**
     * Disconnect the input of each source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect disconnect
     * all when undefined.
     * @returns {this}
     */

  }, {
    key: 'disconnectInputs',
    value: function disconnectInputs(nodesToDisconnect) {
      var nodes = Array.isArray(nodesToDisconnect) ? nodesToDisconnect : [nodesToDisconnect]; // make array

      this._sources.forEach(function (source, index) {
        source.disconnectInput(nodes[index]);
      });

      return this;
    }

    /**
     * Connect the output of a source.
     *
     * @param {Number} index
     * @param {(AudioNode|Array.<AudioNode>)} nodesToConnect
     * @param {Number} [output=0] output to connect from
     * @param {Number} [input=0] input to connect to
     * @returns {this}
     */

  }, {
    key: 'connectOutputByIndex',
    value: function connectOutputByIndex(index, nodesToConnect, output, input) {
      this._sources[index].connectOutput(nodesToConnect, output, input);

      return this;
    }

    /**
     * Disconnect the output of a source.
     *
     * @param {Number} index
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect disconnect
     * all when undefined.
     * @returns {this}
     */

  }, {
    key: 'disconnectOutputByIndex',
    value: function disconnectOutputByIndex(index, nodesToDisconnect) {
      this._sources[index].disconnectOutput(nodesToDisconnect);

      return this;
    }

    /**
     * Connect the output of each source.
     *
     * @see {@link BinauralPanner#connectOutputByIndex}
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToConnect
     * @param {Number} [output=0] output to connect from
     * @param {Number} [input=0] input to connect to
     * @returns {this}
     */

  }, {
    key: 'connectOutputs',
    value: function connectOutputs(nodesToConnect, output, input) {
      this._sources.forEach(function (source) {
        source.connectOutput(nodesToConnect, output, input);
      });

      return this;
    }

    /**
     * Disconnect the output of each source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect
     * @returns {this}
     */

  }, {
    key: 'disconnectOutputs',
    value: function disconnectOutputs(nodesToDisconnect) {
      this._sources.forEach(function (source) {
        source.disconnectOutput(nodesToDisconnect);
      });

      return this;
    }

    /**
     * Update the sources filters, according to pending changes in listener,
     * and source positions.
     *
     * @returns {Boolean} true when at least a change occurred.
     */

  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      var updated = false;
      if (this._listener.update()) {
        this._sourcesOutdated.fill(true);
        updated = true;
      }

      if (this._hrtfSet.isReady) {
        this._sourcePositionsAbsolute.forEach(function (positionAbsolute, index) {
          if (_this3._sourcesOutdated[index]) {
            _glMatrix2.default.vec3.transformMat4(_this3._sourcePositionsRelative[index], positionAbsolute, _this3._listener.lookAt);

            _this3._sources[index].position = _this3._sourcePositionsRelative[index];

            _this3._sourcesOutdated[index] = false;
            updated = true;
          }
        });
      }

      return updated;
    }
  }, {
    key: 'coordinateSystem',
    set: function set(system) {
      this._coordinateSystem = typeof system !== 'undefined' ? system : 'gl';
    }

    /**
     * Get coordinate system.
     *
     * @returns {CoordinateSystem}
     */
    ,
    get: function get() {
      return this._coordinateSystem;
    }

    /**
     * Refer an external HRTF set, and update sources. Its positions
     * coordinate system must be 'gl'.
     *
     * @see {@link HrtfSet}
     * @see {@link BinauralPanner#update}
     *
     * @param {HrtfSet} hrtfSet
     * @throws {Error} when hrtfSet in undefined or hrtfSet.coordinateSystem is
     * not 'gl'.
     */

  }, {
    key: 'hrtfSet',
    set: function set(hrtfSet) {
      var _this4 = this;

      if (typeof hrtfSet !== 'undefined') {
        if (hrtfSet.coordinateSystem !== 'gl') {
          throw new Error('coordinate system of HRTF set must be \'gl\' ' + ('(and not \'' + hrtfSet.coordinateSystem + '\') ')(_templateObject));
        }
        this._hrtfSet = hrtfSet;
      } else {
        throw new Error('Undefined HRTF set for BinauralPanner');
      }

      // update HRTF set references
      this._sourcesOutdated.fill(true);
      this._sources.forEach(function (source) {
        source.hrtfSet = _this4._hrtfSet;
      });

      this.update();
    }

    /**
     * Get the HrtfSet.
     *
     * @returns {HrtfSet}
     */
    ,
    get: function get() {
      return this._hrtfSet;
    }

    // ------------- HRTF set proxies

    /**
     * Set the filter positions of the HRTF set.
     *
     * @see {@link HrtfSet#filterPositions}
     *
     * @param {Array.<Coordinates>} positions
     */

  }, {
    key: 'filterPositions',
    set: function set(positions) {
      this._hrtfSet.filterPositions = positions;
    }

    /**
     * Get the filter positions of the HRTF set.
     *
     * @see {@link HrtfSet#filterPositions}
     *
     * @return {Array.<Coordinates>} positions
     */
    ,
    get: function get() {
      return this._hrtfSet.filterPositions;
    }

    /**
     * Set coordinate system for filter positions.
     *
     * @param {CoordinateSystem} [system='gl']
     */

  }, {
    key: 'filterCoordinateSystem',
    set: function set(system) {
      this._hrtfSet.filterCoordinateSystem = typeof system !== 'undefined' ? system : this.coordinateSystem;
    }

    /**
     * Get coordinate system for filter positions.
     *
     * @returns {CoordinateSystem}
     */
    ,
    get: function get() {
      return this._hrtfSet.filterCoordinateSystem;
    }

    /**
     * Set post-filtering flag. When false, try to load a partial set of
     * HRTF.
     *
     * @param {Boolean} [post=false]
     */

  }, {
    key: 'filterAfterLoad',
    set: function set(post) {
      this._hrtfSet.filterAfterLoad = post;
    }

    /**
     * Get post-filtering flag. When false, try to load a partial set of
     * HRTF.
     *
     * @returns {Boolean}
     */
    ,
    get: function get() {
      return this._hrtfSet.filterAfterLoad;
    }

    /**
     * Refer an external listener, and update sources.
     *
     * @see {@link Listener}
     * @see {@link BinauralPanner#update}
     *
     * @param {Listener} listener
     * @throws {Error} when listener in undefined.
     */

  }, {
    key: 'listener',
    set: function set(listener) {
      if (typeof listener !== 'undefined') {
        this._listener = listener;
      } else {
        throw new Error('Undefined listener for BinauralPanner');
      }

      this._sourcesOutdated.fill(true);
      this.update();
    }

    // ---------- Listener proxies

    /**
     * Set coordinate system for listener.
     *
     * @see {@link Listener#coordinateSystem}
     *
     * @param {CoordinateSystem} [system='gl']
     */

  }, {
    key: 'listenerCoordinateSystem',
    set: function set(system) {
      this._listener.coordinateSystem = typeof system !== 'undefined' ? system : this.coordinateSystem;
    }

    /**
     * Get coordinate system for listener.
     *
     * @returns {CoordinateSystem}
     */
    ,
    get: function get() {
      return this._listener.coordinateSystem;
    }

    /**
     * Set listener position. It will update the relative positions of the
     * sources after a call to the update method.
     *
     * Default value is [0, 0, 0] in 'gl' coordinates.
     *
     * @see {@link Listener#position}
     * @see {@link BinauralPanner#update}
     *
     * @param {Coordinates} positionRequest
     */

  }, {
    key: 'listenerPosition',
    set: function set(positionRequest) {
      this._listener.position = positionRequest;
    }

    /**
     * Get listener position.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return this._listener.position;
    }

    /**
     * Set listener up direction (not an absolute position). It will update
     * the relative positions of the sources after a call to the update
     * method.
     *
     * Default value is [0, 1, 0] in 'gl' coordinates.
     *
     * @see {@link Listener#up}
     * @see {@link BinauralPanner#update}
     *
     * @param {Coordinates} upRequest
     */

  }, {
    key: 'listenerUp',
    set: function set(upRequest) {
      this._listener.up = upRequest;
    }

    /**
     * Get listener up direction.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return this._listener.up;
    }

    /**
     * Set listener view, as an aiming position or a relative direction, if
     * viewIsRelative is respectively false or true. It will update the
     * relative positions of the sources after a call to the update method.
     *
     * Default value is [0, 0, -1] in 'gl' coordinates.
     *
     * @see {@link Listener#view}
     * @see {@link Listener#viewIsRelative}
     * @see {@link BinauralPanner#update}
     *
     * @param {Coordinates} viewRequest
     */

  }, {
    key: 'listenerView',
    set: function set(viewRequest) {
      this._listener.view = viewRequest;
    }

    /**
     * Get listener view.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return this._listener.view;
    }

    /**
     * Set the type of view: absolute to an aiming position (when false), or
     * a relative direction (when true). It will update the relative
     * positions after a call to the update method.
     *
     * @see {@link Listener#view}
     *
     * @param {Boolean} [relative=false] true when view is a direction, false
     * when it is an absolute position.
     */

  }, {
    key: 'listenerViewIsRelative',
    set: function set(relative) {
      this._listener.viewIsRelative = relative;
    }

    /**
     * Get the type of view.
     *
     * @returns {Boolean}
     */
    ,
    get: function get() {
      return this._listerner.viewIsRelative;
    }

    /**
     * Set the sources positions. It will update the relative positions after
     * a call to the update method.
     *
     * @see {@link BinauralPanner#update}
     * @see {@link BinauralPanner#setSourcePositionByIndex}
     *
     * @param {Array.<Coordinates>} positionsRequest
     * @throws {Error} if the length of positionsRequest is not the same as
     * the number of sources
     */

  }, {
    key: 'sourcePositions',
    set: function set(positionsRequest) {
      var _this5 = this;

      if (positionsRequest.length !== this._sources.length) {
        throw new Error('Bad number of source positions: ' + (positionsRequest.length + ' ') + ('instead of ' + this._sources.length));
      }

      positionsRequest.forEach(function (position, index) {
        _this5._sourcesOutdated[index] = true;
        _this5.setSourcePositionByIndex(index, position);
      });
    }

    /**
     * Get the source positions.
     *
     * @returns {Array.<Coordinates>}
     */
    ,
    get: function get() {
      var _this6 = this;

      return this._sourcePositionsAbsolute.map(function (position) {
        return (0, _coordinates.glToSystem)([], position, _this6.coordinateSystem);
      });
    }
  }]);

  return BinauralPanner;
}();

exports.default = BinauralPanner;
},{"../geometry/Listener":44,"../geometry/coordinates":45,"../sofa/HrtfSet":50,"./Source":38,"gl-matrix":56}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview Source for binaural processing.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Single source.
 *
 * @see {@link BinauralPanner}
 */

var Source = exports.Source = function () {

  /**
   * Construct a source, with and AudioContext and an HrtfSet.
   *
   * @see {@link HrtfSet}
   *
   * @param {Object} options
   * @param {AudioContext} options.audioContext mandatory for the creation
   * of FIR audio buffers
   * @param {HrtfSet} options.hrtfSet {@link Source#hrtfSet}
   * @param {coordinate} [options.position=[0,0,0]] in 'gl' coordinate system.
   * {@link Source#position}
   * @param {Number} [options.crossfadeDuration] in seconds
   * {@link Source#crossfadeDuration}
   */

  function Source() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Source);

    this._audioContext = options.audioContext;
    this._hrtfSet = options.hrtfSet;

    this._convolverCurrent = this._audioContext.createConvolver();
    this._convolverCurrent.normalize = false;

    this._gainCurrent = this._audioContext.createGain();
    this._convolverCurrent.connect(this._gainCurrent);

    this._convolverNext = this._audioContext.createConvolver();
    this._convolverNext.normalize = false;

    this._gainNext = this._audioContext.createGain();
    this._convolverNext.connect(this._gainNext);

    this.crossfadeDuration = options.crossfadeDuration;

    this._crossfadeAfterTime = this._audioContext.currentTime;
    this._crossfadeTimeout = undefined;

    // set position when everything is ready
    if (typeof options.position !== 'undefined') {
      this.position = options.position;
    }
  }

  // ----------- accessors

  /**
   * Set the crossfade duration when the position changes.
   *
   * @param {Number} [duration=0.02] in seconds
   */


  _createClass(Source, [{
    key: 'connectInput',


    // ----------- public methods

    /**
     * Connect the input of a source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToConnect
     * @param {Number} [output=0] output to connect from
     * @param {Number} [input=0] input to connect to
     * @returns {this}
     */
    value: function connectInput(nodesToConnect, output, input) {
      var _this = this;

      var nodes = Array.isArray(nodesToConnect) ? nodesToConnect : [nodesToConnect]; // make array

      nodes.forEach(function (node) {
        node.connect(_this._convolverCurrent, output, input);
        node.connect(_this._convolverNext, output, input);
      });

      return this;
    }

    /**
     * Disconnect the input of a source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect disconnect
     * all when undefined.
     * @returns {this}
     */

  }, {
    key: 'disconnectInput',
    value: function disconnectInput(nodesToDisconnect) {
      var _this2 = this;

      var nodes = Array.isArray(nodesToDisconnect) ? nodesToDisconnect : [nodesToDisconnect]; // make array

      nodes.forEach(function (node) {
        node.disconnect(_this2._convolverCurrent);
        node.disconnect(_this2._convolverNext);
      });

      return this;
    }

    /**
     * Connect the output of a source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToConnect
     * @param {Number} [output=0] output to connect from
     * @param {Number} [input=0] input to connect to
     * @returns {this}
     */

  }, {
    key: 'connectOutput',
    value: function connectOutput(nodesToConnect, output, input) {
      var _this3 = this;

      var nodes = Array.isArray(nodesToConnect) ? nodesToConnect : [nodesToConnect]; // make array

      nodes.forEach(function (node) {
        _this3._gainCurrent.connect(node, output, input);
        _this3._gainNext.connect(node, output, input);
      });

      return this;
    }

    /**
     * Disconnect the output of a source.
     *
     * @param {(AudioNode|Array.<AudioNode>)} nodesToDisconnect disconnect
     * all when undefined.
     * @returns {this}
     */

  }, {
    key: 'disconnectOutput',
    value: function disconnectOutput(nodesToDisconnect) {
      var _this4 = this;

      if (typeof nodesToDisconnect === 'undefined') {
        // disconnect all
        this._gainCurrent.disconnect();
        this._gainNext.disconnect();
      } else {
        var nodes = Array.isArray(nodesToDisconnect) ? nodesToDisconnect : [nodesToDisconnect]; // make array

        nodes.forEach(function (node) {
          _this4._gainCurrent.disconnect(node);
          _this4._gainNext.disconnect(node);
        });
      }

      return this;
    }
  }, {
    key: 'crossfadeDuration',
    set: function set() {
      var duration = arguments.length <= 0 || arguments[0] === undefined ? 0.02 : arguments[0];

      this._crossfadeDuration = duration;
    }

    /**
     * Get the crossfade duration when the position changes.
     *
     * @returns {Number} in seconds
     */
    ,
    get: function get() {
      return this._crossfadeDuration;
    }

    /**
     * Refer an external HRTF set.
     *
     * @param {HrtfSet} hrtfSet
     */

  }, {
    key: 'hrtfSet',
    set: function set(hrtfSet) {
      this._hrtfSet = hrtfSet;
    }

    /**
     * Get the HrtfSet.
     *
     * @returns {HrtfSet}
     */
    ,
    get: function get() {
      return this._hrtfSet;
    }

    /**
     * Set the position of the source and updates.
     *
     * @param {Coordinates} positionRequest
     */

  }, {
    key: 'position',
    set: function set(positionRequest) {
      var _this5 = this;

      clearTimeout(this._crossfadeTimeout);
      var now = this._audioContext.currentTime;
      if (now >= this._crossfadeAfterTime) {
        // swap
        var tmp = this._convolverCurrent;
        this._convolverCurrent = this._convolverNext;
        this._convolverNext = tmp;

        tmp = this._gainCurrent;
        this._gainCurrent = this._gainNext;
        this._gainNext = tmp;

        this._convolverNext.buffer = this._hrtfSet.nearestFir(positionRequest);

        // reschedule after setting the buffer, as it may take time
        // (currentTime updates at least on Chrome 48)
        now = this._audioContext.currentTime;
        this._crossfadeAfterTime = now + this._crossfadeDuration;

        // fade in next
        this._gainNext.gain.cancelScheduledValues(now);
        this._gainNext.gain.setValueAtTime(0, now);
        this._gainNext.gain.linearRampToValueAtTime(1, now + this._crossfadeDuration);

        // fade out current
        this._gainCurrent.gain.cancelScheduledValues(now);
        this._gainCurrent.gain.setValueAtTime(1, now);
        this._gainCurrent.gain.linearRampToValueAtTime(0, now + this._crossfadeDuration);
      } else {
        // re-schedule later
        this._crossfadeTimeout = setTimeout(function () {
          _this5.position = positionRequest;
        }, 0.02);
      }
    }
  }]);

  return Source;
}();

exports.default = Source;
},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BinauralPanner = require('./BinauralPanner');

var _BinauralPanner2 = _interopRequireDefault(_BinauralPanner);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _Source = require('./Source');

var _Source2 = _interopRequireDefault(_Source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BinauralPanner: _BinauralPanner2.default,
  Source: _Source2.default,
  utilities: _utilities2.default
};
},{"./BinauralPanner":37,"./Source":38,"./utilities":40}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dBToLin = dBToLin;
exports.createDiracBuffer = createDiracBuffer;
exports.createNoiseBuffer = createNoiseBuffer;
exports.resampleFloat32Array = resampleFloat32Array;
/**
 * @fileOverview Audio utilities
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Convert a dB value to a linear amplitude, i.e. -20dB gives 0.1
 *
 * @param {Number} dBValue
 * @returns {Number}
 */
function dBToLin(dBValue) {
  var factor = 1 / 20;
  return Math.pow(10, dBValue * factor);
}

/**
 * Create a Dirac buffer, zero-padded.
 *
 * Warning: the default length is 2 samples,
 * to by-pass a bug in Safari ≤ 9.
 *
 * @param {Object} options
 * @param {AudioContext} options.audioContext must be defined
 * @param {Number} [options.channelCount=1]
 * @param {Number} [options.gain=0] in dB
 * @param {Number} [options.length=2] in samples
 * @returns {AudioBuffer}
 */
function createDiracBuffer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var context = options.audioContext;

  var length = typeof options.length !== 'undefined' ? options.length : 2; // Safari ≤9 needs one more
  var channelCount = typeof options.channelCount !== 'undefined' ? options.channelCount : 1;
  var gain = typeof options.gain !== 'undefined' ? options.gain : 0; // dB

  var buffer = context.createBuffer(channelCount, length, context.sampleRate);
  var data = buffer.getChannelData(0);

  var amplitude = dBToLin(gain);
  data[0] = amplitude;
  // already padded with zeroes

  return buffer;
}

/**
 * Create a noise buffer.
 *
 * @param {Object} options
 * @param {AudioContext} options.audioContext must be defined
 * @param {Number} [options.channelCount=1]
 * @param {Number} [options.duration=5] in seconds
 * @param {Number} [options.gain=-30] in dB
 * @returns {AudioBuffer}
 */
function createNoiseBuffer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var context = options.audioContext;
  var duration = typeof options.duration !== 'undefined' ? options.duration : 5;

  var gain = typeof options.gain !== 'undefined' ? options.gain : -30; // dB

  var channelCount = typeof options.channelCount !== 'undefined' ? options.channelCount : context.destination.channelCount;

  var length = duration * context.sampleRate;
  var amplitude = dBToLin(gain);
  var buffer = context.createBuffer(channelCount, length, context.sampleRate);
  for (var c = 0; c < channelCount; ++c) {
    var data = buffer.getChannelData(c);
    for (var i = 0; i < length; ++i) {
      data[i] = amplitude * (Math.random() * 2 - 1);
    }
  }
  return buffer;
}

/**
 * Convert an array, typed or not, to a Float32Array, with possible re-sampling.
 *
 * @param {Object} options
 * @param {Array} options.inputSamples input array
 * @param {Number} options.inputSampleRate in Hertz
 * @param {Number} [options.outputSampleRate=options.inputSampleRate]
 * @returns {Promise.<Float32Array|Error>}
 */
function resampleFloat32Array() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var promise = new Promise(function (resolve, reject) {
    var inputSamples = options.inputSamples;
    var inputSampleRate = options.inputSampleRate;

    var outputSampleRate = typeof options.outputSampleRate !== 'undefined' ? options.outputSampleRate : inputSampleRate;

    if (inputSampleRate === outputSampleRate) {
      resolve(new Float32Array(inputSamples));
    } else {
      try {
        var outputSamplesNb = Math.ceil(inputSamples.length * outputSampleRate / inputSampleRate);

        var context = new window.OfflineAudioContext(1, outputSamplesNb, outputSampleRate);

        var inputBuffer = context.createBuffer(1, inputSamples.length, inputSampleRate);

        inputBuffer.getChannelData(0).set(inputSamples);

        var source = context.createBufferSource();
        source.buffer = inputBuffer;
        source.connect(context.destination);

        source.start(); // will start with offline context

        context.oncomplete = function (event) {
          var outputSamples = event.renderedBuffer.getChannelData(0);
          resolve(outputSamples);
        };

        context.startRendering();
      } catch (error) {
        reject(new Error('Unable to re-sample Float32Array. ' + error.message));
      }
    }
  });

  return promise;
}

exports.default = {
  dBToLin: dBToLin,
  createDiracBuffer: createDiracBuffer,
  createNoiseBuffer: createNoiseBuffer,
  resampleFloat32Array: resampleFloat32Array
};
},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  utilities: _utilities2.default
};
},{"./utilities":42}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.almostEquals = almostEquals;
exports.almostEqualsModulo = almostEqualsModulo;
/**
 * @fileOverview Common utilities
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Test whether a value is around a reference, given a tolerance.
 *
 * @param {Number} value
 * @param {Number} reference
 * @param {Number} [tolerance=Number.EPSILON]
 * @returns {Number} Math.abs(value - reference) <= tolerance;
 */
function almostEquals(value, reference) {
  var tolerance = arguments.length <= 2 || arguments[2] === undefined ? Number.EPSILON : arguments[2];

  return Math.abs(value - reference) <= tolerance;
}

/**
 * Test whether a value is around a reference, given a tolerance and a
 * modulo.
 *
 * @param {Number} value
 * @param {Number} reference
 * @param {Number} modulo
 * @param {Number} [tolerance=Number.EPSILON]
 * @returns {Number} Math.abs(value - reference) % modulo <= tolerance;
 */
function almostEqualsModulo(value, reference, modulo) {
  var tolerance = arguments.length <= 3 || arguments[3] === undefined ? Number.EPSILON : arguments[3];

  return Math.abs(value - reference) % modulo <= tolerance;
}

exports.default = {
  almostEquals: almostEquals,
  almostEqualsModulo: almostEqualsModulo
};
},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tree = undefined;
exports.distanceSquared = distanceSquared;
exports.distance = distance;

var _kd = require('kd.tree');

var _kd2 = _interopRequireDefault(_kd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.tree = _kd2.default;

/**
 * Get the squared distance between to points.
 *
 * (Avoid computing the square-root when unnecessary.)
 *
 * @param {Object} a in cartesian coordinates.
 * @param {Number} a.x
 * @param {Number} a.y
 * @param {Number} a.z
 * @param {Object} b in cartesian coordinates.
 * @param {Number} b.x
 * @param {Number} b.y
 * @param {Number} b.z
 * @returns {Number}
 */
/**
 * @fileOverview Helpers for k-d tree.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

function distanceSquared(a, b) {
  var x = b.x - a.x;
  var y = b.y - a.y;
  var z = b.z - a.z;
  return x * x + y * y + z * z;
}

/**
 * Get the distance between to points.
 *
 * @param {Object} a in cartesian coordinates.
 * @param {Number} a.x
 * @param {Number} a.y
 * @param {Number} a.z
 * @param {Object} b in cartesian coordinates.
 * @param {Number} b.x
 * @param {Number} b.y
 * @param {Number} b.z
 * @returns {Number}
 */
function distance(a, b) {
  return Math.sqrt(this.distanceSquared(a, b));
}

exports.default = {
  distance: distance,
  distanceSquared: distanceSquared,
  tree: _kd2.default
};
},{"kd.tree":66}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Listener = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Listener.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license BSD-3-Clause
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _glMatrix = require('gl-matrix');

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _coordinates = require('../geometry/coordinates');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Camera-like listener. It generates a look-at matrix from a position, a
 * view point, and an up direction.
 *
 */

var Listener = exports.Listener = function () {

  /**
   * Constructs a listener.
   *
   * @param {Object} options
   * @param {CoordinateSystem} [options.coordinateSystem='gl']
   * {@link Listener#coordinateSystem}
   * @param {Coordinates} [options.position=[0,0,0]]
   * {@link Listener#position}
   * @param {Coordinates} [options.up=[0,1,0]]
   * {@link Listener#up}
   * @param {Coordinates} [options.view=[0,0,-1]]
   * {@link Listener#view}
   * @param {Boolean} [options.viewIsRelative=false]
   * {@link Listener#viewIsRelative}
   */

  function Listener() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Listener);

    this._outdated = true;
    this._lookAt = [];

    this.coordinateSystem = options.coordinateSystem;

    this._position = [];
    this.position = typeof options.position !== 'undefined' ? options.position : (0, _coordinates.glToSystem)([], [0, 0, 0], this.coordinateSystem);

    this._up = [];
    this.up = typeof options.up !== 'undefined' ? options.up : (0, _coordinates.glToSystem)([], [0, 1, 0], this.coordinateSystem);

    this.viewIsRelative = options.viewIsRelative; // undefined is fine

    this._view = [];
    this.view = typeof options.view !== 'undefined' ? options.view : (0, _coordinates.glToSystem)([], [0, 0, -1], this.coordinateSystem);

    this.update();
  }

  // ------------- accessors

  /**
   * Get the current look-at matrix. Note is updated only after a call to
   * the update method.
   *
   * @see {@link Listener#update}
   *
   * @returns {mat4} look-at matrix
   */


  _createClass(Listener, [{
    key: 'update',


    // --------- public methods

    /**
     * Updates the look-at matrix, according to the pending changes in
     * position, view, viewIsRelative, and up.
     *
     * @returns {Boolean} true when at least a change occurred.
     */
    value: function update() {
      var updated = this._outdated;
      if (this._outdated) {
        var view = this._viewIsRelative ? _glMatrix2.default.vec3.add([], this._view, this._position) : this._view;
        _glMatrix2.default.mat4.lookAt(this._lookAt, this._position, view, this._up);
        this._outdated = false;
      }

      return updated;
    }
  }, {
    key: 'lookAt',
    get: function get() {
      return this._lookAt;
    }

    /**
     * Set coordinate system.
     *
     * @param {CoordinateSystem} [system='gl']
     */

  }, {
    key: 'coordinateSystem',
    set: function set(system) {
      this._coordinateSystem = typeof system !== 'undefined' ? system : 'gl';
    }

    /**
     * Get coordinate system.
     *
     * @returns {CoordinateSystem}
     */
    ,
    get: function get() {
      return this._coordinateSystem;
    }

    /**
     * Set listener position. It will update the look-at matrix after a call
     * to the update method.
     *
     * Default value is [0, 0, 0] in 'gl' coordinates.
     *
     * @see {@link Listener#update}
     *
     * @param {Coordinates} positionRequest
     */

  }, {
    key: 'position',
    set: function set(positionRequest) {
      (0, _coordinates.systemToGl)(this._position, positionRequest, this._coordinateSystem);
      this._outdated = true;
    }

    /**
     * Get listener position.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return (0, _coordinates.glToSystem)([], this._position, this._coordinateSystem);
    }

    /**
     * Set listener up direction (not an absolute position). It will update
     * the look-at matrix after a call to the update method.
     *
     * Default value is [0, 1, 0] in 'gl' coordinates.
     *
     * @see {@link Listener#update}
     *
     * @param {Coordinates} upRequest
     */

  }, {
    key: 'up',
    set: function set(upRequest) {
      (0, _coordinates.systemToGl)(this._up, upRequest, this._coordinateSystem);
      this._outdated = true;
    }

    /**
     * Get listener up direction.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return (0, _coordinates.glToSystem)([], this._up, this._coordinateSystem);
    }

    /**
     * Set listener view, as an aiming position or a relative direction, if
     * viewIsRelative is respectively false or true. It will update the
     * look-at matrix after a call to the update method.
     *
     * Default value is [0, 0, -1] in 'gl' coordinates.
     *
     * @see {@link Listener#viewIsRelative}
     * @see {@link Listener#update}
     *
     * @param {Coordinates} viewRequest
     */

  }, {
    key: 'view',
    set: function set(viewRequest) {
      (0, _coordinates.systemToGl)(this._view, viewRequest, this._coordinateSystem);
      this._outdated = true;
    }

    /**
     * Get listener view.
     *
     * @returns {Coordinates}
     */
    ,
    get: function get() {
      return (0, _coordinates.glToSystem)([], this._view, this._coordinateSystem);
    }

    /**
     * Set the type of view: absolute to an aiming position (when false), or
     * a relative direction (when true). It will update the look-at matrix
     * after a call to the update method.
     *
     * @see {@link Listener#view}
     *
     * @param {Boolean} [relative=false] true when view is a direction, false
     * when it is an absolute position.
     */

  }, {
    key: 'viewIsRelative',
    set: function set(relative) {
      this._viewIsRelative = typeof relative !== 'undefined' ? relative : false;
    }

    /**
     * Get the type of view.
     *
     * @returns {Boolean}
     */
    ,
    get: function get() {
      return this._viewIsRelative;
    }
  }]);

  return Listener;
}();

exports.default = Listener;
},{"../geometry/coordinates":45,"gl-matrix":56}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sofaCartesianToGl = sofaCartesianToGl;
exports.glToSofaCartesian = glToSofaCartesian;
exports.sofaCartesianToSofaSpherical = sofaCartesianToSofaSpherical;
exports.sofaSphericalToSofaCartesian = sofaSphericalToSofaCartesian;
exports.sofaSphericalToGl = sofaSphericalToGl;
exports.glToSofaSpherical = glToSofaSpherical;
exports.sofaToSofaCartesian = sofaToSofaCartesian;
exports.spat4CartesianToGl = spat4CartesianToGl;
exports.glToSpat4Cartesian = glToSpat4Cartesian;
exports.spat4CartesianToSpat4Spherical = spat4CartesianToSpat4Spherical;
exports.spat4SphericalToSpat4Cartesian = spat4SphericalToSpat4Cartesian;
exports.spat4SphericalToGl = spat4SphericalToGl;
exports.glToSpat4Spherical = glToSpat4Spherical;
exports.systemType = systemType;
exports.systemToGl = systemToGl;
exports.glToSystem = glToSystem;

var _degree = require('./degree');

var _degree2 = _interopRequireDefault(_degree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Coordinates as an array of 3 values:
 * [x, y, z] or [azimuth, elevation, distance], depending on system
 *
 * @typedef {vec3} Coordinates
 */

/**
 * Coordinate system: `gl`, `sofaCartesian`, `sofaSpherical`,
 * `spat4Cartesian`, or `spat4Spherical`.
 *
 * @typedef {String} CoordinateSystem
 */

// ----------------------------- SOFA

/**
 * SOFA cartesian coordinate system: `sofaCartesian`.
 *
 * SOFA distances are in metres.
 *
 * <pre>
 *
 * SOFA          +z  +x             openGL    +y
 *                | /                          |
 *                |/                           |
 *         +y ----o                            o---- +x
 *                                            /
 *                                           /
 *                                          +z
 *
 * SOFA.x = -openGL.z               openGL.x = -SOFA.y
 * SOFA.y = -openGL.x               openGL.y =  SOFA.z
 * SOFA.z =  openGL.y               openGL.z = -SOFA.x
 *
 * </pre>
 *
 * @typedef {Coordinates} SofaCartesian
 */

/**
 * SOFA spherical coordinate system:  `sofaSpherical`.
 *
 * SOFA angles are in degrees.
 *
 * <pre>
 *
 * SOFA.azimuth = atan2(SOFA.y, SOFA.x)
 * SOFA.elevation = atan2(SOFA.z, sqrt(SOFA.x * SOFA.x + SOFA.y * SOFA.y) );
 * SOFA.distance = sqrt(SOFA.x * SOFA.x + SOFA.y * SOFA.y + SOFA.z * SOFA.z)
 *
 * </pre>
 *
 * @typedef {Coordinates} SofaSpherical
 */

/**
 * Convert SOFA cartesian coordinates to openGL.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function sofaCartesianToGl(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = 0 - y;
  out[1] = z;
  out[2] = 0 - x;

  return out;
}

/**
 * Convert openGL coordinates to SOFA cartesian.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
/**
 * @fileOverview Coordinate systems conversions. openGL, SOFA, and Spat4 (Ircam).
 *
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

function glToSofaCartesian(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = 0 - z;
  out[1] = 0 - x;
  out[2] = y;

  return out;
}

/**
 * Convert SOFA cartesian coordinates to SOFA spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function sofaCartesianToSofaSpherical(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  var x2y2 = x * x + y * y;

  // from [-180, 180] to [0, 360);
  out[0] = (_degree2.default.atan2(y, x) + 360) % 360;

  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

/**
 * Convert SOFA spherical coordinates to SOFA spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function sofaSphericalToSofaCartesian(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = distance * cosE * _degree2.default.cos(azimuth); // SOFA.x
  out[1] = distance * cosE * _degree2.default.sin(azimuth); // SOFA.y
  out[2] = distance * _degree2.default.sin(elevation); // SOFA.z

  return out;
}

/**
 * Convert SOFA spherical coordinates to openGL.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function sofaSphericalToGl(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = 0 - distance * cosE * _degree2.default.sin(azimuth); // -SOFA.y
  out[1] = distance * _degree2.default.sin(elevation); // SOFA.z
  out[2] = 0 - distance * cosE * _degree2.default.cos(azimuth); // -SOFA.x

  return out;
}

/**
 * Convert openGL coordinates to SOFA spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function glToSofaSpherical(out, a) {
  // copy to handle in-place
  // difference to avoid generating -0 out of 0
  var x = 0 - a[2]; // -openGL.z
  var y = 0 - a[0]; // -openGL.x
  var z = a[1]; // openGL.y

  var x2y2 = x * x + y * y;

  // from [-180, 180] to [0, 360);
  out[0] = (_degree2.default.atan2(y, x) + 360) % 360;

  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

/**
 * Convert coordinates to SOFA cartesian.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @param {CoordinateSystem} system
 * @returns {Coordinates} out
 * @throws {Error} when the system is unknown.
 */
function sofaToSofaCartesian(out, a, system) {
  switch (system) {
    case 'sofaCartesian':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'sofaSpherical':
      sofaSphericalToSofaCartesian(out, a);
      break;

    default:
      throw new Error('Bad coordinate system');
  }
  return out;
}

// ---------------- Spat4

/**
 * Spat4 cartesian coordinate system: `spat4Cartesian`.
 *
 * Spat4 distances are in metres.
 *
 * <pre>
 *
 * Spat4         +z  +y             openGL    +y
 *                | /                          |
 *                |/                           |
 *                o---- +x                     o---- +x
 *                                            /
 *                                           /
 *                                         +z
 *
 * Spat4.x =  openGL.x               openGL.x =  Spat4.x
 * Spat4.y = -openGL.z               openGL.y =  Spat4.z
 * Spat4.z =  openGL.y               openGL.z = -Spat4.y
 *
 * </pre>
 *
 * @typedef {Coordinates} Spat4Cartesian
 */

/**
 * Spat4 spherical coordinate system: `spat4Spherical`.
 *
 * Spat4 angles are in degrees.
 *
 * <pre>
 *
 * Spat4.azimuth = atan2(Spat4.x, Spat4.y)
 * Spat4.elevation = atan2(Spat4.z, sqrt(Spat4.x * Spat4.x + Spat4.y * Spat4.y) );
 * Spat4.distance = sqrt(Spat4.x * Spat4.x + Spat4.y * Spat4.y + Spat4.z * Spat4.z)
 *
 * </pre>
 *
 * @typedef {Coordinates} Spat4Spherical
 */

/**
 * Convert Spat4 cartesian coordinates to openGL.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function spat4CartesianToGl(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = x;
  out[1] = z;
  out[2] = 0 - y;

  return out;
}

/**
 * Convert openGL coordinates to Spat4 cartesian.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function glToSpat4Cartesian(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  out[0] = x;
  out[1] = 0 - z;
  out[2] = y;

  return out;
}

/**
 * Convert Spat4 cartesian coordinates to Spat4 spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function spat4CartesianToSpat4Spherical(out, a) {
  // copy to handle in-place
  var x = a[0];
  var y = a[1];
  var z = a[2];

  var x2y2 = x * x + y * y;

  out[0] = _degree2.default.atan2(x, y);
  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

/**
 * Convert Spat4 spherical coordinates to Spat4 spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function spat4SphericalToSpat4Cartesian(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = distance * cosE * _degree2.default.sin(azimuth); // Spat4.x
  out[1] = distance * cosE * _degree2.default.cos(azimuth); // Spat4.y
  out[2] = distance * _degree2.default.sin(elevation); // Spat4.z

  return out;
}

/**
 * Convert Spat4 spherical coordinates to openGL.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function spat4SphericalToGl(out, a) {
  // copy to handle in-place
  var azimuth = a[0];
  var elevation = a[1];
  var distance = a[2];

  var cosE = _degree2.default.cos(elevation);
  out[0] = distance * cosE * _degree2.default.sin(azimuth); // Spat4.x
  out[1] = distance * _degree2.default.sin(elevation); // Spat4.z
  out[2] = 0 - distance * cosE * _degree2.default.cos(azimuth); // -Spat4.y

  return out;
}

/**
 * Convert openGL coordinates to Spat4 spherical.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @returns {Coordinates} out
 */
function glToSpat4Spherical(out, a) {
  // copy to handle in-place
  // difference to avoid generating -0 out of 0
  var x = a[0]; // openGL.x
  var y = 0 - a[2]; // -openGL.z
  var z = a[1]; // openGL.y

  var x2y2 = x * x + y * y;

  out[0] = _degree2.default.atan2(x, y);
  out[1] = _degree2.default.atan2(z, Math.sqrt(x2y2));
  out[2] = Math.sqrt(x2y2 + z * z);

  return out;
}

// ---------------- named coordinate systems

/**
 * Get the coordinate system general type (cartesian or spherical).
 *
 * @param {String} system
 * @returns {String} 'cartesian' or 'spherical', if `system` if of cartesian
 * or spherical type.
 */
function systemType(system) {
  var type = void 0;
  if (system === 'sofaCartesian' || system === 'spat4Cartesian' || system === 'gl') {
    type = 'cartesian';
  } else if (system === 'sofaSpherical' || system === 'spat4Spherical') {
    type = 'spherical';
  } else {
    throw new Error('Unknown coordinate system type ' + system);
  }
  return type;
}

/**
 * Convert coordinates to openGL.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @param {CoordinateSystem} system
 * @returns {Coordinates} out
 * @throws {Error} when the system is unknown.
 */
function systemToGl(out, a, system) {
  switch (system) {
    case 'gl':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'sofaCartesian':
      sofaCartesianToGl(out, a);
      break;

    case 'sofaSpherical':
      sofaSphericalToGl(out, a);
      break;

    case 'spat4Cartesian':
      spat4CartesianToGl(out, a);
      break;

    case 'spat4Spherical':
      spat4SphericalToGl(out, a);
      break;

    default:
      throw new Error('Bad coordinate system');
  }
  return out;
}

/**
 * Convert openGL coordinates to other system.
 *
 * @param {Coordinates} out in-place if out === a.
 * @param {Coordinates} a
 * @param {CoordinateSystem} system
 * @returns {Coordinates} out
 * @throws {Error} when the system is unknown.
 */
function glToSystem(out, a, system) {
  switch (system) {
    case 'gl':
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      break;

    case 'sofaCartesian':
      glToSofaCartesian(out, a);
      break;

    case 'sofaSpherical':
      glToSofaSpherical(out, a);
      break;

    case 'spat4Cartesian':
      glToSpat4Cartesian(out, a);
      break;

    case 'spat4Spherical':
      glToSpat4Spherical(out, a);
      break;

    default:
      throw new Error('Bad coordinate system');
  }
  return out;
}

exports.default = {
  glToSofaCartesian: glToSofaCartesian,
  glToSofaSpherical: glToSofaSpherical,
  glToSpat4Cartesian: glToSpat4Cartesian,
  glToSpat4Spherical: glToSpat4Spherical,
  glToSystem: glToSystem,
  sofaCartesianToGl: sofaCartesianToGl,
  sofaCartesianToSofaSpherical: sofaCartesianToSofaSpherical,
  sofaSphericalToGl: sofaSphericalToGl,
  sofaSphericalToSofaCartesian: sofaSphericalToSofaCartesian,
  sofaToSofaCartesian: sofaToSofaCartesian,
  spat4CartesianToGl: spat4CartesianToGl,
  spat4CartesianToSpat4Spherical: spat4CartesianToSpat4Spherical,
  spat4SphericalToGl: spat4SphericalToGl,
  spat4SphericalToSpat4Cartesian: spat4SphericalToSpat4Cartesian,
  systemToGl: systemToGl,
  systemType: systemType
};
},{"./degree":46}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRadian = toRadian;
exports.fromRadian = fromRadian;
exports.cos = cos;
exports.sin = sin;
exports.atan2 = atan2;
/**
 * @fileOverview Convert to and from degree
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Degree to radian multiplication factor.
 *
 * @type {Number}
 */
var toRadianFactor = exports.toRadianFactor = Math.PI / 180;

/**
 * Radian to degree multiplication factor.
 *
 * @type {Number}
 */
var fromRadianFactor = exports.fromRadianFactor = 1 / toRadianFactor;

/**
 * Convert an angle in degrees to radians.
 *
 * @param {Number} angle in degrees
 * @returns {Number} angle in radians
 */
function toRadian(angle) {
  return angle * toRadianFactor;
}

/**
 * Convert an angle in radians to degrees.
 *
 * @param {Number} angle in radians
 * @returns {Number} angle in degrees
 */
function fromRadian(angle) {
  return angle * fromRadianFactor;
}

/**
 * Get the cosinus of an angle in degrees.
 *
 * @param {Number} angle
 * @returns {Number}
 */
function cos(angle) {
  return Math.cos(angle * toRadianFactor);
}

/**
 * Get the sinus of an angle in degrees.
 *
 * @param {Number} angle
 * @returns {Number}
 */
function sin(angle) {
  return Math.sin(angle * toRadianFactor);
}

/**
 * Get the arc-tangent (2 arguments) of 2 angles in degrees.
 *
 * @param {Number} y
 * @param {Number} x
 * @returns {Number}
 */
function atan2(y, x) {
  return Math.atan2(y, x) * fromRadianFactor;
}

exports.default = {
  atan2: atan2,
  cos: cos,
  fromRadian: fromRadian,
  fromRadianFactor: fromRadianFactor,
  sin: sin,
  toRadian: toRadian,
  toRadianFactor: toRadianFactor
};
},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _coordinates = require('./coordinates');

var _coordinates2 = _interopRequireDefault(_coordinates);

var _degree = require('./degree');

var _degree2 = _interopRequireDefault(_degree);

var _KdTree = require('./KdTree');

var _KdTree2 = _interopRequireDefault(_KdTree);

var _Listener = require('./Listener');

var _Listener2 = _interopRequireDefault(_Listener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  coordinates: _coordinates2.default,
  degree: _degree2.default,
  KdTree: _KdTree2.default,
  Listener: _Listener2.default
};
},{"./KdTree":43,"./Listener":44,"./coordinates":45,"./degree":46}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sofa = exports.info = exports.geometry = exports.common = exports.audio = undefined;

var _audio = require('./audio');

var _audio2 = _interopRequireDefault(_audio);

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

var _geometry = require('./geometry');

var _geometry2 = _interopRequireDefault(_geometry);

var _info = require('./info');

var _info2 = _interopRequireDefault(_info);

var _sofa = require('./sofa');

var _sofa2 = _interopRequireDefault(_sofa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.audio = _audio2.default;
exports.common = _common2.default;
exports.geometry = _geometry2.default;
exports.info = _info2.default;
exports.sofa = _sofa2.default;
exports.default = {
  audio: _audio2.default,
  common: _common2.default,
  geometry: _geometry2.default,
  info: _info2.default,
  sofa: _sofa2.default
};
},{"./audio":39,"./common":41,"./geometry":47,"./info":49,"./sofa":52}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.name = exports.license = exports.description = undefined;

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module info
 */

/**
 * Short description of the library.
 *
 * @type {String}
 */
var description = _package2.default.description;

/**
 * License of the library.
 *
 * @type {String}
 */
/**
 * @fileOverview Information on the library, from the `package.json` file.
 *
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

exports.description = description;
var license = _package2.default.license;

/**
 * Name of the library.
 *
 * @type {String}
 */

exports.license = license;
var name = _package2.default.name;

/**
 * Semantic version of the library.
 *
 * @type {String}
 */

exports.name = name;
var version = _package2.default.version;
exports.version = version;
exports.default = {
  description: description,
  license: license,
  name: name,
  version: version
};
},{"../package.json":67}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HrtfSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Container for HRTF set: load a set from an URL and get
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * filters from corresponding positions.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2015-2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license BSD-3-Clause
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _glMatrix = require('gl-matrix');

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _info = require('../info');

var _info2 = _interopRequireDefault(_info);

var _parseDataSet = require('./parseDataSet');

var _parseSofa = require('./parseSofa');

var _coordinates = require('../geometry/coordinates');

var _coordinates2 = _interopRequireDefault(_coordinates);

var _KdTree = require('../geometry/KdTree');

var _KdTree2 = _interopRequireDefault(_KdTree);

var _utilities = require('../audio/utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Container for HRTF set.
 */

var HrtfSet = exports.HrtfSet = function () {

  /**
   * Constructs an HRTF set. Note that the filter positions are applied
   * during the load of an URL.
   *
   * @see {@link HrtfSet#load}
   *
   * @param {Object} options
   * @param {AudioContext} options.audioContext mandatory for the creation
   * of FIR audio buffers
   * @param {CoordinateSystem} [options.coordinateSystem='gl']
   * {@link HrtfSet#coordinateSystem}
   * @param {CoordinateSystem} [options.filterCoordinateSystem=options.coordinateSystem]
   * {@link HrtfSet#filterCoordinateSystem}
   * @param {Array.<Coordinates>} [options.filterPositions=undefined]
   * {@link HrtfSet#filterPositions}
   * array of positions to filter. Use undefined to use all positions.
   * @param {Boolean} [options.filterAfterLoad=false] true to filter after
   * full load of SOFA file, instead of multiple partial loading.
   * {@link HrtfSet#filterAfterLoad}
   */

  function HrtfSet() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, HrtfSet);

    this._audioContext = options.audioContext;

    this._ready = false;

    this.coordinateSystem = options.coordinateSystem;

    this.filterCoordinateSystem = options.filterCoordinateSystem;
    this.filterPositions = options.filterPositions;

    this.filterAfterLoad = options.filterAfterLoad;
  }

  // ------------ accessors

  /**
   * Set coordinate system for positions.
   * @param {CoordinateSystem} [system='gl']
   */


  _createClass(HrtfSet, [{
    key: 'applyFilterPositions',


    // ------------- public methods

    /**
     * Apply filter positions to an existing set of HRTF. (After a successful
     * load.)
     *
     * This is destructive.
     *
     * @see {@link HrtfSet#load}
     */
    value: function applyFilterPositions() {
      var _this = this;

      // do not use getter for gl positions
      var filteredPositions = this._filterPositions.map(function (current) {
        return _this._kdt.nearest({ x: current[0], y: current[1], z: current[2] }, 1).pop()[0]; // nearest data
      });

      // filter out duplicates
      filteredPositions = [].concat(_toConsumableArray(new Set(filteredPositions)));

      this._kdt = _KdTree2.default.tree.createKdTree(filteredPositions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);
    }

    /**
     * Load an URL and generate the corresponding set of IR buffers.
     *
     * @param {String} sourceUrl
     * @returns {Promise.<this|Error>} resolve when the URL sucessfully
     * loaded.
     */

  }, {
    key: 'load',
    value: function load(sourceUrl) {
      var _this2 = this;

      var extension = sourceUrl.split('.').pop();

      var url = extension === 'sofa' ? sourceUrl + '.json' : sourceUrl;

      var promise = void 0;

      // need a server for partial downloading ("sofa" extension may be naive)
      var preFilter = typeof this._filterPositions !== 'undefined' && !this.filterAfterLoad && extension === 'sofa';
      if (preFilter) {
        promise = Promise.all([this._loadMetaAndPositions(sourceUrl), this._loadDataSet(sourceUrl)]).then(function (indicesAndDataSet) {
          var indices = indicesAndDataSet[0];
          var dataSet = indicesAndDataSet[1];
          return _this2._loadSofaPartial(sourceUrl, indices, dataSet).then(function () {
            _this2._ready = true;
            return _this2; // final resolve
          });
        }).catch(function () {
          // when pre-fitering fails, for any reason, try to post-filter
          // console.log(`Error while partial loading of ${sourceUrl}. `
          //             + `${error.message}. `
          //             + `Load full and post-filtering, instead.`);
          return _this2._loadSofaFull(url).then(function () {
            _this2.applyFilterPositions();
            _this2._ready = true;
            return _this2; // final resolve
          });
        });
      } else {
          promise = this._loadSofaFull(url).then(function () {
            if (typeof _this2._filterPositions !== 'undefined' && _this2.filterAfterLoad) {
              _this2.applyFilterPositions();
            }
            _this2._ready = true;
            return _this2; // final resolve
          });
        }

      return promise;
    }

    /**
     * Export the current HRTF set as a JSON string.
     *
     * When set, `this.filterPositions` reduce the actual number of filter, and
     * thus the exported set. The coordinate system of the export is
     * `this.filterCoordinateSystem`.
     *
     * @see {@link HrtfSet#filterCoordinateSystem}
     * @see {@link HrtfSet#filterPositions}
     *
     * @returns {String} as a SOFA JSON file.
     * @throws {Error} when this.filterCoordinateSystem is unknown.
     */

  }, {
    key: 'export',
    value: function _export() {
      var _this3 = this;

      // in a SOFA file, the source positions are the HrtfSet filter positions.

      // SOFA listener is the reference for HrtfSet filter positions
      // which is normalised in HrtfSet

      var SourcePosition = void 0;
      var SourcePositionType = _coordinates2.default.systemType(this.filterCoordinateSystem);
      switch (SourcePositionType) {
        case 'cartesian':
          SourcePosition = this._sofaSourcePosition.map(function (position) {
            return _coordinates2.default.glToSofaCartesian([], position);
          });
          break;

        case 'spherical':
          SourcePosition = this._sofaSourcePosition.map(function (position) {
            return _coordinates2.default.glToSofaSpherical([], position);
          });
          break;

        default:
          throw new Error('Bad source position type ' + SourcePositionType + ' ' + 'for export.');
      }

      var DataIR = this._sofaSourcePosition.map(function (position) {
        // retrieve fir for each position, without conversion
        var fir = _this3._kdt.nearest({ x: position[0], y: position[1], z: position[2] }, 1).pop()[0].fir; // nearest data
        var ir = [];
        for (var channel = 0; channel < fir.numberOfChannels; ++channel) {
          // Float32Array to array for stringify
          ir.push([].concat(_toConsumableArray(fir.getChannelData(channel))));
        }
        return ir;
      });

      return (0, _parseSofa.stringifySofa)({
        name: this._sofaName,
        metaData: this._sofaMetaData,
        ListenerPosition: [0, 0, 0],
        ListenerPositionType: 'cartesian',
        ListenerUp: [0, 0, 1],
        ListenerUpType: 'cartesian',
        ListenerView: [1, 0, 0],
        ListenerViewType: 'cartesian',
        SourcePositionType: SourcePositionType,
        SourcePosition: SourcePosition,
        DataSamplingRate: this._audioContext.sampleRate,
        DataDelay: this._sofaDelay,
        DataIR: DataIR,
        RoomVolume: this._sofaRoomVolume
      });
    }

    /**
     * @typedef {Object} HrtfSet.nearestType
     * @property {Number} distance from the request
     * @property {AudioBuffer} fir 2-channels impulse response
     * @property {Number} index original index in the SOFA set
     * @property {Coordinates} position using coordinateSystem coordinates
     * system.
     */

    /**
     * Get the nearest point in the HRTF set, after a successful load.
     *
     * @see {@link HrtfSet#load}
     *
     * @param {Coordinates} positionRequest
     * @returns {HrtfSet.nearestType}
     */

  }, {
    key: 'nearest',
    value: function nearest(positionRequest) {
      var position = _coordinates2.default.systemToGl([], positionRequest, this.coordinateSystem);
      var nearest = this._kdt.nearest({
        x: position[0],
        y: position[1],
        z: position[2]
      }, 1).pop(); // nearest only
      var data = nearest[0];
      _coordinates2.default.glToSystem(position, [data.x, data.y, data.z], this.coordinateSystem);
      return {
        distance: nearest[1],
        fir: data.fir,
        index: data.index,
        position: position
      };
    }

    /**
     * Get the FIR AudioBuffer that corresponds to the closest position in
     * the set.
     * @param {Coordinates} positionRequest
     * @returns {AudioBuffer}
     */

  }, {
    key: 'nearestFir',
    value: function nearestFir(positionRequest) {
      return this.nearest(positionRequest).fir;
    }

    // ----------- private methods

    /**
     * Creates a kd-tree out of the specified indices, positions, and FIR.
     *
     * @private
     *
     * @param {Array} indicesPositionsFirs
     * @returns {this}
     */

  }, {
    key: '_createKdTree',
    value: function _createKdTree(indicesPositionsFirs) {
      var _this4 = this;

      var positions = indicesPositionsFirs.map(function (value) {
        var impulseResponses = value[2];
        var fir = _this4._audioContext.createBuffer(impulseResponses.length, impulseResponses[0].length, _this4._audioContext.sampleRate);
        impulseResponses.forEach(function (samples, channel) {
          // do not use copyToChannel because of Safari <= 9
          fir.getChannelData(channel).set(samples);
        });

        return {
          index: value[0],
          x: value[1][0],
          y: value[1][1],
          z: value[1][2],
          fir: fir
        };
      });

      this._sofaSourcePosition = positions.map(function (position) {
        return [position.x, position.y, position.z];
      });

      this._kdt = _KdTree2.default.tree.createKdTree(positions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);
      return this;
    }

    /**
     * Asynchronously create Float32Arrays, with possible re-sampling.
     *
     * @private
     *
     * @param {Array.<Number>} indices
     * @param {Array.<Coordinates>} positions
     * @param {Array.<Float32Array>} firs
     * @returns {Promise.<Array|Error>}
     * @throws {Error} assertion that the channel count is 2
     */

  }, {
    key: '_generateIndicesPositionsFirs',
    value: function _generateIndicesPositionsFirs(indices, positions, firs) {
      var _this5 = this;

      var sofaFirsPromises = firs.map(function (sofaFirChannels, index) {
        var channelCount = sofaFirChannels.length;
        if (channelCount !== 2) {
          throw new Error('Bad number of channels' + (' for IR index ' + indices[index]) + (' (' + channelCount + ' instead of 2)'));
        }

        var sofaFirsChannelsPromises = sofaFirChannels.map(function (fir) {
          return (0, _utilities.resampleFloat32Array)({
            inputSamples: fir,
            inputSampleRate: _this5._sofaSampleRate,
            outputSampleRate: _this5._audioContext.sampleRate
          });
        });
        return Promise.all(sofaFirsChannelsPromises).then(function (firChannels) {
          return [indices[index], positions[index], firChannels];
        }).catch(function (error) {
          // re-throw
          throw new Error('Unable to re-sample impulse response ' + index + '. ' + error.message);
        });
      });
      return Promise.all(sofaFirsPromises);
    }

    /**
     * Try to load a data set from a SOFA URL.
     *
     * @private
     *
     * @param {String} sourceUrl
     * @returns {Promise.<Object|Error>}
     */

  }, {
    key: '_loadDataSet',
    value: function _loadDataSet(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var ddsUrl = sourceUrl + '.dds';
        var request = new window.XMLHttpRequest();
        request.open('GET', ddsUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + ddsUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var dds = (0, _parseDataSet.parseDataSet)(request.response);
            resolve(dds);
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + ddsUrl + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Try to load meta-data and positions from a SOFA URL, to get the
     * indices closest to the filter positions.
     *
     * @private
     *
     * @param {String} sourceUrl
     * @returns {Promise.<Array.<Number>|Error>}
     */

  }, {
    key: '_loadMetaAndPositions',
    value: function _loadMetaAndPositions(sourceUrl) {
      var _this6 = this;

      var promise = new Promise(function (resolve, reject) {
        var positionsUrl = sourceUrl + '.json?' + 'ListenerPosition,ListenerUp,ListenerView,SourcePosition,' + 'Data.Delay,Data.SamplingRate,' + 'EmitterPosition,ReceiverPosition,RoomVolume'; // meta

        var request = new window.XMLHttpRequest();
        request.open('GET', positionsUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + positionsUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            (function () {
              var data = (0, _parseSofa.parseSofa)(request.response);
              _this6._setMetaData(data, sourceUrl);

              var sourcePositions = _this6._sourcePositionsToGl(data);
              var hrtfPositions = sourcePositions.map(function (position, index) {
                return {
                  x: position[0],
                  y: position[1],
                  z: position[2],
                  index: index
                };
              });

              var kdt = _KdTree2.default.tree.createKdTree(hrtfPositions, _KdTree2.default.distanceSquared, ['x', 'y', 'z']);

              var nearestIndices = _this6._filterPositions.map(function (current) {
                return kdt.nearest({ x: current[0], y: current[1], z: current[2] }, 1).pop()[0] // nearest data
                .index;
              });

              // filter out duplicates
              nearestIndices = [].concat(_toConsumableArray(new Set(nearestIndices)));

              _this6._sofaUrl = sourceUrl;
              resolve(nearestIndices);
            })();
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + positionsUrl + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Try to load full SOFA URL.
     *
     * @private
     *
     * @param {String} url
     * @returns {Promise.<this|Error>}
     */

  }, {
    key: '_loadSofaFull',
    value: function _loadSofaFull(url) {
      var _this7 = this;

      var promise = new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var data = (0, _parseSofa.parseSofa)(request.response);
            _this7._setMetaData(data, url);
            var sourcePositions = _this7._sourcePositionsToGl(data);
            _this7._generateIndicesPositionsFirs(sourcePositions.map(function (position, index) {
              return index;
            }), // full
            sourcePositions, data['Data.IR'].data).then(function (indicesPositionsFirs) {
              _this7._createKdTree(indicesPositionsFirs);
              _this7._sofaUrl = url;
              resolve(_this7);
            });
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse ' + url + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Try to load partial data from a SOFA URL.
     *
     * @private
     *
     * @param {Array.<String>} sourceUrl
     * @param {Array.<Number>} indices
     * @param {Object} dataSet
     * @returns {Promise.<this|Error>}
     */

  }, {
    key: '_loadSofaPartial',
    value: function _loadSofaPartial(sourceUrl, indices, dataSet) {
      var _this8 = this;

      var urlPromises = indices.map(function (index) {
        var urlPromise = new Promise(function (resolve, reject) {
          var positionUrl = sourceUrl + '.json?' + ('SourcePosition[' + index + '][0:1:' + (dataSet.SourcePosition.C - 1) + '],') + ('Data.IR[' + index + '][0:1:' + (dataSet['Data.IR'].R - 1) + ']') + ('[0:1:' + (dataSet['Data.IR'].N - 1) + ']');

          var request = new window.XMLHttpRequest();
          request.open('GET', positionUrl);
          request.onerror = function () {
            reject(new Error('Unable to GET ' + positionUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
          };

          request.onload = function () {
            if (request.status < 200 || request.status >= 300) {
              request.onerror();
            }

            try {
              var data = (0, _parseSofa.parseSofa)(request.response);
              // (meta-data is already loaded)

              var sourcePositions = _this8._sourcePositionsToGl(data);
              _this8._generateIndicesPositionsFirs([index], sourcePositions, data['Data.IR'].data).then(function (indicesPositionsFirs) {
                // One position per URL here
                // Array made of multiple promises, later
                resolve(indicesPositionsFirs[0]);
              });
            } catch (error) {
              // re-throw
              reject(new Error('Unable to parse ' + positionUrl + '. ' + error.message));
            }
          }; // request.onload

          request.send();
        });

        return urlPromise;
      });

      return Promise.all(urlPromises).then(function (indicesPositionsFirs) {
        _this8._createKdTree(indicesPositionsFirs);
        return _this8; // final resolve
      });
    }

    /**
     * Set meta-data, and assert for supported HRTF type.
     *
     * @private
     *
     * @param {Object} data
     * @param {String} sourceUrl
     * @throws {Error} assertion for FIR data.
     */

  }, {
    key: '_setMetaData',
    value: function _setMetaData(data, sourceUrl) {
      if (typeof data.metaData.DataType !== 'undefined' && data.metaData.DataType !== 'FIR') {
        throw new Error('According to meta-data, SOFA data type is not FIR');
      }

      var dateString = new Date().toISOString();

      this._sofaName = typeof data.name !== 'undefined' ? '' + data.name : 'HRTF.sofa';

      this._sofaMetaData = typeof data.metaData !== 'undefined' ? data.metaData : {};

      // append conversion information
      if (typeof sourceUrl !== 'undefined') {
        this._sofaMetaData.OriginalUrl = sourceUrl;
      }

      this._sofaMetaData.Converter = 'Ircam ' + _info2.default.name + ' ' + _info2.default.version + ' ' + 'javascript API ';
      this._sofaMetaData.DateConverted = dateString;

      this._sofaSampleRate = typeof data['Data.SamplingRate'] !== 'undefined' ? data['Data.SamplingRate'].data[0] : 48000; // Table C.1
      if (this._sofaSampleRate !== this._audioContext.sampleRate) {
        this._sofaMetaData.OriginalSampleRate = this._sofaSampleRate;
      }

      this._sofaDelay = typeof data['Data.Delay'] !== 'undefined' ? data['Data.Delay'].data[0] : 0;

      this._sofaRoomVolume = typeof data.RoomVolume !== 'undefined' ? data.RoomVolume.data[0] : undefined;

      // Convert listener position, up, and view to SOFA cartesian,
      // to generate a SOFA-to-GL look-at mat4.
      // Default SOFA type is 'cartesian' (see table D.4A).

      var listenerPosition = _coordinates2.default.sofaToSofaCartesian([], data.ListenerPosition.data[0], (0, _parseSofa.conformSofaCoordinateSystem)(data.ListenerPosition.Type || 'cartesian'));

      var listenerView = _coordinates2.default.sofaToSofaCartesian([], data.ListenerView.data[0], (0, _parseSofa.conformSofaCoordinateSystem)(data.ListenerView.Type || 'cartesian'));

      var listenerUp = _coordinates2.default.sofaToSofaCartesian([], data.ListenerUp.data[0], (0, _parseSofa.conformSofaCoordinateSystem)(data.ListenerUp.Type || 'cartesian'));

      this._sofaToGl = _glMatrix2.default.mat4.lookAt([], listenerPosition, listenerView, listenerUp);
    }

    /**
     * Convert to GL coordinates, in-place.
     *
     * @private
     *
     * @param {Object} data
     * @returns {Array.<Coordinates>}
     * @throws {Error}
     */

  }, {
    key: '_sourcePositionsToGl',
    value: function _sourcePositionsToGl(data) {
      var _this9 = this;

      var sourcePositions = data.SourcePosition.data; // reference
      var sourceCoordinateSystem = typeof data.SourcePosition.Type !== 'undefined' ? data.SourcePosition.Type : 'spherical'; // default (SOFA Table D.4C)
      switch (sourceCoordinateSystem) {
        case 'cartesian':
          sourcePositions.forEach(function (position) {
            _glMatrix2.default.vec3.transformMat4(position, position, _this9._sofaToGl);
          });
          break;

        case 'spherical':
          sourcePositions.forEach(function (position) {
            _coordinates2.default.sofaSphericalToSofaCartesian(position, position); // in-place
            _glMatrix2.default.vec3.transformMat4(position, position, _this9._sofaToGl);
          });
          break;

        default:
          throw new Error('Bad source position type');
      }

      return sourcePositions;
    }
  }, {
    key: 'coordinateSystem',
    set: function set(system) {
      this._coordinateSystem = typeof system !== 'undefined' ? system : 'gl';
    }

    /**
     * Get coordinate system for positions.
     *
     * @returns {CoordinateSystem}
     */
    ,
    get: function get() {
      return this._coordinateSystem;
    }

    /**
     * Set coordinate system for filter positions.
     *
     * @param {CoordinateSystem} [system] undefined to use coordinateSystem
     */

  }, {
    key: 'filterCoordinateSystem',
    set: function set(system) {
      this._filterCoordinateSystem = typeof system !== 'undefined' ? system : this.coordinateSystem;
    }

    /**
     * Get coordinate system for filter positions.
     */
    ,
    get: function get() {
      return this._filterCoordinateSystem;
    }

    /**
     * Set filter positions.
     *
     * @param {Array.<Coordinates>} [positions] undefined for no filtering.
     */

  }, {
    key: 'filterPositions',
    set: function set(positions) {
      if (typeof positions === 'undefined') {
        this._filterPositions = undefined;
      } else {
        switch (this.filterCoordinateSystem) {
          case 'gl':
            this._filterPositions = positions.map(function (current) {
              return current.slice(0); // copy
            });
            break;

          case 'sofaCartesian':
            this._filterPositions = positions.map(function (current) {
              return _coordinates2.default.sofaCartesianToGl([], current);
            });
            break;

          case 'sofaSpherical':
            this._filterPositions = positions.map(function (current) {
              return _coordinates2.default.sofaSphericalToGl([], current);
            });
            break;

          default:
            throw new Error('Bad filter coordinate system');
        }
      }
    }

    /**
     * Get filter positions.
     */
    ,
    get: function get() {
      var positions = void 0;
      if (typeof this._filterPositions !== 'undefined') {
        switch (this.filterCoordinateSystem) {
          case 'gl':
            positions = this._filterPositions.map(function (current) {
              return current.slice(0); // copy
            });
            break;

          case 'sofaCartesian':
            positions = this._filterPositions.map(function (current) {
              return _coordinates2.default.glToSofaCartesian([], current);
            });
            break;

          case 'sofaSpherical':
            positions = this._filterPositions.map(function (current) {
              return _coordinates2.default.glToSofaSpherical([], current);
            });
            break;

          default:
            throw new Error('Bad filter coordinate system');
        }
      }
      return positions;
    }

    /**
     * Set post-filtering flag. When false, try to load a partial set of
     * HRTF.
     *
     * @param {Boolean} [post=false]
     */

  }, {
    key: 'filterAfterLoad',
    set: function set(post) {
      this._filterAfterLoad = typeof post !== 'undefined' ? post : false;
    }

    /**
     * Get post-filtering flag. When false, try to load a partial set of
     * HRTF.
     *
     * @returns {Boolean}
     */
    ,
    get: function get() {
      return this._filterAfterLoad;
    }

    /**
     * Test whether an HRTF set is actually loaded.
     *
     * @see {@link HrtfSet#load}
     *
     * @returns {Boolean} false before any successful load, true after.
     *
     */

  }, {
    key: 'isReady',
    get: function get() {
      return this._ready;
    }

    /**
     * Get the original name of the HRTF set.
     *
     * @returns {String} that is undefined before a successfully load.
     */

  }, {
    key: 'sofaName',
    get: function get() {
      return this._sofaName;
    }

    /**
     * Get the URL used to actually load the HRTF set.
     *
     * @returns {String} that is undefined before a successfully load.
     */

  }, {
    key: 'sofaUrl',
    get: function get() {
      return this._sofaUrl;
    }

    /**
     * Get the original sample-rate from the SOFA URL already loaded.
     *
     * @returns {Number} that is undefined before a successfully load.
     */

  }, {
    key: 'sofaSampleRate',
    get: function get() {
      return this._sofaSampleRate;
    }

    /**
     * Get the meta-data from the SOFA URL already loaded.
     *
     * @returns {Object} that is undefined before a successfully load.
     */

  }, {
    key: 'sofaMetaData',
    get: function get() {
      return this._sofaMetaData;
    }
  }]);

  return HrtfSet;
}();

exports.default = HrtfSet;
},{"../audio/utilities":40,"../geometry/KdTree":43,"../geometry/coordinates":45,"../info":49,"./parseDataSet":53,"./parseSofa":54,"gl-matrix":56}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerDataBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileOverview Access a remote catalogue from a SOFA server, and get URLs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * with filtering.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Jean-Philippe.Lambert@ircam.fr
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2015-2016 IRCAM, Paris, France
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license BSD-3-Clause
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _parseXml = require('./parseXml');

var _parseXml2 = _interopRequireDefault(_parseXml);

var _parseDataSet = require('./parseDataSet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SOFA remote data-base.
 */

var ServerDataBase = exports.ServerDataBase = function () {
  /**
   * This is only a constructor, it does not load any thing.
   *
   * @see {@link ServerDataBase#loadCatalogue}
   *
   * @param {Object} [options]
   * @param {String} [options.serverUrl] base URL of server, including
   * protocol, eg. 'http://bili2.ircam.fr'. Default protocol is `https:` if
   * `window.location.protocol` is also `https:`, or `http:`, to avoid
   * mixed contents (that are often blocked).
   */

  function ServerDataBase() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerDataBase);

    this._server = options.serverUrl;

    if (typeof this._server === 'undefined') {
      var protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

      this._server = protocol + '//bili2.ircam.fr';
    }

    this._catalogue = {};
    this._urls = [];
  }

  /**
   * Asynchronously load complete catalogue from the server, including the
   * catalogue links found in any partial catalogue.
   *
   * @param {String} [sourceUrl] URL of the root catalogue, including the
   * server, like 'http://bili2.ircam.fr/catalog.xml'.
   *  Default is 'catalog.xml' at serverURL supplied at
   * {@link ServerDataBase#constructor}.
   * @param {Object} [destination] Catalogue to update. Default is
   * internal.
   * @returns {Promise.<String|Error>} The promise will resolve (with
   * sourceUrl) when every sub-catalogue will successfully load, or will
   * reject (with an error) as soon as one transfer fails.
   */


  _createClass(ServerDataBase, [{
    key: 'loadCatalogue',
    value: function loadCatalogue() {
      var _this = this;

      var sourceUrl = arguments.length <= 0 || arguments[0] === undefined ? this._server + '/catalog.xml' : arguments[0];
      var destination = arguments.length <= 1 || arguments[1] === undefined ? this._catalogue : arguments[1];

      var promise = new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open('GET', sourceUrl);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + sourceUrl + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          var xml = (0, _parseXml2.default)(request.response);
          var dataSet = xml.querySelector('dataset');

          // recursive catalogues
          var catalogueReferences = xml.querySelectorAll('dataset > catalogRef');

          if (catalogueReferences.length === 0) {
            // end of recursion
            destination.urls = [];
            var urls = xml.querySelectorAll('dataset > dataset');
            for (var ref = 0; ref < urls.length; ++ref) {
              // data set name already contains a leading slash
              var url = _this._server + dataSet.getAttribute('name') + '/' + urls[ref].getAttribute('name');
              _this._urls.push(url);
              destination.urls.push(url);
            }

            resolve(sourceUrl);
          } else {
            // recursion
            var promises = [];
            for (var _ref = 0; _ref < catalogueReferences.length; ++_ref) {
              var name = catalogueReferences[_ref].getAttribute('name');
              var recursiveUrl = _this._server + dataSet.getAttribute('name') + '/' + catalogueReferences[_ref].getAttribute('xlink:href');
              destination[name] = {};
              promises.push(_this.loadCatalogue(recursiveUrl, destination[name]));
            }

            Promise.all(promises).then(function () {
              _this._urls.sort();
              resolve(sourceUrl);
            }).catch(function (error) {
              reject(error);
            });
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Get URLs, possibly filtered.
     *
     * Any filter can be partial, and is case-insensitive. The result must
     * match every supplied filter. Undefined filters are not applied. For
     * any filter, `|` is the or operator.
     *
     * @param {Object} [options] optional filters
     * @param {String} [options.convention] 'HRIR' or 'SOS'
     * @param {String} [options.dataBase] 'LISTEN', 'BILI', etc.
     * @param {String} [options.equalisation] 'RAW','COMPENSATED'
     * @param {String} [options.sampleRate] in Hertz
     * @param {String} [options.sosOrder] '12order' or '24order'
     * @param {String} [options.freePattern] any pattern matched
     * globally. Use separators (spaces, tabs, etc.) to combine multiple
     * patterns: '44100 listen' will restrict on URLs matching '44100' and
     * 'listen'; '44100|48000 bili|listen' matches ('44100' or '48000') and
     * ('bili' or 'listen').
     * @returns {Array.<String>} URLs that match every filter.
     */

  }, {
    key: 'getUrls',
    value: function getUrls() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // the number and the order of the filters in the following array must
      // match the URL sub-directories
      var filters = [options.convention, options.dataBase, options.equalisation, options.sampleRate, options.sosOrder];

      // any where in URL
      // in file name
      var freePattern = typeof options.freePattern === 'number' ? options.freePattern.toString() : options.freePattern;

      var pattern = filters.reduce(function (global, local) {
        // partial filter inside slashes
        return global + '/' + (typeof local !== 'undefined' ? '[^/]*(?:' + local + ')[^/]*' : '[^/]*');
      }, '');

      var regExp = new RegExp(pattern, 'i');

      var urls = this._urls.filter(function (url) {
        return regExp.test(url);
      });

      if (typeof freePattern !== 'undefined') {
        // split patterns with separators
        var patterns = freePattern.split(/\s+/);
        patterns.forEach(function (current) {
          regExp = new RegExp(current, 'i');

          urls = urls.filter(function (url) {
            return regExp.test(url);
          });
        });
      }

      return urls;
    }

    /**
     * Get the data-set definitions of a given URL.
     *
     * @param {String} sourceUrl is the complete SOFA URL, with the
     * server, like
     * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
     *
     * @returns {Promise.<Object|String>} The promise will resolve after
     * successfully loading, with definitions as * `{definition: {key: values}}`
     * objects; the promise will reject is the transfer fails, with an error.
     */

  }, {
    key: 'getDataSetDefinitions',
    value: function getDataSetDefinitions(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var url = sourceUrl + '.dds';
        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }
          resolve((0, _parseDataSet.parseDataSet)(request.response));
        }; // request.onload

        request.send();
      });

      return promise;
    }

    /**
     * Get all source positions of a given URL.
     *
     * @param {String} sourceUrl is the complete SOFA URL, with the
     * server, like
     * 'http://bili2.ircam.fr/SimpleFreeFieldHRIR/BILI/COMPENSATED/44100/IRC_1100_C_HRIR.sofa'
     *
     * @returns {Promise.<Array<Array.<Number>>|Error>} The promise will resolve
     * after successfully loading, with an array of positions (which are
     * arrays of 3 numbers); the promise will reject is the transfer fails,
     * with an error.
     */

  }, {
    key: 'getSourcePositions',
    value: function getSourcePositions(sourceUrl) {
      var promise = new Promise(function (resolve, reject) {
        var url = sourceUrl + '.json?SourcePosition';

        var request = new window.XMLHttpRequest();
        request.open('GET', url);
        request.onerror = function () {
          reject(new Error('Unable to GET ' + url + ', status ' + request.status + ' ' + ('' + request.responseText)));
        };

        request.onload = function () {
          if (request.status < 200 || request.status >= 300) {
            request.onerror();
            return;
          }

          try {
            var response = JSON.parse(request.response);
            if (response.leaves[0].name !== 'SourcePosition') {
              throw new Error('SourcePosition not found');
            }

            resolve(response.leaves[0].data);
          } catch (error) {
            // re-throw
            reject(new Error('Unable to parse response from ' + url + '. ' + error.message));
          }
        }; // request.onload

        request.send();
      });

      return promise;
    }
  }]);

  return ServerDataBase;
}();

exports.default = ServerDataBase;
},{"./parseDataSet":53,"./parseXml":55}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HrtfSet = require('./HrtfSet');

var _HrtfSet2 = _interopRequireDefault(_HrtfSet);

var _ServerDataBase = require('./ServerDataBase');

var _ServerDataBase2 = _interopRequireDefault(_ServerDataBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileOverview Utility classes to handle the loading of HRTF files form a
 * SOFA server.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

exports.default = {
  HrtfSet: _HrtfSet2.default,
  ServerDataBase: _ServerDataBase2.default
};
},{"./HrtfSet":50,"./ServerDataBase":51}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._parseDimension = _parseDimension;
exports._parseDefinition = _parseDefinition;
exports.parseDataSet = parseDataSet;
/**
 * @fileOverview Parser for DDS files
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

// '[R = 2]'
var _dimensionPattern = '\\[\\s*(\\w+)\\s*=\\s*(\\d+)\\s*\\]';
var _dimensionMatch = new RegExp(_dimensionPattern, 'g');
var _dimensionSplit = new RegExp(_dimensionPattern);

// 'Float64 ReceiverPosition[R = 2][C = 3][I = 1];'
//
// do not re-use dimension pattern (for grouping)
var _definitionPattern = '\\s*(\\w+)\\s*([\\w.]+)\\s*' + '((?:\\[[^\\]]+\\]\\s*)+)' + ';\\s*';
var _definitionMatch = new RegExp(_definitionPattern, 'g');
var _definitionSplit = new RegExp(_definitionPattern);

// `Dataset {
//   Float64 ListenerPosition[I = 1][C = 3];
//   Float64 ListenerUp[I = 1][C = 3];
//   Float64 ListenerView[I = 1][C = 3];
//   Float64 ReceiverPosition[R = 2][C = 3][I = 1];
//   Float64 SourcePosition[M = 1680][C = 3];
//   Float64 EmitterPosition[E = 1][C = 3][I = 1];
//   Float64 Data.SamplingRate[I = 1];
//   Float64 Data.Delay[I = 1][R = 2];
//   Float64 Data.IR[M = 1680][R = 2][N = 941];
//   Float64 RoomVolume[I = 1];
// } IRC_1100_C_HRIR.sofa;`
//
// do not re-use definition pattern (for grouping)
var _dataSetPattern = '\\s*Dataset\\s*\\{\\s*' + '((?:[^;]+;\\s*)*)' + '\\s*\\}\\s*[\\w.]+\\s*;\\s*';
var _dataSetSplit = new RegExp(_dataSetPattern);

/**
 * Parses dimension strings into an array of [key, value] pairs.
 *
 * @private
 * @param {String} input is single or multiple dimension
 * @returns {Array.<Array.<String>>} object [key, value] pairs
 *
 * @example
 * _parseDimension('[R = 2]');
 * // [ [ 'R', 2 ] ]
 *
 * _parseDimension('[R = 2][C = 3][I = 1]');
 * // [ [ 'R', 2 ], [ 'C', 3 ], [ 'I', 1 ] ]
 */
function _parseDimension(input) {
  var parse = [];
  var inputs = input.match(_dimensionMatch);
  if (inputs !== null) {
    inputs.forEach(function (inputSingle) {
      var parts = _dimensionSplit.exec(inputSingle);
      if (parts !== null && parts.length > 2) {
        parse.push([parts[1], Number(parts[2])]);
      }
    });
  }
  return parse;
}

/**
 * Parse definition strings into an array of [key, {values}] pairs.
 *
 * @param {String} input is single or multiple definition
 * @returns {Array.<Array<String,Object>>} [key, {values}] pairs
 *
 * @private
 * @example
 * _parseDefinition('Float64 ReceiverPosition[R = 2][C = 3][I = 1];');
 * // [ [ 'ReceiverPosition',
 * //     { type: 'Float64', R: 2, C: 3, I: 1 } ] ]
 *
 * _parseDefinition(
 * `    Float64 ReceiverPosition[R = 2][C = 3][I = 1];
 *      Float64 SourcePosition[M = 1680][C = 3];
 *      Float64 EmitterPosition[E = 1][C = 3][I = 1];`);
 * // [ [ 'ReceiverPosition',
 * //      { type: 'Float64', R: 2, C: 3, I: 1 } ],
 * //   [ 'SourcePosition', { type: 'Float64', M: 1680, C: 3 } ],
 * //   [ 'EmitterPosition',
 * //     { type: 'Float64', E: 1, C: 3, I: 1 } ] ]
 */
function _parseDefinition(input) {
  var parse = [];
  var inputs = input.match(_definitionMatch);
  if (inputs !== null) {
    inputs.forEach(function (inputSingle) {
      var parts = _definitionSplit.exec(inputSingle);
      if (parts !== null && parts.length > 3) {
        (function () {
          var current = [];
          current[0] = parts[2];
          current[1] = {};
          current[1].type = parts[1];
          _parseDimension(parts[3]).forEach(function (dimension) {
            current[1][dimension[0]] = dimension[1];
          });
          parse.push(current);
        })();
      }
    });
  }
  return parse;
}

/**
 * Parse data set meta data into an object of `{definition: {key: values}}` objects.
 *
 * @param {String} input data set DDS-like.
 * @returns {Object} definitions as `{definition: {key: values}}` objects.
 *
 * @example
 * _parseDataSet(
 * `Dataset {
 *      Float64 ReceiverPosition[R = 2][C = 3][I = 1];
 *      Float64 SourcePosition[M = 1680][C = 3];
 *      Float64 EmitterPosition[E = 1][C = 3][I = 1];
 *      Float64 Data.SamplingRate[I = 1];
 * } IRC_1100_C_HRIR.sofa;`);
 * //  { ReceiverPosition: { type: 'Float64', R: 2, C: 3, I: 1 },
 * //    SourcePosition: { type: 'Float64', M: 1680, C: 3 },
 * //    EmitterPosition: { type: 'Float64', E: 1, C: 3, I: 1 }
 * //    'Data.SamplingRate': { type: 'Float64', I: 1 } }
 */
function parseDataSet(input) {
  var parse = {};
  var definitions = _dataSetSplit.exec(input);
  if (definitions !== null && definitions.length > 1) {
    _parseDefinition(definitions[1]).forEach(function (definition) {
      parse[definition[0]] = definition[1];
    });
  }
  return parse;
}

exports.default = parseDataSet;
},{}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.parseSofa = parseSofa;
exports.stringifySofa = stringifySofa;
exports.conformSofaCoordinateSystem = conformSofaCoordinateSystem;
/**
 * @fileOverview Parser functions for SOFA files
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Parses a SOFA JSON string with into an object with `name`, `data` and
 * `metaData` attributes.
 *
 * @see {@link stringifySofa}
 *
 * @param {String} sofaString in SOFA JSON format
 * @returns {Object} with `data` and `metaData` attributes
 * @throws {Error} when the parsing fails
 */
function parseSofa(sofaString) {
  try {
    var _ret = function () {
      var sofa = JSON.parse(sofaString);
      var sofaSet = {};

      sofaSet.name = sofa.name;

      if (typeof sofa.attributes !== 'undefined') {
        sofaSet.metaData = {};
        var metaData = sofa.attributes.find(function (e) {
          return e.name === 'NC_GLOBAL';
        });
        if (typeof metaData !== 'undefined') {
          metaData.attributes.forEach(function (e) {
            sofaSet.metaData[e.name] = e.value[0];
          });
        }
      }

      if (typeof sofa.leaves !== 'undefined') {
        var data = sofa.leaves;
        data.forEach(function (d) {
          sofaSet[d.name] = {};
          d.attributes.forEach(function (a) {
            sofaSet[d.name][a.name] = a.value[0];
          });
          sofaSet[d.name].shape = d.shape;
          sofaSet[d.name].data = d.data;
        });
      }

      return {
        v: sofaSet
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    throw new Error('Unable to parse SOFA string. ' + error.message);
  }
}

/**
 * Generates a SOFA JSON string from an object.
 *
 * Note that the properties differ from either an {@link HrtfSet} and from
 * the result of the parsing of a SOFA JSON. In particular, the listener
 * attributes correspond to the reference for the filters; the source
 * positions are the positions in the data-base.
 *
 * @see {@link parseSofa}
 * @see {@link HrtfSet}
 *
 * @param {Object} sofaSet
 * @param {Coordinates} sofaSet.ListenerPosition
 * @param {CoordinateSystem} sofaSet.ListenerPositionType
 * @param {Coordinates} sofaSet.ListenerUp
 * @param {CoordinateSystem} sofaSet.ListenerUpType
 * @param {Coordinates} sofaSet.ListenerView
 * @param {CoordinateSystem} sofaSet.ListenerViewType
 * @param {Array.<Array.<Number>>} sofaSet.SourcePosition
 * @param {CoordinateSystem} sofaSet.SourcePositionType
 * @param {Number} sofaSet.DataSamplingRate
 * @param {Array.<Array.<Array.<Number>>>} sofaSet.DataIR
 * @param {Array.<Number>} sofaSet.RoomVolume
 * @returns {String} in SOFA JSON format
 * @throws {Error} when the export fails, because of missing data or
 * unknown coordinate system
 */
function stringifySofa(sofaSet) {
  var sofa = {};

  if (typeof sofaSet.name !== 'undefined') {
    sofa.name = sofaSet.name;
  }

  if (typeof sofaSet.metaData !== 'undefined') {
    sofa.attributes = [];
    var ncGlobal = {
      name: 'NC_GLOBAL',
      attributes: []
    };

    for (var attribute in sofaSet.metaData) {
      if (sofaSet.metaData.hasOwnProperty(attribute)) {
        ncGlobal.attributes.push({
          name: attribute,
          value: [sofaSet.metaData[attribute]]
        });
      }
    }

    sofa.attributes.push(ncGlobal);
  }

  // always the same;
  var type = 'Float64';

  var attributes = void 0;

  sofa.leaves = [];

  [['ListenerPosition', 'ListenerPositionType'], ['ListenerUp', 'ListenerUpType'], ['ListenerView', 'ListenerViewType']].forEach(function (listenerAttributeAndType) {
    var listenerAttributeName = listenerAttributeAndType[0];
    var listenerAttribute = sofaSet[listenerAttributeName];
    var listenerType = sofaSet[listenerAttributeAndType[1]];
    if (typeof listenerAttribute !== 'undefined') {
      switch (listenerType) {
        case 'cartesian':
          attributes = [{ name: 'Type', value: ['cartesian'] }, { name: 'Units', value: ['metre, metre, metre'] }];
          break;

        case 'spherical':
          attributes = [{ name: 'Type', value: ['spherical'] }, { name: 'Units', value: ['degree, degree, metre'] }];
          break;

        default:
          throw new Error('Unknown coordinate system type ' + (listenerType + ' for ' + listenerAttribute));
      }
      // in SOFA, everything is contained by an array, even an array.
      sofa.leaves.push({
        name: listenerAttributeName,
        type: type,
        attributes: attributes,
        shape: [1, 3],
        data: [listenerAttribute]
      });
    }
  });

  if (typeof sofaSet.SourcePosition !== 'undefined') {
    switch (sofaSet.SourcePositionType) {
      case 'cartesian':
        attributes = [{ name: 'Type', value: ['cartesian'] }, { name: 'Units', value: ['metre, metre, metre'] }];
        break;

      case 'spherical':
        attributes = [{ name: 'Type', value: ['spherical'] }, { name: 'Units', value: ['degree, degree, metre'] }];
        break;

      default:
        throw new Error('Unknown coordinate system type ' + ('' + sofaSet.SourcePositionType));
    }
    sofa.leaves.push({
      name: 'SourcePosition',
      type: type,
      attributes: attributes,
      shape: [sofaSet.SourcePosition.length, sofaSet.SourcePosition[0].length],
      data: sofaSet.SourcePosition
    });
  }

  if (typeof sofaSet.DataSamplingRate !== 'undefined') {
    sofa.leaves.push({
      name: 'Data.SamplingRate',
      type: type,
      attributes: [{ name: 'Unit', value: 'hertz' }],
      shape: [1],
      data: [sofaSet.DataSamplingRate]
    });
  } else {
    throw new Error('No data sampling-rate');
  }

  if (typeof sofaSet.DataDelay !== 'undefined') {
    sofa.leaves.push({
      name: 'Data.Delay',
      type: type,
      attributes: [],
      shape: [1, sofaSet.DataDelay.length],
      data: [sofaSet.DataDelay]
    });
  }

  if (typeof sofaSet.DataIR !== 'undefined') {
    sofa.leaves.push({
      name: 'Data.IR',
      type: type,
      attributes: [],
      shape: [sofaSet.DataIR.length, sofaSet.DataIR[0].length, sofaSet.DataIR[0][0].length],
      data: sofaSet.DataIR
    });
  } else {
    throw new Error('No data IR');
  }

  if (typeof sofaSet.RoomVolume !== 'undefined') {
    sofa.leaves.push({
      name: 'RoomVolume',
      type: type,
      attributes: [{ name: 'Units', value: ['cubic metre'] }],
      shape: [1],
      data: [sofaSet.RoomVolume]
    });
  }

  sofa.nodes = [];

  return JSON.stringify(sofa);
}

/**
 * Prefix SOFA coordinate system with `sofa`.
 *
 * @param {String} system : either `cartesian` or `spherical`
 * @returns {String} either `sofaCartesian` or `sofaSpherical`
 * @throws {Error} if system is unknown
 */
function conformSofaCoordinateSystem(system) {
  var type = void 0;

  switch (system) {
    case 'cartesian':
      type = 'sofaCartesian';
      break;

    case 'spherical':
      type = 'sofaSpherical';
      break;

    default:
      throw new Error('Bad SOFA type ' + system);
  }
  return type;
}

exports.default = {
  parseSofa: parseSofa,
  conformSofaCoordinateSystem: conformSofaCoordinateSystem
};
},{}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @fileOverview Simple XML parser, as a DOM parser.
 * @author Jean-Philippe.Lambert@ircam.fr
 * @copyright 2015-2016 IRCAM, Paris, France
 * @license BSD-3-Clause
 */

/**
 * Parse an XML string into an XMLDocument object, using native browser DOM
 * parser.
 *
 * It requires a browser environment.
 *
 * @function parseXml
 * @param {String} xmlStr full valid XML data.
 * @returns {Object} XMLDocument, DOM-like. (Use any selector.)
 *
 * @example
 * const request = new window.XMLHttpRequest();
 * request.open('GET', 'http://bili2.ircam.fr/catalog.xml');
 * request.onerror =  () => {
 *    throw new Error(`Unable to GET: ${request.status}`);
 * };
 * request.onload = () => {
 *   const xml = parseXml(request.response);
 *   const catalogueReferences = xml.querySelector('dataset > catalogRef');
 *   console.log(catalogueReferences);
 * }
 * request.send();
 */
var parseXml = exports.parseXml = void 0;

if (typeof window.DOMParser !== 'undefined') {
  exports.parseXml = parseXml = function parseXmlDOM(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
  };
} else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
  exports.parseXml = parseXml = function parseXmlActiveX(xmlStr) {
    var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);
    return xmlDoc;
  };
} else {
  throw new Error('No XML parser found');
}

exports.default = parseXml;
},{}],56:[function(require,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.2
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = require("./gl-matrix/common.js");
exports.mat2 = require("./gl-matrix/mat2.js");
exports.mat2d = require("./gl-matrix/mat2d.js");
exports.mat3 = require("./gl-matrix/mat3.js");
exports.mat4 = require("./gl-matrix/mat4.js");
exports.quat = require("./gl-matrix/quat.js");
exports.vec2 = require("./gl-matrix/vec2.js");
exports.vec3 = require("./gl-matrix/vec3.js");
exports.vec4 = require("./gl-matrix/vec4.js");
},{"./gl-matrix/common.js":57,"./gl-matrix/mat2.js":58,"./gl-matrix/mat2d.js":59,"./gl-matrix/mat3.js":60,"./gl-matrix/mat4.js":61,"./gl-matrix/quat.js":62,"./gl-matrix/vec2.js":63,"./gl-matrix/vec3.js":64,"./gl-matrix/vec4.js":65}],57:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Configuration Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;
glMatrix.ENABLE_SIMD = false;

// Capability detection
glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    glMatrix.ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * 
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
glMatrix.equals = function(a, b) {
	return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}

module.exports = glMatrix;

},{}],58:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
mat2.fromValues = function(m00, m01, m10, m11) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
mat2.set = function(out, m00, m01, m10, m11) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m10;
    out[3] = m11;
    return out;
};


/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link mat2.subtract}
 * @function
 */
mat2.sub = mat2.subtract;

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
mat2.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
mat2.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

module.exports = mat2;

},{"./common.js":57}],59:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
mat2d.fromValues = function(a, b, c, d, tx, ty) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
mat2d.set = function(out, a, b, c, d, tx, ty) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    return out;
};

/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
mat2d.sub = mat2d.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
mat2d.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    return out;
};

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
mat2d.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat2d.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
};

module.exports = mat2d;

},{"./common.js":57}],60:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
mat3.fromValues = function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
mat3.set = function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
};

/**
 * Alias for {@link mat3.subtract}
 * @function
 */
mat3.sub = mat3.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
mat3.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
};

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
mat3.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    return out;
};

/*
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && 
           a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
           a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = a[6], b7 = b[7], b8 = b[8];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
};


module.exports = mat3;

},{"./common.js":57}],61:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {
  scalar: {},
  SIMD: {},
};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
mat4.fromValues = function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
mat4.set = function(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }

    return out;
};

/**
 * Transpose the values of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.transpose = function(out, a) {
    var a0, a1, a2, a3,
        tmp01, tmp23,
        out0, out1, out2, out3;

    a0 = SIMD.Float32x4.load(a, 0);
    a1 = SIMD.Float32x4.load(a, 4);
    a2 = SIMD.Float32x4.load(a, 8);
    a3 = SIMD.Float32x4.load(a, 12);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
    out0  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out1  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 0,  out0);
    SIMD.Float32x4.store(out, 4,  out1);

    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
    out2  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    out3  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    SIMD.Float32x4.store(out, 8,  out2);
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Transpse a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose;

/**
 * Inverts a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Inverts a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.invert = function(out, a) {
  var row0, row1, row2, row3,
      tmp1,
      minor0, minor1, minor2, minor3,
      det,
      a0 = SIMD.Float32x4.load(a, 0),
      a1 = SIMD.Float32x4.load(a, 4),
      a2 = SIMD.Float32x4.load(a, 8),
      a3 = SIMD.Float32x4.load(a, 12);

  // Compute matrix adjugate
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  // Compute matrix determinant
  det   = SIMD.Float32x4.mul(row0, minor0);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
  tmp1  = SIMD.Float32x4.reciprocalApproximation(det);
  det   = SIMD.Float32x4.sub(
               SIMD.Float32x4.add(tmp1, tmp1),
               SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
  det   = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
  if (!det) {
      return null;
  }

  // Compute matrix inverse
  SIMD.Float32x4.store(out, 0,  SIMD.Float32x4.mul(det, minor0));
  SIMD.Float32x4.store(out, 4,  SIMD.Float32x4.mul(det, minor1));
  SIMD.Float32x4.store(out, 8,  SIMD.Float32x4.mul(det, minor2));
  SIMD.Float32x4.store(out, 12, SIMD.Float32x4.mul(det, minor3));
  return out;
}

/**
 * Inverts a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert;

/**
 * Calculates the adjugate of a mat4 not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.scalar.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.SIMD.adjoint = function(out, a) {
  var a0, a1, a2, a3;
  var row0, row1, row2, row3;
  var tmp1;
  var minor0, minor1, minor2, minor3;

  var a0 = SIMD.Float32x4.load(a, 0);
  var a1 = SIMD.Float32x4.load(a, 4);
  var a2 = SIMD.Float32x4.load(a, 8);
  var a3 = SIMD.Float32x4.load(a, 12);

  // Transpose the source matrix.  Sort of.  Not a true transpose operation
  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

  tmp1   = SIMD.Float32x4.mul(row2, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.mul(row1, tmp1);
  minor1 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row1, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
  minor3 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
  minor2 = SIMD.Float32x4.mul(row0, tmp1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

  tmp1   = SIMD.Float32x4.mul(row0, row1);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row3);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

  tmp1   = SIMD.Float32x4.mul(row0, row2);
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

  SIMD.Float32x4.store(out, 0,  minor0);
  SIMD.Float32x4.store(out, 4,  minor1);
  SIMD.Float32x4.store(out, 8,  minor2);
  SIMD.Float32x4.store(out, 12, minor3);
  return out;
};

/**
 * Calculates the adjugate of a mat4 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
 mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's explicitly using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand, must be a Float32Array
 * @param {mat4} b the second operand, must be a Float32Array
 * @returns {mat4} out
 */
mat4.SIMD.multiply = function (out, a, b) {
    var a0 = SIMD.Float32x4.load(a, 0);
    var a1 = SIMD.Float32x4.load(a, 4);
    var a2 = SIMD.Float32x4.load(a, 8);
    var a3 = SIMD.Float32x4.load(a, 12);

    var b0 = SIMD.Float32x4.load(b, 0);
    var out0 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 0, out0);

    var b1 = SIMD.Float32x4.load(b, 4);
    var out1 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2),
                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 4, out1);

    var b2 = SIMD.Float32x4.load(b, 8);
    var out2 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1),
                       SIMD.Float32x4.add(
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2),
                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 8, out2);

    var b3 = SIMD.Float32x4.load(b, 12);
    var out3 = SIMD.Float32x4.add(
                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0),
                   SIMD.Float32x4.add(
                        SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1),
                        SIMD.Float32x4.add(
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2),
                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
    SIMD.Float32x4.store(out, 12, out3);

    return out;
};

/**
 * Multiplies two mat4's explicitly not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.scalar.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Multiplies two mat4's using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.scalar.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.SIMD.translate = function (out, a, v) {
    var a0 = SIMD.Float32x4.load(a, 0),
        a1 = SIMD.Float32x4.load(a, 4),
        a2 = SIMD.Float32x4.load(a, 8),
        a3 = SIMD.Float32x4.load(a, 12),
        vec = SIMD.Float32x4(v[0], v[1], v[2] , 0);

    if (a !== out) {
        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
        out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
    }

    a0 = SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
    a1 = SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
    a2 = SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));

    var t0 = SIMD.Float32x4.add(a0, SIMD.Float32x4.add(a1, SIMD.Float32x4.add(a2, a3)));
    SIMD.Float32x4.store(out, 12, t0);

    return out;
};

/**
 * Translates a mat4 by the given vector using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate;

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scalar.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.SIMD.scale = function(out, a, v) {
    var a0, a1, a2;
    var vec = SIMD.Float32x4(v[0], v[1], v[2], 0);

    a0 = SIMD.Float32x4.load(a, 0);
    SIMD.Float32x4.store(
        out, 0, SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0)));

    a1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(
        out, 4, SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1)));

    a2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(
        out, 8, SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2)));

    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3 using SIMD if available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 */
mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale;

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateX = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
      out[0]  = a[0];
      out[1]  = a[1];
      out[2]  = a[2];
      out[3]  = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_1 = SIMD.Float32x4.load(a, 4);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_2, c), SIMD.Float32x4.mul(a_1, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis using SIMD if availabe and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX;

/**
 * Rotates a matrix by the given angle around the Y axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateY = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_2 = SIMD.Float32x4.load(a, 8);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_2, s)));
    SIMD.Float32x4.store(out, 8,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, s), SIMD.Float32x4.mul(a_2, c)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY;

/**
 * Rotates a matrix by the given angle around the Z axis not using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.scalar.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis using SIMD
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.SIMD.rotateZ = function (out, a, rad) {
    var s = SIMD.Float32x4.splat(Math.sin(rad)),
        c = SIMD.Float32x4.splat(Math.cos(rad));

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    var a_0 = SIMD.Float32x4.load(a, 0);
    var a_1 = SIMD.Float32x4.load(a, 4);
    SIMD.Float32x4.store(out, 0,
                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_1, s)));
    SIMD.Float32x4.store(out, 4,
                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_0, s)));
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis if SIMD available and enabled
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
 mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ;

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);

    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
mat4.getTranslation = function (out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
};

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
mat4.getRotation = function (out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat[0] + mat[5] + mat[10];
  var S = 0;

  if (trace > 0) { 
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S; 
    out[2] = (mat[1] - mat[4]) / S; 
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) { 
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S; 
    out[2] = (mat[8] + mat[2]) / S; 
  } else if (mat[5] > mat[10]) { 
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S; 
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S; 
  } else { 
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;

    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,

      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
};

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
};

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
};

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
mat4.sub = mat4.subtract;

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
mat4.multiplyScalar = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
};

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
mat4.multiplyScalarAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    out[4] = a[4] + (b[4] * scale);
    out[5] = a[5] + (b[5] * scale);
    out[6] = a[6] + (b[6] * scale);
    out[7] = a[7] + (b[7] * scale);
    out[8] = a[8] + (b[8] * scale);
    out[9] = a[9] + (b[9] * scale);
    out[10] = a[10] + (b[10] * scale);
    out[11] = a[11] + (b[11] * scale);
    out[12] = a[12] + (b[12] * scale);
    out[13] = a[13] + (b[13] * scale);
    out[14] = a[14] + (b[14] * scale);
    out[15] = a[15] + (b[15] * scale);
    return out;
};

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && 
           a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && 
           a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
           a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
};

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
mat4.equals = function (a, b) {
    var a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3],
        a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7], 
        a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11], 
        a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

    var b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3],
        b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7], 
        b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11], 
        b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
            Math.abs(a9 - b9) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
            Math.abs(a10 - b10) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
            Math.abs(a11 - b11) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
            Math.abs(a12 - b12) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
            Math.abs(a13 - b13) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
            Math.abs(a14 - b14) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
            Math.abs(a15 - b15) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
};



module.exports = mat4;

},{"./common.js":57}],62:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");
var mat3 = require("./mat3.js");
var vec3 = require("./vec3.js");
var vec4 = require("./vec4.js");

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
quat.getAxisAngle = function(out_axis, q) {
    var rad = Math.acos(q[3]) * 2.0;
    var s = Math.sin(rad / 2.0);
    if (s != 0.0) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
    } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
    }
    return rad;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.exactEquals = vec4.exactEquals;

/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
quat.equals = vec4.equals;

module.exports = quat;

},{"./common.js":57,"./mat3.js":60,"./vec3.js":64,"./vec4.js":65}],63:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
vec2.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
vec2.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
vec2.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec2.equals = function (a, b) {
    var a0 = a[0], a1 = a[1];
    var b0 = b[0], b1 = b[1];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
};

module.exports = vec2;

},{"./common.js":57}],64:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
vec3.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
};

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
vec3.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
vec3.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec3.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};

module.exports = vec3;

},{"./common.js":57}],65:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
vec4.ceil = function (out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
};

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
vec4.floor = function (out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
};

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
vec4.round = function (out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.exactEquals = function (a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
vec4.equals = function (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
};

module.exports = vec4;

},{"./common.js":57}],66:[function(require,module,exports){
/**
 * AUTHOR OF INITIAL JS LIBRARY
 * k-d Tree JavaScript - V 1.0
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */


function Node(obj, dimension, parent) {
  this.obj = obj;
  this.left = null;
  this.right = null;
  this.parent = parent;
  this.dimension = dimension;
}

function KdTree(points, metric, dimensions) {

  var self = this;
  
  function buildTree(points, depth, parent) {
    var dim = depth % dimensions.length,
      median,
      node;

    if (points.length === 0) {
      return null;
    }
    if (points.length === 1) {
      return new Node(points[0], dim, parent);
    }

    points.sort(function (a, b) {
      return a[dimensions[dim]] - b[dimensions[dim]];
    });

    median = Math.floor(points.length / 2);
    node = new Node(points[median], dim, parent);
    node.left = buildTree(points.slice(0, median), depth + 1, node);
    node.right = buildTree(points.slice(median + 1), depth + 1, node);

    return node;
  }

  this.root = buildTree(points, 0, null);

  this.insert = function (point) {
    function innerSearch(node, parent) {

      if (node === null) {
        return parent;
      }

      var dimension = dimensions[node.dimension];
      if (point[dimension] < node.obj[dimension]) {
        return innerSearch(node.left, node);
      } else {
        return innerSearch(node.right, node);
      }
    }

    var insertPosition = innerSearch(this.root, null),
      newNode,
      dimension;

    if (insertPosition === null) {
      this.root = new Node(point, 0, null);
      return;
    }

    newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
    dimension = dimensions[insertPosition.dimension];

    if (point[dimension] < insertPosition.obj[dimension]) {
      insertPosition.left = newNode;
    } else {
      insertPosition.right = newNode;
    }
  };

  this.remove = function (point) {
    var node;

    function nodeSearch(node) {
      if (node === null) {
        return null;
      }

      if (node.obj === point) {
        return node;
      }

      var dimension = dimensions[node.dimension];

      if (point[dimension] < node.obj[dimension]) {
        return nodeSearch(node.left, node);
      } else {
        return nodeSearch(node.right, node);
      }
    }

    function removeNode(node) {
      var nextNode,
        nextObj,
        pDimension;

      function findMax(node, dim) {
        var dimension,
          own,
          left,
          right,
          max;

        if (node === null) {
          return null;
        }

        dimension = dimensions[dim];
        if (node.dimension === dim) {
          if (node.right !== null) {
            return findMax(node.right, dim);
          }
          return node;
        }

        own = node.obj[dimension];
        left = findMax(node.left, dim);
        right = findMax(node.right, dim);
        max = node;

        if (left !== null && left.obj[dimension] > own) {
          max = left;
        }

        if (right !== null && right.obj[dimension] > max.obj[dimension]) {
          max = right;
        }
        return max;
      }

      function findMin(node, dim) {
        var dimension,
          own,
          left,
          right,
          min;

        if (node === null) {
          return null;
        }

        dimension = dimensions[dim];

        if (node.dimension === dim) {
          if (node.left !== null) {
            return findMin(node.left, dim);
          }
          return node;
        }

        own = node.obj[dimension];
        left = findMin(node.left, dim);
        right = findMin(node.right, dim);
        min = node;

        if (left !== null && left.obj[dimension] < own) {
          min = left;
        }
        if (right !== null && right.obj[dimension] < min.obj[dimension]) {
          min = right;
        }
        return min;
      }

      if (node.left === null && node.right === null) {
        if (node.parent === null) {
          self.root = null;
          return;
        }

        pDimension = dimensions[node.parent.dimension];

        if (node.obj[pDimension] < node.parent.obj[pDimension]) {
          node.parent.left = null;
        } else {
          node.parent.right = null;
        }
        return;
      }

      if (node.left !== null) {
        nextNode = findMax(node.left, node.dimension);
      } else {
        nextNode = findMin(node.right, node.dimension);
      }

      nextObj = nextNode.obj;
      removeNode(nextNode);
      node.obj = nextObj;

    }

    node = nodeSearch(self.root);

    if (node === null) { return; }

    removeNode(node);
  };

  this.nearest = function (point, maxNodes, maxDistance) {
    var i,
      result,
      bestNodes;

    bestNodes = new BinaryHeap(
      function (e) { return -e[1]; }
    );

    function nearestSearch(node) {
      if(!self.root){
        return [];
      }
      var bestChild,
        dimension = dimensions[node.dimension],
        ownDistance = metric(point, node.obj),
        linearPoint = {},
        linearDistance,
        otherChild,
        i;

      function saveNode(node, distance) {
        bestNodes.push([node, distance]);
        if (bestNodes.size() > maxNodes) {
          bestNodes.pop();
        }
      }

      for (i = 0; i < dimensions.length; i += 1) {
        if (i === node.dimension) {
          linearPoint[dimensions[i]] = point[dimensions[i]];
        } else {
          linearPoint[dimensions[i]] = node.obj[dimensions[i]];
        }
      }

      linearDistance = metric(linearPoint, node.obj);

      if (node.right === null && node.left === null) {
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }
        return;
      }

      if (node.right === null) {
        bestChild = node.left;
      } else if (node.left === null) {
        bestChild = node.right;
      } else {
        if (point[dimension] < node.obj[dimension]) {
          bestChild = node.left;
        } else {
          bestChild = node.right;
        }
      }

      nearestSearch(bestChild);

      if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
        saveNode(node, ownDistance);
      }

      if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
        if (bestChild === node.left) {
          otherChild = node.right;
        } else {
          otherChild = node.left;
        }
        if (otherChild !== null) {
          nearestSearch(otherChild);
        }
      }
    }

    if (maxDistance) {
      for (i = 0; i < maxNodes; i += 1) {
        bestNodes.push([null, maxDistance]);
      }
    }

    nearestSearch(self.root);

    result = [];

    for (i = 0; i < maxNodes && i < bestNodes.content.length; i += 1) {
      if (bestNodes.content[i][0]) {
        result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
      }
    }
    return result;
  };

  this.balanceFactor = function () {
    function height(node) {
      if (node === null) {
        return 0;
      }
      return Math.max(height(node.left), height(node.right)) + 1;
    }

    function count(node) {
      if (node === null) {
        return 0;
      }
      return count(node.left) + count(node.right) + 1;
    }

    return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
  };
}

// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html

function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  peek: function() {
    return this.content[0];
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score)){
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

module.exports = {
  createKdTree: function (points, metric, dimensions) {
    return new KdTree(points, metric, dimensions)
  }
}

},{}],67:[function(require,module,exports){
module.exports={
  "name": "binaural",
  "exports": "binaural",
  "version": "0.3.10",
  "description": "Processing audio node which spatializes an incoming audio stream in three-dimensional space for binaural audio",
  "main": "./dist/",
  "standalone": "binaural",
  "scripts": {
    "lint": "eslint ./src/ ./test/ && jscs --verbose ./src/ ./test/",
    "lint-examples": "eslint -c examples/.eslintrc ./examples/*.html",
    "compile": "rm -rf ./dist && babel ./src/ --out-dir ./dist/",
    "browserify": "browserify ./src/index.js -t [ babelify ] --standalone binaural > binaural.js",
    "bundle": "npm run lint && npm run lint-examples && npm run test && npm run doc && npm run compile && npm run browserify",
    "doc": "esdoc -c esdoc.json",
    "test": "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | tape-run",
    "test-browser": "browserify test/*/*.js -t [ babelify ] --exclude 'test/*/*_listen.js*' --exclude 'test/*/*_issues.js' | testling -u",
    "test-listen": "browserify test/*/*_listen.js -t [ babelify ] | tape-run",
    "test-issues": "browserify test/*/*_issues.js -t [ babelify ] | tape-run",
    "watch": "watch 'npm run browserify && echo $( date ): browserified' ./src/"
  },
  "authors": [
    "Jean-Philippe.Lambert@ircam.fr",
    "Arnau Julià <arnau.julia@gmail.com>",
    "Samuel.Goldszmidt@ircam.fr"
  ],
  "license": "BSD-3-Clause",
  "dependencies": {
    "gl-matrix": "^2.3.1",
    "kd.tree": "git+https://github.com/akshaylive/node-kdt#39bc780704a324393bca68a17cf7bc71be8544c6"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Ircam-RnD/binauralFIR"
  },
  "engines": {
    "node": "0.12 || 4",
    "npm": ">=1.0.0 <3.0.0"
  },
  "devDependencies": {
    "babel-cli": "^6.5.1",
    "babel-eslint": "^4.1.8",
    "babel-preset-es2015": "^6.5.0",
    "babelify": "^7.2.0",
    "blue-tape": "^0.1.11",
    "browserify": "^12.0.2",
    "esdoc": "^0.4.6",
    "eslint": "^1.10.3",
    "eslint-config-airbnb": "^1.0.2",
    "eslint-plugin-html": "^1.4.0",
    "jscs": "2.11.0",
    "jscs-jsdoc": "^1.3.1",
    "tape": "^4.4.0",
    "tape-run": "^2.1.2",
    "testling": "^1.7.1",
    "watch": "^0.17.1"
  },
  "readme": "# Binaural #\n\nThis library permits to render sources in three-dimensional space with\nbinaural audio.\n\nThis library provides an access to a server, in order to load a set of\nHead-related transfer functions ([HRTF]). The set of filters applies to any\nnumber of sources, given their position, and a listener.\n\nThis library is compatible with the [Web Audio API]. The novelty of this\nlibrary is that it permits to use a custom [HRTF] dataset (see\n[T. Carpentier article]).\n\nIt is possible to use it without a server, with a direct URL to an [HRTF]\nset.\n\n## Documentation ##\n\nYou can consult the [API documentation] for the complete documentation.\n\n### BinauralPanner ###\n\nA `BinauralPanner` is a panner for use with the [Web Audio API]. It\nspatialises multiple audio sources, given a set of head-related transfer\nfunctions [HRTF]s, and a listener.\n\n### ServerDataBase ###\n\n**The public server that hosts a database of individual [HRTF]s is available\nfor beta-testers only and will open to public in 2016.**\n\nThe `ServerDataBase` retrieves a catalogue from a [SOFA] server. From the\ncatalogue, it get URLs matching optional filters: data-base, sample-rate,\nand any free pattern.\n\n### HRTF dataset ###\n\nYou can use any [HRTF] data-set that follows the [SOFA] standard, in JSON\nformat, using finite impulse responses (FIR). Second-order sections (SOS)\nare not supported, yet. See the [examples HRTF directory] for a few samples.\n\n### Coordinate system types ###\n\nSee the files in [src/geometry], for conversions:\n- OpenGL, [SOFA], and Spat4 (Ircam) conventions\n- cartesian and spherical coordinates\n- radian and degree angles\n\n\n## Examples ##\n\nPlease see the [examples directory] for complete code, and the [examples online].\n\nSee also the [API documentation] for the complete options.\n\n### BinauralPanner ###\nGiven an audio element, and a global binaural module,\n\n```html\n<html>\n    <head>\n        <script src=\"../binaural.js\"></script>\n    </head>\n    <body>\n        <audio id=\"source\" src=\"./snd/breakbeat.wav\" controls loop></audio>\n    </body>\n</html>\n```\n\ncreate a source audio node,\n\n```js\nvar audioContext = new AudioContext();\nvar $mediaElement = document.querySelector('#source');\nvar player = audioContext.createMediaElementSource($mediaElement);\n```\n\ninstantiate a `BinauralPanner` and connect it.\n\n```js\nvar binauralPanner = new binaural.audio.BinauralPanner({\n    audioContext,\n    crossfadeDuration: 0.05, // in seconds\n    coordinateSystem: 'sofaSpherical', // [azimuth, elevation, distance]\n    sourceCount: 1,\n    sourcePositions: [ [0, 0, 1] ], // initial position\n});\nbinauralPanner.connectOutputs(audioContext.destination);\nbinauralPanner.connectInputByIndex(0, player);\n\n```\n\nLoad an HRTF set (this returns a [Promise]).\n\n```js\nbinauralPanner.loadHrtfSet(url)\n    .then(function () {\n        console.log('loaded');\n    })\n    .catch(function (error) {\n        console.log('Error while loading ' + url + error.message);\n    });\n```\n\nThen, any source can move:\n\n```js\n$azimuth.on(\"input\", function(event) {\n    // get current position\n    var position = binauralPanner.getSourcePositionByIndex(0);\n\n    // update azimuth\n    position[0] = event.target.value;\n    binauralPanner.setSourcePositionByIndex(0, position);\n\n    // update filters\n    window.requestAnimationFrame(function () {\n        binauralPanner.update();\n    });\n});\n```\n\nNote that a call to the `update` method actually updates the filters.\n\n### ServerDataBase ###\n\nInstantiate a `ServerDataBase`\n\n```js\nvar serverDataBase = new binaural.sofa.ServerDataBase();\n```\n\nand load the catalogue from the server. This returns a promise.\n\n```js\nvar catalogLoaded = serverDataBase.loadCatalogue();\n```\n\nFind URLs with `HRIR` convention, `COMPENSATED` equalisation, and a\nsample-rate matching the one of the audio context.\n\n```js\nvar urlsFound = catalogLoaded.then(function () {\n    var urls = serverDataBase.getUrls({\n        convention: 'HRIR',\n        equalisation: 'COMPENSATED',\n        sampleRate: audioContext.sampleRate,\n    });\n    return urls;\n})\n.catch(function(error) {\n    console.log('Error accessing HRTF server. ' + error.message);\n});\n```\n\nThen, a `BinauralPanner` can load one of these URLs.\n\n```js\nurlsFound.then(function(urls) {\n    binauralPanner.loadHrtfSet(urls[0])\n        .then(function () {\n            console.log('loaded');\n        })\n        .catch(function (error) {\n            console.log('Error while loading ' + url\n                + error.message);\n        });\n});\n```\n\n## Issues ##\n\n- the [examples HRTF directory] is too big for a repository: this is a\n  problem for cloning, and for installing with npm.\n- documentation and distribution files should go to a release branch\n  (`gh-pages`?) to limit the history on real commits.\n- re-sampling is broken on full set (Chrome 48 issue): too many parallel\n  audio contexts?\n- clicks on Firefox 44-45 (during update of `convolver.buffer`)\n- in documentation, links to BinauralPanner methods are broken (esdoc)\n- ServerDataBase: avoid server with free pattern filter?\n\n## To do ##\n\n- attenuation with distance\n- dry/wet outputs for (shared) reverberation\n- support for infinite impulse responses, once [IIRFilterNode] is\n  implemented.\n\n## Developers ##\n\nThe source code is in the [src directory], in [ES2015] standard. `npm run\ncompile` with [Babel] to the [dist directory]. Note that there is a\n[.babelrc] file. `npm run bundle` runs the linters, the tests,\ngenerates the documentation, and compiles the code.\n\nBe sure to commit the distribution files and the documentation for any\nrelease, and tag it.\n\n### Style ###\n\n`npm run lint` to check that the code conforms with [.eslintrc] and\n[.jscsrc] files. The rules derive from [AirBnB] with these\nmajor points:\n- [ES2015]\n- no `'use strict'` globally (already there via babel)\n- enforce curly braces (`if`, `for`, etc.)\n- allow spaces and new lines, with fewer requirements: use them for clarity\n\n### Test ###\n\nFor any function or method, there is at least a test. The hierarchy in the\n[test directory] is the same as in the [src directory].\n\n- `npm run test` for all automated tests\n- `npm run test-listen` for supervised listening tests. The test files must\n  end with `_listen.js`\n- `npm run test-issues` for unsolved issues. The issues may depend on the\n  host: operating system, user-agent, sound-device, sample-rate, etc. The\n  test files must end with `_issues.js`. Once an issue is solved, the\n  corresponding tests are added to the automated test set.\n- `npm run test-browser` starts a server for running the tests in any browser.\n\nExamples for specific testing, when developing or resolving an issue:\n- `browserify test/geometry/test_Listener.js -t babelify | tape-run` in a\n  headless browser\n- `browserify test/geometry/test_Listener.js -t babelify | testling -u`\n  for an URL to open in any browser\n\n### Documentation ###\n\nDocument any public function and method with [JSDoc], and generate the HTML\npages with `npm run doc`. At this point, neither\n[jsdoc](https://www.npmjs.com/package/jsdoc) nor\n[esdoc](https://www.npmjs.com/package/esdoc) gives perfect\ntranscription. (See the [jsdoc.json] and [esdoc.json] files.)\n\n## License\n\nThis module is released under the [BSD-3-Clause] license.\n\n## Acknowledgements\n\nThis research was developped by both [Acoustic And Cognitive Spaces] and\n[Analysis of Musical Practices] IRCAM research teams. A previous version\nwas part of the WAVE project, funded by ANR (French National Research\nAgency). The current version, supporting multiple sources and a listener,\nthe SOFA standard, and the access to a server, is part of the [CoSiMa]\nproject, funded by ANR.\n\n[//]: # (Avoid relative links for use with https://github.com/README.md)\n[//]: # (and http://cdn.rawgit.com/Ircam-RnD/binauralFIR/next/doc/index.html)\n\n[.babelrc]: https://github.com/Ircam-RnD/binauralFIR/tree/next/.babelrc\n[.eslintrc]: https://github.com/Ircam-RnD/binauralFIR/tree/next/.eslintrc\n[.jscsrc]: https://github.com/Ircam-RnD/binauralFIR/tree/next/.jscsrc\n[Acoustic And Cognitive Spaces]: http://recherche.ircam.fr/equipes/salles/\n[AirBnB]: https://github.com/airbnb/javascript/\n[Analysis of Musical Practices]: http://apm.ircam.fr/\n[API documentation directory]: https://github.com/Ircam-RnD/binauralFIR/tree/next/doc/\n[API documentation]: http://cdn.rawgit.com/Ircam-RnD/binauralFIR/next/doc/index.html\n[Babel]: https://babeljs.io/\n[BSD-3-Clause]: http://opensource.org/licenses/BSD-3-Clause\n[CoSiMa]: http://cosima.ircam.fr/\n[dist directory]:  https://github.com/Ircam-RnD/binauralFIR/tree/next/dist/\n[documentation]: #documentation\n[ES2015]: https://babeljs.io/docs/learn-es2015/\n[esdoc.json]: https://github.com/Ircam-RnD/binauralFIR/tree/next/esdoc.json\n[examples directory]: https://github.com/Ircam-RnD/binauralFIR/tree/next/examples/\n[examples HRTF directory]: https://github.com/Ircam-RnD/binauralFIR/tree/next/examples/hrtf/\n[examples online]: http://cdn.rawgit.com/Ircam-RnD/binauralFIR/next/examples/index.html\n[HRTF]: http://en.wikipedia.org/wiki/Head-related_transfer_function\n[IIRFilterNode]: https://webaudio.github.io/web-audio-api/#idl-def-IIRFilterNode\n[jsdoc.json]: https://github.com/Ircam-RnD/binauralFIR/tree/next/jsdoc.json\n[JSDoc]: http://usejsdoc.org/\n[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise\n[SOFA]: http://www.aes.org/publications/standards/search.cfm?docID=99\n[src directory]: https://github.com/Ircam-RnD/binauralFIR/tree/next/src\n[src/geometry]: https://github.com/Ircam-RnD/binauralFIR/tree/next/src/geometry\n[T. Carpentier article]: http://wac.ircam.fr/pdf/demo/wac15_submission_16.pdf\n[test directory]: https://github.com/Ircam-RnD/binauralFIR/tree/next/test\n[Web Audio API]: https://webaudio.github.io/web-audio-api/\n",
  "readmeFilename": "README.md",
  "bugs": {
    "url": "https://github.com/Ircam-RnD/binauralFIR/issues"
  },
  "homepage": "https://github.com/Ircam-RnD/binauralFIR",
  "_id": "binaural@0.3.10",
  "_shasum": "9053aaf4ba62847bb02a35701be55818ce838faf",
  "_resolved": "git+https://github.com/Ircam-RnD/binauralFIR#eb62cd3f291fe38821489390289425ed337eb874",
  "_from": "binaural@git+https://github.com/Ircam-RnD/binauralFIR#0.3.10"
}

},{}]},{},[18])(18)
});