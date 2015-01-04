'use strict';
ngBMap.directive('map', [ function ($compile){
	return {
      restrict: 'E',
	  controller: ['$scope', 'bingCredentials', function($scope, bingCredentials) {
		//this.markers = [];
		this.markers = $scope.markers = [];
		this.mapHtmlEl = null	
		this.map = null;
		var credentials = bingCredentials;
		
		this.exeFunc = function(func, context, args){
			$scope.$parent[func].apply(context, args)
		}

		this.initializeMarkers = function(){
			for (var i=0; i<this.markers.length; i++) {
				var marker = this.markers[i];
				this.map.entities.push(marker);			
			}
		}
		
		this.initializeMap = function(scope, elem, attrs){
				var map_canvas =  document.createElement('div')
				var _thisCtrl = this;
				Microsoft.Maps.loadModule('Microsoft.Maps.Overlays.Style', { callback: function(){
					var def_coords = eval(attrs.center);
					_thisCtrl.map = new Microsoft.Maps.Map(map_canvas, {
						credentials : credentials,
						center		: new Microsoft.Maps.Location(def_coords[0], def_coords[1]),
						
						//mapTypeId	: 'a',
						mapTypeId	: 'a',
						//mapTypeId	: 'be',
						//mapTypeId	: Microsoft.Maps.MapTypeId.Birdseye,
						zoom		: 18,
						showMapTypeSelector : false,
						customizeOverlays	: true,
						showScalebar		: false, 
						useInertia 			: false,
						enableSearchLogo	: false,
						isRotationEnabled 	: false,
						labelOverlay: Microsoft.Maps.LabelOverlay.hidden ,
					});
						_thisCtrl.initializeMarkers()
					}
				});
				Microsoft.Maps.Events.addHandler(_thisCtrl.map, "viewchangeend", function(){
					//alert('map loaded')
				})

				Microsoft.Maps.Events.addHandler(_thisCtrl.map, 'mousewheel', function(e) {
	    			e.handled = true;
	    			return true;
				});
			this.mapHtmlEl = map_canvas;
		}
		this.setCenter = function(position){
			var position = eval(position)
			var _position = new Microsoft.Maps.Location(position[0], position[1])
			if(this.map)
				this.map.setView({center : _position});
		} 
	  }],
	  //scope: true,	
	  scope: {
	  	'center': '@', 
	  },
      link: function(scope, element, attrs, ctrl) {
		console.log('map')
		//var filtered = new parser.filter(attrs);
        //var markerOptions = parser.getOptions(filtered);
         scope.$watch('center', function(center) {
         	console.log('center: '+center)
         	if(center){
        		ctrl.setCenter(center)	
         	}
      	  }, false);
		//var markerEvents = parser.getEvents(scope, filtered);
		
		ctrl.initializeMap(scope, element, attrs)
		element.html(ctrl.mapHtmlEl)	
	  }
	}	
	
}]);

ngBMap.directive('marker', [ function ($compile){
	return {
      restrict: 'E',
	  require: '^map',
	  controllerAs: 'marker',
      link: function(scope, element, attrs, mapController) {
		  console.log('marker init')
		  	var getMarker = function() {

				var lat = attrs.lat
				var lng =  attrs.lng;
				var text = attrs.text;
				var width = attrs.width
				//if(width ) width = 50
				var _typeName = attrs.typeName;
				console.log('typeName: '+_typeName)

				var location = new Microsoft.Maps.Location(lat, lng);

				var _height = 18
				if( typeof(attrs.height) == "string" )
					_height = attrs.height

				var _marker = new Microsoft.Maps.Pushpin(location,{
					text 	   : text,
					typeName   : _typeName,   
					anchor 	   : new Microsoft.Maps.Point(0,0), 
					textOffset : new Microsoft.Maps.Point(0,0),
					width 	   : width,
					height 	   : _height
				});
				if(attrs.onClick){
					var matches = attrs.onClick.match(/([^\(]+)\(([^\)]*)\)/);
                    var funcName = matches[1];
                    //var argsStr = matches[2].replace(/event[ ,]*/,'');    //remove string 'event'
					var argsStr = matches[2]
                    var args = scope.$eval("["+argsStr+"]");
                    var markerListener = function() {
                        console.log('funcName: '+funcName	)
                        console.log('mapController: '+mapController)
                        mapController.exeFunc(funcName, this, args)
                        //$scope.$parent[funcName].apply(this, args)
                        //mapController.scope[funcName].apply(mapController, args);
                        //mapController.scope[funcName].apply(this, args);
                    }
					Microsoft.Maps.Events.addHandler(_marker, 'click',markerListener);
				}
				//map.entities.push(_marker);
				var marker =  _marker;	
				return marker;
			}//end getMarker

			var marker = getMarker();
			mapController.markers.push(marker);
		  //marker1Ctrl.markers.push('cane');
	  }
	}	
	
}]);



