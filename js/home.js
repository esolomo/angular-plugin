/**
 * Home View
 */

// Route
mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'dashboard',
		url: '/dashboard',
		templateUrl: WP.plugin_url + '/views/dashboard.html',
		controller: 'homeCtrl'
	} );
} );

mainApp.config( function( $stateProvider, WP ) {
    $stateProvider.state( {
		name: 'dns',
		url: '/dns',
		templateUrl: WP.plugin_url + '/views/dns.html',
		controller: 'DNSCtrl'
	} );
} );

mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'zones',
		url: '/zones',
		templateUrl: WP.plugin_url + '/views/zones.html',
		controller: 'ZoneCtrl'
	} );
} );

mainApp.config( function( $stateProvider, WP ) {
	$stateProvider.state( {
		name: 'records',
		url: '/records/:zoneId',
		templateUrl: WP.plugin_url + '/views/records.html',
		controller: 'RecordsCtrl'
	} );
} );

// Controller
mainApp.controller( 'homeCtrl', function( $scope, WP) {
    console.log("Printing Data");
    console.log(WP.user_login);    		    
    $scope.username = WP.user_login;
    $scope.operation = "Home Base"    
} );

mainApp.controller( 'DNSCtrl', function( $scope, $http, WP) {
    console.log("Printing Data");
    console.log(WP.user_login);    		    
    $scope.username = WP.user_login;
    $scope.operation = "dns_list";
    $http.get("/backend/api/dns",  { params:  {'username': WP.user_login }, headers : {'Accept' : 'application/json'} } )
        .then(function(response) {
	    if (response.data['status'] === "Success"){
		$scope.records = response.data['results'];
	    }
	    else{
		$scope.records = []
	    }
	    console.log("Records : " + $scope.records.length);
	    console.log("Records : " + JSON.stringify($scope.records));
	});
} );

mainApp.controller( 'RecordsCtrl', function( $scope, $http, $stateParams, WP) {
    console.log("Getting Records Data for $");
    console.log(WP.user_login);    		    
    $scope.username = WP.user_login;
    console.log("Zone Id " +  $stateParams.zoneId);    
    $http.get("/backend/api/dns",  { params:  {'username': WP.user_login,'zone': $stateParams.zoneId}, headers : {'Accept' : 'application/json'} } )
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
} );


mainApp.controller( 'DashBoardCtrl', function( $scope, WP) {
    console.log("Printing Data");
    console.log(WP.user_login);    		    
    $scope.username = WP.user_login;
} );

mainApp.controller( 'ZoneCtrl', function( $scope, WP) {
    console.log("Printing Data");
    console.log(WP.user_login);    		    
    $scope.username = WP.user_login;
} );

