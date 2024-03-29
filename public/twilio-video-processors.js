/*! twilio-video-processors.js 2.1.0

The following license applies to all parts of this software except as
documented below.

    Copyright (C) 2022 Twilio Inc.
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are
    met:

      1. Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.

      2. Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in
         the documentation and/or other materials provided with the
         distribution.

      3. Neither the name of Twilio nor the names of its contributors may
         be used to endorse or promote products derived from this software
         without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WASM_INFERENCE_DIMENSIONS = exports.TFLITE_SIMD_LOADER_NAME = exports.TFLITE_LOADER_NAME = exports.MODEL_NAME = exports.PERSON_PROBABILITY_THRESHOLD = exports.HISTORY_COUNT_MULTIPLIER = exports.MASK_BLUR_RADIUS = exports.DEBOUNCE_COUNT = exports.BLUR_FILTER_RADIUS = void 0;
exports.BLUR_FILTER_RADIUS = 15;
exports.DEBOUNCE_COUNT = 2;
exports.MASK_BLUR_RADIUS = 5;
exports.HISTORY_COUNT_MULTIPLIER = 3;
exports.PERSON_PROBABILITY_THRESHOLD = 0.4;
exports.MODEL_NAME = 'selfie_segmentation_landscape.tflite';
exports.TFLITE_LOADER_NAME = 'tflite-1-0-0.js';
exports.TFLITE_SIMD_LOADER_NAME = 'tflite-simd-1-0-0.js';
exports.WASM_INFERENCE_DIMENSIONS = {
    width: 256,
    height: 144,
};

},{}],2:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualBackgroundProcessor = exports.version = exports.isSupported = exports.Pipeline = exports.ImageFit = exports.GaussianBlurBackgroundProcessor = void 0;
var GaussianBlurBackgroundProcessor_1 = require("./processors/background/GaussianBlurBackgroundProcessor");
Object.defineProperty(exports, "GaussianBlurBackgroundProcessor", { enumerable: true, get: function () { return GaussianBlurBackgroundProcessor_1.GaussianBlurBackgroundProcessor; } });
var VirtualBackgroundProcessor_1 = require("./processors/background/VirtualBackgroundProcessor");
Object.defineProperty(exports, "VirtualBackgroundProcessor", { enumerable: true, get: function () { return VirtualBackgroundProcessor_1.VirtualBackgroundProcessor; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ImageFit", { enumerable: true, get: function () { return types_1.ImageFit; } });
Object.defineProperty(exports, "Pipeline", { enumerable: true, get: function () { return types_1.Pipeline; } });
var support_1 = require("./utils/support");
Object.defineProperty(exports, "isSupported", { enumerable: true, get: function () { return support_1.isSupported; } });
var version_1 = require("./utils/version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_1.version; } });
if (typeof window !== 'undefined') {
    window.Twilio = window.Twilio || {};
    window.Twilio.VideoProcessors = __assign(__assign({}, window.Twilio.VideoProcessors), { GaussianBlurBackgroundProcessor: GaussianBlurBackgroundProcessor_1.GaussianBlurBackgroundProcessor, ImageFit: types_1.ImageFit, Pipeline: types_1.Pipeline, isSupported: support_1.isSupported, version: version_1.version, VirtualBackgroundProcessor: VirtualBackgroundProcessor_1.VirtualBackgroundProcessor });
}

},{"./processors/background/GaussianBlurBackgroundProcessor":5,"./processors/background/VirtualBackgroundProcessor":6,"./types":16,"./utils/support":18,"./utils/version":19}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
/**
 * @private
 * The [[Processor]] is an abstract class for building your own custom processors.
 */
var Processor = /** @class */ (function () {
    function Processor() {
    }
    return Processor;
}());
exports.Processor = Processor;

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundProcessor = void 0;
var Processor_1 = require("../Processor");
var Benchmark_1 = require("../../utils/Benchmark");
var version_1 = require("../../utils/version");
var types_1 = require("../../types");
var webgl2_1 = require("../webgl2");
var constants_1 = require("../../constants");
/**
 * @private
 */
var BackgroundProcessor = /** @class */ (function (_super) {
    __extends(BackgroundProcessor, _super);
    function BackgroundProcessor(options) {
        var _this = _super.call(this) || this;
        _this._backgroundImage = null;
        _this._outputCanvas = null;
        _this._outputContext = null;
        _this._webgl2Pipeline = null;
        _this._currentMask = new Uint8ClampedArray();
        _this._debounce = true;
        _this._debounceCount = constants_1.DEBOUNCE_COUNT;
        _this._dummyImageData = new ImageData(1, 1);
        _this._inferenceDimensions = constants_1.WASM_INFERENCE_DIMENSIONS;
        _this._inputMemoryOffset = 0;
        // tslint:disable-next-line no-unused-variable
        _this._isSimdEnabled = null;
        _this._maskBlurRadius = constants_1.MASK_BLUR_RADIUS;
        _this._maskUsageCounter = 0;
        _this._outputMemoryOffset = 0;
        _this._personProbabilityThreshold = constants_1.PERSON_PROBABILITY_THRESHOLD;
        _this._pipeline = types_1.Pipeline.WebGL2;
        // tslint:disable-next-line no-unused-variable
        _this._version = version_1.version;
        if (typeof options.assetsPath !== 'string') {
            throw new Error('assetsPath parameter is missing');
        }
        var assetsPath = options.assetsPath;
        if (assetsPath && assetsPath[assetsPath.length - 1] !== '/') {
            assetsPath += '/';
        }
        _this.maskBlurRadius = options.maskBlurRadius;
        _this._assetsPath = assetsPath;
        _this._debounce = typeof options.debounce === 'boolean' ? options.debounce : _this._debounce;
        _this._debounceCount = _this._debounce ? _this._debounceCount : 1;
        _this._inferenceDimensions = options.inferenceDimensions || _this._inferenceDimensions;
        _this._historyCount = constants_1.HISTORY_COUNT_MULTIPLIER * _this._debounceCount;
        _this._personProbabilityThreshold = options.personProbabilityThreshold || _this._personProbabilityThreshold;
        _this._pipeline = options.pipeline || _this._pipeline;
        _this._benchmark = new Benchmark_1.Benchmark();
        _this._inputCanvas = document.createElement('canvas');
        _this._inputContext = _this._inputCanvas.getContext('2d');
        _this._maskCanvas = typeof window.OffscreenCanvas !== 'undefined' ? new window.OffscreenCanvas(1, 1) : document.createElement('canvas');
        _this._maskContext = _this._maskCanvas.getContext('2d');
        _this._masks = [];
        return _this;
    }
    Object.defineProperty(BackgroundProcessor.prototype, "maskBlurRadius", {
        /**
         * The current blur radius when smoothing out the edges of the person's mask.
         */
        get: function () {
            return this._maskBlurRadius;
        },
        /**
         * Set a new blur radius to be used when smoothing out the edges of the person's mask.
         */
        set: function (radius) {
            if (typeof radius !== 'number' || radius < 0) {
                console.warn("Valid mask blur radius not found. Using ".concat(constants_1.MASK_BLUR_RADIUS, " as default."));
                radius = constants_1.MASK_BLUR_RADIUS;
            }
            this._maskBlurRadius = radius;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Load the segmentation model.
     * Call this method before attaching the processor to ensure
     * video frames are processed correctly.
     */
    BackgroundProcessor.prototype.loadModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tflite, modelResponse, model, modelBufferOffset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this._loadTwilioTfLite(),
                            fetch(this._assetsPath + constants_1.MODEL_NAME),
                        ])];
                    case 1:
                        _a = _b.sent(), tflite = _a[0], modelResponse = _a[1];
                        return [4 /*yield*/, modelResponse.arrayBuffer()];
                    case 2:
                        model = _b.sent();
                        modelBufferOffset = tflite._getModelBufferMemoryOffset();
                        tflite.HEAPU8.set(new Uint8Array(model), modelBufferOffset);
                        tflite._loadModel(model.byteLength);
                        this._inputMemoryOffset = tflite._getInputMemoryOffset() / 4;
                        this._outputMemoryOffset = tflite._getOutputMemoryOffset() / 4;
                        this._tflite = tflite;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Apply a transform to the background of an input video frame and leaving
     * the foreground (person(s)) untouched. Any exception detected will
     * result in the frame being dropped.
     * @param inputFrameBuffer - The source of the input frame to process.
     * <br/>
     * <br/>
     * [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) - Good for canvas-related processing
     * that can be rendered off screen. Only works when using [[Pipeline.Canvas2D]].
     * <br/>
     * <br/>
     * [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) - This is recommended on browsers
     * that doesn't support `OffscreenCanvas`, or if you need to render the frame on the screen. Only works when using [[Pipeline.Canvas2D]].
     * <br/>
     * <br/>
     * [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement) - Recommended when using [[Pipeline.WebGL2]] but
     * works for both [[Pipeline.Canvas2D]] and [[Pipeline.WebGL2]].
     * <br/>
     * @param outputFrameBuffer - The output frame buffer to use to draw the processed frame.
     */
    BackgroundProcessor.prototype.processFrame = function (inputFrameBuffer, outputFrameBuffer) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, inferenceWidth, inferenceHeight, inputFrame, captureWidth, captureHeight, reInitDummyImage, personMask, ctx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this._tflite) {
                            return [2 /*return*/];
                        }
                        if (!inputFrameBuffer || !outputFrameBuffer) {
                            throw new Error('Missing input or output frame buffer');
                        }
                        this._benchmark.end('captureFrameDelay');
                        this._benchmark.start('processFrameDelay');
                        _c = this._inferenceDimensions, inferenceWidth = _c.width, inferenceHeight = _c.height;
                        inputFrame = inputFrameBuffer;
                        captureWidth = inputFrame.width, captureHeight = inputFrame.height;
                        if (inputFrame.videoWidth) {
                            inputFrame = inputFrame;
                            captureWidth = inputFrame.videoWidth;
                            captureHeight = inputFrame.videoHeight;
                        }
                        if (this._outputCanvas !== outputFrameBuffer) {
                            this._outputCanvas = outputFrameBuffer;
                            this._outputContext = this._outputCanvas
                                .getContext(this._pipeline === types_1.Pipeline.Canvas2D ? '2d' : 'webgl2');
                            (_a = this._webgl2Pipeline) === null || _a === void 0 ? void 0 : _a.cleanUp();
                            this._webgl2Pipeline = null;
                        }
                        if (!this._webgl2Pipeline && this._pipeline === types_1.Pipeline.WebGL2) {
                            this._createWebGL2Pipeline(inputFrame, captureWidth, captureHeight, inferenceWidth, inferenceHeight);
                        }
                        if (!(this._pipeline === types_1.Pipeline.WebGL2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_b = this._webgl2Pipeline) === null || _b === void 0 ? void 0 : _b.render())];
                    case 1:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        reInitDummyImage = false;
                        if (this._inputCanvas.width !== inferenceWidth) {
                            this._inputCanvas.width = inferenceWidth;
                            this._maskCanvas.width = inferenceWidth;
                            reInitDummyImage = true;
                        }
                        if (this._inputCanvas.height !== inferenceHeight) {
                            this._inputCanvas.height = inferenceHeight;
                            this._maskCanvas.height = inferenceHeight;
                            reInitDummyImage = true;
                        }
                        if (reInitDummyImage) {
                            this._dummyImageData = new ImageData(new Uint8ClampedArray(inferenceWidth * inferenceHeight * 4), inferenceWidth, inferenceHeight);
                        }
                        return [4 /*yield*/, this._createPersonMask(inputFrame)];
                    case 3:
                        personMask = _d.sent();
                        ctx = this._outputContext;
                        this._benchmark.start('imageCompositionDelay');
                        this._maskContext.putImageData(personMask, 0, 0);
                        ctx.save();
                        ctx.filter = "blur(".concat(this._maskBlurRadius, "px)");
                        ctx.globalCompositeOperation = 'copy';
                        ctx.drawImage(this._maskCanvas, 0, 0, captureWidth, captureHeight);
                        ctx.filter = 'none';
                        ctx.globalCompositeOperation = 'source-in';
                        ctx.drawImage(inputFrame, 0, 0, captureWidth, captureHeight);
                        ctx.globalCompositeOperation = 'destination-over';
                        this._setBackground(inputFrame);
                        ctx.restore();
                        this._benchmark.end('imageCompositionDelay');
                        _d.label = 4;
                    case 4:
                        this._benchmark.end('processFrameDelay');
                        this._benchmark.end('totalProcessingDelay');
                        // NOTE (csantos): Start the benchmark from here so we can include the delay from the Video sdk
                        // for a more accurate fps
                        this._benchmark.start('totalProcessingDelay');
                        this._benchmark.start('captureFrameDelay');
                        return [2 /*return*/];
                }
            });
        });
    };
    BackgroundProcessor.prototype._addMask = function (mask) {
        if (this._masks.length >= this._historyCount) {
            this._masks.splice(0, this._masks.length - this._historyCount + 1);
        }
        this._masks.push(mask);
    };
    BackgroundProcessor.prototype._applyAlpha = function (imageData) {
        var weightedSum = this._masks.reduce(function (sum, mask, j) { return sum + (j + 1) * (j + 1); }, 0);
        var pixels = imageData.height * imageData.width;
        var _loop_1 = function (i) {
            var w = this_1._masks.reduce(function (sum, mask, j) { return sum + mask[i] * (j + 1) * (j + 1); }, 0) / weightedSum;
            imageData.data[i * 4 + 3] = Math.round(w * 255);
        };
        var this_1 = this;
        for (var i = 0; i < pixels; i++) {
            _loop_1(i);
        }
    };
    BackgroundProcessor.prototype._createPersonMask = function (inputFrame) {
        return __awaiter(this, void 0, void 0, function () {
            var imageData, shouldRunInference;
            return __generator(this, function (_a) {
                imageData = this._dummyImageData;
                shouldRunInference = this._maskUsageCounter < 1;
                this._benchmark.start('inputImageResizeDelay');
                if (shouldRunInference) {
                    imageData = this._getResizedInputImageData(inputFrame);
                }
                this._benchmark.end('inputImageResizeDelay');
                this._benchmark.start('segmentationDelay');
                if (shouldRunInference) {
                    this._currentMask = this._runTwilioTfLiteInference(imageData);
                    this._maskUsageCounter = this._debounceCount;
                }
                this._addMask(this._currentMask);
                this._applyAlpha(imageData);
                this._maskUsageCounter--;
                this._benchmark.end('segmentationDelay');
                return [2 /*return*/, imageData];
            });
        });
    };
    BackgroundProcessor.prototype._createWebGL2Pipeline = function (inputFrame, captureWidth, captureHeight, inferenceWidth, inferenceHeight) {
        this._webgl2Pipeline = (0, webgl2_1.buildWebGL2Pipeline)({
            htmlElement: inputFrame,
            width: captureWidth,
            height: captureHeight,
        }, this._backgroundImage, { type: this._getWebGL2PipelineType() }, { inputResolution: "".concat(inferenceWidth, "x").concat(inferenceHeight) }, this._outputCanvas, this._tflite, this._benchmark, this._debounce);
        this._webgl2Pipeline.updatePostProcessingConfig({
            smoothSegmentationMask: true,
            jointBilateralFilter: {
                sigmaSpace: 10,
                sigmaColor: 0.12
            },
            coverage: [
                0,
                0.99
            ],
            lightWrapping: 0,
            blendMode: 'screen'
        });
    };
    BackgroundProcessor.prototype._getResizedInputImageData = function (inputFrame) {
        var _a = this._inputCanvas, width = _a.width, height = _a.height;
        this._inputContext.drawImage(inputFrame, 0, 0, width, height);
        var imageData = this._inputContext.getImageData(0, 0, width, height);
        return imageData;
    };
    BackgroundProcessor.prototype._loadJs = function (url) {
        if (BackgroundProcessor._loadedScripts.includes(url)) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.onload = function () {
                BackgroundProcessor._loadedScripts.push(url);
                resolve();
            };
            script.onerror = reject;
            document.head.append(script);
            script.src = url;
        });
    };
    BackgroundProcessor.prototype._loadTwilioTfLite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tflite, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._loadJs(this._assetsPath + constants_1.TFLITE_SIMD_LOADER_NAME)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, window.createTwilioTFLiteSIMDModule()];
                    case 3:
                        tflite = _b.sent();
                        this._isSimdEnabled = true;
                        return [3 /*break*/, 7];
                    case 4:
                        _a = _b.sent();
                        console.warn('SIMD not supported. You may experience poor quality of background replacement.');
                        return [4 /*yield*/, this._loadJs(this._assetsPath + constants_1.TFLITE_LOADER_NAME)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, window.createTwilioTFLiteModule()];
                    case 6:
                        tflite = _b.sent();
                        this._isSimdEnabled = false;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, tflite];
                }
            });
        });
    };
    BackgroundProcessor.prototype._runTwilioTfLiteInference = function (inputImage) {
        var _a = this, _b = _a._inferenceDimensions, width = _b.width, height = _b.height, offset = _a._inputMemoryOffset, tflite = _a._tflite;
        var pixels = width * height;
        for (var i = 0; i < pixels; i++) {
            tflite.HEAPF32[offset + i * 3] = inputImage.data[i * 4] / 255;
            tflite.HEAPF32[offset + i * 3 + 1] = inputImage.data[i * 4 + 1] / 255;
            tflite.HEAPF32[offset + i * 3 + 2] = inputImage.data[i * 4 + 2] / 255;
        }
        tflite._runInference();
        var inferenceData = new Uint8ClampedArray(pixels * 4);
        for (var i = 0; i < pixels; i++) {
            var personProbability = tflite.HEAPF32[this._outputMemoryOffset + i];
            inferenceData[i] = Number(personProbability >= this._personProbabilityThreshold) * personProbability;
        }
        return inferenceData;
    };
    BackgroundProcessor._loadedScripts = [];
    return BackgroundProcessor;
}(Processor_1.Processor));
exports.BackgroundProcessor = BackgroundProcessor;

},{"../../constants":1,"../../types":16,"../../utils/Benchmark":17,"../../utils/version":19,"../Processor":3,"../webgl2":9}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianBlurBackgroundProcessor = void 0;
var BackgroundProcessor_1 = require("./BackgroundProcessor");
var constants_1 = require("../../constants");
var types_1 = require("../../types");
/**
 * The GaussianBlurBackgroundProcessor, when added to a VideoTrack,
 * applies a gaussian blur filter on the background in each video frame
 * and leaves the foreground (person(s)) untouched. Each instance of
 * GaussianBlurBackgroundProcessor should be added to only one VideoTrack
 * at a time to prevent overlapping of image data from multiple VideoTracks.
 *
 * @example
 *
 * ```ts
 * import { createLocalVideoTrack } from 'twilio-video';
 * import { Pipeline, GaussianBlurBackgroundProcessor } from '@twilio/video-processors';
 *
 * const blurBackground = new GaussianBlurBackgroundProcessor({
 *   assetsPath: 'https://my-server-path/assets',
 *   pipeline: Pipeline.WebGL2,
 *   debounce: true,
 * });
 *
 * blurBackground.loadModel().then(() => {
 *   createLocalVideoTrack({
 *     // Increasing the capture resolution decreases the output FPS
 *     // especially on browsers that do not support SIMD
 *     // such as desktop Safari and iOS browsers, or on Chrome
 *     // with capture resolutions above 640x480 for webgl2.
 *     width: 640,
 *     height: 480,
 *     // Any frame rate above 24 fps on desktop browsers increase CPU
 *     // usage without noticeable increase in quality.
 *     frameRate: 24
 *   }).then(track => {
 *     track.addProcessor(blurBackground, {
 *       inputFrameBufferType: 'video',
 *       outputFrameBufferContextType: 'webgl2',
 *     });
 *   });
 * });
 * ```
 */
var GaussianBlurBackgroundProcessor = /** @class */ (function (_super) {
    __extends(GaussianBlurBackgroundProcessor, _super);
    /**
     * Construct a GaussianBlurBackgroundProcessor. Default values will be used for
     * any missing properties in [[GaussianBlurBackgroundProcessorOptions]], and
     * invalid properties will be ignored.
     */
    function GaussianBlurBackgroundProcessor(options) {
        var _this = _super.call(this, options) || this;
        _this._blurFilterRadius = constants_1.BLUR_FILTER_RADIUS;
        // tslint:disable-next-line no-unused-variable
        _this._name = 'GaussianBlurBackgroundProcessor';
        _this.blurFilterRadius = options.blurFilterRadius;
        return _this;
    }
    Object.defineProperty(GaussianBlurBackgroundProcessor.prototype, "blurFilterRadius", {
        /**
         * The current background blur filter radius in pixels.
         */
        get: function () {
            return this._blurFilterRadius;
        },
        /**
         * Set a new background blur filter radius in pixels.
         */
        set: function (radius) {
            if (!radius) {
                console.warn("Valid blur filter radius not found. Using ".concat(constants_1.BLUR_FILTER_RADIUS, " as default."));
                radius = constants_1.BLUR_FILTER_RADIUS;
            }
            this._blurFilterRadius = radius;
        },
        enumerable: false,
        configurable: true
    });
    GaussianBlurBackgroundProcessor.prototype._getWebGL2PipelineType = function () {
        return types_1.WebGL2PipelineType.Blur;
    };
    GaussianBlurBackgroundProcessor.prototype._setBackground = function (inputFrame) {
        if (!this._outputContext) {
            return;
        }
        var ctx = this._outputContext;
        ctx.filter = "blur(".concat(this._blurFilterRadius, "px)");
        ctx.drawImage(inputFrame, 0, 0);
    };
    return GaussianBlurBackgroundProcessor;
}(BackgroundProcessor_1.BackgroundProcessor));
exports.GaussianBlurBackgroundProcessor = GaussianBlurBackgroundProcessor;

},{"../../constants":1,"../../types":16,"./BackgroundProcessor":4}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualBackgroundProcessor = void 0;
var BackgroundProcessor_1 = require("./BackgroundProcessor");
var types_1 = require("../../types");
/**
 * The VirtualBackgroundProcessor, when added to a VideoTrack,
 * replaces the background in each video frame with a given image,
 * and leaves the foreground (person(s)) untouched. Each instance of
 * VirtualBackgroundProcessor should be added to only one VideoTrack
 * at a time to prevent overlapping of image data from multiple VideoTracks.
 *
 * @example
 *
 * ```ts
 * import { createLocalVideoTrack } from 'twilio-video';
 * import { Pipeline, VirtualBackgroundProcessor } from '@twilio/video-processors';
 *
 * let virtualBackground;
 * const img = new Image();
 *
 * img.onload = () => {
 *   virtualBackground = new VirtualBackgroundProcessor({
 *     assetsPath: 'https://my-server-path/assets',
 *     backgroundImage: img,
 *     pipeline: Pipeline.WebGL2,
 *
 *     // Desktop Safari and iOS browsers do not support SIMD.
 *     // Set debounce to true to achieve an acceptable performance.
 *     debounce: isSafari(),
 *   });
 *
 *   virtualBackground.loadModel().then(() => {
 *     createLocalVideoTrack({
 *       // Increasing the capture resolution decreases the output FPS
 *       // especially on browsers that do not support SIMD
 *       // such as desktop Safari and iOS browsers, or on Chrome
 *       // with capture resolutions above 640x480 for webgl2.
 *       width: 640,
 *       height: 480,
 *       // Any frame rate above 24 fps on desktop browsers increase CPU
 *       // usage without noticeable increase in quality.
 *       frameRate: 24
 *     }).then(track => {
 *       track.addProcessor(virtualBackground, {
 *         inputFrameBufferType: 'video',
 *         outputFrameBufferContextType: 'webgl2',
 *       });
 *     });
 *   });
 * };
 * img.src = '/background.jpg';
 * ```
 */
var VirtualBackgroundProcessor = /** @class */ (function (_super) {
    __extends(VirtualBackgroundProcessor, _super);
    /**
     * Construct a VirtualBackgroundProcessor. Default values will be used for
     * any missing optional properties in [[VirtualBackgroundProcessorOptions]],
     * and invalid properties will be ignored.
     */
    function VirtualBackgroundProcessor(options) {
        var _this = _super.call(this, options) || this;
        // tslint:disable-next-line no-unused-variable
        _this._name = 'VirtualBackgroundProcessor';
        _this.backgroundImage = options.backgroundImage;
        _this.fitType = options.fitType;
        return _this;
    }
    Object.defineProperty(VirtualBackgroundProcessor.prototype, "backgroundImage", {
        /**
         * The HTMLImageElement representing the current background image.
         */
        get: function () {
            return this._backgroundImage;
        },
        /**
         * Set an HTMLImageElement as the new background image.
         * An error will be raised if the image hasn't been fully loaded yet. Additionally, the image must follow
         * [security guidelines](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
         * when loading the image from a different origin. Failing to do so will result to an empty output frame.
         */
        set: function (image) {
            var _a;
            if (!image || !image.complete || !image.naturalHeight) {
                throw new Error('Invalid image. Make sure that the image is an HTMLImageElement and has been successfully loaded');
            }
            this._backgroundImage = image;
            // Triggers recreation of the pipeline in the next processFrame call
            (_a = this._webgl2Pipeline) === null || _a === void 0 ? void 0 : _a.cleanUp();
            this._webgl2Pipeline = null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VirtualBackgroundProcessor.prototype, "fitType", {
        /**
         * The current [[ImageFit]] for positioning of the background image in the viewport.
         */
        get: function () {
            return this._fitType;
        },
        /**
         * Set a new [[ImageFit]] to be used for positioning the background image in the viewport.
         */
        set: function (fitType) {
            var validTypes = Object.keys(types_1.ImageFit);
            if (!validTypes.includes(fitType)) {
                console.warn("Valid fitType not found. Using '".concat(types_1.ImageFit.Fill, "' as default."));
                fitType = types_1.ImageFit.Fill;
            }
            this._fitType = fitType;
        },
        enumerable: false,
        configurable: true
    });
    VirtualBackgroundProcessor.prototype._getWebGL2PipelineType = function () {
        return types_1.WebGL2PipelineType.Image;
    };
    VirtualBackgroundProcessor.prototype._setBackground = function () {
        if (!this._outputContext || !this._outputCanvas) {
            return;
        }
        var img = this._backgroundImage;
        var imageWidth = img.naturalWidth;
        var imageHeight = img.naturalHeight;
        var canvasWidth = this._outputCanvas.width;
        var canvasHeight = this._outputCanvas.height;
        var ctx = this._outputContext;
        if (this._fitType === types_1.ImageFit.Fill) {
            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, 0, 0, canvasWidth, canvasHeight);
        }
        else if (this._fitType === types_1.ImageFit.None) {
            ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
        }
        else if (this._fitType === types_1.ImageFit.Contain) {
            var _a = this._getFitPosition(imageWidth, imageHeight, canvasWidth, canvasHeight, types_1.ImageFit.Contain), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, x, y, w, h);
        }
        else if (this._fitType === types_1.ImageFit.Cover) {
            var _b = this._getFitPosition(imageWidth, imageHeight, canvasWidth, canvasHeight, types_1.ImageFit.Cover), x = _b.x, y = _b.y, w = _b.w, h = _b.h;
            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, x, y, w, h);
        }
    };
    VirtualBackgroundProcessor.prototype._getFitPosition = function (contentWidth, contentHeight, viewportWidth, viewportHeight, type) {
        // Calculate new content width to fit viewport width
        var factor = viewportWidth / contentWidth;
        var newContentWidth = viewportWidth;
        var newContentHeight = factor * contentHeight;
        // Scale down the resulting height and width more
        // to fit viewport height if the content still exceeds it
        if ((type === types_1.ImageFit.Contain && newContentHeight > viewportHeight)
            || (type === types_1.ImageFit.Cover && viewportHeight > newContentHeight)) {
            factor = viewportHeight / newContentHeight;
            newContentWidth = factor * newContentWidth;
            newContentHeight = viewportHeight;
        }
        // Calculate the destination top left corner to center the content
        var x = (viewportWidth - newContentWidth) / 2;
        var y = (viewportHeight - newContentHeight) / 2;
        return {
            x: x,
            y: y,
            w: newContentWidth,
            h: newContentHeight,
        };
    };
    return VirtualBackgroundProcessor;
}(BackgroundProcessor_1.BackgroundProcessor));
exports.VirtualBackgroundProcessor = VirtualBackgroundProcessor;

},{"../../types":16,"./BackgroundProcessor":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputResolutions = void 0;
exports.inputResolutions = {
    '640x360': [640, 360],
    '256x256': [256, 256],
    '256x144': [256, 144],
    '160x96': [160, 96],
};

},{}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPixelsAsync = exports.createTexture = exports.compileShader = exports.createProgram = exports.createPiplelineStageProgram = exports.glsl = void 0;
/**
 * Use it along with boyswan.glsl-literal VSCode extension
 * to get GLSL syntax highlighting.
 * https://marketplace.visualstudio.com/items?itemName=boyswan.glsl-literal
 *
 * On VSCode OSS, boyswan.glsl-literal requires slevesque.shader extension
 * to be installed as well.
 * https://marketplace.visualstudio.com/items?itemName=slevesque.shader
 */
exports.glsl = String.raw;
function createPiplelineStageProgram(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer) {
    var program = createProgram(gl, vertexShader, fragmentShader);
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    var texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    return program;
}
exports.createPiplelineStageProgram = createPiplelineStageProgram;
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Could not link WebGL program: ".concat(gl.getProgramInfoLog(program)));
    }
    return program;
}
exports.createProgram = createProgram;
function compileShader(gl, shaderType, shaderSource) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("Could not compile shader: ".concat(gl.getShaderInfoLog(shader)));
    }
    return shader;
}
exports.compileShader = compileShader;
function createTexture(gl, internalformat, width, height, minFilter, magFilter) {
    if (minFilter === void 0) { minFilter = gl.NEAREST; }
    if (magFilter === void 0) { magFilter = gl.NEAREST; }
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internalformat, width, height);
    return texture;
}
exports.createTexture = createTexture;
function readPixelsAsync(gl, x, y, width, height, format, type, dest) {
    return __awaiter(this, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = gl.createBuffer();
                    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
                    gl.bufferData(gl.PIXEL_PACK_BUFFER, dest.byteLength, gl.STREAM_READ);
                    gl.readPixels(x, y, width, height, format, type, 0);
                    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
                    return [4 /*yield*/, getBufferSubDataAsync(gl, gl.PIXEL_PACK_BUFFER, buf, 0, dest)];
                case 1:
                    _a.sent();
                    gl.deleteBuffer(buf);
                    return [2 /*return*/, dest];
            }
        });
    });
}
exports.readPixelsAsync = readPixelsAsync;
function getBufferSubDataAsync(gl, target, buffer, srcByteOffset, dstBuffer, dstOffset, length) {
    return __awaiter(this, void 0, void 0, function () {
        var sync, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
                    gl.flush();
                    return [4 /*yield*/, clientWaitAsync(gl, sync)];
                case 1:
                    res = _a.sent();
                    gl.deleteSync(sync);
                    if (res !== gl.WAIT_FAILED) {
                        gl.bindBuffer(target, buffer);
                        gl.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length);
                        gl.bindBuffer(target, null);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function clientWaitAsync(gl, sync) {
    return new Promise(function (resolve) {
        function test() {
            var res = gl.clientWaitSync(sync, 0, 0);
            if (res === gl.WAIT_FAILED) {
                resolve(res);
                return;
            }
            if (res === gl.TIMEOUT_EXPIRED) {
                requestAnimationFrame(test);
                return;
            }
            resolve(res);
        }
        requestAnimationFrame(test);
    });
}

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWebGL2Pipeline = void 0;
/**
 * This pipeline is based on Volcomix's react project.
 * https://github.com/Volcomix/virtual-background
 * It was modified and converted into a module to work with
 * Twilio's Video Processor
 */
var webgl2Pipeline_1 = require("./pipelines/webgl2Pipeline");
Object.defineProperty(exports, "buildWebGL2Pipeline", { enumerable: true, get: function () { return webgl2Pipeline_1.buildWebGL2Pipeline; } });

},{"./pipelines/webgl2Pipeline":15}],10:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBackgroundBlurStage = void 0;
var webglHelper_1 = require("../helpers/webglHelper");
function buildBackgroundBlurStage(gl, vertexShader, positionBuffer, texCoordBuffer, personMaskTexture, canvas) {
    var blurPass = buildBlurPass(gl, vertexShader, positionBuffer, texCoordBuffer, personMaskTexture, canvas);
    var blendPass = buildBlendPass(gl, positionBuffer, texCoordBuffer, canvas);
    function render() {
        blurPass.render();
        blendPass.render();
    }
    function updateCoverage(coverage) {
        blendPass.updateCoverage(coverage);
    }
    function cleanUp() {
        blendPass.cleanUp();
        blurPass.cleanUp();
    }
    return {
        render: render,
        updateCoverage: updateCoverage,
        cleanUp: cleanUp,
    };
}
exports.buildBackgroundBlurStage = buildBackgroundBlurStage;
function buildBlurPass(gl, vertexShader, positionBuffer, texCoordBuffer, personMaskTexture, canvas) {
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform vec2 u_texelSize;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    const float offset[5] = float[](0.0, 1.0, 2.0, 3.0, 4.0);\n    const float weight[5] = float[](0.2270270270, 0.1945945946, 0.1216216216,\n      0.0540540541, 0.0162162162);\n\n    void main() {\n      vec4 centerColor = texture(u_inputFrame, v_texCoord);\n      float personMask = texture(u_personMask, v_texCoord).a;\n\n      vec4 frameColor = centerColor * weight[0] * (1.0 - personMask);\n\n      for (int i = 1; i < 5; i++) {\n        vec2 offset = vec2(offset[i]) * u_texelSize;\n\n        vec2 texCoord = v_texCoord + offset;\n        frameColor += texture(u_inputFrame, texCoord) * weight[i] *\n          (1.0 - texture(u_personMask, texCoord).a);\n\n        texCoord = v_texCoord - offset;\n        frameColor += texture(u_inputFrame, texCoord) * weight[i] *\n          (1.0 - texture(u_personMask, texCoord).a);\n      }\n      outColor = vec4(frameColor.rgb + (1.0 - frameColor.a) * centerColor.rgb, 1.0);\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform vec2 u_texelSize;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    const float offset[5] = float[](0.0, 1.0, 2.0, 3.0, 4.0);\n    const float weight[5] = float[](0.2270270270, 0.1945945946, 0.1216216216,\n      0.0540540541, 0.0162162162);\n\n    void main() {\n      vec4 centerColor = texture(u_inputFrame, v_texCoord);\n      float personMask = texture(u_personMask, v_texCoord).a;\n\n      vec4 frameColor = centerColor * weight[0] * (1.0 - personMask);\n\n      for (int i = 1; i < 5; i++) {\n        vec2 offset = vec2(offset[i]) * u_texelSize;\n\n        vec2 texCoord = v_texCoord + offset;\n        frameColor += texture(u_inputFrame, texCoord) * weight[i] *\n          (1.0 - texture(u_personMask, texCoord).a);\n\n        texCoord = v_texCoord - offset;\n        frameColor += texture(u_inputFrame, texCoord) * weight[i] *\n          (1.0 - texture(u_personMask, texCoord).a);\n      }\n      outColor = vec4(frameColor.rgb + (1.0 - frameColor.a) * centerColor.rgb, 1.0);\n    }\n  "])));
    var scale = 0.5;
    var outputWidth = canvas.width * scale;
    var outputHeight = canvas.height * scale;
    var texelWidth = 1 / outputWidth;
    var texelHeight = 1 / outputHeight;
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
    var personMaskLocation = gl.getUniformLocation(program, 'u_personMask');
    var texelSizeLocation = gl.getUniformLocation(program, 'u_texelSize');
    var texture1 = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, outputWidth, outputHeight, gl.NEAREST, gl.LINEAR);
    var texture2 = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, outputWidth, outputHeight, gl.NEAREST, gl.LINEAR);
    var frameBuffer1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
    var frameBuffer2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);
    gl.useProgram(program);
    gl.uniform1i(personMaskLocation, 1);
    function render() {
        gl.viewport(0, 0, outputWidth, outputHeight);
        gl.useProgram(program);
        gl.uniform1i(inputFrameLocation, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, personMaskTexture);
        for (var i = 0; i < 8; i++) {
            gl.uniform2f(texelSizeLocation, 0, texelHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, texture1);
            gl.uniform1i(inputFrameLocation, 2);
            gl.uniform2f(texelSizeLocation, texelWidth, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer2);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindTexture(gl.TEXTURE_2D, texture2);
        }
    }
    function cleanUp() {
        gl.deleteFramebuffer(frameBuffer2);
        gl.deleteFramebuffer(frameBuffer1);
        gl.deleteTexture(texture2);
        gl.deleteTexture(texture1);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
    }
    return {
        render: render,
        cleanUp: cleanUp,
    };
}
function buildBlendPass(gl, positionBuffer, texCoordBuffer, canvas) {
    var vertexShaderSource = (0, webglHelper_1.glsl)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["#version 300 es\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n\n    void main() {\n      // Flipping Y is required when rendering to canvas\n      gl_Position = vec4(a_position * vec2(1.0, -1.0), 0.0, 1.0);\n      v_texCoord = a_texCoord;\n    }\n  "], ["#version 300 es\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n\n    void main() {\n      // Flipping Y is required when rendering to canvas\n      gl_Position = vec4(a_position * vec2(1.0, -1.0), 0.0, 1.0);\n      v_texCoord = a_texCoord;\n    }\n  "])));
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform sampler2D u_blurredInputFrame;\n    uniform vec2 u_coverage;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      vec3 color = texture(u_inputFrame, v_texCoord).rgb;\n      vec3 blurredColor = texture(u_blurredInputFrame, v_texCoord).rgb;\n      float personMask = texture(u_personMask, v_texCoord).a;\n      personMask = smoothstep(u_coverage.x, u_coverage.y, personMask);\n      outColor = vec4(mix(blurredColor, color, personMask), 1.0);\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform sampler2D u_blurredInputFrame;\n    uniform vec2 u_coverage;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      vec3 color = texture(u_inputFrame, v_texCoord).rgb;\n      vec3 blurredColor = texture(u_blurredInputFrame, v_texCoord).rgb;\n      float personMask = texture(u_personMask, v_texCoord).a;\n      personMask = smoothstep(u_coverage.x, u_coverage.y, personMask);\n      outColor = vec4(mix(blurredColor, color, personMask), 1.0);\n    }\n  "])));
    var outputWidth = canvas.width, outputHeight = canvas.height;
    var vertexShader = (0, webglHelper_1.compileShader)(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
    var personMaskLocation = gl.getUniformLocation(program, 'u_personMask');
    var blurredInputFrame = gl.getUniformLocation(program, 'u_blurredInputFrame');
    var coverageLocation = gl.getUniformLocation(program, 'u_coverage');
    gl.useProgram(program);
    gl.uniform1i(inputFrameLocation, 0);
    gl.uniform1i(personMaskLocation, 1);
    gl.uniform1i(blurredInputFrame, 2);
    gl.uniform2f(coverageLocation, 0, 1);
    function render() {
        gl.viewport(0, 0, outputWidth, outputHeight);
        gl.useProgram(program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function updateCoverage(coverage) {
        gl.useProgram(program);
        gl.uniform2f(coverageLocation, coverage[0], coverage[1]);
    }
    function cleanUp() {
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
    }
    return {
        render: render,
        updateCoverage: updateCoverage,
        cleanUp: cleanUp,
    };
}
var templateObject_1, templateObject_2, templateObject_3;

},{"../helpers/webglHelper":8}],11:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBackgroundImageStage = void 0;
var webglHelper_1 = require("../helpers/webglHelper");
function buildBackgroundImageStage(gl, positionBuffer, texCoordBuffer, personMaskTexture, backgroundImage, canvas) {
    var vertexShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    uniform vec2 u_backgroundScale;\n    uniform vec2 u_backgroundOffset;\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n    out vec2 v_backgroundCoord;\n\n    void main() {\n      // Flipping Y is required when rendering to canvas\n      gl_Position = vec4(a_position * vec2(1.0, -1.0), 0.0, 1.0);\n      v_texCoord = a_texCoord;\n      v_backgroundCoord = a_texCoord * u_backgroundScale + u_backgroundOffset;\n    }\n  "], ["#version 300 es\n\n    uniform vec2 u_backgroundScale;\n    uniform vec2 u_backgroundOffset;\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n    out vec2 v_backgroundCoord;\n\n    void main() {\n      // Flipping Y is required when rendering to canvas\n      gl_Position = vec4(a_position * vec2(1.0, -1.0), 0.0, 1.0);\n      v_texCoord = a_texCoord;\n      v_backgroundCoord = a_texCoord * u_backgroundScale + u_backgroundOffset;\n    }\n  "])));
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform sampler2D u_background;\n    uniform vec2 u_coverage;\n    uniform float u_lightWrapping;\n    uniform float u_blendMode;\n\n    in vec2 v_texCoord;\n    in vec2 v_backgroundCoord;\n\n    out vec4 outColor;\n\n    vec3 screen(vec3 a, vec3 b) {\n      return 1.0 - (1.0 - a) * (1.0 - b);\n    }\n\n    vec3 linearDodge(vec3 a, vec3 b) {\n      return a + b;\n    }\n\n    void main() {\n      vec3 frameColor = texture(u_inputFrame, v_texCoord).rgb;\n      vec3 backgroundColor = texture(u_background, v_backgroundCoord).rgb;\n      float personMask = texture(u_personMask, v_texCoord).a;\n      float lightWrapMask = 1.0 - max(0.0, personMask - u_coverage.y) / (1.0 - u_coverage.y);\n      vec3 lightWrap = u_lightWrapping * lightWrapMask * backgroundColor;\n      frameColor = u_blendMode * linearDodge(frameColor, lightWrap) +\n        (1.0 - u_blendMode) * screen(frameColor, lightWrap);\n      personMask = smoothstep(u_coverage.x, u_coverage.y, personMask);\n      outColor = vec4(frameColor * personMask + backgroundColor * (1.0 - personMask), 1.0);\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_personMask;\n    uniform sampler2D u_background;\n    uniform vec2 u_coverage;\n    uniform float u_lightWrapping;\n    uniform float u_blendMode;\n\n    in vec2 v_texCoord;\n    in vec2 v_backgroundCoord;\n\n    out vec4 outColor;\n\n    vec3 screen(vec3 a, vec3 b) {\n      return 1.0 - (1.0 - a) * (1.0 - b);\n    }\n\n    vec3 linearDodge(vec3 a, vec3 b) {\n      return a + b;\n    }\n\n    void main() {\n      vec3 frameColor = texture(u_inputFrame, v_texCoord).rgb;\n      vec3 backgroundColor = texture(u_background, v_backgroundCoord).rgb;\n      float personMask = texture(u_personMask, v_texCoord).a;\n      float lightWrapMask = 1.0 - max(0.0, personMask - u_coverage.y) / (1.0 - u_coverage.y);\n      vec3 lightWrap = u_lightWrapping * lightWrapMask * backgroundColor;\n      frameColor = u_blendMode * linearDodge(frameColor, lightWrap) +\n        (1.0 - u_blendMode) * screen(frameColor, lightWrap);\n      personMask = smoothstep(u_coverage.x, u_coverage.y, personMask);\n      outColor = vec4(frameColor * personMask + backgroundColor * (1.0 - personMask), 1.0);\n    }\n  "])));
    var outputWidth = canvas.width, outputHeight = canvas.height;
    var outputRatio = outputWidth / outputHeight;
    var vertexShader = (0, webglHelper_1.compileShader)(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var backgroundScaleLocation = gl.getUniformLocation(program, 'u_backgroundScale');
    var backgroundOffsetLocation = gl.getUniformLocation(program, 'u_backgroundOffset');
    var inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
    var personMaskLocation = gl.getUniformLocation(program, 'u_personMask');
    var backgroundLocation = gl.getUniformLocation(program, 'u_background');
    var coverageLocation = gl.getUniformLocation(program, 'u_coverage');
    var lightWrappingLocation = gl.getUniformLocation(program, 'u_lightWrapping');
    var blendModeLocation = gl.getUniformLocation(program, 'u_blendMode');
    gl.useProgram(program);
    gl.uniform2f(backgroundScaleLocation, 1, 1);
    gl.uniform2f(backgroundOffsetLocation, 0, 0);
    gl.uniform1i(inputFrameLocation, 0);
    gl.uniform1i(personMaskLocation, 1);
    gl.uniform2f(coverageLocation, 0, 1);
    gl.uniform1f(lightWrappingLocation, 0);
    gl.uniform1f(blendModeLocation, 0);
    var backgroundTexture = null;
    // TODO Find a better to handle background being loaded
    if (backgroundImage === null || backgroundImage === void 0 ? void 0 : backgroundImage.complete) {
        updateBackgroundImage(backgroundImage);
    }
    else if (backgroundImage) {
        backgroundImage.onload = function () {
            updateBackgroundImage(backgroundImage);
        };
    }
    function render() {
        gl.viewport(0, 0, outputWidth, outputHeight);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, personMaskTexture);
        if (backgroundTexture !== null) {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
            // TODO Handle correctly the background not loaded yet
            gl.uniform1i(backgroundLocation, 2);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function updateBackgroundImage(backgroundImage) {
        backgroundTexture = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, backgroundImage.naturalWidth, backgroundImage.naturalHeight, gl.LINEAR, gl.LINEAR);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, backgroundImage.naturalWidth, backgroundImage.naturalHeight, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImage);
        var xOffset = 0;
        var yOffset = 0;
        var backgroundWidth = backgroundImage.naturalWidth;
        var backgroundHeight = backgroundImage.naturalHeight;
        var backgroundRatio = backgroundWidth / backgroundHeight;
        if (backgroundRatio < outputRatio) {
            backgroundHeight = backgroundWidth / outputRatio;
            yOffset = (backgroundImage.naturalHeight - backgroundHeight) / 2;
        }
        else {
            backgroundWidth = backgroundHeight * outputRatio;
            xOffset = (backgroundImage.naturalWidth - backgroundWidth) / 2;
        }
        var xScale = backgroundWidth / backgroundImage.naturalWidth;
        var yScale = backgroundHeight / backgroundImage.naturalHeight;
        xOffset /= backgroundImage.naturalWidth;
        yOffset /= backgroundImage.naturalHeight;
        gl.uniform2f(backgroundScaleLocation, xScale, yScale);
        gl.uniform2f(backgroundOffsetLocation, xOffset, yOffset);
    }
    function updateCoverage(coverage) {
        gl.useProgram(program);
        gl.uniform2f(coverageLocation, coverage[0], coverage[1]);
    }
    function updateLightWrapping(lightWrapping) {
        gl.useProgram(program);
        gl.uniform1f(lightWrappingLocation, lightWrapping);
    }
    function updateBlendMode(blendMode) {
        gl.useProgram(program);
        gl.uniform1f(blendModeLocation, blendMode === 'screen' ? 0 : 1);
    }
    function cleanUp() {
        gl.deleteTexture(backgroundTexture);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
    }
    return {
        render: render,
        updateCoverage: updateCoverage,
        updateLightWrapping: updateLightWrapping,
        updateBlendMode: updateBlendMode,
        cleanUp: cleanUp,
    };
}
exports.buildBackgroundImageStage = buildBackgroundImageStage;
var templateObject_1, templateObject_2;

},{"../helpers/webglHelper":8}],12:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJointBilateralFilterStage = void 0;
var segmentationHelper_1 = require("../helpers/segmentationHelper");
var webglHelper_1 = require("../helpers/webglHelper");
function buildJointBilateralFilterStage(gl, vertexShader, positionBuffer, texCoordBuffer, inputTexture, segmentationConfig, outputTexture, canvas) {
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_segmentationMask;\n    uniform vec2 u_texelSize;\n    uniform float u_step;\n    uniform float u_radius;\n    uniform float u_offset;\n    uniform float u_sigmaTexel;\n    uniform float u_sigmaColor;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    float gaussian(float x, float sigma) {\n      float coeff = -0.5 / (sigma * sigma * 4.0 + 1.0e-6);\n      return exp((x * x) * coeff);\n    }\n\n    void main() {\n      vec2 centerCoord = v_texCoord;\n      vec3 centerColor = texture(u_inputFrame, centerCoord).rgb;\n      float newVal = 0.0;\n\n      float spaceWeight = 0.0;\n      float colorWeight = 0.0;\n      float totalWeight = 0.0;\n\n      vec2 leftTopCoord = vec2(centerCoord + vec2(-u_radius, -u_radius) * u_texelSize);\n      vec2 rightTopCoord = vec2(centerCoord + vec2(u_radius, -u_radius) * u_texelSize);\n      vec2 leftBottomCoord = vec2(centerCoord + vec2(-u_radius, u_radius) * u_texelSize);\n      vec2 rightBottomCoord = vec2(centerCoord + vec2(u_radius, u_radius) * u_texelSize);\n\n      float leftTopSegAlpha = texture(u_segmentationMask, leftTopCoord).a;\n      float rightTopSegAlpha = texture(u_segmentationMask, rightTopCoord).a;\n      float leftBottomSegAlpha = texture(u_segmentationMask, leftBottomCoord).a;\n      float rightBottomSegAlpha = texture(u_segmentationMask, rightBottomCoord).a;\n      float totalSegAlpha = leftTopSegAlpha + rightTopSegAlpha + leftBottomSegAlpha + rightBottomSegAlpha;\n\n      if (totalSegAlpha <= 0.0) {\n        outColor = vec4(vec3(0.0), 0.0);\n      } else if (totalSegAlpha >= 4.0) {\n        outColor = vec4(vec3(0.0), 1.0);\n      } else {\n        for (float i = -u_radius + u_offset; i <= u_radius; i += u_step) {\n          for (float j = -u_radius + u_offset; j <= u_radius; j += u_step) {\n            vec2 shift = vec2(j, i) * u_texelSize;\n            vec2 coord = vec2(centerCoord + shift);\n            vec3 frameColor = texture(u_inputFrame, coord).rgb;\n            float outVal = texture(u_segmentationMask, coord).a;\n\n            spaceWeight = gaussian(distance(centerCoord, coord), u_sigmaTexel);\n            colorWeight = gaussian(distance(centerColor, frameColor), u_sigmaColor);\n            totalWeight += spaceWeight * colorWeight;\n\n            newVal += spaceWeight * colorWeight * outVal;\n          }\n        }\n        newVal /= totalWeight;\n\n        outColor = vec4(vec3(0.0), newVal);\n      }\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n    uniform sampler2D u_segmentationMask;\n    uniform vec2 u_texelSize;\n    uniform float u_step;\n    uniform float u_radius;\n    uniform float u_offset;\n    uniform float u_sigmaTexel;\n    uniform float u_sigmaColor;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    float gaussian(float x, float sigma) {\n      float coeff = -0.5 / (sigma * sigma * 4.0 + 1.0e-6);\n      return exp((x * x) * coeff);\n    }\n\n    void main() {\n      vec2 centerCoord = v_texCoord;\n      vec3 centerColor = texture(u_inputFrame, centerCoord).rgb;\n      float newVal = 0.0;\n\n      float spaceWeight = 0.0;\n      float colorWeight = 0.0;\n      float totalWeight = 0.0;\n\n      vec2 leftTopCoord = vec2(centerCoord + vec2(-u_radius, -u_radius) * u_texelSize);\n      vec2 rightTopCoord = vec2(centerCoord + vec2(u_radius, -u_radius) * u_texelSize);\n      vec2 leftBottomCoord = vec2(centerCoord + vec2(-u_radius, u_radius) * u_texelSize);\n      vec2 rightBottomCoord = vec2(centerCoord + vec2(u_radius, u_radius) * u_texelSize);\n\n      float leftTopSegAlpha = texture(u_segmentationMask, leftTopCoord).a;\n      float rightTopSegAlpha = texture(u_segmentationMask, rightTopCoord).a;\n      float leftBottomSegAlpha = texture(u_segmentationMask, leftBottomCoord).a;\n      float rightBottomSegAlpha = texture(u_segmentationMask, rightBottomCoord).a;\n      float totalSegAlpha = leftTopSegAlpha + rightTopSegAlpha + leftBottomSegAlpha + rightBottomSegAlpha;\n\n      if (totalSegAlpha <= 0.0) {\n        outColor = vec4(vec3(0.0), 0.0);\n      } else if (totalSegAlpha >= 4.0) {\n        outColor = vec4(vec3(0.0), 1.0);\n      } else {\n        for (float i = -u_radius + u_offset; i <= u_radius; i += u_step) {\n          for (float j = -u_radius + u_offset; j <= u_radius; j += u_step) {\n            vec2 shift = vec2(j, i) * u_texelSize;\n            vec2 coord = vec2(centerCoord + shift);\n            vec3 frameColor = texture(u_inputFrame, coord).rgb;\n            float outVal = texture(u_segmentationMask, coord).a;\n\n            spaceWeight = gaussian(distance(centerCoord, coord), u_sigmaTexel);\n            colorWeight = gaussian(distance(centerColor, frameColor), u_sigmaColor);\n            totalWeight += spaceWeight * colorWeight;\n\n            newVal += spaceWeight * colorWeight * outVal;\n          }\n        }\n        newVal /= totalWeight;\n\n        outColor = vec4(vec3(0.0), newVal);\n      }\n    }\n  "])));
    var _a = segmentationHelper_1.inputResolutions[segmentationConfig.inputResolution], segmentationWidth = _a[0], segmentationHeight = _a[1];
    var outputWidth = canvas.width, outputHeight = canvas.height;
    var texelWidth = 1 / outputWidth;
    var texelHeight = 1 / outputHeight;
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
    var segmentationMaskLocation = gl.getUniformLocation(program, 'u_segmentationMask');
    var texelSizeLocation = gl.getUniformLocation(program, 'u_texelSize');
    var stepLocation = gl.getUniformLocation(program, 'u_step');
    var radiusLocation = gl.getUniformLocation(program, 'u_radius');
    var offsetLocation = gl.getUniformLocation(program, 'u_offset');
    var sigmaTexelLocation = gl.getUniformLocation(program, 'u_sigmaTexel');
    var sigmaColorLocation = gl.getUniformLocation(program, 'u_sigmaColor');
    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);
    gl.useProgram(program);
    gl.uniform1i(inputFrameLocation, 0);
    gl.uniform1i(segmentationMaskLocation, 1);
    gl.uniform2f(texelSizeLocation, texelWidth, texelHeight);
    // Ensures default values are configured to prevent infinite
    // loop in fragment shader
    updateSigmaSpace(0);
    updateSigmaColor(0);
    function render() {
        gl.viewport(0, 0, outputWidth, outputHeight);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, inputTexture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function updateSigmaSpace(sigmaSpace) {
        sigmaSpace *= Math.max(outputWidth / segmentationWidth, outputHeight / segmentationHeight);
        var kSparsityFactor = 0.66; // Higher is more sparse.
        var sparsity = Math.max(1, Math.sqrt(sigmaSpace) * kSparsityFactor);
        var step = sparsity;
        var radius = sigmaSpace;
        var offset = step > 1 ? step * 0.5 : 0;
        var sigmaTexel = Math.max(texelWidth, texelHeight) * sigmaSpace;
        gl.useProgram(program);
        gl.uniform1f(stepLocation, step);
        gl.uniform1f(radiusLocation, radius);
        gl.uniform1f(offsetLocation, offset);
        gl.uniform1f(sigmaTexelLocation, sigmaTexel);
    }
    function updateSigmaColor(sigmaColor) {
        gl.useProgram(program);
        gl.uniform1f(sigmaColorLocation, sigmaColor);
    }
    function cleanUp() {
        gl.deleteFramebuffer(frameBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
    }
    return { render: render, updateSigmaSpace: updateSigmaSpace, updateSigmaColor: updateSigmaColor, cleanUp: cleanUp };
}
exports.buildJointBilateralFilterStage = buildJointBilateralFilterStage;
var templateObject_1;

},{"../helpers/segmentationHelper":7,"../helpers/webglHelper":8}],13:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLoadSegmentationStage = void 0;
var segmentationHelper_1 = require("../helpers/segmentationHelper");
var webglHelper_1 = require("../helpers/webglHelper");
function buildLoadSegmentationStage(gl, vertexShader, positionBuffer, texCoordBuffer, segmentationConfig, tflite, outputTexture) {
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputSegmentation;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      float segmentation = texture(u_inputSegmentation, v_texCoord).r;\n      outColor = vec4(vec3(0.0), segmentation);\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputSegmentation;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      float segmentation = texture(u_inputSegmentation, v_texCoord).r;\n      outColor = vec4(vec3(0.0), segmentation);\n    }\n  "
        // TFLite memory will be accessed as float32
    ])));
    // TFLite memory will be accessed as float32
    var tfliteOutputMemoryOffset = tflite._getOutputMemoryOffset() / 4;
    var _a = segmentationHelper_1.inputResolutions[segmentationConfig.inputResolution], segmentationWidth = _a[0], segmentationHeight = _a[1];
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var inputLocation = gl.getUniformLocation(program, 'u_inputSegmentation');
    var inputTexture = (0, webglHelper_1.createTexture)(gl, gl.R32F, segmentationWidth, segmentationHeight);
    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);
    gl.useProgram(program);
    gl.uniform1i(inputLocation, 1);
    function render() {
        gl.viewport(0, 0, segmentationWidth, segmentationHeight);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, inputTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, segmentationWidth, segmentationHeight, gl.RED, gl.FLOAT, tflite.HEAPF32, tfliteOutputMemoryOffset);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function cleanUp() {
        gl.deleteFramebuffer(frameBuffer);
        gl.deleteTexture(inputTexture);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
    }
    return { render: render, cleanUp: cleanUp };
}
exports.buildLoadSegmentationStage = buildLoadSegmentationStage;
var templateObject_1;

},{"../helpers/segmentationHelper":7,"../helpers/webglHelper":8}],14:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResizingStage = void 0;
var segmentationHelper_1 = require("../helpers/segmentationHelper");
var webglHelper_1 = require("../helpers/webglHelper");
function buildResizingStage(gl, vertexShader, positionBuffer, texCoordBuffer, segmentationConfig, tflite) {
    var fragmentShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      outColor = texture(u_inputFrame, v_texCoord);\n    }\n  "], ["#version 300 es\n\n    precision highp float;\n\n    uniform sampler2D u_inputFrame;\n\n    in vec2 v_texCoord;\n\n    out vec4 outColor;\n\n    void main() {\n      outColor = texture(u_inputFrame, v_texCoord);\n    }\n  "
        // TFLite memory will be accessed as float32
    ])));
    // TFLite memory will be accessed as float32
    var tfliteInputMemoryOffset = tflite._getInputMemoryOffset() / 4;
    var _a = segmentationHelper_1.inputResolutions[segmentationConfig.inputResolution], outputWidth = _a[0], outputHeight = _a[1];
    var outputPixelCount = outputWidth * outputHeight;
    var fragmentShader = (0, webglHelper_1.compileShader)(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = (0, webglHelper_1.createPiplelineStageProgram)(gl, vertexShader, fragmentShader, positionBuffer, texCoordBuffer);
    var inputFrameLocation = gl.getUniformLocation(program, 'u_inputFrame');
    var outputTexture = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, outputWidth, outputHeight);
    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);
    var outputPixels = new Uint8Array(outputPixelCount * 4);
    gl.useProgram(program);
    gl.uniform1i(inputFrameLocation, 0);
    function render() {
        gl.viewport(0, 0, outputWidth, outputHeight);
        gl.useProgram(program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // Downloads pixels asynchronously from GPU while rendering the current frame
        (0, webglHelper_1.readPixelsAsync)(gl, 0, 0, outputWidth, outputHeight, gl.RGBA, gl.UNSIGNED_BYTE, outputPixels);
        for (var i = 0; i < outputPixelCount; i++) {
            var tfliteIndex = tfliteInputMemoryOffset + i * 3;
            var outputIndex = i * 4;
            tflite.HEAPF32[tfliteIndex] = outputPixels[outputIndex] / 255;
            tflite.HEAPF32[tfliteIndex + 1] = outputPixels[outputIndex + 1] / 255;
            tflite.HEAPF32[tfliteIndex + 2] = outputPixels[outputIndex + 2] / 255;
        }
    }
    function cleanUp() {
        gl.deleteFramebuffer(frameBuffer);
        gl.deleteTexture(outputTexture);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
    }
    return { render: render, cleanUp: cleanUp };
}
exports.buildResizingStage = buildResizingStage;
var templateObject_1;

},{"../helpers/segmentationHelper":7,"../helpers/webglHelper":8}],15:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWebGL2Pipeline = void 0;
var segmentationHelper_1 = require("../helpers/segmentationHelper");
var webglHelper_1 = require("../helpers/webglHelper");
var backgroundBlurStage_1 = require("./backgroundBlurStage");
var backgroundImageStage_1 = require("./backgroundImageStage");
var jointBilateralFilterStage_1 = require("./jointBilateralFilterStage");
var loadSegmentationStage_1 = require("./loadSegmentationStage");
var resizingStage_1 = require("./resizingStage");
function buildWebGL2Pipeline(sourcePlayback, backgroundImage, backgroundConfig, segmentationConfig, canvas, tflite, benchmark, debounce) {
    var shouldRunInference = true;
    var vertexShaderSource = (0, webglHelper_1.glsl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["#version 300 es\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n\n    void main() {\n      gl_Position = vec4(a_position, 0.0, 1.0);\n      v_texCoord = a_texCoord;\n    }\n  "], ["#version 300 es\n\n    in vec2 a_position;\n    in vec2 a_texCoord;\n\n    out vec2 v_texCoord;\n\n    void main() {\n      gl_Position = vec4(a_position, 0.0, 1.0);\n      v_texCoord = a_texCoord;\n    }\n  "])));
    var frameWidth = sourcePlayback.width, frameHeight = sourcePlayback.height;
    var _a = segmentationHelper_1.inputResolutions[segmentationConfig.inputResolution], segmentationWidth = _a[0], segmentationHeight = _a[1];
    var gl = canvas.getContext('webgl2');
    var vertexShader = (0, webglHelper_1.compileShader)(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    // We don't use texStorage2D here because texImage2D seems faster
    // to upload video texture than texSubImage2D even though the latter
    // is supposed to be the recommended way:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#use_texstorage_to_create_textures
    var inputFrameTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, inputFrameTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // TODO Rename segmentation and person mask to be more specific
    var segmentationTexture = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, segmentationWidth, segmentationHeight);
    var personMaskTexture = (0, webglHelper_1.createTexture)(gl, gl.RGBA8, frameWidth, frameHeight);
    var resizingStage = (0, resizingStage_1.buildResizingStage)(gl, vertexShader, positionBuffer, texCoordBuffer, segmentationConfig, tflite);
    var loadSegmentationStage = (0, loadSegmentationStage_1.buildLoadSegmentationStage)(gl, vertexShader, positionBuffer, texCoordBuffer, segmentationConfig, tflite, segmentationTexture);
    var jointBilateralFilterStage = (0, jointBilateralFilterStage_1.buildJointBilateralFilterStage)(gl, vertexShader, positionBuffer, texCoordBuffer, segmentationTexture, segmentationConfig, personMaskTexture, canvas);
    var backgroundStage = backgroundConfig.type === 'blur'
        ? (0, backgroundBlurStage_1.buildBackgroundBlurStage)(gl, vertexShader, positionBuffer, texCoordBuffer, personMaskTexture, canvas)
        : (0, backgroundImageStage_1.buildBackgroundImageStage)(gl, positionBuffer, texCoordBuffer, personMaskTexture, backgroundImage, canvas);
    function render() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                benchmark.start('inputImageResizeDelay');
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, inputFrameTexture);
                // texImage2D seems faster than texSubImage2D to upload
                // video texture
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourcePlayback.htmlElement);
                gl.bindVertexArray(vertexArray);
                resizingStage.render();
                benchmark.end('inputImageResizeDelay');
                benchmark.start('segmentationDelay');
                if (shouldRunInference) {
                    tflite._runInference();
                }
                if (debounce) {
                    shouldRunInference = !shouldRunInference;
                }
                benchmark.end('segmentationDelay');
                benchmark.start('imageCompositionDelay');
                loadSegmentationStage.render();
                jointBilateralFilterStage.render();
                backgroundStage.render();
                benchmark.end('imageCompositionDelay');
                return [2 /*return*/];
            });
        });
    }
    function updatePostProcessingConfig(postProcessingConfig) {
        jointBilateralFilterStage.updateSigmaSpace(postProcessingConfig.jointBilateralFilter.sigmaSpace);
        jointBilateralFilterStage.updateSigmaColor(postProcessingConfig.jointBilateralFilter.sigmaColor);
        if (backgroundConfig.type === 'image') {
            var backgroundImageStage = backgroundStage;
            backgroundImageStage.updateCoverage(postProcessingConfig.coverage);
            backgroundImageStage.updateLightWrapping(postProcessingConfig.lightWrapping);
            backgroundImageStage.updateBlendMode(postProcessingConfig.blendMode);
        }
        else if (backgroundConfig.type === 'blur') {
            var backgroundBlurStage = backgroundStage;
            backgroundBlurStage.updateCoverage(postProcessingConfig.coverage);
        }
        else {
            // TODO Handle no background in a separate pipeline path
            var backgroundImageStage = backgroundStage;
            backgroundImageStage.updateCoverage([0, 0.9999]);
            backgroundImageStage.updateLightWrapping(0);
        }
    }
    function cleanUp() {
        backgroundStage.cleanUp();
        jointBilateralFilterStage.cleanUp();
        loadSegmentationStage.cleanUp();
        resizingStage.cleanUp();
        gl.deleteTexture(personMaskTexture);
        gl.deleteTexture(segmentationTexture);
        gl.deleteTexture(inputFrameTexture);
        gl.deleteBuffer(texCoordBuffer);
        gl.deleteBuffer(positionBuffer);
        gl.deleteVertexArray(vertexArray);
        gl.deleteShader(vertexShader);
    }
    return { render: render, updatePostProcessingConfig: updatePostProcessingConfig, cleanUp: cleanUp };
}
exports.buildWebGL2Pipeline = buildWebGL2Pipeline;
var templateObject_1;

},{"../helpers/segmentationHelper":7,"../helpers/webglHelper":8,"./backgroundBlurStage":10,"./backgroundImageStage":11,"./jointBilateralFilterStage":12,"./loadSegmentationStage":13,"./resizingStage":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = exports.ImageFit = exports.WebGL2PipelineType = void 0;
/**
 * @private
 */
var WebGL2PipelineType;
(function (WebGL2PipelineType) {
    WebGL2PipelineType["Blur"] = "blur";
    WebGL2PipelineType["Image"] = "image";
})(WebGL2PipelineType || (exports.WebGL2PipelineType = WebGL2PipelineType = {}));
/**
 * ImageFit specifies the positioning of an image inside a viewport.
 */
var ImageFit;
(function (ImageFit) {
    /**
     * Scale the image up or down to fill the viewport while preserving the aspect ratio.
     * The image will be fully visible but will add empty space in the viewport if
     * aspect ratios do not match.
     */
    ImageFit["Contain"] = "Contain";
    /**
     * Scale the image to fill both height and width of the viewport while preserving
     * the aspect ratio, but will crop the image if aspect ratios do not match.
     */
    ImageFit["Cover"] = "Cover";
    /**
     * Stretches the image to fill the viewport regardless of aspect ratio.
     */
    ImageFit["Fill"] = "Fill";
    /**
     * Ignore height and width and use the original size.
     */
    ImageFit["None"] = "None";
})(ImageFit || (exports.ImageFit = ImageFit = {}));
/**
 * Specifies which pipeline to use when processing video frames.
 */
var Pipeline;
(function (Pipeline) {
    /**
     * Use canvas 2d rendering context. Some browsers such as Safari do not
     * have full support of this feature. Please test your application to make sure it works as intented. See
     * [browser compatibility page](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#browser_compatibility)
     * for reference.
     */
    Pipeline["Canvas2D"] = "Canvas2D";
    /**
     * Use canvas webgl2 rendering context. Major browsers have support for this feature. However, this does not work
     * on some older versions of browsers. Please test your application to make sure it works as intented. See
     * [browser compatibility page](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext#browser_compatibility)
     * for reference.
     */
    Pipeline["WebGL2"] = "WebGL2";
})(Pipeline || (exports.Pipeline = Pipeline = {}));

},{}],17:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Benchmark = void 0;
/**
 * @private
 */
var Benchmark = /** @class */ (function () {
    function Benchmark() {
        this._timingCache = new Map();
        this._timings = new Map();
    }
    Benchmark.prototype.end = function (name) {
        var timing = this._timings.get(name);
        if (!timing) {
            return;
        }
        timing.end = Date.now();
        timing.delay = timing.end - timing.start;
        this._save(name, __assign({}, timing));
    };
    Benchmark.prototype.getAverageDelay = function (name) {
        var timingCache = this._timingCache.get(name);
        if (!timingCache || !timingCache.length) {
            return;
        }
        return timingCache.map(function (timing) { return timing.delay; })
            .reduce(function (total, value) { return total += value; }, 0) / timingCache.length;
    };
    Benchmark.prototype.getNames = function () {
        return Array.from(this._timingCache.keys());
    };
    Benchmark.prototype.getRate = function (name) {
        var timingCache = this._timingCache.get(name);
        if (!timingCache || timingCache.length < 2) {
            return;
        }
        var totalDelay = timingCache[timingCache.length - 1].end - timingCache[0].start;
        return (timingCache.length / totalDelay) * 1000;
    };
    Benchmark.prototype.start = function (name) {
        var timing = this._timings.get(name);
        if (!timing) {
            timing = {};
            this._timings.set(name, timing);
        }
        timing.start = Date.now();
        delete timing.end;
        delete timing.delay;
    };
    Benchmark.prototype._save = function (name, timing) {
        var timingCache = this._timingCache.get(name);
        if (!timingCache) {
            timingCache = [];
            this._timingCache.set(name, timingCache);
        }
        timingCache.push(timing);
        if (timingCache.length > Benchmark.cacheSize) {
            timingCache.splice(0, timingCache.length - Benchmark.cacheSize);
        }
    };
    // NOTE (csantos): How many timing information to save per benchmark.
    // This is about the amount of timing info generated on a 24fps input.
    // Enough samples to calculate fps
    Benchmark.cacheSize = 41;
    return Benchmark;
}());
exports.Benchmark = Benchmark;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupported = exports.isBrowserSupported = void 0;
/**
 * @private
 */
function getCanvas() {
    return typeof window.OffscreenCanvas !== 'undefined' ? new window.OffscreenCanvas(1, 1) : document.createElement('canvas');
}
/**
 * @private
 */
function isBrowserSupported() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return !!(getCanvas().getContext('2d') || getCanvas().getContext('webgl2'));
    }
    else {
        return false;
    }
}
exports.isBrowserSupported = isBrowserSupported;
/**
 * Check if the current browser is officially supported by twilio-video-procesors.js.
 * This is set to `true` for browsers that supports canvas
 * [2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) or
 * [webgl2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
 * rendering context.
 * @example
 * ```ts
 * import { isSupported } from '@twilio/video-processors';
 *
 * if (isSupported) {
 *   // Initialize the background processors
 * }
 * ```
 */
exports.isSupported = isBrowserSupported();

},{}],19:[function(require,module,exports){
"use strict";
// This file is generated on build. To make changes, see scripts/version.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
/**
 * The current version of the library.
 */
exports.version = '2.1.0';

},{}]},{},[2]);
