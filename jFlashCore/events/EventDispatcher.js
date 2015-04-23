


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The EventDispatcher class implements the IEventDispatcher interface and is the base class for the DisplayObject class. 
    * @class EventDispatcher
    * @constructor
    **/
    var EventDispatcher = function () {

        //------------------------------------------------------------------
        //  EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATES

        /** @private */
        var _list = [];

        /** @private */
        var _indexOf = function (type, listener) {
            for (var i = 0, len = _list.length; i < len; i++) {
                var obj = _list[i];
                if (obj.type == type && (listener == null || obj.listener === listener)) {
                    return i;
                }
            }
            return -1;
        };


        //------------------------------------------------------------------
        // PUBLIC

        /**
        * Check if event is triggered.
        * @method hasEventListener
        * @param { String } event type
        */
        this.hasEventListener = function (type) {
            return (_indexOf(type) != -1);
        }

        /**
        * Add event to list.
        * @method addEventListener
        * @param { String } event type
        * @param { Function } function to call when event is trigger
        */
        this.addEventListener = function (type, listener) {
            if (type != "" && listener != null) {
                _list.push({ type: type, listener: listener });
            }
        };

        /**
        * Remove event from list.
        * @method removeEventListener
        * @param { String } event type
        * @param { Function } function to call when event is trigger
        */
        this.removeEventListener = function (type, listener) {
            if (type != null && type != "" && listener != null) {
                var pos = _indexOf(type, listener);
                if (pos != -1) {
                    _list.splice(pos, 1);
                }
            }
        };

        /**
        * Dispach an event.
        * @method dispatchEvent
        * @param { jFlashCore.Event } Event
        */
        this.dispatchEvent = function (event) {
            for (var i = 0, len = _list.length; i < len; i++) {
                var obj = _list[i];
                var snap = this;
                var stop = false;

                if (obj.type == event.type && obj.listener != null) {
                    event.addProperty("target", function () { return snap; });
                    event.stopPropagation = function () { stop = true; };
                    obj.listener.apply(this, [event]);
                }
                if (stop) break;
            }
        };

        /**
        * Checks whether an event listener is registered with this EventDispatcher object or any of its ancestors for the specified event type.
        * @method willTrigger
        * @param { String } event type
        */
        this.willTrigger = function (type) {
            var focus = this.ancestor;
            while (focus != null) {
                if (focus.hasEventListener(type)) return true;
                focus = focus.parent;
            }
            return false;
        };

    };
    EventDispatcher.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // REGISTER

    EventDispatcher.prototype.className = "EventDispatcher";
    jFlashCore.registerClass(EventDispatcher);


})(window);