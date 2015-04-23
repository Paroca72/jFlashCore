


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Bitmap class represents display objects that represent bitmap images.
    * @param { jFlashCore.BitmapData } bitmapData The BitmapData object being referenced. 
    * @param { Object } pixelSnapping Not implemented. 
    * @param { Object } smoothing Not implemented. 
    * @class Bitmap
    * @constructor
    **/
    var Bitmap = function (bitmapData, pixelSnapping, smoothing) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObject, true);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _bitmapData = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * The BitmapData object being referenced.
        * @property bitmapData
        * @type jFlashCore.BitmapData
        **/
        this.addProperty("bitmapData",
            function () {
                this.__cache = null;
                return _bitmapData;
            },
            function (value) {
                this.__cache = null;
                _bitmapData = value;
            }
        );


        //------------------------------------------------------------------
        // INIT

        _bitmapData = bitmapData;

    };
    Bitmap.prototype = Object.create(jFlashCore.DisplayObject.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Bitmap.prototype.className = "Bitmap";
    jFlashCore.registerClass(Bitmap);


})(window);