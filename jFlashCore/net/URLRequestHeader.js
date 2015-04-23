

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * A URLRequestHeader object encapsulates a single HTTP request header and consists of a name/value pair.
    * @class URLRequestHeader 
    * @param { String } name An HTTP request header name (such as Content-Type or SOAPAction). 
    * @param { String } value The value associated with the name property (such as text/plain). 
    * @constructor
    **/
    var URLRequestHeader = function (name, value) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _name = null;
        /** @private */
        var _value = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * An HTTP request header name (such as Content-Type or SOAPAction). 
        * @property name
        * @type String
        * @default ""
        **/
        this.addProperty("name",
            function () { return _name; },
            function (value) { _name = value; }
        );

        /**
        * The value associated with the name property (such as text/plain). 
        * @property value
        * @type String
        * @default ""
        **/
        this.addProperty("value",
            function () { return _value; },
            function (value) { _value = value; }
        );


        //------------------------------------------------------------------
        // INIT

        _name = name || "";
        _value = value || "";


    };
    URLRequestHeader.prototype = Object.create(jFlashCore.Object.prototype);



    //------------------------------------------------------------------
    // REGISTER CLASS

    URLRequestHeader.prototype.className = "URLRequestHeader";
    jFlashCore.registerClass(URLRequestHeader);

})(window);