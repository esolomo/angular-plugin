
// App module
var dnsApp =  angular.module('SshSettingsApp', [
  'ng',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ngAnimate',
  'xeditable'
]);

// Third-party support
SshSettingsApp.constant( '_', window._ );
SshSettingsApp.constant( 'WP', window.WP );

// Routing
SshSettingsApp.config( function( $urlRouterProvider, $locationProvider ) {
    $locationProvider.html5Mode( { enabled: true, requireBase: false } );
    $urlRouterProvider.otherwise( '/index.php/api/dashboard' );
} );

// Boot
SshSettingsApp.run( function( $rootScope, _ ) {

    // Log routing errors
    $rootScope.$on( "$stateChangeError", console.error.bind( console, '$stateChangeError' ) );
    // Global lodash
    $rootScope._ = window._;
} );

SshSettingsApp.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);

// Route
SshSettingsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'sshkeys',
      url: '/index.php/api/sshkeys',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/sshkeys.html',
      controller: 'SShKeysCtrl'
  } );
} );


SshSettingsApp.controller('SShKeysCtrl', function($scope, $http) {
  var todoList = this;
  plugin_url = WP.plugin_url
  var config = {
    params: { 'username' : WP.user_login},
    headers : {'Content-Type' : 'application/json'}
   };
  console.log(JSON.stringify(WP));
  $scope.getZones = function (zone) {
    $http.get("/backend/api/dns",  config)
    .then(function(response) {
            if (response.data['status'] === "Success"){
              $scope.records = response.data['results'];
            }
            else{
              $scope.records = [] 
            }
        });
  };
  $scope.getZones()

  $scope.addZone = function (zone) {
    $http.post("/backend/api/dns",  {"name":zone, 'username' : WP.user_login} ,{headers : {'Content-Type' : 'application/json'}})
    .then(function(response) {
      $('#AddZone').modal('hide');
      $scope.getZones();
    })
  };

  $scope.removeZone = function (zone) {
    console.log('In Removing zone');
    $http.delete("/backend/api/dns",  {"params":{"zone":zone, 'username' : WP.user_login, "type":"full"}})
    .then(function(response) {
            $scope.getZones()
        });
  };

  $(document.body).on('hidden.bs.modal', function () {
    console.log("Catch hiding event on window");
    $('input[name=AddZone]').val("")
  });

});

