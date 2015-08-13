(function (angular, undefined) {

    'use strict';

    angular.module('fwFilters', ['ngSanitize'])
    
    /**
     * @ngdoc filter
     * @name FWFilters.filter:telefone
     * @function telefone
     * 
     * @description
     * Filtro para tratar telefone
     */
    .filter('telefone', function () {
        return function (tel) {
            if (!tel) {
                return '';
            }

            var ddd = normalizar(tel.ddd || '');
            var ddi = normalizar(tel.ddi || '');
            var telefone = normalizar(tel.telefone || '');
            telefone = formatarNumeroTelefone(telefone || '');
            var area = normalizar(tel.area || '');
            
            function normalizar(valor) {
                return valor.toString().replace(/[^0-9]/g, '').trim();
            }
            
            function formatarNumeroTelefone(nrTel) {
                while (nrTel.length < 8) {
                    nrTel += '0' + nrTel;
                }
                
                //Telefones de 8 dígitos
                if(nrTel.length === 8) {
                    return nrTel.substring(0, 4) + '-'  + nrTel.substring(4, 8);
                    
                //Telefones de 9 dígitos
                } else if(nrTel.length === 9) {
                    return nrTel.substring(0, 5) + '-'  + nrTel.substring(5, 9);
                    
                //Formato de telefone desconhecido
                } else{
                    return nrTel;
                }
            }
            
            function numeroForamatado(ddi, ddd, area, telefone) {
                if (ddi === '55') {
                    return '(' + ddd + ') ' + telefone;
                } else {
                    return ddi + ' (' + area + ') ' + telefone;
                }
            }
            
            return numeroForamatado(ddi, ddd, area, telefone);
        };
    })

    /**
     * @ngdoc filter
     * @name FWFilters.filter:cep
     * @function
     * 
     * @description
     * Filtro de exibição de CEP
     */
    .filter('cep', function () {
        return function (cep) {
            if (!cep) { return ''; }

            var value = cep.toString().trim().replace(/[^\d]/g, '');

            if (value.match(/[^0-9]/)) {
                return cep;
            }
            
            while (cep.length < 8) {
                value = '0' + value;
            }
            
            if (value.length !== 8) {
                return value;
            }
            
            return value.slice(0, 2) + '.' + value.slice(2, 5) + '-' + value.slice(5, 8);
        };
    })

    /**
	 * @ngdoc filter
	 * @name FWFilters.filter:cpf
	 * @function
	 * 
	 * @description
	 * Filtro de exibição de CPF
	 */
    .filter('cpf', function () {
        return function (cpf) {
            if (!cpf) { return ''; }

            var value = cpf.toString().trim().replace(/[^\d]/g, '');

            if (value.match(/[^0-9]/)) {
                return cpf;
            }
            
            while (value.length < 11) {
                value = '0' + value;
            }
            
            if (value.length !== 11) {
                return value;
            }
            
            return value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9, 11);
        };
    })

    /**
	 * @ngdoc filter
	 * @name FWFilters.filter:cnpj
	 * @function
	 * 
	 * @description
	 * Filtro de exibição de CNPJ
	 */
    .filter('cnpj', function () {
        return function (cnpj) {
            if (!cnpj) { return ''; }

            var value = cnpj.toString().trim().replace(/[^\d]/g, '');

            if (value.match(/[^0-9]/)) {
                return cnpj;
            }
            
            while (value.length < 14) {
                value = '0' + value;
            }
            
            if (value.length > 14) {
                return value;
            }
            
            return value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '/' + value.slice(8, 12) + '-' + value.slice(12, 14);
        };
    })

    /**
	 * @ngdoc filter
	 * @name FWFilters.filter:data
	 * @function
	 * 
	 * @description
	 * Filtro de exibição de datas
	 */
    //TODO: Refazer testes com e sem parametro de quantidade de dígitos
    .filter('data', function () {
        return function (data, qtdDigitos) {
            if (!data) { return ''; }

            var value = data.toString().trim().replace(/[^\d]/g, '');

            qtdDigitos = qtdDigitos || 8;
            
            while (value.length < qtdDigitos) {
                value = '0' + value;
            }
            
            //Ocorre quando o tamanho do valor informado tem mais dígitos que o número de dígitos informado
            if (value.length !== qtdDigitos) {
                return value;
            }
            
            return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
        };
    })
    
    /**
	 * @ngdoc filter
	 * @name FWFilters.filter:limitaCaracter
	 * @function
	 * 
	 * @description
	 * Filtro de limitação de caracteres
	 */
    .filter('limitaCaracter', function () {
        return function (texto, nrcaracter) {
            if (!texto) {
                return '';
            }
            return texto.length > nrcaracter ? texto.substring(0, nrcaracter - 3) + '...' : texto;
        };
    })
    
    //TODO: Testes
    .filter('capitalizeName', function () {
        return function (name) {
            // Preposições ignoradas
            var wordsToIgnore = ['da', 'das', 'do', 'dos', 'de'];
            var minLength = 2;

            function getWords(str) {
                return str.match(/\S+\s*/g);
            }

            var words = getWords(name.toLowerCase());
            words.forEach(function (word, i) {
                if (wordsToIgnore.indexOf(word.trim()) === -1 && word.trim().length > minLength) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
            });
            return words.join('');
        };
    })
    
    //TODO: Testes
    .filter('completaZeros', function () {
        return function (valor, tamanhoMinimo) {
            valor = (valor || '0').toString();
            
            while (valor.length < tamanhoMinimo) {
                valor = '0' + valor;
            }
            return valor;
        };
    })
    
    //TODO: Testes
    .filter('valorDefault', function () {
        return function (texto, valorDefault) {
            //Retorna um valor default para um campo se o campo não for preenchido,
            //caso o filtro não receba argumentos, o valor default é '-'
            return texto || (valorDefault || '-');
        };
    })
    
    .filter('formataNumeroDv', function () {
        return function (entrada) {
            if (!entrada) {
                return '';
            }
            
            var numbers = entrada
                .toString()
                .split('')
                .map(function (number) { return parseInt(number, 10); });

            var modulus = numbers.length + 1;

            var multiplied = numbers.map(function (number, index) {
                return number * (modulus - index);
            });

            var mod = multiplied.reduce(function (buffer, number) {
                return buffer + number;
            }) % 11;

            var dv;
            
            if (mod === 0) {
                dv = 0;
            } else if (mod === 1) {
                dv = 'X';
            } else {
                dv = 11 - mod;
            }
            
            return entrada + '-' + dv;
        };
    })
    
    .filter('unsafe', function($sce) {
         return function(val) {
             return $sce.trustAsHtml(val);
         };
     });
})(angular);