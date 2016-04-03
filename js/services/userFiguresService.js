googleMapsApp.factory("userFiguresService", function() { 
    // variables (private)
    var userFigures = {};


    // methods (publick)
    function addPoligonToBase (polygon) {
        userFigures[polygon.id] = polygon;
    }

    function delPoligonFromBase (polygon) {
        delete userFigures[polygon.id];
    }

    function getUserFigures () {
        var lat, lng, color;
        var userFiguresSaved = {};
        
        var figurePoints = [], figure = 0;
        
        for (var fig in userFigures) { 
            for (var i = 0, l = userFigures[fig].getPath().getLength(); 
                 i < l; i++) {
                lat = userFigures[fig].getPath().getAt(i).lat();
                lng = userFigures[fig].getPath().getAt(i).lng();
                
                figurePoints.push({lat, lng});
            }
            color = userFigures[fig].fillColor;
            userFiguresSaved["figure" + figure++] = {
                color: color,
                points: figurePoints
            };
            figurePoints = [];
        }
        return userFiguresSaved; 
    }
    
    
    return {
        addPoligonToBase: addPoligonToBase,
        delPoligonFromBase: delPoligonFromBase,
        getUserFigures: getUserFigures
    }
});
