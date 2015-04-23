

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Loader class is used to load image files. Use the load() method to initiate loading.
    * @class Loader
    * @constructor
    **/
    var Loader = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObjectContainer, true);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _contentLoaderInfo = null;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        var _addChild = function (e) {
            var caller = e.target;
            caller.addChild.call(caller, _contentLoaderInfo.content);
        };


        //------------------------------------------------------------------
        // OVERRIDE METHODS AND PROPERTIES

        /**
        * [override] Adds a child DisplayObject instance to this DisplayObjectContainer instance. 
        * @method addChild
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.  
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.addChild = function (child) {
            throw "Loader object can only have one child display object. The display object that it loads."
        };

        /**
        * [override] Adds a child DisplayObject instance to this DisplayObjectContainer instance.
        * @method addChildAt
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.  
        * @param { Number } index The index position to which the child is added. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.addChildAt = function (child, index) {
            throw "Loader object can only have one child display object. The display object that it loads."
        };

        /**
        * [override] Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
        * @method removeChild
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to remove. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.removeChild = function (child) {
            throw "Loader object can only have one child display object. The display object that it loads."
        };

        /**
        * [override] Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer. 
        * @method removeChildAt
        * @param { Numbert } index The child index of the DisplayObject to remove. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that was removed. 
        **/
        this.removeChildAt = function (index) {
            throw "Loader object can only have one child display object. The display object that it loads."
        };

        /**
        * [override] Changes the position of an existing child in the display object container. 
        * @method setChildIndex
        * @param { jFlashCore.DisplayObject } child The child DisplayObject instance for which you want to change the index number. 
        * @param { Numbert } index The resulting index number for the child display object. 
        **/
        this.setChildIndex = function (child, index) {
            throw "Loader object can only have one child display object. The display object that it loads."
        };


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * [read-only] Returns a LoaderInfo object corresponding to the object being loaded.
        * @property contentLoaderInfo
        * @type jFlashCore.LoaderInfo
        **/
        this.addProperty("contentLoaderInfo",
            function () { return _contentLoaderInfo; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Loads image file into an object that is a child of this Loader object.
        * @method load
        * @param { jFlashCore.URLRequest } The absolute or relative image file to be loaded.
        **/
        this.load = function (request) {
        };

        /**
        * Removes a child of this Loader object that was loaded by using the load() method. 
        * @method unload
        **/
        this.unload = function () {
        };


        //------------------------------------------------------------------
        // INIT

        jFlashCore.unlockAbstractClassConstraint();
        _contentLoaderInfo = new jFlashCore.LoaderInfo(this);
        _contentLoaderInfo.addEventListener(jFlashCore.Event.COMPLETE, _addChild);

    };
    Loader.prototype = Object.create(jFlashCore.DisplayObjectContainer.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Loader.prototype.className = "Loader";
    jFlashCore.registerClass(Loader);


})(window);