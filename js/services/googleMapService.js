googleMapsApp.factory("googleMapService", function(userFiguresService) { 
    // variables (private)
    var map, selectedPolygon, drawingProcess;

    var figId = 0;

    var mapOptions = {
        disableDefaultUI: true,
        zoom: 19,
        center: {lat: 39.537634, lng: -95.145232},
        mapTypeId: google.maps.MapTypeId.HYBRID
    }

    var polygonOptions = {
        strokeColor: "#0000FF",
        strokeOpacity: 0.4, // border line opacity
        strokeWeight: 0,    // border line width
        fillColor: "#0000FF",
        fillOpacity: 0.4,
        editable: true
    }

    var drawingPolygon = {
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false, // hide drawing panel
        polygonOptions: polygonOptions,
        map: undefined
    }


    // functions (private)
    function clearSelection () {
        if (selectedPolygon) {
            selectedPolygon.setEditable(false);
            selectedPolygon = null;
        }
    }

    function setSelection(polygon) {
      clearSelection();
      polygon.setEditable(true);
      selectedPolygon = polygon;
    }


    // methods (publick)
    function setMapCenter (lat, lng) {
        if (lat && lng) {
            mapOptions.center.lat = lat;
            mapOptions.center.lng = lng;
        }
    }
    
    function createMap (lat, lng) {
        var mapContainer = document.getElementById('map');
        if (lat) mapOptions.center.lat = lat;
        if (lng) mapOptions.center.lng = lng;

        map = new google.maps.Map(mapContainer, mapOptions);
        map.addListener('click', clearSelection);
    }

    function zoomPlus () {
        map.setZoom(map.zoom + 1); // max zoom 20
    }

    function zoomMinus () {
        map.setZoom(map.zoom - 1); // min zoom 0
    }

    function createPolygon (fillColor) {
        if (!drawingProcess) { // prevent new drawing while old drawing continues
            drawingProcess = true;
            drawingPolygon.map = map;
            if (fillColor) polygonOptions.fillColor = fillColor;
            clearSelection();

            var polygon = new google.maps.drawing
                              .DrawingManager(drawingPolygon);

            polygon.addListener('overlaycomplete', function (evnt) {
                drawingProcess = false;
                this.setDrawingMode(null);
                selectedPolygon = evnt.overlay; // overlay is a new poligon

                selectedPolygon.id = "id" + figId++;
                userFiguresService.addPoligonToBase(selectedPolygon);

                selectedPolygon.addListener('click', function () {
                    setSelection(evnt.overlay);
                });
            });
        }
    }
    
    function polygonAutocreation (userFigures) {
        function selectPolygon (polygon) {
            return function () {
                setSelection(polygon);
            }
        }

        for (var fig in userFigures) { 
            polygonOptions.strokeColor = userFigures[fig].color;
            polygonOptions.fillColor = userFigures[fig].color;
            polygonOptions.paths = userFigures[fig].points;
            polygonOptions.editable = false;

            var newUserFigure = new google.maps.Polygon(polygonOptions);
            newUserFigure.setMap(map);
  
            newUserFigure.id = "id" + figId++;
            userFiguresService.addPoligonToBase(newUserFigure);

            newUserFigure.addListener('click', selectPolygon(newUserFigure));
        }

        delete polygonOptions.paths;
        polygonOptions.editable = true;
        polygonOptions.strokeColor = "#0000FF";
        polygonOptions.fillColor = "#0000FF";
    }

    function deletePolygon () { 
        if (selectedPolygon) {
            userFiguresService.delPoligonFromBase(selectedPolygon);
            selectedPolygon.setMap(null);
            clearSelection();
        }
    }

    function goToPoint (latLng) {
        if (latLng) {
            map.panTo(latLng);
            map.setZoom(15);
        }
    }


    return {
        setMapCenter: setMapCenter,
        createMap: createMap,
        createPolygon: createPolygon,
        deletePolygon: deletePolygon,
        goToPoint: goToPoint,
        polygonAutocreation: polygonAutocreation,
        zoomPlus: zoomPlus,
        zoomMinus: zoomMinus
    }
});
