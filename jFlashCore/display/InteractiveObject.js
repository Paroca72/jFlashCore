

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The InteractiveObject class is the abstract base class for all display objects with which the user can interact, using the mouse. 
    * Is an abstract class and you cannot create a InteractiveObject object directly from ActionScript code. If you call new InteractiveObject(), an exception is thrown.
    * @class InteractiveObject
    * @constructor
    **/
    var InteractiveObject = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObject, true);


        //------------------------------------------------------------------
        // PRIVATE PROPERTIES

        /** @private */
        var _self = this;

        /** @private */
        var _mouseEnabled = true;
        /** @private */
        var _mouseInside = false;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        /** @private */
        var _isParentMouseEnabled = function (obj) {
            while (obj != null) {
                if (obj.mouseChildren == false) return false;
                obj = obj.parent;
            }
            return true;
        };

        /** @private */
        var _isMouseEnabled = function () {
            return this.visible && _mouseEnabled && _isParentMouseEnabled(this.parent);
        };


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * Specifies whether this object receives mouse messages. 
        * @property mouseEnabled
        * @type Boolean
        * @default true
        **/
        this.addProperty("mouseEnabled",
            function () { return _isMouseEnabled(); },
            function (value) {
                if (value != true) value = false;
                _mouseEnabled = value;
            }
        );


        //------------------------------------------------------------------
        // INIT

        if (jFlashCore.abstractClassIsLock()) {
            throw "This is an abstract class.";
        } else {
            jFlashCore.lockAbstractClassConstraint();
        }

        // Capture mouse events
        jFlashCore.html.attachEvent(document, "mousemove", function (e) {
            if (_self.hitTestPoint(_self.mouseX, _self.mouseY, true)) {
                if (_self.hasEventListener(jFlashCore.MouseEvent.MOUSE_MOVE)) {
                    _self.dispatchEvent(new jFlashCore.MouseEvent(jFlashCore.MouseEvent.MOUSE_MOVE));
                }

                if (!_mouseInside) {
                    _self.dispatchEvent(new jFlashCore.MouseEvent(jFlashCore.MouseEvent.MOUSE_OVER));
                }

                _mouseInside = true;
            } else {
                if (_mouseInside) {
                    _self.dispatchEvent(new jFlashCore.MouseEvent(jFlashCore.MouseEvent.MOUSE_OUT));
                }

                _mouseInside = false;
            }
        });

        jFlashCore.html.attachEvent(document, "click", function (e) {
            if (_self.hasEventListener(jFlashCore.MouseEvent.CLICK) &&
                _self.hitTestPoint(_self.mouseX, _self.mouseY, true)) {
                _self.dispatchEvent(new jFlashCore.MouseEvent(jFlashCore.MouseEvent.CLICK));
            }
        });

        jFlashCore.html.attachEvent(document, "dblclick", function (e) {
            if (_self.hasEventListener(jFlashCore.MouseEvent.DOUBLE_CLICK) &&
                _self.hitTestPoint(_self.mouseX, _self.mouseY, true)) {
                _self.dispatchEvent(new jFlashCore.MouseEvent(jFlashCore.MouseEvent.DOUBLE_CLICK));
            }
        });

    };
    InteractiveObject.prototype = Object.create(jFlashCore.DisplayObject.prototype);


    //------------------------------------------------------------------
    // REGISTER

    InteractiveObject.prototype.className = "InteractiveObject";
    jFlashCore.registerClass(InteractiveObject);


})(window);
