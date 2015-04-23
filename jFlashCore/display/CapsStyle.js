

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines. 
    * @class GradientType
    * @constructor
    **/
    var CapsStyle = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object, false);

    };


    //------------------------------------------------------------------
    // PUBLIC METHODS

    CapsStyle.NONE = "none";
    CapsStyle.prototype.NONE = CapsStyle.NONE;

    CapsStyle.ROUND = "round";
    CapsStyle.prototype.ROUND = CapsStyle.ROUND;

    CapsStyle.SQUARE = "square";
    CapsStyle.prototype.SQUARE = CapsStyle.SQUARE;


    //------------------------------------------------------------------
    // REGISTER CLASS

    CapsStyle.prototype.className = "CapsStyle";
    jFlashCore.registerClass(CapsStyle);

})(window);