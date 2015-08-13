(function (window, angular, undefined) {
    'use strict';

    angular.module('fwConfigs', [])

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
        
        //Obs.: window.receberDado pode ter sido definido anteriormente pelo fw-atendimento, assim, verifica-se
        //se ele não foi definido e o define.
        if(!window.receberDado) {
            window.receberDado = function (dado) {
                angular.element(window.document.querySelector('#divApp')).scope().$broadcast('receberDado', dado);
            };
        }
        
        /*
         * https://github.com/angular/angular.js/issues/1417
         * Evita o Loop infinito que ocorre por exemplo no FF 34.0.5 ao acessar a tela início e pressionar CTRL+SHIFT+R
         */
        $provide.decorator('$sniffer', ['$delegate', function ($delegate) {
            $delegate.history = false;
            return $delegate;
        }]);
        
        /*
         * Este interceptor é acionado a cada request e tem a finalidade de interceptar respostas HTTP onde tenham havido mensagens 
         * e incluir as mensagens em tela de forma automática
         */
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            
            if (!$rootScope.messages) {
                $rootScope.messages = [];
            }
            
            /*
             * Permite a inclusão de uma lista mensagens assegurando a existência do array $rootScope.messages
             */
            var addMessages = function (messages) {
                angular.forEach(messages, function (value) {
                    $rootScope.messages.push(value);
                });
            };
            
            /*
             * Especificação do Interceptor
             */
            
            //Necessário devido ao bug de redimensionamento do GAW
            var resizePortlets = function () {
                setTimeout(function () {
                    try {
                        if (window.parent.getPortal) {
                            window.parent.getPortal().resizePortlets();
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }, 1);
            };
            
            return {
                'request': function (config) {
                    resizePortlets();
                    return config || $q.when(config);
                },

                'requestError': function (rejection) {
                    resizePortlets();
                    return $q.reject(rejection);
                },

                /*
                 * Caso seja uma resposta de sucesso (HTTP 20X) 
                 */
                'response': function (response) {
                    resizePortlets();
                    
                    if (response.data && (typeof response.data === 'string') && response.data.indexOf('Autorização inválida') > -1) {
                        response.data = {'data':null,'status':'BAD_REQUEST','messages':[{'fields':[],'type':'ERROR','text':'Autorização Inválida - Faça Logoff e Login na Plataforma para revalidar o Ticket GRI'}],'statusCode':400};
                        
                        //O trecho abaixo é reponsável por invalidar o login do usuário e fazer um reload da tela para que seja solicitada
                        //nova autenticação e o Ticket GRI seja revalidado
                        
                        //Não é possível injetar $http neste ponto por isso foi utilizado o XMLHttpRequest
//                        var httpRequest = new XMLHttpRequest();
//                        httpRequest.onreadystatechange = function () {
//                            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
//                                location.reload();
//                            }
//                        };
//                        httpRequest.open('GET', PltConfig.basePath + '/servlet/br.com.bb.customizacao.servlets.ServletEncerraSessao');
//                        httpRequest.send();
                    }
                    
                    //TODO: Melhorar a forma de identificar se ocorreu redirect para página de login
                    /*
                     * O método abaixo verifica se ocorreu uma falha de login e faz um "reload" da página, redirecionando o usuário
                     * para a página de login 
                     */
                    if (response.data && (typeof response.data === 'string') && response.data.indexOf('Por favor, preencha o campo senha com 8 caracteres') > -1) {
                        location.reload();
                        return;
                    }
                    
                    //Se existirem mensagens
                    if (response.data && response.data.messages) {
                        addMessages(response.data.messages);
                    }
                    return response || $q.when(response);
                },

                /*
                 * Caso seja uma resposta de erro (HTTP 4XX/5XX) 
                 */
                'responseError': function (rejection) {
                    if (rejection.status === 401) {
                        $rootScope.erroAcesso = true;
                    }
                    
                    resizePortlets();
                    //Se existirem mensagens
                    if (rejection.data && rejection.data.messages) {
                        addMessages(rejection.data.messages);
                    
                    //Se houver somente um status definido
                    } else if (rejection.status) {
                        $rootScope.messages.push({type: 'ERROR', text: 'Erro: ' + rejection.status});
                        
                    //Se houver somente uma mensagem definida
                    } else if (rejection.message) {
                        $rootScope.messages.push({type: 'ERROR', text: 'Erro: ' + rejection.message});
                        
                    //Caso contrário
                    } else {
                        $rootScope.messages.push({type: 'ERROR', text: 'Erro: ' + rejection});
                    }
                    
                    return $q.reject(rejection);
                }
            };
        });
    }])

    /*
     * Adiciona no $rootScope método que permite voltar a última página navegada '$rootScope.back()' salvando o histórico das mudanças de rota
     */
    .run(function ($rootScope, $location) {

        var history = [],
            historyList = [];

        $rootScope.$on('$routeChangeSuccess', function () {
            history.push($location.$$path);
            historyList.push($location.$$path);
            
            //Evita memory leak
            historyList = historyList.slice(-10);
        });
        
        $rootScope.previous = function () {
            return historyList[historyList.length - 2];
        };
        
        $rootScope.back = function () {
            var prev = history.length > 1 ? history.splice(-2)[0] : '/';
            $rootScope.messages = [];
            $location.path(prev);
        };
    })
    ;

})(window, angular);