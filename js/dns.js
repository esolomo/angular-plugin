
// App module
var dnsApp = angular.module('dnsApp', [
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
	$locationProvider.html5Mode( true );
	$urlRouterProvider.otherwise( '/not-found/' );
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
		name: 'dns',
		url: '/',
		templateUrl: WP.plugin_url + '/views/dns2.html',
		controller: 'DNSCtrl'
	} );
} );


dnsApp.controller('TodoListController', function() {
    var todoList = this;
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

