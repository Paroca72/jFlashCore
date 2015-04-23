

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The GradientType class provides values for the type parameter in the beginGradientFill() and lineGradientStyle() methods of the flash.display.Graphics class. 
    * @class GradientType
    * @constructor
    **/
    var GradientType = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object, false);

    };


    //------------------------------------------------------------------
    // PUBLIC METHODS

    GradientType.LINEAR = "linear";
    GradientType.prototype.LINEAR = GradientType.LINEAR;

    GradientType.RADIAL = "radial";
    GradientType.prototype.RADIAL = GradientType.RADIAL;


    //------------------------------------------------------------------
    // REGISTER CLASS

    GradientType.prototype.className = "GradientType";
    jFlashCore.registerClass(GradientType);

})(window);