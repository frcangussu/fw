(function (angular, undefined) {
    'use strict';

    angular.module('fwServices', [])
        .factory('FWParamsService', FWParamsService)
        .factory('FWExceptionService', FWExceptionService)
        .factory('FWStacktraceService', FWStacktraceService)
        .factory('FWErrorLogService', FWErrorLogService)
        
        // By default, AngularJS will catch errors and log them to 
        // the Console. We want to keep that behavior; however, we
        // want to intercept it so that we can also log the errors 
        // to the server for later analysis.
        //TODO: Mover provider para arquivo correto
        .provider('$exceptionHandler', {
            $get: function (FWErrorLogService) {
                return (FWErrorLogService);
            }
        });
    
    
    /**
	 * @ngdoc service
	 * @name FWServices.service:FWParamsService
	 * @function
	 * 
	 * @description
	 * FWParamsService é um Singleton utilizado para trafegar dados entre as telas de um fluxo de uma
	 * aplicação AngularJS, tem escopo semelhante ao conversation em JSF.
	 * 
	 * Na tela que enviará os dados é feito um:
	 * 
	 * <ul><b>FWParamsService.add('chave', 'valor');</b></ul>
	 * 
	 * 
	 * E na tela de destino é feito:
	 * 
	 * <ul><b>var valor = FWParamsService.get('chave');</b></ul> 
	 */
    function FWParamsService() {
        var params = [];
        var paramsService = {};

        paramsService.add = function (key, value) {
            params[key] = value;
        };
        
        paramsService.list = function () {
            return params;
        };
        
        paramsService.get = function (key) {
            return params[key];
        };

        return paramsService;
    }
    
    /**
	 * @ngdoc service
	 * @name FWServices.service:FWExceptionService
	 * @function
	 * 
	 * @description
	 * TODO: Comentar
	 */
    function FWExceptionService(logger) {
        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }
        
        var service = {
            catcher: catcher
        };
        return service;

    }
    
    /**
	 * @ngdoc service
	 * @name FWServices.service:FWStacktraceService
	 * @function
	 * 
	 * @description
	 * The "stacktrace" library that we included in the Scripts 
	 * is now in the Global scope; but, we don't want to reference
	 * global objects inside the AngularJS components - that's
	 * not how AngularJS rolls; as such, we want to wrap the 
	 * stacktrace feature in a proper AngularJS service that 
	 * formally exposes the print method.
	 */
    function FWStacktraceService() {
        // "printStackTrace" is a global object.
        return ({
            print: printStackTrace
        });
    }
    
    /**
	 * @ngdoc service
	 * @name FWServices.service:FWErrorLogService
	 * @function
	 * 
	 * @description
     * The error log service is our wrapper around the core error
     * handling ability of AngularJS. Notice that we pass off to 
     * the native "$log" method and then handle our additional
     * server-side logging.
	 */
    FWErrorLogService.$inject = ['$log', '$window', 'FWStacktraceService'];
    function FWErrorLogService($log, $window, FWStacktraceService) {

        // I log the given error to the remote server.
        function log(exception, cause) {

            // Pass off the error to the default error handler
            // on the AngualrJS logger. This will output the 
            // error to the console (and let the application 
            // keep running normally for the user).
            $log.error.apply($log, arguments);

            // Now, we need to try and log the error the server.
            // --
            // NOTE: In production, I have some debouncing 
            // logic here to prevent the same client from
            // logging the same error over and over again! All
            // that would do is add noise to the log.
            
            //TODO: Remover dependencia do jQuery
            try {

                var errorMessage = exception.toString();
                var stackTrace = FWStacktraceService.print({ e: exception });
                
                console.error('errorMessage: ' + errorMessage);
                console.error('stackTrace: ' + stackTrace);

                // Log the JavaScript error to the server.
                // --
                // NOTE: In this demo, the POST URL doesn't 
                // exists and will simply return a 404.
                var errorNavigator = {
                    appCodeName:    navigator.appCodeName,
                    appName:        navigator.appName,
                    appVersion:     navigator.appVersion,
                    userAgeng:      navigator.userAgent,
                    platform:       navigator.platform
                };
                
                // $.ajax({
                //     type: 'POST',
                //     url: PltConfig.baseAPIPath + '/v1/frontEndErrors',
                //     contentType: 'application/json',
                //     data: angular.toJson({
                //         errorUrl: $window.location.href,
                //         errorMessage: errorMessage,
                //         navigator: JSON.stringify(errorNavigator),
                //         stackTrace: stackTrace,
                //         cause: (cause || '')
                //     })
                // });
            } catch (loggingError) {
                // For Developers - log the log-failure.
                $log.warn('Error logging failed');
                $log.log(loggingError);
            }
        }
        // Return the logging function.
        return log;
    }
    
})(angular);