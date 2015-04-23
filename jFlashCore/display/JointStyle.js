

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines. 
    * @class GradientType
    * @constructor
    **/
    var JointStyle = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object, false);

    };


    //------------------------------------------------------------------
    // PUBLIC METHODS

    JointStyle.BEVEL = "bevel";
    JointStyle.prototype.BEVEL = JointStyle.BEVEL;

    JointStyle.MITER = "miter";
    JointStyle.prototype.MITER = JointStyle.MITER;

    JointStyle.ROUND = "round";
    JointStyle.prototype.ROUND = JointStyle.ROUND;


    //------------------------------------------------------------------
    // REGISTER CLASS

    JointStyle.prototype.className = "JointStyle";
    jFlashCore.registerClass(JointStyle);

})(window);