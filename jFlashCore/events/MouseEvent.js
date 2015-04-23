

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * Dispatches MouseEvent objects into the event flow whenever mouse events occur.
    * @class MouseEvent
    * @param { String } type Event type
    * @param { Boolean } bubbles Not implemented
    * @param { Boolean } cancelable Not implemented
    * @constructor
    **/
    var MouseEvent = function (type, bubbles, cancelable) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Event, false, [type, bubbles, cancelable]);


    };
    MouseEvent.prototype = Object.create(jFlashCore.Event.prototype);


    //------------------------------------------------------------------
    // CONSTANTS

    MouseEvent.MOUSE_OVER = "mouseOver";
    MouseEvent.prototype.MOUSE_OVER = MouseEvent.MOUSE_OVER;

    MouseEvent.MOUSE_OUT = "mouseOut";
    MouseEvent.prototype.MOUSE_OUT = MouseEvent.MOUSE_OUT;

    MouseEvent.MOUSE_MOVE = "mouseMove";
    MouseEvent.prototype.MOUSE_MOVE = MouseEvent.MOUSE_MOVE;

    MouseEvent.CLICK = "click";
    MouseEvent.prototype.CLICK = MouseEvent.CLICK;

    MouseEvent.DOUBLE_CLICK = "doubleClick";
    MouseEvent.prototype.DOUBLE_CLICK = MouseEvent.DOUBLE_CLICK;


    //------------------------------------------------------------------
    // REGISTER CLASS

    MouseEvent.prototype.className = "MouseEvent";
    jFlashCore.registerClass(MouseEvent);


})(window);