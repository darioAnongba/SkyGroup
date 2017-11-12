(function ()
{
  'use strict';

  angular
    .module('app.ui.forms')
    .controller('FormsController', FormsController);

  /** @ngInject */
  function FormsController($http, api)
  {
    var vm = this;

    // Constants
    var defaultUser = function () {
      return {
        name: 'dario',
        departure: 'test'
      }
    };

    var config = {
      headers : {
        'Content-Type': 'application/json'
      }
    };

    // Data
    vm.searchForm = {
      returnDate: new Date(),
      departureDate: new Date(),
      destination: 'Switzerland'
    };
    vm.searchForm.users = [defaultUser(), defaultUser()];
    vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function (state)
    {
      return {abbrev: state};
    });

    api.countries.get(
      {},
      function (response) {
        vm.countries = response.data;
      }
    );

    api.airports.get(
      {},
      function (response) {
        vm.airports = response.data;
      }
    );

    // Methods
    vm.sendForm = sendForm;
    vm.addTraveler = addTraveler;
    vm.removeTraveler = removeTraveler;

    //////////

    /**
     * Send form
     */
    function sendForm()
    {
      console.log(vm.searchForm);

      // You can do an API call here to send the form to your server
      $http.post('http://localhost:8080/suggestion', vm.searchForm, config)
        .then(function(data, status, headers, config) {
          console.log(data);
        }, function (data, status, header, config) {
          console.log(status);
        });
    }

    /**
     * Add a new traveler to the form
     */
    function addTraveler() {
      vm.searchForm.users.push(defaultUser());
    }

    /**
     * Removes last traveler to the form
     */
    function removeTraveler() {
      var length = vm.searchForm.users.length;
      if (length > 2) {
        vm.searchForm.users.splice(length-1);
      }
    }
  }
})();
