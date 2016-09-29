var REST_API_URL="API/get_list.php";
var app=new angular.module("demo",['ngMessages']);

//quick start application
app.run(function($log){
    $log.info("Application is ready to work");
})

//controller
app.controller("formApp", function($scope,http,  $timeout){
  var self=$scope;
  self.data={};
  self.graph={};
  self.graph["months"]=["jul","aug","sep","oct","nov","dec"];

  self.graph["info"]=[
    {"title":"Total projects","view":"3700"},
    {"title":"Completed projects","view":"900"},
    {"title":"Running projects","view":"1700"}];
    self.color=['#72d3fe','#45b7af','#ffc66c']
  if(http.storageView("graph")){
    self.graph["percentage"]= http.storageView("graph");
  }

  //get data via REST API
  http.get_data("self.data", REST_API_URL,function(response){

  self.data=response;
  });

  //submit form application
  self.submitForm= function(form,data){
    if(form.$valid)
    {
        http.storage(data,"graph");
    }
    else {
      angular.forEach(form.$error.required, function(field){
        field.$dirty=true;
      })
    }
  }
});

//factory services
app.factory('http',['$http', '$timeout','$templateCache',
	function($http, $timeout,$templateCache){
		var services={}
		services.get_data=function(data,url,callback){
			 $timeout(function(){
			 	//using http request here
			 	$http({
					method:"POST",
					url:url,
					data:data,
					cache: $templateCache
				}).then(function(response){
      			callback(response.data)

				})

      }, 200);


		};
    services.storage=function(data,key){
      var data=data;
      var key=key;
      if(data){
        sessionStorage[key]=JSON.stringify(data);
        return JSON.parse(sessionStorage[key]);
      }
    }
    services.storageView=function(key){

      var key=key;
      if(key){
          if(sessionStorage[key]){
              return JSON.parse(sessionStorage[key]);
        }
      }
    }
    services.graph=function(data,color){
      var config = {
       'chart': {
          'type': 'solidgauge',
          'backgroundColor':'transparent',
       },

       'pane': {
         'background': {
           'backgroundColor': 'white',
           'innerRadius': '90%',
           'outerRadius': '100%',
           'borderWidth': 0
         }
       },

       'yAxis': {
          'stops': [[0.1, color] ],
         'min': 0,
         'max': 100,
         'labels': {   'enabled': false },
         'lineWidth': 0, 'minorTickInterval': null,'tickPixelInterval': 400, 'tickWidth': 0
       },

      'plotOptions': { 'solidgauge': { 'innerRadius': '90%'}},
       credits: { enabled: false},
       'series': [{
           'data': [data],
              'dataLabels': {
               'enabled': false
           }
       }]
   };
   return config;

    }
		return services;
}]);

app.directive('hcChart', function (http) {
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        data: '=',
                        color:'='
                    },
                    link: function (scope, element) {

                        Highcharts.chart(element[0], http.graph(scope.data,scope.color));
                    }
                };
            })
