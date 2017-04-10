module.exports = function () {
 
    var yUrl = "http://www.yahoo.com";
    var gUrl = "https://www.google.com";

    return {
        
        "/y": {
            destination: yUrl,
            forwardFullOriginalUrl: true // forwards the full orignal url
        },

        "/g" : {
            destination: gUrl,
            forwardFullOriginalUrl: true // forwards the full orignal url
        }

    }
}