var REST_API_URL="API/get_list.php";
var app=new angular.module("demo",['ngMessages']);

app.run(function($log){
    $log.info("Application is ready to work");
})

app.directive("graph", function(http,$timeout){
  return {
      scope:{
        data:'='
      },
      link: function(scope,ele,atts){
        console.log(http.graph(scope.data));
      //  ele.highcharts(http.graph(scope.data));
      console.log(atts.id);
      $timeout(function(){var chart = new Highcharts.Chart(http.graph(scope.data,atts.id));
        },100);
      }
  }
})
app.controller("formApp", function($scope,http,  $timeout){
  var self=$scope;
  self.data={};
  self.graph={};
  self.graph["months"]=["jul","aug","sep","oct","nov","dec"];

  self.graph["info"]=[
    {"title":"Total projects","view":"3700"},
    {"title":"Completed projects","view":"900"},
    {"title":"Running projects","view":"1700"}];
  //  console.log(http.storageView("graph"));
  if(http.storageView("graph")){
    self.graph["percentage"]= http.storageView("graph");
  }

  $timeout(function(){
        Highcharts.chart('chart0',http.graph(10));
    //  Highcharts.Chart(http.graph(10,"chart0"));
},500);

//var chart = new Highcharts.Chart(http.graph(10,"chart0"));
     //{
  //     chart: {
  //         renderTo: 'my-chart'
  //     },
  //
  //     xAxis: {
  //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //     },
  //
  //     series: [{
  //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  //     }]
  //
  // });


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
    services.graph=function(data){
      var config = {
       'chart': {
           'type': 'solidgauge'
       },
       'title': null,
       'tooltip': {
           'enabled': false
       },
       'pane': {
         'center': ['50%', '50%'],
         'size': '200px',
         'startAngle': 0,
         'endAngle': 360,
         'background': {
           'backgroundColor': '#EEE',
           'innerRadius': '90%',
           'outerRadius': '100%',
           'borderWidth': 0
         }
       },

       'yAxis': {
         'min': 0,
         'max': 100,
         'labels': {
           'enabled': false
         },

         'lineWidth': 0,
         'minorTickInterval': null,
         'tickPixelInterval': 400,
         'tickWidth': 0
       },

       'plotOptions': {
           'solidgauge': {
               'innerRadius': '90%'
           }
       },

       'series': [{
           'name': 'Speed',
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
