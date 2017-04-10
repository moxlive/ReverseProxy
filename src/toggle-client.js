module.exports = function () {

    var http = require('http')
    var toggleServiceAddres = 'localhost'
    var port = '4000'
    

    function getFeatureFromLD(featureName, firm, user, customizedData, callback) {

        var url = '/toggle'
        url += '/feature/' + featureName
        url += '/firm/' + firm
        url += '/user/' + user

        http.get({
            host: toggleServiceAddres,
            port: 4000,
            path: url,
        }, function(response) {
            
            var str = ''
            response.on('data', function (chunk) {
                console.log('strgetFeatureFromLD ' + chunk)
                callback(chunk);
            })

            response.on('end', function () {
                console.log(str)
                callback(undefined);
            })

        })
    }
    
    function getUserSession(sessionId) {

    }

    return {

         getFeature : function(req, callback) {
            
            // var sessionId = req.header.Authorization
            // var userSession = getUserSession(sessionId)
            // var header =  {
            //     "Authorization": "authorizationHeader",
            //     "X-Request-Id": "xRequestIdHeader"
            // }

            return getFeatureFromLD('flag-boolean', 'firmA', 'abc', 'undefined', callback)

         }
    }
}