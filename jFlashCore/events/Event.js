

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event listeners when an event occurs. 
    * @class DisplayObjectContainer
    * @param { String } type Event type
    * @param { Boolean } bubbles Not implemented
    * @param { Boolean } cancelable Not implemented
    * @constructor
    **/
    var Event = function (type, bubbles, cancelable) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _type = type;


        //------------------------------------------------------------------
        // PUBLIC

        /**
        * Event type.
        * @property type
        * @type String
        */
        this.addProperty("type",
            function () { return _type; }
        );

        /**
        * Event target.
        * @property target
        * @type Object
        */
        this.addProperty("target",
            function () { return null; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow.
        * @method stopPropagation
        */
        this.stopPropagation = function () {
        };


        //------------------------------------------------------------------
        // INIT

        bubbles = bubbles || false;
        cancelable = cancelable || false;


    };
    Event.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // CONSTANTS

    Event.ADDED_TO_STAGE = "addedToStage";
    Event.prototype.ADDED_TO_STAGE = Event.ADDED_TO_STAGE;

    Event.COMPLETE = "complete";
    Event.prototype.COMPLETE = Event.COMPLETE;

    Event.ENTER_FRAME = "enterFrame";
    Event.prototype.ENTER_FRAME = Event.ENTER_FRAME;

    Event.RENDER = "render";
    Event.prototype.RENDER = Event.RENDER;

    Event.INVALIDATE = "invalidate";
    Event.prototype.INVALIDATE = Event.INVALIDATE;

    Event.OPEN = "open";
    Event.prototype.OPEN = Event.OPEN;

    Event.REMOVED_FROM_STAGE = "removedFromStage";
    Event.prototype.REMOVED_FROM_STAGE = Event.REMOVED_FROM_STAGE;


    //------------------------------------------------------------------
    // REGISTER CLASS

    Event.prototype.className = "Event";
    jFlashCore.registerClass(Event);


})(window);