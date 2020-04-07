myApp.controller('mapCtrl', function($location, constants, $routeParams) {
    var vm = this;
    vm.deviceKey = null;

    vm.sources = constants.sources;
    vm.icons = constants.infoWindows.icons;
    vm.user = JSON.parse($.cookie('user'));
    vm.go = function(path) {
        $location.path(path)
    }
    
    vm.init = function() {
         if($routeParams && $routeParams.deviceId) {
             vm.deviceKey = $routeParams.deviceId;
             vm.params = {"id":  vm.deviceKey }
             vm.tag = "dashboard_" +  vm.deviceKey;
         }
    }
    
    vm.onSelectAsset = function(data) {
        if(data){
            vm.selectedDevice = data;
            vm.params = {"id": data.assetId}
        }
        if($routeParams && $routeParams.deviceId != data.assetId )
        	$location.path("/map/deviceId/"+data.assetId)
    }
    
    vm.setMarkerIcon = function(data, marker){
        marker.icon =  constants.sources[marker.source]["mapMarker"]
        return marker
    }
});
    
myApp.controller('menuCtrl', function(headerItemsJsonClinic, menuItemsJsonClinic, headerItemsJsonPatient, menuItemsJsonPatient) {
    var vm = this;
   
    vm.user = JSON.parse($.cookie('user'));
    
    
    if(vm.user.groups == "clinic" ||  vm.user.groups.indexOf("clinic") > -1) {
         vm.headerItems = headerItemsJsonClinic;
         vm.menuItems = menuItemsJsonClinic;
    }
    
     if(vm.user.groups == "patient" ||  vm.user.groups.indexOf("patient") > -1) {
         vm.headerItems = headerItemsJsonPatient;
         vm.menuItems = menuItemsJsonPatient;
    }
     
});

myApp.controller('searchDevicesCtrl', function($location, $route, $routeParams) {
    var vm = this;
    
   vm.init = function() {
         if($routeParams && $routeParams.deviceId) {
             vm.selectedDevice = $routeParams.deviceId;
             vm.params = {"id":  vm.deviceKey }
             vm.tag = "dashboard_" +  vm.deviceKey;
         }
        
    }
    vm.listCallback = function(data){
        vm.tripsData = [
            {
                "key" : "all",
                "name" : "All"
            }
        ];
        for(var i = 0; i < data.length; i++) {
            vm.tripsData.push({"key": data[i].id, "name": data[i].id})
        }
        return vm.tripsData;
    }
     
     
     vm.onSelect = function(data){
         if(data){
            vm.selectedDevice = data.originalObject;
            vm.params = {"id": vm.selectedDevice.key}
        }
         
        if(vm.selectedDevice.key == "all") {
            $location.path("/map");
        } else {
            if($routeParams.deviceId)
                $route.updateParams({"deviceId": vm.selectedDevice.key});
        	else 
            	$location.path($route.current.originalPath + "/deviceId/" + vm.selectedDevice.key);
        }
         
        return data;
        
     }
     
});

myApp.controller('notificationCtrl', function(httpClient) {
    var vm = this;
    vm.params = {} 
    httpClient
        .get("app/api/notifications/getSettings", null)
        .then(
        function(data, response) {
            if(data && (data.emails || data.mobiles)){
                vm.emails= [];//data.emails;
                vm.mobiles = []; //data.mobiles;
                for(var i = 0; i < data.emails.length; i++){
                    vm.emails.push({"text":data.emails[i]});
                }
                for(var i = 0; i < data.mobiles.length; i++){
                    vm.mobiles.push({"text":data.mobiles[i]});
                }
            }else{
                vm.emails = [];
                vm.mobiles = [];
            }
        },
        function(err) {
            console.log('ERROR', err);
        });

    vm.buildParams = function(){
        var emailsArray = [];
        var mobilesArray = [];
        for(var i = 0; i < vm.emails.length; i++){
            emailsArray.push(vm.emails[i]["text"]);
        }
        for(var i = 0; i < vm.mobiles.length; i++){
            mobilesArray.push(vm.mobiles[i]["text"]);
        }
        vm.params["emails"] = emailsArray;
        vm.params["mobiles"] = mobilesArray;
    } 

});

myApp.controller('rulesCtrl', function(httpClient, $sce, $timeout,$routeParams) {
    var vm = this;
    var params = {};
    params["scriptName"] = $routeParams.id;
    httpClient
        .get("app/api/rules/getGenericRuleEditor", null)
        .then(
        function(data, response) {
             vm.rulesrc = $sce.trustAsResourceUrl(data);
             $timeout(function() {
               $(".loading-frame").css("display", "none")
               $(".allFrame").css("display","")
            }, 2000);
        },
        function(err) {
            console.log('ERROR');
        });
});

myApp.controller('alertsCtrl', function(httpClient, $routeParams, constants) {
       var vm = this;
       vm.icons = constants.infoWindows.icons;
       vm.user = JSON.parse($.cookie('user'));
       vm.deviceKey = null;
     
       vm.init = function(){
            if($routeParams && $routeParams.deviceId) {
                vm.deviceKey = $routeParams.deviceId;
                vm.params = {"id":  vm.deviceKey }
                vm.tag = "dashboard_" +  vm.deviceKey;
                httpClient.get("app/api/getPatientLatest", vm.params).then(
                function(data, response) {
                    vm.summaryData(data)
                },
                function(err) {
                    console.log('ERROR', error);
                });
             }
        }
		
        vm.formatData = function(data){
            return data;
        }
        
        vm.summaryData = function(data) {
            if(data && data[vm.deviceKey] && data[vm.deviceKey][0] && data[vm.deviceKey][0][0]){
                vm.selectedDevice = data[vm.deviceKey][0][0];
                var selectedDeviceSensors = _.keys(vm.selectedDevice);
            	vm.colDef = constants.alertsGrid;
            }
        }
});
        	

myApp.controller('dashboardCtrl', function($scope,  wsClient, httpClient, $routeParams, constants) {
    var vm = this;
    vm.icons = constants.infoWindows.icons;
    vm.user = JSON.parse($.cookie('user'));
    vm.deviceKey = null;
    vm.gridsterOptions = {
        pushing: true,
		floating: true,
        minRows: 1, // the minimum height of the grid, in rows
        maxRows: 50,
        columns: 6, // the width of the grid, in columns
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        mobileBreakPoint: 1024, // if the screen is not wider that this, remove the grid layout and stack the items
        minColumns: 1,
        resizable: {
            enabled: true
        },
        draggable: {
            enabled: true
        }
    };

    vm.init = function(){
        if($routeParams && $routeParams.deviceId) {
            vm.deviceKey = $routeParams.deviceId;
            vm.params = {"id":  vm.deviceKey }
            vm.tag = "dashboard_" +  vm.deviceKey;
            wsClient.subscribe(vm.tag, vm.consumeData.bind(vm), $scope.$id);  
            httpClient.get("app/api/getPatientLatest", vm.params).then(
                function(data, response) {
                    vm.consumeData(data)
                },
                function(err) {
                    console.log('ERROR', error);
                });
        }
    }


    vm.consumeData = function(data) {
        if(data.latest) {
            data = data.latest
            vm.latest =  data;
        }
        if(data && data[vm.deviceKey] && data[vm.deviceKey][0] && data[vm.deviceKey][0][0]) {
            vm.selectedDevice = data[vm.deviceKey][0][0];
            vm.latest = vm.selectedDevice
            vm.sensors = _.groupBy(vm.selectedDevice.sensors.value, "name")
		 }
    }

    vm.formatDate = function (x) { 
        return moment(x).format("YYYY-MM-DDTHH:mm:ss"); 
    }

    vm.historicalFormatDexcomData = function(data){
       if(data.historical) {
            data = data.historical
        }
       return _.findWhere(data.sensors, {name: "dexcom"}).data
    }  
    
    vm.historicalFormatOmnipodData = function(data){
      if(data.historical) {
            data = data.historical
        }
       return _.findWhere(data.sensors, {name: "omnipod"}).data
    }  

    vm.sensorLatestFormatData = function(data) {
        return  vm.consumeDate(data)
    }
    
    
});




