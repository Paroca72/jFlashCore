


(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * This class is used to create lightweight shapes. 
    * @class Shape
    * @constructor
    **/
    var Sprite = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObjectContainer, true);


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
    Sprite.prototype = Object.create(jFlashCore.DisplayObjectContainer.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Sprite.prototype.className = "Sprite";
    jFlashCore.registerClass(Sprite);


})(window);