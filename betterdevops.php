<?php
/**
 * Plugin Name: WordPress BetterDevOps Plugin
 * Plugin URI: https://github.com/esolomo/angular-plugin
 * Description: BetterDevOps Plugin
 * Author: Emmanuel Solomo
 * Version: 0.0.1
 * Author URI: 	http://www.betterdevops.co.uk
*/

class ngApp
{	
	public $plugin_dir;
	public $plugin_url;
	public $base_href;
	public $api_route;
	public $versions;


	/**
	 * Setup plugin
	 */
	public function __construct() {

		// General
		$this->plugin_dir = plugin_dir_path( __FILE__ );
		$this->plugin_url = plugins_url( '/', __FILE__ );
		$this->versions = array();

		// Routing
		$this->api_route = '^api/weather/(.*)/?'; // Matches /api/weather/{position}
		$this->base_href = '/' . basename( dirname( __FILE__ ) ) . '/'; // Matches /wordpress-angular-plugin/
		add_filter( 'do_parse_request', array( $this, 'intercept_wp_router' ), 1, 3 );
		add_filter( 'rewrite_rules_array', array( $this, 'rewrite_rules' ) );
		//add_filter( 'rewrite_rules_array', array( $this, 'rewrite_rules2' ) );		
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
		add_action( 'wp_loaded', array( $this, 'flush_rewrites' ) );
		add_action( 'parse_request', array( $this, 'weather_api' ), 1, 3 );
		error_log('Setting up constructor');		
		//add_action('init', 'custom_rewrite_basic');	
	}


	public function log_me($message) {
    	       if (WP_DEBUG === true) {
               	  if (is_array($message) || is_object($message)) {
               	     error_log(print_r($message, true));
               	  }
	       	  else
	       	  {
			error_log($message);
               		}
    	     }
	}


	/**
	 * API Route Handler
	 */
	public function weather_api( $wp ) { 

		//error_log('In weather API');
		//error_log($wp->matched_rule);
		//error_log($this->api_route);
		//error_log($this->base_href);
		
		// Weather API
		if ( $wp->matched_rule !== $this->api_route )
			return;

		// Validate params
		if ( empty( $wp->query_vars['api_position'] ) ) {
			return wp_send_json_error( 'Missing required position parameters.' );
		}

		// Lookup weather forecast
		$position = esc_attr( $wp->query_vars['api_position'] );
		$coords = explode( ':', $position );
		$lat = round( floatval( $coords[0] ), 4 );
		$long = round( floatval( $coords[1] ), 4 );
		$url = "https://api.weather.gov/points/$lat,$long/forecast";
		$response = wp_remote_get( $url );
		$status = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );
		$body = json_decode( $body, true );

		log_me('This is a message for debugging purposes');
		// Errors
		if ( $status !== 200 )
		        error_log('This is a message for debugging purposes');
			wp_send_json_error( $body );

		// Cache control headers, these will cache the 
		// users local weather forecast in the browser
		// for 1 day to reduce API requests.
		$ttl = DAY_IN_SECONDS;
		header( "Cache-Control: public, max-age=$ttl" );
		header( "Last-Modified: $last_modified" );
		log_me('This is a message for debugging purposes');
		error_log('This is a message for debugging purposes');
		//log_me($body);
		// Success response
		wp_send_json_success( $body );
	}


	// flush_rules() if our rules are not yet included
	public function flush_rewrites() {
		$rules = get_option( 'rewrite_rules' );

		if ( ! isset( $rules[ $this->api_route ] ) ) {
			global $wp_rewrite;
			$wp_rewrite->flush_rules();
		}
	}

	public function custom_rewrite_basic() {
	  add_rewrite_rule('^leaf/([0-9]+)/?', 'index.php?page_id=$matches[1]', 'top');
	}
	
	// Add rule for /api/weather/{position}
	public function rewrite_rules( $rules ) {
		$rules[ $this->api_route ] = 'index.php?api_position=$matches[1]';
		return $rules;
	}

	// Adding the id var so that WP recognizes it
	public function query_vars( $vars ) {
		array_push( $vars, 'api_position' );
		return $vars;
	}


	/**
	 * Auto-version Assets
	 */
	public function auto_version_file( $path_to_file ) {
		$file = $this->plugin_dir . $path_to_file;
		if ( ! file_exists( $file ) ) return false;

		$mtime = filemtime( $file );
		$url = $this->plugin_url . $path_to_file . '?v=' . $mtime;

		// Store for Last-Modified headers
		array_push( $this->versions, $mtime );

		return $url;
	}


	/**
	 * Intercept WP Router
	 *
	 * Intercept WordPress rewrites and serve a 
	 * static HTML page for our angular.js app.
	 */
	public function intercept_wp_router( $continue, WP $wp, $extra_query_vars ) {
		// Conditions for url path
		error_log('url_path:');
		$angular_dashboard = "/index.php/api/dashboard";
		$angular_dns = "/index.php/api/dns";
		$angular_ftp = "/index.php/api/ftp";		
		$angular_zones = "/index.php/api/zones";
		error_log($_SERVER['REQUEST_URI']);
		$url_match_dashboard = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $angular_dashboard ) ) === $angular_dashboard );
		$url_match_dns = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $angular_dns ) ) === $angular_dns );
		$url_match_ftp = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $angular_ftp ) ) === $angular_ftp );		
		$url_match_zones = ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $angular_zones ) ) === $angular_zones );		
		error_log($url_match_dashboard);
		$base_index = 'views/index.php';
		if ($url_match_dashboard)
		{
			error_log("Match dashboard");
			$this->base_href = $angular_dashboard ;
			$base_index = 'views/dashboard.php';
		}
		elseif ($url_match_dns)
		{
			error_log("Match dns");
			$this->base_href = $angular_dns ;
			$base_index = 'views/dns.php';		
		}
		elseif ($url_match_ftp)
		{
			error_log("Match zones");
			$this->base_href = $angular_ftp ;
			$base_index = 'views/ftp.php';						
		}		
		else{
		        error_log("Does not Match");		
			return $continue;
		}
		// Vars for index view
		error_log('Path Match ?');
		$main_js = $this->auto_version_file( 'dist/js/main.js' );
		$main_css = $this->auto_version_file( 'dist/css/main.css' );
		$plugin_url = $this->plugin_url;
		$current_user = wp_get_current_user();
		$user_name = $current_user->user_login;
		error_log('Current Username : ');		
		error_log($user_name);
		$user_login = $current_user->user_email;
		error_log($user_login);		
		$base_href = $this->base_href;
		$page_title = 'BetterDevOps DashBoard';

		// Browser caching for our main template
		$ttl = DAY_IN_SECONDS;
		header( "Cache-Control: public, max-age=$ttl" );

		// Load index view
		include_once( $this->plugin_dir . $base_index );
		exit;
		//}
	}

} // class ngApp

new ngApp();
