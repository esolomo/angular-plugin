<?php
error_reporting( E_ALL ); 
ini_set( 'display_errors', 1 ); 
?><!DOCTYPE html>
<html ng-app="dnsApp">
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <script src="http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/js/dns.js"></script>
    <link rel="stylesheet" href="http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/css/todo.css">
  </head>
  <body>
    <h2>DNS</h2>
    <div ng-controller="TodoListController as todoList">
      <span>{{todoList.remaining()}} of {{todoList.todos.length}} remaining</span>
      [ <a href="" ng-click="todoList.archive()">archive</a> ]
      <ul class="unstyled">
        <li ng-repeat="todo in todoList.todos">
          <label class="checkbox">
            <input type="checkbox" ng-model="todo.done">
            <span class="done-{{todo.done}}">{{todo.text}}</span>
          </label>
        </li>
      </ul>
      <form ng-submit="todoList.addTodo()">
        <input type="text" ng-model="todoList.todoText"  size="30"
               placeholder="add new todo here">
        <input class="btn-primary" type="submit" value="add">
      </form>
    </div>
    <script>	
    window.WP = {
    	      	plugin_url: "<?php echo $plugin_url; ?>",
		user_login: "<?php echo $user_login; ?>",
		user_name: "<?php echo $user_name; ?>"	     	
	}
    </script>    
  </body>
</html>

