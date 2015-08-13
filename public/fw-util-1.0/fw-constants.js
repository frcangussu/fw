(function (angular, undefined) {

    'use strict';

    angular.module('fwConstants', [])

    .constant('MSG_TYPE',{
    		E: {TYPE: 'danger',  ICON: 'glyphicon-warning-sign'},
    		W: {TYPE: 'warning', ICON: 'glyphicon-exclamation-sign'},
    		I: {TYPE: 'info',    ICON: 'glyphicon-info-sign'},
    		S: {TYPE: 'success', ICON: 'glyphicon-ok-sign'}
    })

    .constant('INTEGER_REGEXP', /^\-?\d*$/)

    .constant('FLOAT_REGEXP', /^\-?\d+((\.|\,)\d+)?$/)

    .constant('EVENTS_DICT', {httpError: 'httpError', tabsActivate: 'tabsActivate'});

})(angular);