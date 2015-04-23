

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * An IOErrorEvent object is dispatched when an error causes input or output operations to fail. 
    * @class IOErrorEvent
    * @param { String } type Event type
    * @param { Boolean } bubbles Not implemented
    * @param { Boolean } cancelable Not implemented
    * @param { String } text Text to be displayed as an error message.
    * @constructor
    **/
    var IOErrorEvent = function (type, bubbles, cancelable, text) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Event, false, [type, bubbles, cancelable]);


        //------------------------------------------------------------------
        // PRIVATE PROPERTIES

        /** @private */
        var _text = null;


        //------------------------------------------------------------------
        // PUBLIC

        /**
        * For a textInput event, the character or sequence of characters entered by the user.
        * @property text
        * @type String
        */
        this.addProperty("text",
            function () { return _text; }
        );


        //------------------------------------------------------------------
        // INIT

        _text = text;


    };
    IOErrorEvent.prototype = Object.create(jFlashCore.Event.prototype);


    //------------------------------------------------------------------
    // CONSTANTS

    IOErrorEvent.IO_ERROR = "ioError";
    IOErrorEvent.prototype.IO_ERROR = IOErrorEvent.IO_ERROR;



    //------------------------------------------------------------------
    // REGISTER CLASS

    IOErrorEvent.prototype.className = "IOErrorEvent";
    jFlashCore.registerClass(IOErrorEvent);


})(window);