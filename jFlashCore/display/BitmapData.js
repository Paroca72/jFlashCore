


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * Creates a BitmapData object with a specified width and height.
    * @class BitmapData
    * @param { Number } width The width of the bitmap image in pixels. 
    * @param { Number } height The height of the bitmap image in pixels. 
    * @param { Boolean } transparent Specifies whether the bitmap image supports per-pixel transparency. The default value is true (transparent).
    * @param { Number } fillColor 32-bit ARGB color value that you use to fill the bitmap image area. The default value is 0xFFFFFFFF (solid white). 
    * @constructor
    **/
    var BitmapData = function (width, height, transparent, fillColor) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object, true);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _canvas = null;

        /** @private */
        var _width = null;
        /** @private */
        var _height = null;
        /** @private */
        var _rect = null;

        /** @private */
        var _fillColor = null;
        /** @private */
        var _trasparent = null;


        //------------------------------------------------------------------
        // HIDDEN PROPERTIES

        window.Object.defineProperty(this, "__canvas", {
            get: function () { return _canvas; },
            enumerable: false,
            configurable: false
        });


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * [read-only] The height of the bitmap image in pixels.
        * @property height
        * @type Number
        **/
        this.addProperty("height",
            function () { return _height; }
        );

        /**
        * [read-only] The rectangle that defines the size and location of the bitmap image.
        * @property rect
        * @type jFlashCore.Rectangle
        **/
        this.addProperty("rect",
            function () { return _rect.clone(); }
        );

        /**
        * [read-only] Defines whether the bitmap image supports per-pixel transparency.
        * @property trasparent
        * @type Boolean
        **/
        this.addProperty("trasparent",
            function () { return _trasparent; }
        );

        /**
        * [read-only] The width of the bitmap image in pixels.
        * @property width
        * @type Number
        **/
        this.addProperty("width",
            function () { return _width; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Returns a new BitmapData object that is a clone of the original instance with an exact copy of the contained bitmap. 
        * @method clone
        */
        this.clone = function () {
            var data = new jFlashCore.BitmapData(_width, _height, _trasparent, _fillColor);
            data.draw(_canvas);
            return data;
        };

        /**
        * Draws the source display object onto the bitmap image.
        * @param { Canvas } source The display object to draw to the BitmapData object.
        * @param { Object } matrix Not implemented.
        * @param { Object } colorTransform Not implemented.
        * @param { Object } blendMode Not implemented.
        * @param { jFlashCore.Rectangle } clipRect A Rectangle object that defines the area of the source object to draw. 
        * @param { Object } Boolean Not implemented.
        * @method draw
        */
        this.draw = function (source, matrix, colorTransform, blendMode, clipRect, smoothing) {
            if (clipRect == null) {
                clipRect = new jFlashCore.Rectangle(0, 0, _width, _height);
            }

            var context = _canvas.getContext("2d");
            context.drawImage(source, clipRect.x, clipRect.y, clipRect.width, clipRect.height, 0, 0, _height, _width);
        };

        /**
        * Fills a rectangular area of pixels with a specified ARGB color. 
        * @param { jFlashCore.Rectangle } rect The rectangular area to fill. 
        * @param { Number } color The ARGB color value that fills the area.
        * @method fillRect
        */
        this.fillRect = function (rect, color) {
            var context = _canvas.getContext("2d");
            ctx.fillStyle = color;
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };

        /**
        * Returns an integer that represents an RGB pixel value from a BitmapData object at a specific point (x, y).
        * @param { Number } x The x position of the pixel. 
        * @param { Number } y The y position of the pixel. 
        * @method getPixel
        * @return { Number } A number that represents an RGB pixel value. 
        */
        this.getPixel = function (x, y) {
            x = x || 0;
            y = y || 0;

            var img = context.getImageData(x, y, 1, 1);
            var data = imgd.data;

            var r = data[0];
            var g = data[1];
            var b = data[2];

            return b | (g << 8) | (r << 16);
        };

        /**
        * Returns an ARGB color value that contains alpha channel data and RGB data. 
        * @param { Number } x The x position of the pixel. 
        * @param { Number } y The y position of the pixel. 
        * @method getPixel32
        * @return { Number } A number that represents an ARGB pixel value. 
        */
        this.getPixel32 = function (x, y) {
            x = x || 0;
            y = y || 0;

            var img = context.getImageData(x, y, 1, 1);
            var data = imgd.data;

            var r = data[0];
            var g = data[1];
            var b = data[2];
            var a = data[3];

            return b | (g << 8) | (r << 16) | (a << 32);
        };

        /**
        * Returns an integer that represents an RGB pixel value from a BitmapData object at a specific point (x, y).
        * @param { Number } x The x position of the pixel. 
        * @param { Number } y The y position of the pixel. 
        * @param { Number } color The resulting RGB color for the pixel. 
        * @method setPixel
        */
        this.setPixel = function (x, y, color) {
            x = x || 0;
            y = y || 0;
            color = color || 0x000000;

            var img = context.getImageData(x, y, 1, 1);
            var data = imgd.data;

            data[0] = (color & (255 << 16)) >> 16;
            data[1] = (color & (255 << 8)) >> 8;
            data[2] = (color & 255);
        };

        /**
        * Returns an integer that represents an RGB pixel value from a BitmapData object at a specific point (x, y).
        * @param { Number } x The x position of the pixel. 
        * @param { Number } y The y position of the pixel. 
        * @param { Number } color The resulting ARGB color for the pixel. 
        * @method setPixel
        */
        this.setPixel32 = function (x, y, color) {
            x = x || 0;
            y = y || 0;
            color = color || 0x000000;

            var img = context.getImageData(x, y, 1, 1);
            var data = imgd.data;

            data[0] = (color & (255 << 16)) >> 16;
            data[1] = (color & (255 << 8)) >> 8;
            data[2] = (color & 255);
            data[3] = (color & (255 << 32)) >> 32;
        };


        //------------------------------------------------------------------
        // INIT

        // create canvas
        _canvas = document.createElement("canvas");
        _canvas.setAttribute("width", width);
        _canvas.setAttribute("height", height);

        // arguments
        _width = width || 0;
        _height = height || 0;
        _trasparent = transparent || true;
        _fillColor = fillColor || 0xFFFFFFFF;
        _rect = new jFlashCore.Rectangle(0, 0, _width, _height);

        if (!_trasparent) {
            this.fillRect(rect, _fillColor);
        }

    };
    BitmapData.prototype = Object.create(jFlashCore.Object.prototype);


    //------------------------------------------------------------------
    // REGISTER

    BitmapData.prototype.className = "BitmapData";
    jFlashCore.registerClass(BitmapData);


})(window);