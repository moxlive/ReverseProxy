var argsParser = require("minimist");
var express = require("express");
var proxy = require("express-http-proxy");
var colors = require("colors");
var http = require("http");
var routeMappings = require('./route-mappings')();
var toggleClient = require('./toggle-client')();

var args = argsParser(process.argv.slice(2));
var app = express();

app.set("port", args.port || process.env.PORT || 3000);
var postBodyLimit = '100mb';


var wireProxy = function (routePath) {

    var simplePathResolutionFunction = function (req) {
        var routeInfo = routeMappings[routePath]
        if (routeInfo.forwardFullOriginalUrl) {
            return require("url").parse(req.originalUrl).path
        } else {
            return require("url").parse(req.url).path
        }
    }

    var resolvePathAsync = function (req) {

        return new Promise (function(resolve, reject) {
            setTimeout(function () {   // do asyncness                
                toggleClient.getFeature(req, function (feature) {   
                    if (feature) {
                        var path = JSON.parse(feature)
                        if (path.state) {
                            resolve (path.state)    // new path from LD
                        }            
                    }
                    else
                    {
                        resolve (require("url").parse(req.originalUrl).path)
                    }                               
                })
            }, 500);
          
        })        
    }


    var destination = routeMappings[routePath].destination;

    if (typeof destination === "string") {
        //if desitnation is string then do a simple mapping
        console.log(colors.green("Mapping Route:" + routePath + " to destination:" + destination));

        app.use(routePath, proxy(destination, { proxyReqPathResolver: resolvePathAsync, limit: postBodyLimit }));
    }
}

Object.keys(routeMappings).forEach(wireProxy);

http.createServer(app).listen(app.get("port"), function () {
    console.log("Starting Ims WebApp Server on port ".green + colors.yellow(app.get("port")));
});

var gracefulShutdown = function() {
    console.log("Received kill signal, shutting down gracefully.");
    process.exit();
};

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown); 