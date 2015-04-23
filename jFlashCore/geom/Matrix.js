


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to another. 
    * @class Matrix
    * @constructor
    **/
    var Matrix = function (a, b, c, d, tx, ty) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _a = null;
        /** @private */
        var _b = null;
        /** @private */
        var _c = null;
        /** @private */
        var _d = null;
        /** @private */
        var _tx = null;
        /** @private */
        var _ty = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
        * @property a
        * @type Number
        * @default 1
        **/
        this.addProperty("a",
            function () { return _a; },
            function (value) { _a = value; }
        );

        /**
        * The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
        * @property a
        * @type Number
        * @default 0
        **/
        this.addProperty("b",
            function () { return _b; },
            function (value) { _b = value; }
        );

        /**
        * The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
        * @property c
        * @type Number
        * @default 0
        **/
        this.addProperty("c",
            function () { return _c; },
            function (value) { _c = value; }
        );

        /**
        * The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
        * @property d
        * @type Number
        * @default 1
        **/
        this.addProperty("d",
            function () { return _d; },
            function (value) { _d = value; }
        );

        /**
        * The distance by which to translate each point along the x axis.
        * @property tx
        * @type Number
        * @default 0
        **/
        this.addProperty("tx",
            function () { return _tx; },
            function (value) { _tx = value; }
        );

        /**
        * The distance by which to translate each point along the y axis.
        * @property ty
        * @type Number
        * @default 0
        **/
        this.addProperty("ty",
            function () { return _ty; },
            function (value) { _ty = value; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Returns a new Matrix object that is a clone of this matrix, with an exact copy of the contained object.
        * @method clone
        * @return { jFlashCore.Matrix } A Matrix object. 
        */
        this.clone = function () {
            return new jFlashCore.Matrix(_a, _b, _c, _d, _tx, _ty);
        };

        /**
        * Concatenates a matrix with the current matrix, effectively combining the geometric effects of the two. 
        * @method concat
        * @param { jFlashCore.Matrix } m The matrix to be concatenated to the source matrix.
        */
        this.concat = function (m) {
            _a = _a * m.a + _b * m.c;
            _b = _a * m.b + _b * m.d;
            _c = _c * m.a + _d * m.c;
            _d = _c * m.b + _d * m.d;
            _tx = _tx * m.a + _ty * m.c + m.tx;
            _ty = _tx * m.b + _ty * m.d + m.ty;
        };

        /**
        * Includes parameters for scaling, rotation, and translation. When applied to a matrix it sets the matrix's values based on those parameters. 
        * @method createBox
        * @param { Number } scaleX The factor by which to scale horizontally. 
        * @param { Number } scaleY The factor by which scale vertically. 
        * @param { Number } rotation The amount to rotate, in radians. 
        * @param { Number } tx The number of pixels to translate (move) to the right along the x axis. 
        * @param { Number } ty The number of pixels to translate (move) down along the y axis. 
        */
        this.createBox = function (scaleX, scaleY, rotation, tx, ty) {
            rotation = rotation || 0;
            tx = tx || 0;
            ty = ty || 0;

            this.identity();
            this.rotate(rotation);
            this.scale(scaleX, scaleY);
            this.translate(tx, ty);
        };

        /**
        * Creates the specific style of matrix expected by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
        * @method createGradientBox
        * @param { Number } width The width of the gradient box. 
        * @param { Number } height The height of the gradient box. 
        * @param { Number } rotation The amount to rotate, in radians. 
        * @param { Number } tx The number of pixels to translate (move) to the right along the x axis. 
        * @param { Number } ty The number of pixels to translate (move) down along the y axis. 
        */
        this.createGradientBox = function (width, height, rotation, tx, ty) {
            width = width || 0;
            height = height || 0;
            rotation = rotation || 0;
            tx = tx || 0;
            ty = ty || 0;

            this.identity();
            this.rotate(rotation);
            this.scale(width * 0.0006103515625, height * 0.0006103515625);
            this.translate(width / 2 + tx, height / 2 + ty);
        };

        /**
        * Sets each matrix property to a value that causes a null transformation. 
        * @method identity
        */
        this.identity = function () {
            _a = 1;
            _b = 0;
            _c = 0;
            _d = 1;
            _tx = 0;
            _ty = 0;
        };

        /**
        * Performs the opposite transformation of the original matrix.
        * @method invert
        */
        this.invert = function () {
            var calc = _a * _d - _b * _c;
            _a = _d / calc;
            _b = -_b / calc;
            _c = -_c / calc;
            _d = _a / calc;
            _tx = (_c * _ty - _d * _tx) / calc;
            _ty = -((_a * _ty - _b * _tx) / calc);
        };

        /**
        * Applies a rotation transformation to the Matrix object. 
        * @param { Number } angle The rotation angle in radians. 
        * @method rotate
        */
        this.rotate = function (angle) {
            _a = Math.cos(angle);
            _b = Math.sin(angle);
            _c = -Math.sin(angle);
            _d = Math.cos(angle);
        };

        /**
        * Applies a scaling transformation to the matrix. The x axis is multiplied by sx, and the y axis it is multiplied by sy. 
        * @method scale
        * @param { Number } sx A multiplier used to scale the object along the x axis. 
        * @param { Number } sy A multiplier used to scale the object along the y axis. 
        */
        this.scale = function (sx, sy) {
            var scaleMatrix = new jFlashCore.Matrix(sx, 0, 0, sy, 0, 0);
            this.concat(scaleMatrix);
        };

        /**
        * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
        * @method transformPoint
        * @param { jFlashCore.Point } point The point for which you want to get the result of the Matrix transformation. 
        * @return { jFlashCore.Point } The point resulting from applying the Matrix transformation. 
        */
        this.transformPoint = function (point) {
            return new jFlashCore.Point((point.x * _a) + (point.y * _c) + _tx,
                                        (point.x * _b) + (point.y * _d) + _ty);
        };

        /**
        * Translates the matrix along the x and y axes, as specified by the dx and dy parameters. 
        * @method translate
        * @param { Number } dx The amount of movement along the x axis to the right, in pixels. 
        * @param { Number } dy The amount of movement down along the y axis, in pixels. 
        */
        this.translate = function (dx, dy) {
            _tx += dx;
            _ty += dy;
        };


        //------------------------------------------------------------------
        // INIT

        _a = a || 1;
        _b = b || 0;
        _c = c || 0;
        _d = d || 1;
        _tx = tx || 0;
        _ty = ty || 0;

    };
    Matrix.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Matrix.prototype.className = "Matrix";
    jFlashCore.registerClass(Matrix);


})(window);
