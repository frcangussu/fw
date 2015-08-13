(function (angular, undefined) {

    'use strict';

    angular.module('fwDirectives', ['fwConstants'])

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwNumbersOnly
     * 
     * @description
     * Diretiva para mascarar um campo de input para permitir apenas números
     * 
     * @element input
     */
    .directive('fwNumbersOnly', ['INTEGER_REGEXP', function (INTEGER_REGEXP) {
        return {
            restrict : 'A',
            require : 'ngModel',
            link : function (scope, element, attrs, ctrl) {
                ctrl.$parsers.push(function (inputValue) {
                    // this next if is necessary for when using ng-required on your input.
                    // In such cases, when a letter is typed first, this parser will
                    // be called again, and the 2nd time, the value will be undefined
                    if (inputValue === undefined) {
                        return '';
                    }
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }

                    if (INTEGER_REGEXP.test(inputValue)) {
                        // it is valid
                        ctrl.$setValidity('integer', true);
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('integer', false);
                    }

                    return transformedInput;
                });
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwInteger
     * 
     * @description
     * Diretiva para mascarar um campo de input para permitir apenas valores inteiros
     * 
     * @element input
     */
    .directive('fwInteger', ['INTEGER_REGEXP', function (INTEGER_REGEXP) {
        return {
            require : 'ngModel',
            link : function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (INTEGER_REGEXP.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('integer', true);
                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('integer', false);
                        return undefined;
                    }
                });
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwSmartFloat
     * 
     * @description
     * Diretiva para mascarar um campo de input para permitir apenas de ponto flutuante
     * 
     * @element input
     */
    .directive('fwSmartFloat', ['FLOAT_REGEXP', function (FLOAT_REGEXP) {
        return {
            require : 'ngModel',
            link : function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', '.'));
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwTabs
     * 
     * @description
     * Diretiva ponte para utilização de abas do jQueryUI
     * 
     * @element input
     */
    .directive('fwTabs', function ($timeout) {
        return function ($scope, element) {
            $(element).tabs();

            $(element).bind('tabsactivate', function (event, ui) {
                $timeout(function () {
                    $scope.$emit('tabsactivate', event, ui);
                });
            });
        };
    })

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwSelectOnFocus
     * 
     * @description
     * Diretiva onde quando um campo de input é selecionado, todo o seu conteúdo é selecionado 
     * (facilita quando o operador necessita apagar o conteúdo de um campo)
     * 
     * @element input
     */
    .directive('fwSelectEvent', function () {
        return function (scope, element,att) {
            element.bind(att.fwSelectEvent, function () {
                //element.select();

                //console.log(element[0].id);

                if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(document.getElementById(element[0].id));
                    range.select();
                } else if (window.getSelection) {
                    var range = document.createRange();
                    range.selectNode(document.getElementById(element[0].id));
                    window.getSelection().addRange(range);
                }

            });
        };
    })

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwAutoTabTo
     * 
     * @description
     * Diretiva onde quando um campo chega em seu tamanho máximo, ocorre um 'auto-tab' para um campo
     * especificado
     * 
     * @element input
     */
    .directive('fwAutoTabTo', function () {
        return {
            restrict : 'A',
            link : function (scope, el, attrs) {
                el.bind('keyup', function () {
                    if (this.value.length === this.maxLength) {
                        var element = document.getElementById(attrs.fwAutoTabTo);
                        if (element) {
                            element.focus();
                        }
                    }
                });
            }
        };
    })

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwLoading
     * 
     * @description
     * Diretiva de exibição do 'Carregando' quando uma requisição AJAX está pendente
     * 
     * @element input
     */
    //TODO: Externalizar isLoading em um serviço
    .directive('fwLoading', [ '$http', '$window', '$rootScope', function ($http, $window, $rootScope) {
        return {
            restrict : 'A',
            link: function (scope, elm) {
                $rootScope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch($rootScope.isLoading, function (v) {
                    if (v) {
                        elm.css('display', '');
                    } else {
                        elm.css('display', 'none');
                    }
                    
                    //Necessário devido ao bug de redimensionamento do GAW
                    setTimeout(function () {
                        if ($window.parent.getPortal) {
                            $window.parent.getPortal().resizePortlets();
                        }
                    }, 1);
                });
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwFocusMe
     * 
     * @description
     * Elemento assume o foco quando um determinado evento é lançado por $scope.$emit
     * 
     * @example
       <pre>
       <input type="password" ng-model="value1" fw-focus-me='limpar'>
       </pre>
     * 
     * @element input
     */
    .directive('fwFocusMe', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on(attrs.fwFocusMe, function () {
                    $timeout(function () {
                        element[0].focus();
                    });
                });
            }
        };
    }])


    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwMinlength
     * 
     * @description
     * Foi necessário criar os validadores prórprios minlength e maxlength uma vez que os do framework adicionam
     * além do validador um parser, de modo que o modelo somente era atualizado após o valor ser válido, o que
     * impedia a contagem de caracteres digitados. 
     * 
     * @element input
     */
    .directive('fwMinlength', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var minlength = parseInt(attrs.fwMinlength, 10);
                    ctrl.$setValidity('fwMinlength', !ctrl.$isEmpty(viewValue) && viewValue.length >= minlength);
                    return viewValue;
                });
            }
        };
    })

    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwMaxlength
     * 
     * @description
     * Define a quantidade máxima de characteres de um input text
     * 
     * @element input
     */
    .directive('fwMaxlength', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var maxlength = parseInt(attrs.fwMaxlength, 10);
                    ctrl.$setValidity('fwMaxlength', ctrl.$isEmpty(viewValue) || viewValue.length <= maxlength);
                    return viewValue;
                });
            }
        };
    })
    
    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwInfiniteScroll
     * 
     * @description
     * Define o scroll infinito
     * 
     * @element input
     */
    .directive('fwInfiniteScroll', function () {
        return {
            link: function (scope, element, attrs) {
                var offset = parseInt(attrs.threshold, 10) || 0;
                var e = element[0];

                element.bind('scroll', function () {
                    if (scope.$eval(attrs.canLoad) && e.scrollTop + e.offsetHeight >= e.scrollHeight - offset) {
                        scope.$apply(attrs.fwInfiniteScroll);
                    }
                });
            }
        };
    })
    
    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwCpf
     * 
     * @description
     * Validação de CPF
     * 
     * @element input
     */
    .directive('fwCpf', function () {
        return {

            restrict: 'A',
    
            require: 'ngModel',
    
            link: function (scope, elm, attrs, ctrl) {
                if (window.bb.CPF) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        ctrl.$setValidity('cpf', window.bb.CPF.isValid(viewValue));
                        return viewValue;
                    });
                } else {
                    console.log('window.bb.CPF não localizado');
                }
            }
        };
    })
    
    /**
     * @ngdoc directive
     * @name fwDirectives.directive:fwCnpj
     * 
     * @description
     * Validação de CNPJ
     * 
     * @element input
     */
    .directive('fwCnpj', function () {
        return {

            restrict: 'A',

            require: 'ngModel',

            link: function (scope, elm, attrs, ctrl) {
                if (window.bb.CNPJ) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        ctrl.$setValidity('cnpj', window.bb.CNPJ.isValid(viewValue));
                        return viewValue;
                    });
                } else {
                    console.log('window.bb.CNPJ não localizado');
                }
            }
        };
    })
    
    ;

})(angular);
