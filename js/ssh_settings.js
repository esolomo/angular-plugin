
// App module
var SshSettingsApp =  angular.module('SshSettingsApp', [
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
      url: '/index.php/api/settings/ssh',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/sshkeys.html',
      controller: 'SShKeysCtrl'
  } );
} );


SshSettingsApp.controller('SShKeysCtrl', function($scope, $http) {
  plugin_url = WP.plugin_url
  var config = {
    params: { 'username' : WP.user_login},
    headers : {'Content-Type' : 'application/json'}
   };

  console.log(JSON.stringify(WP));

  $scope.getSettings = function () {
    $http.get("/backend/api/settings/ssh",  config )
    .then(function(response) {
            if (response.data['status'] === "Success"){
              $scope.settings = response.data['results'];
            }
            else{
              $scope.settings = [] 
            }
        });
  };

  $scope.getSettings();

  $scope.addSSHKey = function(key_name,ssh_user,ssh_key) {
    //$rootScope.modalInstance.close('a');
    $http.post("/backend/api/settings/ssh", {'name':key_name, 'ssh_user':ssh_user, 'ssh_key':ssh_key,'username' : WP.user_login}, { headers : {'Content-Type' : 'application/json'} })
    .then(function(response) {
        console.log("Adding ssh key");
        $('#AddSShKey').modal('hide');
        $scope.getSettings();
        //$rootScope.getSettings()
        //$scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
      });

  };

  $scope.removeSSH_ID = function(name) {
    
      $http.delete("/backend/api/settings/ssh", {"params": {'name':name,'username' : WP.user_login} })
      .then(function(response) {
            //$scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
            $scope.getSettings();
      });
  };

  $scope.createSSH_ID = function(name,ssh_user,ssh_key) {
    
          $http.post("/backend/api/settings/ssh", {'name':name,'ssh_user':ssh_user,'ssh_key':ssh_key,'username' : WP.user_login}, { headers : {'Content-Type' : 'application/json'} })
          .then(function(response) {
               //$scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
               $scope.getSettings();
            });
  };

  $scope.UpdateSSH_User = function(user_id, user) {
          $http.put("/backend/api/settings/ssh", {'name':user_id.name,'ssh_user': user,'ssh_key':user_id.ssh_key,'username' : WP.user_login}, { headers : {'Content-Type' : 'application/json'} })
          .then(function(response) {
               //$scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
               $scope.getSettings();
            });
  };

  $scope.UpdateSSH_Key = function(user_id, key) {
          $http.put("/backend/api/settings/ssh", {'name':user_id.name,'ssh_user':user_id.ssh_user,'ssh_key': key,'username' : WP.user_login}, { headers : {'Content-Type' : 'application/json'} })
          .then(function(response) {
               //$scope.open('app/pages/ui/modals/modalTemplates/SettingsUpdate.html')
               $scope.getSettings();
            });
  };

  $(document.body).on('hidden.bs.modal', function () {
    console.log("Catch hiding event on window");
    $('input[name=keyname]').val("")
    $('input[name=user]').val("")
    $('textarea[name=rsakey]').val("")
  });

});

