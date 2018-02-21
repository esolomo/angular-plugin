<?php
error_reporting( E_ALL ); 
ini_set( 'display_errors', 1 ); 
?><!DOCTYPE html>
<html ng-app="dnsApp" ng-cloak>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-resource/1.6.9/angular-resource.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.6.9/angular-sanitize.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular-animate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.3/angular-ui-router.min.js"></script>
    <script src="http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/js/dns.js"></script>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" async>
    <link rel="stylesheet" href="http://wordpress.betterdevops.co.uk/wp-content/plugins/betterdevops/css/todo.css"></link>
  </head>
  <body>
        <nav class="navbar navbar-inverse navbar-toggleable-md bg-inverse" role="navigation">
        <a class="navbar-brand mr-auto" ui-sref="home">
          <img src="https://angularjs.org/img/angularjs-for-header-only.svg" height="40" alt="Angular.js">
        </a>

        <ul class="nav navbar-nav my-2">
          <li class="nav-item" ui-sref-active="active"><a class="nav-link" ui-sref="home">Home</a></li>
              <li class="nav-item" ui-sref-active="active"><a class="nav-link" ui-sref="weather">Weather</a></li>
        </ul><!--// end .navbar-nav -->
      </nav>
      <div class="container">
        <ui-view/>
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

