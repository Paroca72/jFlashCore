


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The DisplayObject class is the base class for all objects that can be placed on the display list.
    * Is an abstract calss and you cannot create a DisplayObject object directly from ActionScript code. If you call new DisplayObject(), an exception is thrown.
    * @class DisplayObjectContainer
    * @constructor
    **/
    var DisplayObject = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.EventDispatcher);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _canvas = null;

        /** @private */
        var _x = 0;
        /** @private */
        var _y = 0;

        /** @private */
        var _scaleX = 1;
        /** @private */
        var _scaleY = 1;
        /** @private */
        var _rotation = 0;

        /** @private */
        var _alpha = 1;
        /** @private */
        var _visible = true;
        /** @private */
        var _name = null;

        /** @private */
        var _cacheAsBitmap = false;
        /** @private */
        var _mask = null;
        /** @private */
        var _scrollRect = null;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        var _getContainerDimension = function (isBounds) {
            var ancestor = this.ancestor;
            var bounds = null;

            if (ancestor instanceof jFlashCore.Sprite) bounds = (isBounds) ? ancestor.graphics.__bounds : ancestor.graphics.__rect;
            if (ancestor instanceof jFlashCore.Bitmap) bounds = ancestor.graphics.rect;
            if (bounds == null) bounds = new jFlashCore.Rectangle(0, 0, 0, 0);

            if (ancestor instanceof jFlashCore.DisplayObjectContainer) {
                for (var i = 0, len = ancestor.numChildren; i < len; i++) {
                    var child = ancestor.getChildAt(i);
                    bounds = bounds.union((isBounds) ? child.getBounds(child) : child.getRect(child));
                }
            }

            return bounds;
        };

        /** @private */
        var _findElementPosition = function (oElement) {
            if (typeof (oElement.offsetParent) != "undefined") {
                for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                    posX += oElement.offsetLeft;
                    posY += oElement.offsetTop;
                }
                return [posX, posY];
            } else {
                return [oElement.x, oElement.y];
            }
        };

        /** @private */
        var _getMouseCoordinates = function () {
            var canvas = this.stage.getHTMLCanvas();
            var elPos = _findElementPosition(canvas);

            var x = jFlashCore.html.mouseX - elPos[0];
            var y = jFlashCore.html.mouseY - elPos[1];

            return new jFlashCore.Point(x, y);
        };


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * Indicates the alpha transparency value of the object specified.
        * @property alpha
        * @type Number
        * @default 1
        **/
        this.addProperty("alpha",
            function () { return _alpha; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _alpha = value;
            }
        );

        /**
        * If set to true, Flash runtimes cache an internal bitmap representation of the display object. 
        * @property cacheAsBitmap
        * @type Boolean
        * @default false
        **/
        this.addProperty("cacheAsBitmap",
            function () { return _cacheAsBitmap; },
            function (value) { _cacheAsBitmap = value; }
        );

        /**
        * Whether or not the display object is visible.
        * @property visible
        * @type Boolean
        * @default true
        **/
        this.addProperty("visible",
            function () { return _visible; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _visible = value;
            }
        );

        /**
        * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
        * @property x
        * @type Number
        * @default 0
        **/
        this.addProperty("x",
            function () { return _x; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _x = value;
            }
        );

        /**
        * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
        * @property y
        * @type Number
        * @default 0
        **/
        this.addProperty("y",
            function () { return _y; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _y = value;
            }
        );

        /**
        * Indicates the width of the display object, in pixels.
        * @property width
        * @type Number
        * @default 0
        **/
        this.addProperty("width",
            function () {
                return this.getRect(this).width * this.scaleX;
            },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                if (value < 0) value = 0;
                if (this.width != value) {
                    this.scaleX = (this.width == 0) ? 1 : value / this.width;
                }
            }
        );

        /**
        * Indicates the height of the display object, in pixels.
        * @property height
        * @type Number
        * @default 0
        **/
        this.addProperty("height",
            function () {
                return this.getRect(this).height * this.scaleY;
            },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                if (value < 0) value = 0;
                this.scaleY = (this.height == 0) ? 1 : value / this.height;
            }
        );

        /**
        * Indicates the instance name of the DisplayObject.
        * @property name
        * @type String
        * @default null
        **/
        this.addProperty("name",
            function () { return _name; },
            function (value) { _name = value; }
        );

        /**
        * The calling display object is masked by the specified mask object.
        * @property mask
        * @type jFlashCore.DisplayObject
        * @default null
        **/
        this.addProperty("mask",
            function () { return _mask; },
            function (value) {
                if (_mask !== value) {
                    if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                    if (value != null && !(value instanceof jFlashCore.DisplayObject)) throw "Passed object must be an jFlashCore.DisplayObject";
                    if (this.ancestor === value) throw "It can not be the mask itself";
                    _mask = value;
                }
            }
        );

        /**
        * Indicates the horizontal scale (percentage) of the object as applied from the registration point.
        * @property scaleX
        * @type Number
        * @default 0
        **/
        this.addProperty("scaleX",
            function () { return _scaleX; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _scaleX = (value < 0) ? 0 : value;
            }
        );

        /**
        * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
        * @property scaleY
        * @type Number
        * @default 0
        **/
        this.addProperty("scaleY",
            function () { return _scaleY; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _scaleY = (value < 0) ? 0 : value;
            }
        );

        /**
        * The scroll rectangle bounds of the display object.
        * @property scrollRect
        * @type jFlashCore.Rectangle
        * @default null
        **/
        this.addProperty("scrollRect",
            function () { return _scrollRect; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                if (!(value instanceof jFlashCore.Rectangle)) throw "Passed object must be an jFlashCore.Rectangle";
                _scrollRect = value;
            }
        );

        /**
        * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
        * @property rotation
        * @type Number
        * @default 0
        **/
        this.addProperty("rotation",
            function () { return _rotation; },
            function (value) {
                if (value.ancestor instanceof jFlashCore.Stage) throw "The requested operation can not be on the Stage object";
                _rotation = value;
            }
        );

        /**
        * [read-only] Indicates the DisplayObjectContainer object that contains this display object. 
        * @property parent
        * @type jFlashCore.DisplayObjectContainer
        **/
        this.addProperty("parent",
            function () { return null; }
        );

        /**
        * [read-only] The Stage of the display object.
        * @property stage
        * @type jFlashCore.Stage
        **/
        this.addProperty("stage",
            function () {
                var parent = this.ancestor;
                do {
                    if (parent instanceof jFlashCore.Stage) return parent;
                    parent = parent.parent;
                } while (parent != null);

                return null;
            }
        );

        /**
        * [read-only] Indicates the x coordinate of the mouse or user input device position, in pixels.
        * @property mouseX
        * @type Number
        **/
        this.addProperty("mouseX",
            function () {
                if (this.stage != null) {
                    var point = _getMouseCoordinates.call(this);
                    point = this.globalToLocal(point);
                    return point.x;
                } else {
                    return jFlashCore.html.mouseX;
                }
            }
        );

        /**
        * [read-only] Indicates the y coordinate of the mouse or user input device position, in pixels.
        * @property mouseY
        * @type Number
        **/
        this.addProperty("mouseY",
            function () {
                if (this.stage != null) {
                    var point = _getMouseCoordinates.call(this);
                    point = this.globalToLocal(point);
                    return point.y;
                } else {
                    return jFlashCore.html.mouseY;
                }
            }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object. 
        * @method getBounds
        * @param { jFlashCore.DisplayObject } targetCoordinateSpace The display object that defines the coordinate system to use. 
        * @return { jFlashCore.Rectangle } The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system. 
        */
        this.getBounds = function (targetCoordinateSpace) {
            var bounds = _getContainerDimension.call(this, true);
            var point = new jFlashCore.Point(bounds.x, bounds.y);

            point = targetCoordinateSpace.localToGlobal(point);
            bounds.x = point.x;
            bounds.y = point.y;

            return bounds;
        };

        /**
        * Returns a rectangle that defines the boundary of the display object, based on the coordinate system defined by the targetCoordinateSpace parameter, excluding any strokes on shapes.
        * @method getRect
        * @param { jFlashCore.DisplayObject } targetCoordinateSpace The display object that defines the coordinate system to use. 
        * @return { jFlashCore.Rectangle } The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system. 
        */
        this.getRect = function (targetCoordinateSpace) {
            var rect = _getContainerDimension.call(this, false);
            var point = new jFlashCore.Point(rect.x, rect.y);

            point = targetCoordinateSpace.localToGlobal(point);
            rect.x = point.x;
            rect.y = point.y;

            return rect;
        };

        /**
        * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates. 
        * @method globalToLocal
        * @param { jFlashCore.Point } point An object created with the Point class.
        * @return { jFlashCore.Point } A Point object with coordinates relative to the display object. 
        */
        this.globalToLocal = function (point) {
            if (!(point instanceof jFlashCore.Point)) throw "Passed object must be an jFlashCore.Point";

            var newPoint = new jFlashCore.Point(point.x, point.y);
            var parent = this;

            while (parent != null) {
                newPoint.offset(-parent.x, -parent.y);
                parent = parent.parent;
            }

            return newPoint;
        };

        /**
        * Evaluates the bounding box of the display object to see if it overlaps or intersects with the bounding box of the obj display object.
        * @method hitTestObject
        * @param { jFlashCore.DisplayObject } The display object to test against.
        * @return { Boolean } true if the bounding boxes of the display objects intersect; false if not.
        */
        this.hitTestObject = function (obj) {
            if (!(obj instanceof jFlashCore.DisplayObject)) throw "Passed object must be an jFlashCore.DisplayObject";
            var bounds = this.getBounds(this);
            var targ = obj.getBounds(this);
            return bounds.intersects(targ);
        };

        /**
        * Evaluates the display object to see if it overlaps or intersects with the point specified by the x and y parameters.
        * @method hitTestPoint
        * @param { Number } x The x coordinate to test against this object. 
        * @param { Number } y The y coordinate to test against this object. 
        * @param { Boolean } shapeFlag Not implemented.
        * @return { Boolean } true if the display object overlaps or intersects with the specified point; false otherwise.
        */
        this.hitTestPoint = function (x, y, shapeFlag) {
            var bounds = this.getBounds(this);
            var point = new jFlashCore.Point(x, y);
            point = this.globalToLocal(point);
            return bounds.containsPoint(point);
        };

        /**
        * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.  
        * @method localToGlobal
        * @param { jFlashCore.Point } point An object created with the Point class.
        * @return { jFlashCore.Point } A Point object with coordinates relative to the Stage. 
        */
        this.localToGlobal = function (point) {
            if (!(point instanceof jFlashCore.Point)) throw "Passed object must be an jFlashCore.Point";

            var newPoint = new jFlashCore.Point(point.x, point.y);
            var parent = this;

            while (parent != null) {
                newPoint.offset(parent.x, parent.y);
                parent = parent.parent;
            }

            return newPoint;
        };


        //------------------------------------------------------------------
        // INIT

        if (jFlashCore.abstractClassIsLock()) {
            throw "This is an abstract class.";
        } else {
            jFlashCore.lockAbstractClassConstraint();
        }

        // create canvas
        _canvas = document.createElement("canvas");
        _canvas.setAttribute("width", 0);
        _canvas.setAttribute("height", 0);

        // bounds
        _bounds = new jFlashCore.Rectangle(0, 0, 0, 0);
        _rect = new jFlashCore.Rectangle(0, 0, 0, 0);

    };
    DisplayObject.prototype = Object.create(jFlashCore.EventDispatcher.prototype);


    //------------------------------------------------------------------
    // REGISTER

    DisplayObject.prototype.className = "DisplayObject";
    jFlashCore.registerClass(DisplayObject);


})(window);