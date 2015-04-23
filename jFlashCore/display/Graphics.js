


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Graphics class contains a set of methods that you can use to create a vector shape. 
    * Is an abstract calss and you cannot create a Graphics object directly from ActionScript code. If you call new Graphics(), an exception is thrown.
    * @class Graphics
    * @constructor
    **/
    var Graphics = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private **/
        var _commands = [];
        /** @private **/
        var _owner = null;

        /** @private **/
        var _bounds = null;
        /** @private **/
        var _rect = null;

        /** @private **/
        var _filling = false;
        /** @private **/
        var _currLineWidth = 0.0;


        //------------------------------------------------------------------
        // HIDDEN PROPERTIES

        window.Object.defineProperty(this, "__commands", {
            get: function () { return _commands; },
            enumerable: false,
            configurable: false
        });

        window.Object.defineProperty(this, "__bounds", {
            get: function () { return _bounds; },
            enumerable: false,
            configurable: false
        });

        window.Object.defineProperty(this, "__rect", {
            get: function () { return _rect; },
            enumerable: false,
            configurable: false
        });


        //------------------------------------------------------------------
        // PRIVATE METHODS

        /** @private **/
        var _hexToRGB = function (hex) {
            var r = hex >> 16 & 0xFF;
            var g = hex >> 8 & 0xFF;
            var b = hex & 0xFF;

            return { red: r, green: g, blue: b };
        };

        /** @private **/
        var _checkNumeric = function (value, min, max) {
            if (!jFlashCore.isNumber(value)) {
                if (min != null) {
                    value = min;
                } else {
                    value = 0;
                }
            }
            if (min != null && value < min) value = min;
            if (max != null && value > max) value = max;

            return value;
        };

        /** @private **/
        var _checkHexNumber = function (hex) {
            return _checkNumeric(hex, 0x000000, 0xFFFFFF);
        };

        /** @private **/
        var _checkAlpha = function (alpha) {
            return _checkNumeric(alpha, 0, 1);
        };

        /** @private **/
        var _createRGBA = function (color, alpha) {
            color = _checkHexNumber(color);
            alpha = _checkAlpha(alpha);

            var rgb = _hexToRGB(color);
            return "rgba(" + rgb.red + ", " + rgb.green + ", " + rgb.blue + ", " + alpha + ")";
        };

        /** @private **/
        // 0 - Context method
        // 1 - Context property
        // 2 - Gradient create
        // 3 - Gradient method
        // 4 - Gradient assign
        // 5 - Hold Cap create
        // 6 - Hold Cap assign
        var _addCommand = function (type, name, args) {
            _commands[_commands.length] = { type: type, name: name, args: args };
        };

        /** @private **/
        var _addStrokeIfNeeded = function () {
            if (!_filling) {
                _addCommand(0, "stroke", null);
            }
        };

        /** @private **/
        var _createGradientCommands = function (type, colors, alphas, ratios, matrix, focalPointRatio) {

            function getRotation(matrix) {
                var p1 = new jFlashCore.Point(0.0, 0.0);
                var p2 = new jFlashCore.Point(1.0, 0.0);

                p1 = matrix.transformPoint(p1);
                p2 = matrix.transformPoint(p2);

                return Math.atan2(p2.y - p1.y, p2.x - p1.x);
            };

            colors = colors || [];
            alphas = alphas || [];
            ratios = ratios || [];
            focalPointRatio = focalPointRatio || 0;
            focalPointRatio = _checkNumeric(focalPointRatio, -1, 1);

            var rotation = getRotation(matrix);
            var width = Math.sqrt((matrix.a * matrix.a) + (matrix.c * matrix.c)) / 0.0006103515625;
            var height = Math.sqrt((matrix.b * matrix.b) + (matrix.d * matrix.d)) / 0.0006103515625;
            var tx = matrix.tx - width / 2;
            var ty = matrix.ty - height / 2;

            if (type.toLowerCase() == jFlashCore.GradientType.LINEAR) {
                var deltaWidth = width - width * Math.cos(rotation);
                var deltaHeight = height - height * Math.sin(rotation);

                var startX = deltaWidth / 2 + tx;
                var startY = deltaHeight / 2 + ty;
                var finishX = startX + width - deltaWidth;
                var finishY = startY + height - deltaHeight;

                _addCommand(2, "createLinearGradient", [startX, startY, finishX, finishY]);
            } else {
                var radius = ((width > height) ? width : height) / 2;
                var point = jFlashCore.Point.polar(radius * focalPointRatio, rotation);
                var centerX = width / 2 + point.x;
                var centerY = height / 2 + point.y;

                _addCommand(2, "createRadialGradient", [centerX, centerY, 0, centerX, centerY, radius]);
            }

            for (var i = 0, len = colors.length; i < len; i++) {
                var ratio = (ratios.length > i) ? _checkNumeric(ratios[i], 0, 255) / 255 : 1;
                var alpha = (alphas.length > i) ? _checkNumeric(alphas[i], 0, 1) : 1;
                var color = _checkHexNumber(colors[i]);

                _addCommand(3, "addColorStop", [ratio.toString(), _createRGBA(color, alpha)]);
            }
        };

        /** @private **/
        var _updateRect = function (left, top, right, bottom) {
            if (_rect.isEmpty()) {
                _rect.left = left;
                _rect.top = top;
                _rect.right = right;
                _rect.bottom = bottom;
            }

            if (_rect.left > left) _rect.left = left;
            if (_rect.top > top) _rect.top = top;
            if (_rect.right < right) _rect.right = right;
            if (_rect.bottom < bottom) _rect.bottom = bottom;
        };

        /** @private **/
        var _updateBounds = function (left, top, right, bottom) {
            if (_bounds.isEmpty()) {
                _bounds.left = left;
                _bounds.top = top;
                _bounds.right = right;
                _bounds.bottom = bottom;
            }

            if (!_filling) {
                var middle = _currLineWidth / 2;
                left -= middle;
                top -= middle;
                right += middle;
                bottom += middle;
            }

            if (_bounds.left > left) _bounds.left = left;
            if (_bounds.top > top) _bounds.top = top;
            if (_bounds.right < right) _bounds.right = right;
            if (_bounds.bottom < bottom) _bounds.bottom = bottom;
        };



        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Specifies a simple one-color fill that subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) use when drawing.
        * @method beginFill
        * @param { Number } color The color of the fill (0xRRGGBB). 
        * @param { Number } alpha The alpha value of the fill (0.0 to 1.0). 
        */
        this.beginFill = function (color, alpha) {
            _addCommand(1, "fillStyle", _createRGBA(color, alpha));
            _addCommand(0, "beginPath", null);

            _filling = true;
        }

        /**
        * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
        * @method beginGradientFill
        * @param { Number } type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL. 
        * @param { Array } colors An array of RGB hexadecimal color values used in the gradient.
        * @param { Array } alphas An array of alpha values for the corresponding colors in the colors array; valid values are 0 to 1.
        * @param { Array } ratios An array of color distribution ratios; valid values are 0-255.
        * @param { jFlashCore.Matrix } matrix A transformation matrix as defined by the geom.
        * @param { String } spreadMethod Not implemented.
        * @param { String } interpolationMethod Not implemented.
        * @param { Number } focalPointRatio A number that controls the location of the focal point of the gradient.
        */
        this.beginGradientFill = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
            _createGradientCommands(type, colors, alphas, ratios, matrix, focalPointRatio);
            _addCommand(4, "fillStyle", null);
            _addCommand(0, "beginPath", null);

            _filling = true;
        }

        /**
        * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings. 
        * @method clear
        */
        this.clear = function () {
            // Path
            _addCommand(0, "closePath", null);

            // Style
            _currLineWidth = 1;
            _addCommand(1, "lineWidth", 1);
            _addCommand(1, "strokeStyle", "rgb(0, 0, 0)");
            _addCommand(1, "lineCap", "butt");
            _addCommand(1, "lineJoin", "miter");
            _addCommand(1, "miterLimit", 10);
            _addCommand(1, "fillStyle", "rgb(0, 0, 0)");

            // Clear
            _addCommand(0, "clearRect", [0, 0, context.canvas.width, context.canvas.height]);

            _filling = false;
        }

        /**
        * Draws a quadratic Bezier curve using the current line style from the current drawing position to (anchorX, anchorY) 
        * and using the control point that (controlX, controlY) specifies.
        * @method curveTo
        * @param { Number } controlX A number that specifies the horizontal position of the control point relative to the registration point of the parent display object. 
        * @param { Number } controlY A number that specifies the vertical position of the control point relative to the registration point of the parent display object.
        * @param { Number } anchorX A number that specifies the horizontal position of the next anchor point relative to the registration point of the parent display object. 
        * @param { Number } anchorY A number that specifies the vertical position of the next anchor point relative to the registration point of the parent display object. 
        */
        this.curveTo = function (controlX, controlY, anchorX, anchorY) {
            _updateBounds(controlX + anchorX, controlY + anchorY, controlX + anchorX, controlY + anchorY);
            _updateRect(controlX + anchorX, controlY + anchorY, controlX + anchorX, controlY + anchorY);

            _addCommand(0, "bezierCurveTo", [controlX, controlY, anchorX, anchorY]);
            _addStrokeIfNeeded();
        }

        /**
        * Draws a circle.
        * @method drawCircle
        * @param { Number } x The x location of the center of the circle relative to the registration point of the parent display object (in pixels).  
        * @param { Number } y The y location of the center of the circle relative to the registration point of the parent display object (in pixels). 
        * @param { Number } radius The radius of the circle (in pixels). 
        */
        this.drawCircle = function (x, y, radius) {
            _updateBounds(x - radius, y - radius, x + radius, y + radius);
            _updateRect(x - radius, y - radius, x + radius, y + radius);

            _addCommand(0, "arc", [x, y, radius, 0, 2 * Math.PI, false]);
            _addStrokeIfNeeded();
        }

        /**
        * Draws a ellipse.
        * @method drawEllipse
        * @param { Number } x The x location of the top-left of the bounding-box of the ellipse relative to the registration point of the parent display object (in pixels). 
        * @param { Number } y The y location of the top left of the bounding-box of the ellipse relative to the registration point of the parent display object (in pixels). 
        * @param { Number } width The width of the ellipse (in pixels). 
        * @param { Number } height The height of the ellipse (in pixels). 
        */
        this.drawEllipse = function (x, y, width, height) {
            _updateBounds(x, y, x + width, y + height);
            _updateRect(x, y, x + width, y + height);

            var k = 0.5522848;
            var ox = (width / 2) * k;
            var oy = (height / 2) * k;
            var xe = x + width;
            var ye = y + height;
            var xm = x + width / 2;
            var ym = y + height / 2;

            _addCommand(0, "moveTo", [x, ym]);
            _addCommand(0, "bezierCurveTo", [x, ym - oy, xm - ox, y, xm, y]);
            _addCommand(0, "bezierCurveTo", [xm + ox, y, xe, ym - oy, xe, ym]);
            _addCommand(0, "bezierCurveTo", [xe, ym + oy, xm + ox, ye, xm, ye]);
            _addCommand(0, "bezierCurveTo", [xm - ox, ye, x, ym + oy, x, ym]);
            _addStrokeIfNeeded();
        }

        /**
        * Draws a rectangle.
        * @method drawRect
        * @param { Number } x A number indicating the horizontal position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } y A number indicating the vertical position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } width The width of the rectangle (in pixels). 
        * @param { Number } height The height of the rectangle (in pixels). 
        */
        this.drawRect = function (x, y, width, height) {
            _updateBounds(x, y, x + width, y + height);
            _updateRect(x, y, x + width, y + height);

            _addCommand(5, "lineCap", null);
            _addCommand(1, "lineCap", "square");
            _addCommand(0, "moveTo", [x, y]);
            _addCommand(0, "lineTo", [x + width, y]);
            _addCommand(0, "lineTo", [x + width, y + height]);
            _addCommand(0, "lineTo", [x, y + height]);
            _addCommand(0, "lineTo", [x, y]);
            _addStrokeIfNeeded();
            _addCommand(6, "lineCap", null);
        }

        /**
        * Draws a rectangle.
        * @method drawRoundRect
        * @param { Number } x A number indicating the horizontal position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } y A number indicating the vertical position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } width The width of the rectangle (in pixels). 
        * @param { Number } height The height of the rectangle (in pixels). 
        * @param { Number } ellipseWidth The width of the ellipse used to draw the rounded corners (in pixels). 
        * @param { Number } ellipseHeight The height of the ellipse used to draw the rounded corners (in pixels).
        */
        this.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
            _updateBounds(x, y, x + width, y + height);
            _updateRect(x, y, x + width, y + height);

            ellipseHeight = (ellipseHeight == null) ? ellipseWidth : ellipseHeight;
            _addCommand(0, "moveTo", [x + ellipseWidth, y]);
            _addCommand(0, "lineTo", [x + width - ellipseWidth, y]);
            _addCommand(0, "quadraticCurveTo", [x + width, top, x + width, y + ellipseHeight]);
            _addCommand(0, "lineTo", [x + width, y + height - ellipseHeight]);
            _addCommand(0, "quadraticCurveTo", [x + width, y + height, x + width - ellipseWidth, y + height]);
            _addCommand(0, "lineTo", [x + ellipseWidth, y + height]);
            _addCommand(0, "quadraticCurveTo", [x, y + height, x, y + height - ellipseHeight]);
            _addCommand(0, "lineTo", [x, y + ellipseHeight]);
            _addCommand(0, "quadraticCurveTo", [x, y, x + ellipseWidth, y]);
        }

        /**
        * Applies a fill to the lines and curves that were added since the last call.
        * @method endFill
        */
        this.endFill = function () {
            _addCommand(0, "closePath", null);
            _addCommand(0, "fill", null);
            if (_currLineWidth > 0) {
                _addCommand(0, "stroke", null);
            }
            _filling = false;
        }

        /**
        * Specifies a gradient to use for the stroke when drawing lines. 
        * @method lineGradientStyle
        * @param { Number } type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL. 
        * @param { Array } colors An array of RGB hexadecimal color values used in the gradient.
        * @param { Array } alphas An array of alpha values for the corresponding colors in the colors array; valid values are 0 to 1.
        * @param { Array } ratios An array of color distribution ratios; valid values are 0-255.
        * @param { jFlashCore.Matrix } matrix A transformation matrix as defined by the geom.
        * @param { String } spreadMethod Not implemented.
        * @param { String } interpolationMethod Not implemented.
        * @param { Number } focalPointRatio A number that controls the location of the focal point of the gradient.
        */
        this.lineGradientStyle = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
            _createGradientCommands(type, colors, alphas, ratios, matrix, focalPointRatio);
            _addCommand(4, "strokeStyle", null);
            _addCommand(0, "beginPath", null);
            _filling = true;
        }

        /**
        * Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
        * @method lineStyle
        * @param { Number } thickness An integer that indicates the thickness of the line in points
        * @param { Number } color A hexadecimal color value of the line
        * @param { Number } alpha A number that indicates the alpha value of the color of the line
        * @param { Boolean } pixelHinting Not implemented
        * @param { String } scaleMode Not implemented
        * @param { String } caps A value from the CapsStyle class that specifies the type of caps at the end of lines.
        * @param { String } joints A value from the JointStyle class that specifies the type of joint appearance used at angles.
        * @param { Number } miterLimit A number that indicates the limit at which a miter is cut off.
        */
        this.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
            function checkCaps(caps) {
                switch (caps.toLowerCase()) {
                    case jFlashCore.CapsStyle.ROUND: return "round";
                    case jFlashCore.CapsStyle.SQUARE: return "square";
                    default: return "butt";
                }
            };

            function checkJoints(joints) {
                switch (joints.toLowerCase()) {
                    case jFlashCore.JointStyle.ROUND: return "round";
                    case jFlashCore.JointStyle.BEVEL: return "bevel";
                    default: return "miter";
                }
            };

            if (thickness == null || thickness < 0) thickness = 1;
            color = _checkHexNumber(color);
            alpha = _checkAlpha(alpha);
            if (caps == null) caps = "";
            if (joints == null) joints = "";
            if (miterLimit == null) miterLimit = 10;

            _currLineWidth = thickness;

            _addCommand(1, "lineWidth", _checkNumeric(thickness, 0));
            _addCommand(1, "strokeStyle", _createRGBA(color, alpha));
            _addCommand(1, "lineCap", checkCaps(caps));
            _addCommand(1, "lineJoin", checkJoints(joints));
            _addCommand(1, "miterLimit", _checkNumeric(miterLimit, 0, 255));
        }

        /**
        * Draws a line using the current line style from the current drawing position to (x, y); 
        * @method lineTo
        * @param { Number } x A number that indicates the horizontal position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } y A number that indicates the vertical position relative to the registration point of the parent display object (in pixels). 
        */
        this.lineTo = function (x, y) {
            _updateBounds(x, y, x, y);
            _updateRect(x, y, x, y);

            _addCommand(0, "lineTo", [x, y]);
            _addStrokeIfNeeded();
        }

        /**
        * Moves the current drawing position to (x, y). 
        * @method moveTo
        * @param { Number } x A number that indicates the horizontal position relative to the registration point of the parent display object (in pixels). 
        * @param { Number } y A number that indicates the vertical position relative to the registration point of the parent display object (in pixels). 
        */
        this.moveTo = function (x, y) {
            _updateBounds(x, y, x, y);
            _updateRect(x, y, x, y);

            _addCommand(0, "moveTo", [x, y]);
        }


        //------------------------------------------------------------------
        // INIT

        if (jFlashCore.abstractClassIsLock()) {
            throw "This is an abstract class.";
        } else {
            jFlashCore.lockAbstractClassConstraint();
        }

        _bounds = new jFlashCore.Rectangle();
        _rect = new jFlashCore.Rectangle();

    };
    Graphics.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Graphics.prototype.className = "Graphics";
    jFlashCore.registerClass(Graphics);


})(window);