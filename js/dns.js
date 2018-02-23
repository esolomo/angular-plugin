
// App module
var dnsApp =  angular.module('dnsApp', [
  'ng',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ngAnimate'
]);

// Third-party support
dnsApp.constant( '_', window._ );
dnsApp.constant( 'WP', window.WP );

// Routing
dnsApp.config( function( $urlRouterProvider, $locationProvider ) {
    $locationProvider.html5Mode( { enabled: true, requireBase: false } );
    $urlRouterProvider.otherwise( '/api/dns' );
} );

// Boot
dnsApp.run( function( $rootScope, _ ) {

    // Log routing errors
    $rootScope.$on( "$stateChangeError", console.error.bind( console, '$stateChangeError' ) );

    // Global lodash
    $rootScope._ = window._;
} );

// Route
dnsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'dashboard',
      url: '/index.php/api/dashboard',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dashboard.html',
      //templateUrl: WP.plugin_url + '/views/dashboard.html',
      controller: 'TodoListController'
  } );
} );

// Route
dnsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'dns',
      url: '/index.php/api/dns',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dns.html',
      controller: 'DNSCtrl'
  } );
} );

// Route
dnsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'dnsapi',
      url: '/api/dns',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dns.html',
      controller: 'DNSCtrl'
  } );
} );

// Route
dnsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'records',
      url: '/api/records/:zoneId',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/records.html',
      controller: 'RecordsCtrl'
  } );
} );

// Route
dnsApp.config( function( $stateProvider) {
  $stateProvider.state( {
      name: 'ftp',
      url: '/api/ftp',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/ftp.html',
      controller: 'FTPCtrl'
  } );
} );


dnsApp.controller('DNSCtrl', function($scope, $http) {
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

dnsApp.controller('RecordsCtrl', function($scope, $http, $stateParams) {
  var todoList = this;
  var config = {
    params: { 'username' : WP.user_login, zone: $stateParams.zoneId},
    headers : {'Content-Type' : 'application/json'}
   };
   $scope.zone = $stateParams.zoneId;
  console.log("Records Controller");
  console.log(JSON.stringify(WP));
  $scope.plugin_url = WP.plugin_url;
  $scope.getZoneDetails = function() {
    $http.get("/backend/api/dns",  { "params": { 'username' : WP.user_login, "zone": $stateParams.zoneId } })
    .then(function(response) {
            $scope.zone = $stateParams.zoneId
            $scope.zone_data = response.data['results']
            $scope.main_zone = response.data['results']['main_zone']
            $scope.zone_a = response.data['results']['A']
            $scope.zone_aaaa = response.data['results']['AAAA']
            $scope.zone_cname = response.data['results']['CNAME']
            $scope.zone_mx = response.data['results']['MX']
            $scope.zone_txt = response.data['results']['TXT']
            $scope.zone_srv = response.data['results']['SRV']
            $scope.zone_spf = response.data['results']['SPF']
            $scope.root_ipv4 = response.data['results']['ROOT_IPv4']
            $scope.root_ipv6 = response.data['results']['ROOT_IPv6']
            $scope.soa = response.data['results']['SOA']
            $scope.ns = response.data['results']['NS']
            $scope.ttl = response.data['results']['TTL']
            $scope.managed_zones = response.data['results']['managed_zones']
            console.log("Zone : " + $scope.zone )
            console.log("SRV length : " + $scope.zone_srv.length )
            console.log("SPF length : " + $scope.zone_spf.length )
        });    
      };

  $scope.getZoneDetails();

  $scope.addRecord = function(type,zone,name,value,ttl,target,port,weight,priority,protocol) {
  
        var data = {'type':type,'zone':zone, username: WP.user_login}
        if (type == 'A' || type == 'AAAA' || type == 'CNAME'){
          data['destination'] = value
          data['ttl'] = ttl
          data['name'] = name
        }
        else if (type == 'TXT' ) {
          data['entry'] = value
          data['name'] = name
        }
        else if (type == 'SPF' ) {
          data['entry'] = value
          data['ttl'] = ttl
          data['name'] = name
        }
        else if (type == 'SRV'){
          data['target'] = target
          data['port'] = port
          data['weight'] = weight
          data['priority'] = priority
          data['protocol'] = protocol
          data['ttl'] = ttl
        }
        else if (type == 'MX'){
          data['priority'] = value
          data['name'] = name
        }
        else if (type == 'managed_zones'){
          data['managed_zones'] = value
          data['name'] = name
        }
        else if (type == 'ROOT_IPv4' || type == 'ROOT_IPv6'){
          data['value'] = value
          data['name'] = name
        }
        else if (type == 'TTL' ){
          data['ttl'] = ttl
          data['name'] = name
        }

        $http.put("/backend/api/dns", data, { headers : {'Content-Type' : 'application/json'} })
        .then(function(response) {
          $scope.getZoneDetails();
        });    
      };

      $scope.addSRV_Record = function(type,zone,target,port,weight,priority,ttl,protocol) {
        
            var data = {'type':type,'zone':zone,'name':target, username: WP.user_login}
            if (type == 'A' || type == 'AAAA' || type == 'CNAME'){
              data['destination'] = value
              data['ttl'] = ttl
            }
            else if (type == 'TXT'){
              data['entry'] = value
            }
            else if (type == 'SRV'){
              data['entry'] = value
            }
            else if (type == 'SPF'){
              data['entry'] = value
            }
            else if (type == 'MX'){
              data['priority'] = value
            }
            else if (type == 'managed_zones'){
              data['managed_zones'] = value
            }
            else if (type == 'ROOT_IPv4' || type == 'ROOT_IPv6'){
              data['value'] = value
            }
            else if (type == 'TTL' ){
              data['ttl'] = ttl
            }
    
            $http.put("/backend/api/dns", data, { headers : {'Content-Type' : 'application/json'} })
            .then(function(response) {
              $scope.getZoneDetails();
            });    
          };
        
  $(document.body).on('hidden.bs.modal', function () {
    console.log("RecordsCtrl Catch hiding event on window");
    $('input[name=AddZone]').val("")
  });

});
