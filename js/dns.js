
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
dnsApp.config( function( $stateProvider, WP ) {
  $stateProvider.state( {
      name: 'dashboard',
      url: '/index.php/api/dashboard',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dashboard.html',
      //templateUrl: WP.plugin_url + '/views/dashboard.html',
      controller: 'TodoListController'
  } );
} );

// Route
dnsApp.config( function( $stateProvider, WP ) {
  $stateProvider.state( {
      name: 'dns',
      url: '/index.php/api/dns',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dns.html',
      controller: 'DNSCtrl'
  } );
} );

// Route
dnsApp.config( function( $stateProvider, WP ) {
  $stateProvider.state( {
      name: 'dnsapi',
      url: '/api/dns',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dns.html',
      controller: 'TodoListController'
  } );
} );

// Route
dnsApp.config( function( $stateProvider, WP ) {
  $stateProvider.state( {
      name: 'records',
      url: '/api/records/:zoneId',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/records.html',
      controller: 'RecordsCtrl'
  } );
} );

// Route
dnsApp.config( function( $stateProvider, WP) {
  $stateProvider.state( {
      name: 'dns2',
      url: '/',
      templateUrl: 'http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/views/dns.html',
      controller: 'TodoListController'
  } );
} );

dnsApp.controller('TodoListController', function($scope,  $window) {
  var todoList = this;
  console.log("In the controller");
  console.log($window.WP.user_login);
  todoList.todos = [
    {text:'learn AngularJS', done:true},
    {text:'build an AngularJS app', done:false}];

  todoList.addTodo = function() {
    todoList.todos.push({text:todoList.todoText, done:false});
    todoList.todoText = '';
  };

  todoList.remaining = function() {
    var count = 0;
    angular.forEach(todoList.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  todoList.archive = function() {
    var oldTodos = todoList.todos;
    todoList.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) todoList.todos.push(todo);
    });
  };

});

dnsApp.controller('DNSCtrl', function($scope, $http) {
  var todoList = this;
  var config = {
    params: { 'username' : WP.user_login},
    headers : {'Content-Type' : 'application/json'}
   };
  console.log("In the controller 2 Hello World");
  //console.log(JSON.stringify($window.WP));
  console.log(JSON.stringify(WP));
  //console.log(JSON.stringify($stateProvider));
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

  $scope.$on('modal.hide',function(){
    console.log("hide");
});

  $scope.removeZone = function (zone) {
    $http.delete("/backend/api/dns",  {"params":{"zone":zone, 'username' : WP.user_login, "type":"full"}})
    .then(function(response) {
            $scope.getZones()
        });
  };

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
});
