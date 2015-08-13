(function (window, FWUtils, undefined) {
    'use strict';
    
    //Permite que o objeto 'window' seja mockado tornando o código testável 
    FWUtils.getWindow = function () {
        return window;
    };

    // remove elementos null de um array
    FWUtils.arrayTrim = function(input){
    	for(var i in input){
    		
    		if (!input[i] || input[i] == '')
    			delete(input[i]);
    	}
    	return input;
    }

    /**
	 * @ngdoc function
	 * @name FWUtils.function:converterData8paraData6
	 * 
	 * @description
	 * Converte o formato de data de <b>"dd/mm/aaaa"</b> para <b>"dd/mm/aa"</b>
	 * 
	 * @param {String} data Data no formato "dd/mm/aaaa"
	 * @return {String} Retorna uma data no formato "dd/mm/aa"
	 */
    FWUtils.converterData8paraData6 = function (d) {
        var dt = this.removerNaoNumericos(d);
        while (dt.length < 8) {
            dt = '0' + dt;
        }
        
        return dt.subString(0, 4) + dt.subString(6);
    };
    
    /**
	 * @ngdoc function
	 * @name FWUtils.function:getUrlParam
	 * 
	 * @description
	 * Obtem um parâmetro existente na url
	 * 
	 * @param {String} param Nome do parâmetro desejado
	 * @return {String} Retorna o valor do parâmetro ou vazio caso não exista
	 */
    FWUtils.getUrlParam = function (param) {
        param = param.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var exp = '[\\?&]' + param + '=([^&#]*)';
        var regexp = new RegExp(exp);
        var results = regexp.exec(FWUtils.getWindow().location.href);
        if (results === null) {
            return '';
        } else {
            return results[1];
        }
    };

    /**
	 * @ngdoc function
	 * @name FWUtils.function:isEmptyObject
	 * 
	 * @description
	 * Verifica se um objeto é vazio.
	 * 
	 * @param {Object} obj Objeto a ser avaliado
	 * @return {Boolean} Retorna <u><i>true</i></u> caso o objeto seja vazio e <u><i>false</i></u> caso não seja vazio.
	 */
    FWUtils.isEmptyObject = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };
    
    //TODO: Testes
    /**
	 * @ngdoc function
	 * @name FWUtils.function:paginar
	 * 
	 * @description
	 * Paginaçao construída pra funcionar com o "ng-table.js"
	 * 
	 * @param {Object} params  Parâmetros para paginação
	 * @param {Object} lista  Lista não paginada
	 * 
	 * @return {Object} Lista paginada
	 * 
	 * @deprecated Esta função será descontinuada na próxima versão do WEB-ESTATICO 
	 */
    FWUtils.paginar = function (params, lista) {
        var inicioPaginacao  = (params.page() - 1) * params.count();
        var terminoPaginacao = params.page() * params.count();
        params.total(lista.length);
        return lista.slice(inicioPaginacao, terminoPaginacao);
    };

    /**
	 * @ngdoc function
	 * @name FWUtils.function:parseInt
	 * 
	 * @description
	 * Converte em inteiro
	 * 
	 * @param {Number} number  Número a ser convertido em inteiro
	 * 
	 * @return {Integer} Número inteiro
	 */
    FWUtils.parseInt = function (number) {
        return parseInt(number, 10);
    };

    /**
	 * @ngdoc function
	 * @name FWUtils.function:pegarVariavelQueryString
	 * 
	 * @description
	 * Retorna o valor de um parâmetro contido em uma queryString
	 * 
	 * @param {String} queryString  QueryString contendo a variável desejada
	 * @param {String} nomeVariavel Nome da variável a ser identificada na queryString
	 * 
	 * @return {String} Retorna o valor caso exista da variável informada
	 * @deprecated Esta função será descontinuada na próxima versão do WEB-ESTATICO 
	 */
    FWUtils.pegarVariavelQueryString = function (queryString, nomeVariavel) {
        //Gera um array se encontrar valores que casem com 'nomeVariavel', por exemplo ['&p_mci=1234']
        var chaveValor = (('&' + queryString + '&').match('&' + nomeVariavel + '=[a-zA-Z0-9\-\/\ \.\,\;\%\+]*'));
        
        //Se chaveValor for definido (será na forma do array acima), pegamos o elemento '0', e damos um split, por exemplo: ['&p_mci=1234'] retorna 1234 
        return (chaveValor ? chaveValor[0].split('=')[1] : undefined);
    };

    /**
	 * @ngdoc function
	 * @name FWUtils.function:range
	 * 
	 * @description
	 * Função utilitária para criação de Array com tamanho fixo.
	 * 
	 * @param {Integer} n  Define o tamanho do array a ser criado
	 * 
	 * @return {Array} Array com tamanho fixo
	 */
    FWUtils.range = function (n) {
        return new Array(n);
    };
    
    /**
	 * @ngdoc function
	 * @name FWUtils.function:removerNaoNumericos
	 * 
	 * @description
	 * Remove caracteres não numéricos em uma string
	 * 
	 * @param {String} s Conteúdo a ser avaliado
	 * 
	 * @return {String} Retorna ums string contendo apenas números.
	 */
    FWUtils.removerNaoNumericos = function (s) {
        return s.toString().trim().replace(/[^\d]/g, '');
    };
    
    /**
	 * @ngdoc function
	 * @name FWUtils.function:resizePortlets
	 * 
	 * @description
	 * Função de redimensionamento da plataforma. Necessária devido ao bug de redimensionamento do GAW.
	 * 
	 */
    FWUtils.resizePortlets = function () {
        setTimeout(function () {
            FWUtils.getWindow().parent.getPortal().resizePortlets();
        }, 1);
    };

    /**
	 * @ngdoc function
	 * @name FWUtils.function:toInteger
	 * 
	 * @description
	 * Remove os caracteres não numéricos convertendo o retorno em inteiro.
	 * 
	 * @param {String} s  Conteúdo a ser analisado pela função
	 * 
	 * @return {Integer} Número inteiro retirado da string
	 */
    FWUtils.toInteger = function (s) {
        return parseInt(this.removerNaoNumericos(s), 10);
    };
    
    /**
	 * @ngdoc function
	 * @name FWUtils.function:insertURLParam
	 * 
	 * @description
	 * Adiciona parâmetros a uma url
	 * 
	 * @param {String} url URL
	 * @param {String} key Chave
	 * @param {String} value Valor
	 * 
	 * @return {String} url
	 */
    FWUtils.insertURLParam = function (url, key, value) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);

        //var kvp = url.search.substr(1).split('&');
        
        //Verifica se a URL informada já possui algum parâmetro
        var kvp = url.split('?')[1];
        
        //Se não possuir, retorna a própria url incluindo '?' e a chave/valor
        if (!kvp) {
            url += '?' + key + '=' + value;
            
        //Se já possuir parametros
        } else {
            kvp = kvp.split('&');
            var i = kvp.length;
            var x;
            while (i--) {
                x = kvp[i].split('=');

                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }
            url = url.split('?')[0] + '?' + kvp.join('&');
        }
        return url;
    }

}(window, window.FWUtils = window.FWUtils || {}));