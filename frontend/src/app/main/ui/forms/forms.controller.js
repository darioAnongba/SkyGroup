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
        departure: ''
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
      destination: ''
    };
    vm.searchForm.users = [defaultUser(), defaultUser()];

    api.countries.get(
      {},
      function (response) {
        vm.countries = response.data;
      }
    );

    api.airports.get(
      {},
      function (response) {
        vm.airports = angular.fromJson(response.data);
      }
    );

    // Methods
    vm.sendForm = sendForm;
    vm.addTraveler = addTraveler;
    vm.removeTraveler = removeTraveler;
    vm.querySearchCountries = querySearchCountries;
    vm.querySearchAirports = querySearchAirports;

    //////////

    /**
     * Send form
     */
    function sendForm()
    {

      vm.searchForm.users.forEach(function (part, index, arr) {
        console.log(arr[index].departure);
        arr[index].departure = arr[index].departure.airportId;
      });

      vm.searchForm.destination = vm.searchForm.destination.countryId;

      // You can do an API call here to send the form to your server
      $http.post('http://localhost:8080/suggestion', vm.searchForm, config)
        .then(function(data, status, headers, config) {

          vm.suggestions = [
            {
              destination: 'London',
              currency: 'CHF',
              departureDate: new Date(),
              returnDate: new Date(),
              itineraries: [
                {
                  user: 'Dario',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 100
                  },
                  inLeg: {
                    departureAirport: 'GTW',
                    destinationAirport: 'ZRH',
                    price: 40
                  }
                },
                {
                  user: 'Christophe',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'GTW',
                    price: 20
                  },
                  inLeg: {
                    departureAirport: 'HTW',
                    destinationAirport: 'GVA',
                    price: 50
                  }
                },
                {
                  user: 'Valentin',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 120
                  },
                  inLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 70
                  }
                }
              ]
            },
            {
              destination: 'Liverpool',
              currency: 'CHF',
              departureDate: new Date(),
              returnDate: new Date(),
              itineraries: [
                {
                  user: 'Dario',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 100
                  },
                  inLeg: {
                    departureAirport: 'GTW',
                    destinationAirport: 'ZRH',
                    price: 40
                  }
                },
                {
                  user: 'Christophe',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 20
                  },
                  inLeg: {
                    departureAirport: 'HTW',
                    destinationAirport: 'GVA',
                    price: 50
                  }
                },
                {
                  user: 'Valentin',
                  outgoingLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 120
                  },
                  inLeg: {
                    departureAirport: 'GVA',
                    destinationAirport: 'HTW',
                    price: 70
                  }
                }
              ]
            }
          ]
        }, function (data, status, header, config) {
          console.log(header);
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

    function querySearchCountries(query) {
      return query ? vm.countries.filter( createFilterForCountries(query) ) : vm.countries;
    }

    function querySearchAirports(query) {
      return query ? vm.airports.filter( createFilterForAirports(query) ) : vm.airports;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterForCountries(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (angular.lowercase(item.countryName).indexOf(lowercaseQuery) === 0);
      };
    }

    /**
     * Create filter function for a query string
     */
    function createFilterForAirports(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (angular.lowercase(item.cityName).indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();
