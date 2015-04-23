


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height. 
    * @class Rectangle
    * @constructor
    **/
    var Rectangle = function (x, y, width, height) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _x = null;
        /** @private */
        var _y = null;

        /** @private */
        var _width = null;
        /** @private */
        var _height = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * The x coordinate of the top-left corner of the rectangle.
        * @property x
        * @type Number
        * @default 0
        **/
        this.addProperty("x",
            function () { return _x; },
            function (value) { _x = value; }
        );

        /**
        * The y coordinate of the top-left corner of the rectangle.
        * @property y
        * @type Number
        * @default 0
        **/
        this.addProperty("y",
            function () { return _y; },
            function (value) { _y = value; }
        );

        /**
        * The width of the rectangle, in pixels.
        * @property width
        * @type Number
        * @default 0
        **/
        this.addProperty("width",
            function () { return _width; },
            function (value) { _width = value; }
        );

        /**
        * The height of the rectangle, in pixels.
        * @property width
        * @type Number
        * @default 0
        **/
        this.addProperty("height",
            function () { return _height; },
            function (value) { _height = value; }
        );

        /**
        * The sum of the y and height properties.
        * @property bottom
        * @type Number
        * @default 0
        **/
        this.addProperty("bottom",
            function () { return _y + _height; },
            function (value) { _height = value - _y; }
        );

        /**
        * The location of the Rectangle object's bottom-right corner, determined by the values of the right and bottom properties.
        * @property bottomRight
        * @type jFlashCore.Point
        **/
        this.addProperty("bottomRight",
            function () { return jFlashCore.Point(this.right, this.bottom); },
            function (value) {
                if (!(obj instanceof jFlashCore.Point)) throw "Passed object must be an jFlashCore.Point";
                this.right = value.x;
                this.bottom = value.y;
            }
        );

        /**
        * The x coordinate of the top-left corner of the rectangle.
        * @property left
        * @type Number
        * @default 0
        **/
        this.addProperty("left",
            function () { return _x; },
            function (value) { _x = value; }
        );

        /**
        * The sum of the x and width properties.
        * @property right
        * @type Number
        * @default 0
        **/
        this.addProperty("right",
            function () { return _x + _width; },
            function (value) { _width = value - _x; }
        );

        /**
        * The y coordinate of the top-left corner of the rectangle.
        * @property top
        * @type Number
        * @default 0
        **/
        this.addProperty("top",
            function () { return _y; },
            function (value) { _y = value; }
        );

        /**
        * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
        * @property topLeft
        * @type jFlashCore.Point
        **/
        this.addProperty("topLeft",
            function () { return jFlashCore.Point(this.left, this.top); },
            function (value) {
                if (!(obj instanceof jFlashCore.Point)) throw "Passed object must be an jFlashCore.Point";
                this.left(value.x);
                this.top(value.y);
            }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Creates a copy of this Rectangle object.
        * @method clone
        * @return { jFlashCore.Rectangle } The new Rectangle object. 
        */
        this.clone = function () {
            return new jFlashCore.Rectangle(_x, _y, _width, _height);
        };

        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
        * @method contains
        * @param { Number } x The x coordinate (horizontal position) of the point. 
        * @param { Number } y The y coordinate (vertical position) of the point. 
        * @return { Boolean } A value of true if the Rectangle object contains the specified point; otherwise false. 
        */
        this.contains = function (x, y) {
            return (x >= this.x && x <= this.right) &&
                   (y >= this.y && y <= this.bottom)
        };

        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object
        * @method containsPoint
        * @param { jFlashCore.Point } point The point, as represented by its x and y coordinates. 
        * @return { Boolean } A value of true if the Rectangle object contains the specified point; otherwise false. 
        */
        this.containsPoint = function (point) {
            return this.contains(point.x, point.y);
        };

        /**
        * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
        * @method containsRect
        * @param { jFlashCore.Rectangle } rect The Rectangle object being checked. 
        * @return { Boolean } A value of true if the Rectangle object that you specify is contained by this Rectangle object; otherwise false. 
        */
        this.containsRect = function (rect) {
            return this.containsPoint(rect.topLeft) &&
                   this.containsPoint(rect.rightBottom);
        };

        /**
        * Determines whether two rectangle are equal. 
        * @method equals
        * @param { jFlashCore.Rectangle } toCompare The rectangle to be compared.
        * @return { Boolean } A value of true if the object is equal to this Rectangle object; false if it is not equal. 
        */
        this.equals = function (toCompare) {
            if (!(obj instanceof jFlashCore.Rectangle)) throw "Passed object must be an jFlashCore.Rectangle";
            return rect.topLeft.equals(toCompare.topLeft) &&
                   rect.rightBottom.equals(toCompare.rightBottom);
        };

        /**
        * Increases the size of the Rectangle object by the specified amounts, in pixels.
        * @method inflate
        * @param { Number } dx The value to be added to the left and the right of the Rectangle object. 
        * @param { Number } dy The value to be added to the top and the bottom of the Rectangle. 
        */
        this.inflate = function (dx, dy) {
            _x += dx;
            _y += dy;
            _width -= 2 * dx;
            _height -= 2 * dy;
        };

        /**
        * Increases the size of the Rectangle object. 
        * @method inflatePoint
        * @param { jFlashCore.Point } point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object.
        */
        this.inflatePoint = function (point) {
            this.inflate(point.x, point.y);
        };

        /**
        * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
        * @method intersects
        * @param { jFlashCore.Rectangle } toIntersect The Rectangle object being checked. 
        * @return { Boolean } A value of true if the specified object intersects with this Rectangle object; otherwise false. 
        */
        this.intersects = function (toIntersect) {
            return (this.containsPoint(toIntersect.topLeft) || this.containsPoint(toIntersect.rightBottom)) ||
                   (toIntersect.containsPoint(this.topLeft) || toIntersect.containsPoint(this.rightBottom))
        };

        /**
        * Determines whether or not this Rectangle object is empty. 
        * @method isEmpty
        */
        this.isEmpty = function () {
            return !(this.width > 0 || this.height > 0);
        };

        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param { Number } dx Moves the x value of the Rectangle object by this amount. 
        * @param { Number } dy Moves the y value of the Rectangle object by this amount. 
        */
        this.offset = function (dx, dy) {
            _x += dx;
            _y += dy;
        };

        /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. 
        * @method offsetPoint
        * @param { jFlashCore.Point } point A Point object to use to offset this Rectangle object. 
        */
        this.offsetPoint = function (point) {
            this.offset(point.x, point.y);
        };

        /** Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0. 
        * @method setEmpty
        */
        this.setEmpty = function () {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        };

        /** Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles. 
        * @method union
        * @param { jFlashCore.Rectangle } toUnion A Rectangle object to add to this Rectangle object. 
        */
        this.union = function (toUnion) {
            var cloned = this.clone();

            if (cloned.left > toUnion.left) cloned.left = toUnion.left;
            if (cloned.top > toUnion.top) cloned.top = toUnion.top;
            if (cloned.right < toUnion.right) cloned.right = toUnion.right;
            if (cloned.bottom < toUnion.bottom) cloned.bottom = toUnion.bottom;

            return cloned;
        };


        //------------------------------------------------------------------
        // INIT

        _x = x || 0;
        _y = y || 0;

        _width = width || 0;
        _height = height || 0;

    };
    Rectangle.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Rectangle.prototype.className = "Rectangle";
    jFlashCore.registerClass(Rectangle);


})(window);
