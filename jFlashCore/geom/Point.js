


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis. 
    * @class Point
    * @constructor
    **/
    var Point = function (x, y) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _x = x;
        /** @private */
        var _y = y;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * [read-only] The length of the line segment from (0,0) to this point. 
        * @property length
        * @type Number
        **/
        this.addProperty("length",
            function () { return Math.sqrt(x * x + y * y); }
        );

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


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Adds the coordinates of another point to the coordinates of this point to create a new point. 
        * @method add
        * @param { jFlashCore.Point } v The point to be added. 
        * @return { jFlashCore.Point } The new Point object. 
        */
        this.add = function (v) {
            return new jFlashCore.Point(this.x + v.x, this.y + v.y);
        };

        /**
        * Creates a copy of this Point object.
        * @method clone
        * @return { jFlashCore.Point } The new Point object. 
        */
        this.clone = function () {
            return new jFlashCore.Point(this.x, this.y);
        };

        /**
        * Determines whether two points are equal. 
        * @method equals
        * @param { jFlashCore.Point } toCompare The point to be compared.
        * @return { Boolean } A value of true if the object is equal to this Point object; false if it is not equal. 
        */
        this.equals = function (toCompare) {
            if (!(toCompare instanceof jFlashCore.Point)) throw "Passed object must be an jFlashCore.Point";
            return (this.x == toCompare.x && this.y == toCompare.y);
        };

        /**
        * Offsets the Point object by the specified amount. 
        * @method offset
        * @param { Number } dx The amount by which to offset the horizontal coordinate, x. 
        * @param { Number } dy The amount by which to offset the vertical coordinate, y. 
        */
        this.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };

        /**
        * Subtracts the coordinates of another point from the coordinates of this point to create a new point.  
        * @method subtract
        * @param { jFlashCore.Point } v The point to be added. 
        * @return { jFlashCore.Point } The new Point object. 
        */
        this.subtract = function (v) {
            return new jFlashCore.Point(this.x - v.x, this.y - v.y);
        };

    };
    Point.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // SHARED METHODS

    /**
    * Returns the distance between pt1 and pt2. 
    * @method distance
    * @param { jFlashCore.Point } pt1 The first point. 
    * @param { jFlashCore.Point } pt2 The second point. 
    * @return { Number } The distance between the first and second points. 
    */
    Point.distance = function (pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x), Math.pow(pt2.y - pt1.y));
    };
    Point.prototype.distance = Point.distance;

    /**
    * Determines a point between two specified points. 
    * @method distance
    * @param { jFlashCore.Point } pt1 The first point. 
    * @param { jFlashCore.Point } pt2 The second point. 
    * @param { Number } f The level of interpolation between the two points.
    * @return { Number } The new, interpolated point. 
    */
    Point.interpolate = function (pt1, pt2, f) {
        f = f || 0.5;
        if (f > 1) f = 1;
        if (f < 0) f = 0;

        var newX = (pt2.x - pt1.x) / f;
        var newY = (pt2.y - pt1.y) / f;

        return new jFlashCore.Point(newX, newY);
    };
    Point.prototype.interpolate = Point.interpolate;

    /**
    * Converts a pair of polar coordinates to a Cartesian point coordinate. 
    * @method polar
    * @param { Number } len The length coordinate of the polar pair. 
    * @param { Number } angle The angle, in radians, of the polar pair. 
    * @return { jFlashCore.Point } The Cartesian point. 
    */
    Point.polar = function (len, angle) {
        var x = len * Math.cos(angle);
        var y = len * Math.sin(angle);
        return new jFlashCore.Point(x, y);
    };
    Point.prototype.polar = Point.polar;


    //------------------------------------------------------------------
    // REGISTER

    Point.prototype.className = "Point";
    jFlashCore.registerClass(Point);


})(window);
