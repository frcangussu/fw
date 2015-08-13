/** 
 * @module 
 * @description 
 * Módulo AngularJS de controllers utilitários do FW, diretivas são equivalentes aos BackingBeans do JSF
 */

(function (angular, undefined) {

    'use strict';

    angular
        .module('fwControllers', ['fwConstants', 'fwServices'])
        .controller('FWController', FWController);
    
    FWController.$inject = ['$http', '$location', '$rootScope', '$scope', 'MSG_TYPE', 'FWParamsService', '$window'];
    
    function FWController($http, $location, $rootScope, $scope, MSG_TYPE, FWParamsService, $window) {
        var vm = this;
        
        vm.getMsgClass = getMsgClass;
        vm.getMsgImage = getMsgImage;
        vm.go = go;
        vm.urlAbsoluta = urlAbsoluta;
        vm.urlAbsolutaDependencia = urlAbsolutaDependencia;
        
        //Observação: Se a âncora estiver antes dos parâmetros de query, estes parâmetros serão ignorados, 
        //Ex. 1 que funciona:     https://localhost.bb.com.br/gawapp/APPS/app/components/perfil-cliente/perfil-cliente.app.html?p_mci=11#/perfil-cliente
        //Ex. 2 que não funciona: https://localhost.bb.com.br/gawapp/APPS/app/components/perfil-cliente/perfil-cliente.app.html#/perfil-?p_mci=11cliente
        //No entanto, de acordo com o RFC 3986 (http://tools.ietf.org/html/rfc3986#section-4.1) a âncora deve vir APÓS os parâmetros de query, assim
        //o método irá funcionar se a URL estiver corretamente formatada
        var urlSemAncora = $window.location.href;
        
        if (urlSemAncora.indexOf('#') !== -1) {
            urlSemAncora = urlSemAncora.substring(0, urlSemAncora.indexOf('#'));
        }
        
        // Adicionando todos os parâmetros da URL ao FWParamsService
        urlSemAncora.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            FWParamsService.add(key, value);
        });
        
        vm.mci = FWParamsService.get('p_mci');
        
        /**
         * Função utilitária que permite navegar clicando em botões
         */
        function go(path) {
            $rootScope.messages = [];
            $location.path(path);
        }
        
        
        /**
         * Função utilitária que um caminho absoluto dado uma URL relativa
         */
        function urlAbsoluta(urlRelativa) {
            if (!urlRelativa) {
                return '';
            } else {
                if (urlRelativa.charAt(0) !== '/') {
                    urlRelativa = '/' + urlRelativa;
                }
                return PltConfig.basePath + urlRelativa;
            }
        }
        
        /**
         * TODO: Testes
         * Função utilitária que um caminho absoluto dado um arquivo fornecido por web-estatico
         */
        function urlAbsolutaDependencia(libName) {
            return PltConfig.resolveDependency(libName);
        }
        
        /**
         * Função utilitária que retorna uma imagem a partir de um tipo de mensagem
         * TODO: Verificar se esta lógica não deveria estar na view
         */
        function getMsgImage(msgType) {
            switch (msgType) {
            case MSG_TYPE.ERROR:
                return urlAbsolutaDependencia('msgerro-color-png');
            case MSG_TYPE.WARN:
                return urlAbsolutaDependencia('msgalerta-color-png');
            case MSG_TYPE.INFO:
                return urlAbsolutaDependencia('msginfo-color-png');
            default:
                throw 'Tipo de mensagem não parametrizado: ' + msgType;
            }
        }

        /**
         * Função utilitária que retorna uma classe de css a partir de um tipo de mensagem
         * TODO: Alterar para utilizar direto na view o ngClass
         */
        function getMsgClass(msgType) {
            switch (msgType) {
            case MSG_TYPE.ERROR:
                return 'mensagem_erro';
            case MSG_TYPE.WARN:
                return 'mensagem_erro';
            case MSG_TYPE.INFO:
                return 'mensagem_info';
            default:
                throw 'Tipo de mensagem não parametrizado: ' + msgType;
            }
        }
        
    }

})(angular);