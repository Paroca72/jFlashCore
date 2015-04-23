

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The URLRequest class captures all of the information in a single HTTP request.
    * @class URLRequest
    * @constructor
    **/
    var URLRequest = function (url) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _contentType = null;
        /** @private */
        var _data = null;
        /** @private */
        var _method = null;
        /** @private */
        var _url = null;
        /** @private */
        var _requestHeaders = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * The MIME content type of the content in the the data property. 
        * @property contentType
        * @type String
        * @default "application/x-www-form-urlencoded"
        **/
        this.addProperty("contentType",
            function () { return _contentType; },
            function (value) { _contentType = value; }
        );

        /**
        * An object containing data to be transmitted with the URL request.
        * @property data
        * @type Object
        * @default null
        **/
        this.addProperty("data",
            function () { return _data; },
            function (value) { _data = value; }
        );

        /**
        * Controls the HTTP form submission method. 
        * @property method
        * @type String
        * @default jFlashCore.URLRequestMethod.GET
        **/
        this.addProperty("method",
            function () { return _method; },
            function (value) {
                if (value != "GET" && value != "POST") {
                    value = "GET";
                }
                _method = value;
            }
        );

        /**
        * The URL to be requested. 
        * @property url
        * @type String
        * @default null
        **/
        this.addProperty("url",
            function () { return _url; },
            function (value) { _url = value; }
        );

        /**
        * The array of HTTP request headers to be appended to the HTTP request.
        * @property requestHeaders
        * @type Array
        **/
        this.addProperty("requestHeaders",
            function () { return _requestHeaders; },
            function (value) { _requestHeaders = value; }
        );


        //------------------------------------------------------------------
        // INIT

        _url = url;
        _contentType = "";
        _method = "GET";
        _requestHeaders = [];

    };
    URLRequest.prototype = Object.create(jFlashCore.Object.prototype);



    //------------------------------------------------------------------
    // REGISTER CLASS

    URLRequest.prototype.className = "URLRequest";
    jFlashCore.registerClass(URLRequest);

})(window);