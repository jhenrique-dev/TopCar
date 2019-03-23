(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

var app = (function appController(){

    return {

      init : function init(){
        this.openAjaxConnection();
        this.getDataStore();
        this.events();
      },

      setCar : function setCar(){
        var cars = {
         image : $('[data-js="field-image-car"]').get().value,
         brandModel : $('[data-js="field-brand"]').get().value,
         year : $('[data-js="field-year"]').get().value,
         plate : $('[data-js="field-board"]').get().value,
         color :  $('[data-js="field-color"]').get().value
        }
        return cars;
      },

      openAjaxConnection : function openAjaxConnection() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET' , '/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getInfoCompany, false);
      },

      requestOk : function requestOk(){
        return this.readyState === 4 && this.status === 200;
      },

      getDataStore : function getDataStore(){
        var ajax = new XMLHttpRequest();
        ajax.open('GET' , 'http://localhost:3000/car' , true);
        ajax.send();
        ajax.addEventListener('readystatechange' , app.putTableDataStore , false);

      },

      postDataStore : function postDataStore(){
        var car = app.setCar();
        var ajax = new XMLHttpRequest();
        ajax.open('POST' , 'http://localhost:3000/car' , true);
        ajax.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded');
        ajax.send('image='+car.image+'&brandModel='+car.brandModel+'&year='+car.year+'&plate='+car.plate+'&color='+car.color);
        ajax.addEventListener('readystatechange' , function(){
          console.log('Carro cadastrado com sucesso!');
        })
      },

      putTableDataStore : function putTableDataStore(){
        if(this.readyState === 4 && this.status === 200)
          return;
        var cars = JSON.parse(this.responseText);
        var $tbody = $('[data-js="tbody"]').get();
        
        cars.forEach(function(car){
          var $fragment = app.createNewTr(car);
          $tbody.appendChild($fragment);
        });
      },

      deleteDataStore : function deleteDataStore(car){
        var ajax = new XMLHttpRequest();
        ajax.open('DELETE' , 'http://localhost:3000/car' , true);
        ajax.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded');
        ajax.send('plate='+car.plate);
        ajax.addEventListener('readystatechange' , function(){
          console.log('Carro removido com sucesso');
        }, false);
      },
      
      getInfoCompany : function getInfoCompany(){
        if(!app.requestOk)
          return;
          var data = JSON.parse(this.responseText);
          var $companyName = $('[data-js="company-name"]');
          var $companyPhone = $('[data-js="company-phone"]');
          $companyName.get().textContent = data.name;
          $companyPhone.get().textContent = data.phone;
      },

      events : function events(){
        $('[data-js="form-register-car"]').on('submit' , this.setInfoTable);
      },

      setInfoTable : function setInfoTable(e){
        e.preventDefault();
        var car = app.setCar();
        var $tbody = $('[data-js="tbody"]').get();
        $tbody.appendChild(app.createNewTr(car));
        app.postDataStore();
        app.clear();
      },

      createNewTr : function createNewTr(car){

        var $fragment = document.createDocumentFragment();

        var $createTr = document.createElement('tr');
        var $tdImage = document.createElement('td');
        var $tdBrand = document.createElement('td');
        var $tdYear = document.createElement('td');
        var $tdBoard = document.createElement('td');
        var $tdColor = document.createElement('td');
        var $image = document.createElement('img');

        var $tdButtonRemove = document.createElement('td');
        var $buttonRemove = document.createElement('button');
        $tdButtonRemove.appendChild($buttonRemove);
        $buttonRemove.textContent = 'Remover';

        $buttonRemove.addEventListener('click' , function(){
          app.deleteDataStore(car);
          $createTr.parentNode.removeChild($createTr);        
        } , false );

        $image.src = car.image;
        $tdImage.appendChild($image);

        $tdBrand.textContent = car.brandModel;
        $tdYear.textContent = car.year;
        $tdBoard.textContent = car.plate;
        $tdColor.textContent = car.color;

        $createTr.appendChild($tdImage);
        $createTr.appendChild($tdBrand);
        $createTr.appendChild($tdYear);
        $createTr.appendChild($tdBoard);
        $createTr.appendChild($tdColor);
        $createTr.appendChild($tdButtonRemove);

        return $fragment.appendChild($createTr);

      },

      clear : function clear(){
        $('[data-js="field-image-car"]').get().value = '';
        $('[data-js="field-brand"]').get().value = '';
        $('[data-js="field-year"]').get().value = '';
        $('[data-js="field-board"]').get().value = '';
        $('[data-js="field-color"]').get().value = '';
      }
    }



  })();

  app.init();

})(window.DOM);
