

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The Stage class represents the main drawing area. 
    * @class Stage
    * @constructor
    **/
    var Stage = function (width, height) {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.DisplayObjectContainer, true);


        //------------------------------------------------------------------
        // PRIVATE VARIABLES

        /** @private */
        var _self = this;
        /** @private */
        var _canvas = null;

        /** @private */
        var _frameRate = 24;
        /** @private */
        var _timerID = null;


        //------------------------------------------------------------------
        // PRIVATE METHODS

        /** @private */
        var _setTimelineFrameRate = function (rate) {
            var millisecond = (1 / rate) * 1000;
            if (_timerID) clearInterval(_timerID);
            _timerID = setInterval(_timerHandler, millisecond);
        };

        /** @private */
        var _timerHandler = function () {
            _engine.call(_self);
        };

        /** @private */
        var _engine = function () {

            // Execute render commands
            function executeGraphicsCommands(object, context) {
                var commands = object.graphics.__commands;
                var gradient = null;
                var holdCapValue = null;

                for (var i = 0, len = commands.length; i < len; i++) {
                    var command = commands[i];
                    switch (command.type) {
                        case 0: context[command.name].apply(context, command.args); break;
                        case 1: context[command.name] = command.args; break;
                        case 2: gradient = context[command.name].apply(context, command.args); break;
                        case 3: gradient[command.name].apply(gradient, command.args); break;
                        case 4: context[command.name] = gradient; break;
                        case 5: holdCapValue = context[command.name]; break;
                        case 6: context[command.name] = holdCapValue; break;
                    }
                }
            }

            // Draw context
            function draw(object, context) {
                if (object instanceof jFlashCore.Bitmap) {
                    // Draw bitmap
                    var canvas = object.__canvas;
                    var context = canvas.getContext("2d");

                    if (canvas.width != 0 && canvas.height != 0) {
                        context.drawImage(cache, 0, 0);
                    }

                } else {
                    // Draw graphics
                    executeGraphicsCommands(object, context);
                }
            }

            // Create cache and link it to object
            function createCache(object) {
                var bounds = (object instanceof jFlashCore.Bitmap) ? object.BitmapData.rect : object.graphics.__bounds;

                var canvas = document.createElement("canvas");
                canvas.setAttribute("width", bounds.width);
                canvas.setAttribute("height", bounds.height);

                var context = canvas.getContext("2d");
                context.translate(-bounds.x, -bounds.y);
                draw(object, context);

                object.__cache = canvas;
            }

            // Sets the enviroment
            function setEnvironment(object, context, hide) {
                // Set properties
                context.scale(object.scaleX, object.scaleY);
                context.translate(object.x, object.y);
                context.rotate((Math.PI * object.rotation) / 180);
                context.globalAlpha = (hide) ? 0 : object.alpha;

                var clip = object.scrollRect;
                var mask = object.mask;

                // Clipping
                if (clip != null) {
                    context.save();
                    context.globalAlpha = 0;
                    context.beginPath();
                    context.rect(0, 0, clip.width, clip.height);
                    if (mask == null) context.clip();
                    context.restore();
                    context.translate(-clip.x, -clip.y);
                }

                // Masking
                if (mask != null) {
                    context.save();
                    setEnvironment(mask, context, true);
                    context.restore();
                    context.clip();
                }

                // Draw
                if (object.cacheAsBitmap) {
                    if (object.__cache == null) {
                        createCache(object);
                    }

                    var cache = object.__cache;
                    if (cache.width != 0 && cache.height != 0) {
                        context.drawImage(cache, 0, 0);
                    }

                } else {
                    draw(object, context);
                }
            };

            // Cycle all objects
            function recursive(object, context) {
                context.save();

                // Events
                if (object.hasEventListener(jFlashCore.Event.ENTER_FRAME)) {
                    object.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.ENTER_FRAME));
                }

                // Childs
                if (object instanceof jFlashCore.DisplayObjectContainer) {
                    for (var index = 0, len = object.numChildren; index < len; index++) {
                        var child = object.getChildAt(index);
                        recursive(child, context);
                    }
                }

                // Draw current
                if (!(object instanceof jFlashCore.Stage)) {
                    setEnvironment(object, context, false);
                }

                context.restore();
            };

            // Get context and draw
            var context = _canvas.getContext('2d');
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            recursive(this, context);

            if (this.hasEventListener(jFlashCore.Event.RENDER)) {
                this.dispatchEvent(new jFlashCore.Event(jFlashCore.Event.RENDER));
            }
        };


        //------------------------------------------------------------------
        // PUBLIC PROPERTIES

        /**
        * Gets and sets the frame rate of the stage.
        * @property frameRate
        * @type Number
        * @default 24
        **/
        this.addProperty("frameRate",
            function () { return _frameRate; },
            function (value) {
                if (value <= 0.01) value = 0.01;
                if (value >= 1000) value = 1000;

                _frameRate = value;
                _setTimelineFrameRate(_frameRate);
            }
        );


        //------------------------------------------------------------------
        // PUBLIC METHODS

        /**
        * Get the canvas element.
        * @method getHTMLCanvas
        */
        this.getHTMLCanvas = function () {
            return _canvas;
        };

        /**
        * Force to redraw stage.
        * @method invalidate
        */
        this.invalidate = function () {
            _engine.call(this);
        };


        //------------------------------------------------------------------
        // INIT

        // create canvas
        _canvas = document.createElement("canvas");
        _canvas.setAttribute("width", width);
        _canvas.setAttribute("height", height);


        // frame rate
        _setTimelineFrameRate.call(this, _frameRate);

    };
    Stage.prototype = Object.create(jFlashCore.DisplayObjectContainer.prototype);


    //------------------------------------------------------------------
    // REGISTER

    Stage.prototype.className = "Stage";
    jFlashCore.registerClass(Stage);


})(window);