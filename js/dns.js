
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

dnsApp.controller('DNSCtrl', function($scope) {
  var todoList = this;
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

});
