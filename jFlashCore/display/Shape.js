


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * This class is used to create lightweight shapes. 
    * @class Shape
    * @constructor
    **/
    var Shape = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObject, true);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _graphics = null;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * [read-only] Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
        * @property graphics
        * @type jFlashCore.Graphics
        **/
        this.addProperty("graphics",
            function () {
                this.__cache = null;
                return _graphics;
            }
        );


        //------------------------------------------------------------------
        // INIT

        // Graphics
        jFlashCore.unlockAbstractClassConstraint();
        _graphics = new jFlashCore.Graphics();

    };
    Shape.prototype = Object.create(jFlashCore.DisplayObject.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Shape.prototype.className = "Shape";
    jFlashCore.registerClass(Shape);


})(window);