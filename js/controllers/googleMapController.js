googleMapsApp.controller('googleMapController', 
    function searchController($scope, googleMapService, userFiguresService, $http){
        // publick
        $scope.delPoligon = googleMapService.deletePolygon;
        $scope.addPoligon = googleMapService.createPolygon;
        $scope.saveAndExit = userFiguresService.getUserFigures;
        $scope.zoomPlus = googleMapService.zoomPlus;
        $scope.zoomMinus = googleMapService.zoomMinus;
        
        
        
        $scope.request = function (searchForm) {
            if($scope.searchline){ 
                var requestStr = "address=" + 
                                 $scope.searchline.split(' ').join('+') +
                                 "&key=AIzaSyC4xAOJBW8LfrvJ01sWPAOC_mob0or8LkM";
                
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?' +
                requestStr).success(function(answ) {
                    if (answ.results[0]) {
                        googleMapService.goToPoint(answ.results[0].geometry.location);
                    }
                });
            }
        }
        
/* set the new map center */
//        googleMapService.setMapCenter(50.451466, 30.462653);


/* create the map when application loaded */
        googleMapService.createMap();


/* automatic polygons adding */        
//        googleMapService.polygonAutocreation({
//            figure0: {
//                color: "#FF0000",
//                points: [
//                    {lat: 39.53771116618221, lng: -95.1462310552597},
//                    {lat: 39.53780735924333, lng: -95.14563292264938},
//                    {lat: 39.53724057911352, lng: -95.14580190181732}
//                ]
//            },
//            figure1: {
//                color: "#0000FF",
//                points: [
//                    {lat: 39.53779116615225, lng: -95.1462310552593},
//                    {lat: 39.53780735924321, lng: -95.14563292264915},
//                    {lat: 39.53724057911311, lng: -95.14580190181707}
//                ]
//            }
//        });
});
