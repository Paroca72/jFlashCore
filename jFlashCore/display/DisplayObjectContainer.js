



(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The DisplayObjectContainer class is the base class for all objects that can serve as display object containers on the display list. 
    * Is an abstract calss and you cannot create a DisplayObjectContainer object directly from ActionScript code. If you call new DisplayObjectContainer(), an exception is thrown.
    * @class DisplayObjectContainer
    * @constructor
    **/
    var DisplayObjectContainer = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.InteractiveObject, true);


        //------------------------------------------------------------------
        // PRIVATE PROPERTIES

        /** @private */
        var _children = [];
        /** @private */
        var _mouseChildren = true;
        /** @private */
        var _preventEventDispatch = false;


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * Determines whether or not the children of the object are mouse, or user input device, enabled.
        * @property mouseChildren
        * @type Boolean
        * @default true
        **/
        this.addProperty("mouseChildren",
            function () { return _mouseChildren; },
            function (value) { _mouseChildren = value; }
        );

        /**
        * [read-only] Returns the number of children of this object. 
        * @property numChildren
        * @type Number
        **/
        this.addProperty("numChildren",
            function () { return _children.length; }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Adds a child DisplayObject instance to this DisplayObjectContainer instance. 
        * @method addChild
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.  
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.addChild = function (child) {
            return this.addChildAt(child, -1);
        };

        /**
        * Adds a child DisplayObject instance to this DisplayObjectContainer instance.
        * @method addChildAt
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.  
        * @param { Number } index The index position to which the child is added. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.addChildAt = function (child, index) {
            // Check
            if (child instanceof jFlashCore.Stage) throw "Passed object cannot be an jFlashCore.Stage";
            if (!(child instanceof jFlashCore.DisplayObject)) throw "Passed object must be an jFlashCore.DisplayObject";
            if (this.ancestor === child) throw "You can not add an object as a child of itself";

            // Parent
            var self = this.ancestor;
            var parent = child.parent;

            if (parent != null) parent.removeChild(child);
            child.addProperty("parent",
                function () { return self; }
            )

            // stage
            if (child.stage != null && !_preventEventDispatch) {
                if (child.hasEventListener(jFlashCore.Event.ADDED_TO_STAGE)) {
                    child.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.ADDED_TO_STAGE));
                }
            }

            // Add
            if (!jFlashCore.isNumber(index) || index < 0 || index > _children.length - 1) {
                _children.push(child);
            } else {
                _children.splice(index, 0, child);
            }

            return child;
        };

        /**
        * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself. 
        * @method contains
        * @param { jFlashCore.DisplayObject } child The child object to test. 
        * @return { Boolean } true if the child object is a child of the DisplayObjectContainer or the container itself; otherwise false. 
        **/
        this.contains = function (child) {
            for (var i = 0, len = _children.length; i < len; i++) {
                var item = _children[i];
                if (item === child) return true;
                if (item instanceof jFlashCore.DisplayObjectContainer && item.contains(child)) return true;
            }
            return false;
        };

        /**
        * Returns the child display object instance that exists at the specified index. 
        * @method getChildAt
        * @param { Number } index The index position of the child object. 
        * @return { jFlashCore.DisplayObject } The child display object at the specified index position. 
        **/
        this.getChildAt = function (index) {
            if (!jFlashCore.isNumber(index)) throw "Not valid argument";
            if (index < 0 || index > _children.length - 1) throw "Index range error";
            return _children[index];
        };

        /**
        * Returns the child display object instance that exists at the specified index. 
        * @method getChildByName
        * @param { Number } name The name of the child to return. 
        * @return { jFlashCore.DisplayObject } The child display object with the specified name. 
        **/
        this.getChildByName = function (name) {
            for (var i = 0, len = _children.length; i < len; i++) {
                var item = _children[i];
                if (item.name == name) return item;
            }
            return null;
        };

        /**
        * Returns the index position of a child DisplayObject instance. 
        * @method getChildIndex
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to identify. 
        * @return { Number } The index position of the child display object to identify.
        **/
        this.getChildIndex = function (child) {
            if (!(child instanceof jFlashCore.DisplayObject)) throw "Passed object must be an jFlashCore.DisplayObject";
            for (var i = 0, len = _children.length; i < len; i++) {
                if (child === _children[i]) return i;
            }
            throw "Passed object is not a child of this object";
        };

        /**
        * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
        * @method removeChild
        * @param { jFlashCore.DisplayObject } child The DisplayObject instance to remove. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that you pass in the child parameter. 
        **/
        this.removeChild = function (child) {
            var index = this.getChildIndex(child);
            return this.removeChildAt(index);
        };

        /**
        * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer. 
        * @method removeChildAt
        * @param { Numbert } index The child index of the DisplayObject to remove. 
        * @return { jFlashCore.DisplayObject } The DisplayObject instance that was removed. 
        **/
        this.removeChildAt = function (index) {
            // Check
            if (!jFlashCore.isNumber(index) || index < 0 || index > _children.length - 1) throw "Index does not exist in the child list";

            var self = this.ancestor;
            var child = _children.splice(index, 1);
            child = child[0];

            // stage
            if (child.stage != null && !_preventEventDispatch) {
                if (child.hasEventListener(jFlashCore.Event.REMOVED_FROM_STAGE)) {
                    child.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.REMOVED_FROM_STAGE));
                }
            };

            // parent
            child.addProperty("parent",
                function () { return null; }
            );

            // return
            return child;
        };

        /**
        * Changes the position of an existing child in the display object container. 
        * @method setChildIndex
        * @param { jFlashCore.DisplayObject } child The child DisplayObject instance for which you want to change the index number. 
        * @param { Numbert } index The resulting index number for the child display object. 
        **/
        this.setChildIndex = function (child, index) {
            _preventEventDispatch = true;
            var curr = this.removeChild(child);
            this.addChildAt(curr, index);
            _preventEventDispatch = false;
        };

        /**
        * Swaps the z-order (front-to-back order) of the two specified child objects.
        * @method swapChildren
        * @param { jFlashCore.DisplayObject } child1 The first child object.  
        * @param { jFlashCore.DisplayObject } child2 The second child object. 
        **/
        this.swapChildren = function (child1, child2) {
            _preventEventDispatch = true;
            var pos1 = this.getChildIndex(child1);
            var pos2 = this.getChildIndex(child2);
            this.swapChildrenAt(pos1, pos2);
            _preventEventDispatch = false;
        };

        /**
        * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child list.
        * @method swapChildrenAt
        * @param { Number } index1 The index position of the first child object. 
        * @param { Number } index2 The index position of the second child object. 
        **/
        this.swapChildrenAt = function (index1, index2) {
            _preventEventDispatch = true;
            if (index1 != index2) {
                var first = index1;
                var second = index2;

                if (index1 > index2) {
                    first = index2;
                    second = index1;
                }

                var so = this.removeChildAt(second);
                var fo = this.removeChildAt(first);

                this.addChildAt(so, first);
                this.addChildAt(fo, second);
            }
            _preventEventDispatch = false;
        };


        //------------------------------------------------------------------
        // INIT

        if (jFlashCore.abstractClassIsLock()) {
            throw "This is an abstract class.";
        } else {
            jFlashCore.lockAbstractClassConstraint();
        }

    };
    DisplayObjectContainer.prototype = Object.create(jFlashCore.InteractiveObject.prototype);


    //------------------------------------------------------------------
    // REGISTER

    DisplayObjectContainer.prototype.className = "DisplayObjectContainer";
    jFlashCore.registerClass(DisplayObjectContainer);


})(window);
