

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The URLLoader class downloads data from a URL as text, binary data, or URL-encoded variables. It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
    * @class URLLoader
    * @param { jFlashCore.URLRequest } request A URLRequest object specifying the URL to download. If this parameter is omitted, no load operation begins. If specified, the load operation begins immediately. 
    * @constructor
    **/
    var URLLoader = function (request) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.EventDispatcher);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _bytesLoaded = 0;
        /** @private */
        var _bytesTotal = 0;
        /** @private */
        var _data = null;
        /** @private */
        var _url = null;

        /** @private */
        var _self = this;
        /** @private */
        var _XHR = null;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        /** @private */
        var _makeRequest = function (request) {
            if (request != null && request.url != "") {
                _XHR = new XMLHttpRequest();
                _XHR.open(request.method, request.url, true);

                if (_XHR.hasOwnProperty("onload")) {
                    _XHR.onload = _checkState;
                } else {
                    _XHR.onreadystatechange = _checkState;
                }

                if (_XHR.overrideMimeType) {
                    _XHR.overrideMimeType('text/plain; charset=x-user-defined');
                } else {
                    _XHR.setRequestHeader('Accept-Charset', 'x-user-defined');
                }

                if (request.contentType != "") {
                    _XHR.setRequestHeader('Content-Type', request.contentType);
                }

                request.requestHeaders = request.requestHeaders || [];
                for (var i = 0, len = request.requestHeaders.length; i < len; i++) {
                    var header = request.requestHeaders[i];
                    if (header instanceof jFlashCore.URLRequestHeader) {
                        _XHR.setRequestHeader(header.name, header.value);
                    }
                }

                _XHR.send(request.data);
            }
        };


        //------------------------------------------------------------------
        // EVENT

        var _checkState = function () {
            function getContextLength(XHR) {
                if (typeof XHR.responseBody == 'unknown') {
                    var data = new VBArray(XHR.responseBody).toArray();
                    return data.length;
                } else {
                    return XHR.responseText.length;
                }
            };

            function getContextBytes(XHR) {
                if (typeof XHR.responseBody == 'unknown') {
                    var data = new VBArray(XHR.responseBody).toArray();
                    var dataStr = "";
                    for (var i = 0, len = data.length; i < len; i++) {
                        dataStr += String.fromCharCode(data[i] & 0xFF);
                    }
                    return dataStr;
                } else {
                    return XHR.responseText;
                }
            };

            switch (_XHR.readyState) {
                case 1:
                    if (_self.hasEventListener(jFlashCore.Event.OPEN)) {
                        _self.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.OPEN));
                    }
                    break;

                case 2:
                    if (_XHR.status != 200) {
                        if (_self.hasEventListener(jFlashCore.IOErrorEvent.IO_ERROR)) {
                            _self.dispatchEvent(new jFlashCore.IOErrorEvent(jFlashCore.IOErrorEvent.IO_ERROR, false, false, _XHR.statusText));
                        }
                        _XHR.abort();
                    }
                    break;

                case 3:
                    try {
                        _bytesTotal = _XHR.getResponseHeader("Content-Length");
                        _bytesLoaded = getContextLength(_XHR);
                        if (_self.hasEventListener(jFlashCore.ProgressEvent.PROGRESS)) {
                            _self.dispatchEvent(new jFlashCore.ProgressEvent(jFlashCore.ProgressEvent.PROGRESS, false, false, _bytesLoaded, _bytesTotal));
                        }
                    } catch (e) {
                        _bytesTotal = NaN;
                        _bytesLoaded = NaN;
                    }
                    break;

                case 4:
                    if (_bytesLoaded < _bytesTotal) {
                        _bytesLoaded = _bytesTotal;
                        if (_self.hasEventListener(jFlashCore.ProgressEvent.PROGRESS)) {
                            _self.dispatchEvent(new jFlashCore.ProgressEvent(jFlashCore.ProgressEvent.PROGRESS, false, false, _bytesLoaded, _bytesTotal));
                        }
                    }
                    _data = getContextBytes(_XHR);
                    if (_self.hasEventListener(jFlashCore.Event.COMPLETE)) {
                        _self.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.COMPLETE));
                    }
                    break;
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
            function () { return _bytesLoaded; }
        );

        /**
        * [read-only] Indicates the total number of bytes in the downloaded data.
        * @property bytesTotal
        * @type Number
        * @default 0
        **/
        this.addProperty("bytesTotal",
            function () { return _bytesTotal; }
        );

        /**
        * [read-only] The data received from the load operation.
        * @property data
        * @type Variant
        * @default null
        **/
        this.addProperty("data",
            function () { return _data; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Closes the load operation in progress.
        * @method close
        */
        this.close = function () {
            if (_XHR) {
                _XHR.close();
            }
        };

        /**
        * Sends and loads data from the specified URL. 
        * @method load
        * @return { jFlashCore.URLRequest } request A URLRequest object specifying the URL to download. 
        */
        this.load = function (request) {
            if (!(request instanceof jFlashCore.URLRequest)) throw "Passed object must be an jFlashCore.URLRequest";
            _url = request.url;
            _makeRequest(request);
        };


        //------------------------------------------------------------------
        // INIT

        if (request != null) {
            this.load(request);
        }


    };
    URLLoader.prototype = Object.create(jFlashCore.EventDispatcher.prototype);



    //------------------------------------------------------------------
    // REGISTER CLASS

    URLLoader.prototype.className = "URLLoader";
    jFlashCore.registerClass(URLLoader);

})(window);


