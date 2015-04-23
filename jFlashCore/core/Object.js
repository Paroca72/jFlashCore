

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Object class is at the root of the ActionScript class hierarchy. 
    * @class Object
    * @constructor
    **/
    var Object = function () {
    };


    //------------------------------------------------------------------
    // PUBLIC METHODS

    /**
    * Add property.
    * @method addProperty
    * @param { String } name The name of property to add
    * @param { Function } getter The getter function
    * @param { Function } setter The setter function
    */
    Object.prototype.addProperty = function (name, getter, setter) {
        var scope = "[" + this.className + "." + name + "] ";
        if (setter == null) setter = function () { throw scope + "This is a read-only property" };
        if (getter == null) throw scope + "Define the getter function before";

        window.Object.defineProperty(this, name, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }

    /**
    * Exdent methods from another prototype and create a super class.
    * @method extend
    * @param { Class } from The class to extend
    * @param { Boolean } isAbstract If is an abstract class
    */
    Object.prototype.extend = function (from, isAbstract, args) {
        function cloneProperties(source, dest) {
            var properties = window.Object.getOwnPropertyNames(source);
            for (var i = 0, len = properties.length; i < len; i++) {
                var name = properties[i];
                if (!dest.hasOwnProperty(name)) {
                    var descriptor = window.Object.getOwnPropertyDescriptor(source, name);
                    window.Object.defineProperty(dest, name, descriptor);
                }
            }
        }

        function setAncestor(chain, ancestor) {
            chain.ancestor = ancestor;
            while (chain.hasOwnProperty("super")) {
                chain = chain.super;
                chain.ancestor = ancestor;
            }
        }

        if (isAbstract == true) jFlashCore.unlockAbstractClassConstraint();
        args = args || [];
        args.unshift(null);
        this.super = new (Function.prototype.bind.apply(from, args));

        cloneProperties(this.super, this);
        setAncestor(this, this);
    }


    //------------------------------------------------------------------
    // REGISTER CLASS

    Object.prototype.className = "Object";
    jFlashCore.registerClass(Object);

})(window);