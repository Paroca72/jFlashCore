


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The LoaderInfo class provides information about a loaded image file.
    * @class LoaderInfo
    * @constructor
    **/
    var LoaderInfo = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.EventDispatcher);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _urlLoader = null;
        /** @private */
        var _urlRequest = null;

        /** @private */
        var _loader = null;
        /** @private */
        var _content = null;

        /** @private */
        var _width = 0;
        /** @private */
        var _height = 0;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        /** @private */
        var _base64Encode = function (inputStr) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var outputStr = "";
            var i = 0;

            while (i < inputStr.length) {
                var byte1 = inputStr.charCodeAt(i++) & 0xff;
                var byte2 = inputStr.charCodeAt(i++) & 0xff;
                var byte3 = inputStr.charCodeAt(i++) & 0xff;

                var enc1 = byte1 >> 2;
                var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                var enc3;
                var enc4;

                if (isNaN(byte2)) {
                    enc3 = enc4 = 64;
                } else {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3)) {
                        enc4 = 64;
                    } else {
                        enc4 = byte3 & 63;
                    }
                }

                outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
            }

            return outputStr;
        }

        var _copyToCanvas = function () {
            if (_urlLoader.data != null) {
                var self = this;
                var image = new Image();

                image.onload = function (e) {
                    _width = image.width;
                    _height = image.height;

                    var canvas = document.createElement("canvas");
                    canvas.setAttribute("width", _width);
                    canvas.setAttribute("height", _height);

                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, _width, _height);

                    var data = new jFlashCore.BitmapData(_width, _height);
                    data.draw(canvas);

                    _content = new jFlashCore.Bitmap(data);
                };

                image.onerror = function (e) {
                    if (self.hasEventListener(jFlashCore.IOErrorEvent.IO_ERROR)) {
                        self.dispatchEvent(new jFlashCore.IOErrorEvent(jFlashCore.IOErrorEvent.IO_ERROR, false, false, "Loaded file is not an image."));
                    }
                };

                image.src = "data:image/png;base64," + _base64Encode(_urlLoader.data);
            }
        };


        //------------------------------------------------------------------
        // EVENTS

        var _openHandler = function (e) {
            _content = new jFlashCore.Bitmap();
            _width = 0;
            _height = 0;

            var source = e.target;
            if (source.hasEventListener(jFlashCore.Event.OPEN)) {
                source.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.OPEN));
            }
        };

        var _errorHandler = function (e) {
            _content = null;

            var source = e.target;
            if (source.hasEventListener(jFlashCore.IOErrorEvent.IO_ERROR)) {
                source.dispatchEvent(new jFlashCore.IOErrorEvent(jFlashCore.IOErrorEvent.IO_ERROR, false, false, e.text));
            }
        };

        var _progressHandler = function (e) {
            var source = e.target;
            if (source.hasEventListener(jFlashCore.ProgressEvent.PROGRESS)) {
                source.dispatchEvent(new jFlashCore.ProgressEvent(jFlashCore.ProgressEvent.PROGRESS, false, false, e._bytesLoaded, e._bytesTotal));
            }
        };

        var _completeHandler = function (e) {
            var source = e.target;
            _copyToCanvas.call(source);

            if (source.hasEventListener(jFlashCore.Event.COMPLETE)) {
                source.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.COMPLETE));
            }
        };


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * [read-only] Indicates the number of bytes that have been loaded thus far during the load operation.
        * @property bytesLoaded
        * @type Number
        * @default 0
        **/
        this.addProperty("bytesLoaded",
            function () {
                if (_urlLoader != null) {
                    return _urlLoader.bytesLoaded;
                } else {
                    return 0;
                }
            }
        );

        /**
        * [read-only] Indicates the total number of bytes in the downloaded data.
        * @property bytesTotal
        * @type Number
        * @default 0
        **/
        this.addProperty("bytesTotal",
            function () {
                if (_urlLoader != null) {
                    return _urlLoader.bytesTotal;
                } else {
                    return 0;
                }
            }
        );

        /**
        * [read-only] The loaded object associated with this LoaderInfo object. 
        * @property content
        * @type jFlashCore.DisplayObject
        * @default null
        **/
        this.addProperty("content",
            function () { return _content; }
        );

        /**
        * [read-only] The nominal height of the loaded content.
        * @property height
        * @type Number
        * @default 0
        **/
        this.addProperty("height",
            function () { return _height; }
        );

        /**
        * [read-only] The nominal width of the loaded content.
        * @property width
        * @type Number
        * @default 0
        **/
        this.addProperty("width",
            function () { return _width; }
        );

        /**
        * [read-only] The URL of the media being loaded.
        * @property url
        * @type String
        * @default null
        **/
        this.addProperty("url",
            function () { return _url; }
        );


        //------------------------------------------------------------------
        // INIT

        if (jFlashCore.abstractClassIsLock()) {
            throw "This is an abstract class.";
        } else {
            jFlashCore.lockAbstractClassConstraint();
        }

        if (arguments.length == 1) {
            _loader = arguments[0];
        } else {
            throw "Arguments exception";
        }

        _urlLoader = new jFlashCore.URLLoader();
        _urlLoader.addEventListener(jFlashCore.Event.OPEN, _openHandler);
        _urlLoader.addEventListener(jFlashCore.IOErrorEvent.IO_ERROR, _errorHandler);
        _urlLoader.addEventListener(jFlashCore.ProgressEvent.PROGRESS, _progressHandler);
        _urlLoader.addEventListener(jFlashCore.Event.COMPLETE, _completeHandler);

        // override methods
        _loader.load = function (request) {
            _url = request.url;
            _urlLoader.load(request);
        };

        _loader.unload = function () {
            if (_urlLoader != null) {
                _urlLoader.close();
            }

            if (_loader.numChildren.length > 0) {
                _loader.super.removeChildAt(0);
            }
        }


    };
    LoaderInfo.prototype = Object.create(jFlashCore.EventDispatcher.prototype);


    //------------------------------------------------------------------
    // REGISTER

    LoaderInfo.prototype.className = "LoaderInfo";
    jFlashCore.registerClass(LoaderInfo);


})(window);