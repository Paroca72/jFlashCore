

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * A ProgressEvent object is dispatched when a load operation has begun or a socket has received data.
    * @class ProgressEvent
    * @param { String } type Event type
    * @param { Boolean } bubbles Not implemented
    * @param { Boolean } cancelable Not implemented
    * @param { Number } bytesLoaded The number of items or bytes loaded at the time the listener processes the event. 
    * @param { Number } bytesTotal The total number of items or bytes that will be loaded if the loading process succeeds. 
    * @constructor
    **/
    var ProgressEvent = function (type, bubbles, cancelable, bytesLoaded, bytesTotal) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Event, false, [type, bubbles, cancelable]);


        //------------------------------------------------------------------
        // PRIVATE PROPERTIES

        /** @private */
        var _bytesLoaded = 0;
        /** @private */
        var _bytesTotal = 0;


        //------------------------------------------------------------------
        // PUBLIC

        /**
        * The number of items or bytes loaded at the time the listener processes the event. 
        * @property bytesLoaded
        * @type Number
        */
        this.addProperty("bytesLoaded",
            function () { return _bytesLoaded; }
        );

        /**
        * The total number of items or bytes that will be loaded if the loading process succeeds. 
        * @property bytesTotal
        * @type Number
        */
        this.addProperty("bytesTotal",
            function () { return _bytesTotal; }
        );


        //------------------------------------------------------------------
        // INIT

        _bytesLoaded = bytesLoaded;
        _bytesTotal = bytesTotal;


    };
    ProgressEvent.prototype = Object.create(jFlashCore.Event.prototype);


    //------------------------------------------------------------------
    // CONSTANTS

    ProgressEvent.PROGRESS = "progress";
    ProgressEvent.prototype.PROGRESS = ProgressEvent.PROGRESS;



    //------------------------------------------------------------------
    // REGISTER CLASS

    ProgressEvent.prototype.className = "ProgressEvent";
    jFlashCore.registerClass(ProgressEvent);


})(window);