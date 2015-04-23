

(function (window) {

    //------------------------------------------------------------------
    // CONSTRUCTOR

    /**
    * The URLRequestMethod class provides values that specify whether the URLRequest object should use the POST method or the GET method when sending data to a server. 
    * @class URLRequestMethod
    * @constructor
    **/
    var URLRequestMethod = function () {

        //------------------------------------------------------------------
        // EXTEND BASE METHODS

        this.extend(jFlashCore.Object, false);

    };


    //------------------------------------------------------------------
    // PUBLIC METHODS

    URLRequestMethod.POST = "POST";
    URLRequestMethod.prototype.POST = URLRequestMethod.POST;

    URLRequestMethod.GET = "GET";
    URLRequestMethod.prototype.GET = URLRequestMethod.GET;


    //------------------------------------------------------------------
    // REGISTER CLASS

    URLRequestMethod.prototype.className = "URLRequestMethod";
    jFlashCore.registerClass(URLRequestMethod);

})(window);