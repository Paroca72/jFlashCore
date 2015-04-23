

(function (window) {

    var jFlashCore = {

        // Abstract Class
        abstractLockCounter: 0,

        unlockAbstractClassConstraint: function () {
            this.abstractLockCounter++;
        },

        lockAbstractClassConstraint: function () {
            this.abstractLockCounter--;
            if (this.abstractLockCounter < 0) this.abstractLockCounter = 0;
        },

        abstractClassIsLock: function () {
            return (this.abstractLockCounter = 0);
        },


        // Inclusion
        allIsLoaded: false,

        IncludeQueue: function () {

            var queue = [];
            var busy = false;

            var createScript = function (filePath) {
                var element = document.createElement('script');
                element.setAttribute("type", "text/javascript");
                element.setAttribute("src", filePath);

                return element;
            };

            var addToDocument = function (element) {
                var head = document.getElementsByTagName("head");
                head[0].appendChild(element);
            };

            var findGlobalPath = function () {
                var head = document.getElementsByTagName("head");
                var coll = head[0].getElementsByTagName("script");
                var master = "jFlashCore.js";

                for (var i = 0, len = coll.length; i < len; i++) {
                    var element = coll[i];
                    if (element.src.indexOf(master)) return element.src.match(/^.*\//)[0];
                }
                return "";
            };

            var alreadyInclude = function (filePath) {
                var head = document.getElementsByTagName("head");
                var coll = head[0].getElementsByTagName("script");

                for (var i = 0, len = coll.length; i < len; i++) {
                    if (coll[i].src == filePath) return true;
                }
                return false;
            };

            var loadCompleteHanlder = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    busy = false;

                    if (queue.length == 0) {
                        jFlashCore.allIsLoaded = true;
                        for (var i = 0, len = jFlashCore.readyList.length; i < len; i++) {
                            jFlashCore.readyList[i].call(jFlashCore);
                        }
                    }

                    this.onload = this.onreadystatechange = null;
                    resolveQueue();
                }
            };

            var resolveQueue = function () {
                if (!busy) {
                    busy = true;
                    if (queue.length > 0) {
                        var filePath = queue[0];
                        var element = createScript(filePath);

                        element.onload = element.onreadystatechange = loadCompleteHanlder;
                        addToDocument(element);

                        queue.splice(0, 1);
                        resolveQueue();
                    }
                }
            };

            var addToQueue = function (filePath) {
                var globalPath = findGlobalPath();
                filePath = globalPath + filePath;

                if (!alreadyInclude(filePath)) {
                    queue.push(filePath);
                    resolveQueue();
                }
            };

            this.load = function (filePath) {
                addToQueue(filePath);
            };
        },

        // Onready
        readyList: [],

        onready: function (funct) {
            if (typeof funct === "function") {
                if (jFlashCore.allIsLoaded) {
                    funct();
                } else {
                    if (jFlashCore.readyList.length == 0) {
                        // Include classes
                        var include = new jFlashCore.IncludeQueue();
                        include.load("core/Object.js");
                        include.load("geom/Point.js");
                        include.load("geom/Rectangle.js");
                        include.load("geom/Matrix.js");
                        include.load("events/Event.js");
                        include.load("events/IOErrorEvent.js");
                        include.load("events/MouseEvent.js");
                        include.load("events/ProgressEvent.js");
                        include.load("events/EventDispatcher.js");
                        include.load("events/MouseEvent.js");
                        include.load("net/URLRequestMethod.js");
                        include.load("net/URLRequest.js");
                        include.load("net/URLLoader.js");
                        include.load("display/CapsStyle.js");
                        include.load("display/GradientType.js");
                        include.load("display/JointStyle.js");
                        include.load("display/DisplayObject.js");
                        include.load("display/InteractiveObject.js");
                        include.load("display/DisplayObjectContainer.js");
                        include.load("display/LoaderInfo.js");
                        include.load("display/Loader.js");
                        include.load("display/BitmapData.js");
                        include.load("display/Bitmap.js");
                        include.load("display/Graphics.js");
                        include.load("display/Shape.js");
                        include.load("display/Sprite.js");
                        include.load("display/Stage.js");
                    }
                }
                jFlashCore.readyList.push(funct);
            } else {
                throw "Param in not a function";
            }
        },

        // Register
        registerClass: function (classReference) {
            if (classReference != null && classReference.hasOwnProperty("prototype") && classReference.prototype.hasOwnProperty("className")) {
                var jFlashCore = window.jFlashCore;
                jFlashCore[classReference.prototype.className] = classReference;
            }
        },

        // Math
        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },

        // Cross browser
        html: {

            // Handling events
            attachEvent: function (element, type, handler) {
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                } else {
                    element.attachEvent('on' + type, handler);
                }
            },

            detachEvent: function (element, type, handler) {
                if (element.removeEventListener) {
                    element.removeEventListener(type, handler, false);
                } else {
                    element.detachEvent('on' + type, handler);
                }
            },

            mouseX: 0,
            mouseY: 0

        }

    };


    // Capture global mouse movement
    jFlashCore.html.attachEvent(document, "mousemove", function (e) {
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            jFlashCore.html.mouseX = e.pageX;
            jFlashCore.html.mouseY = e.pageY;
        } else {
            if (e.clientX || e.clientY) {
                jFlashCore.html.mouseX = e.clientX + document.body.scrollLeft
                                                   + document.documentElement.scrollLeft;
                jFlashCore.html.mouseY = e.clientY + document.body.scrollTop
                                                   + document.documentElement.scrollTop;
            }
        }
    });


    // Add to global
    window.jFlashCore = jFlashCore;


})(window);