window.login_lib = {};
login_lib.value = 'noauth';

window.protocol_lib = {};
protocol_lib.value = [];

mapboxgl.accessToken = 'insert your mapbox token here';
var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [20.450913,44.818739], 
    zoom: 13.5,
    container: 'map',
    antialias: true 
});

/* mapboxgl.accessToken = '';
if ("geolocation" in navigator) { 
    navigator.geolocation.getCurrentPosition(position => { 
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mmapbox://styles/mapbox/streets-v10',
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14,
          antialias: true
        });
    }); 
} else {
    var map = new mapboxgl.Map({
        container: 'map', // Specify the container ID
        style: 'mapbox://styles/mapbox/streets-v10', // Specify which map style to use
        center: [20.450913,44.818739], // Specify the starting position
        zoom: 13.7,
        container: 'map',
        antialias: true // Specify the starting zoom
    });
}
*/

map.on('load', function() {
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
    })
    );

    map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05, ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );
});

var url = 'api endpoint goes here';
async function get_all_protocols() {
    login()
    .then(parsed => localStorage.setItem('bearer', parsed.user.token))
    .catch((error) => {
        console.log(error.toString());
    });
    var bearer = localStorage.getItem('bearer');
    console.log(bearer);
    const response = await fetch('api endpoint goes here', {
       method: 'GET',
       mode: 'cors',
       cache: 'no-cache',
       credentials: 'same-origin',
       headers: {
         'Authorization': "Bearer "+ bearer,
         'Content-Type': 'application/json'
       },
       redirect: 'follow',
       referrerPolicy: 'no-referrer',
     });
     return response.json();
    }

window.onload = add_all_protocols();
function add_all_protocols() {
    get_all_protocols()
    .then(parsed => localStorage.setItem('prot_features', JSON.stringify(parsed.features)))
    .catch((error) => {
        console.log(error.toString());
    });
    protocol_lib.value = localStorage.getItem('prot_features');
}
console.log(JSON.parse(protocol_lib.value))


var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

var data_source = {'type': 'Feature','geometry': {'type': 'Polygon','coordinates': [[]]}}
console.log(data_source.geometry.coordinates)

var prot_array_length = JSON.parse(protocol_lib.value).length;
console.log(prot_array_length);
var prot_counter = 0;
map.on('load', function() {
    for (i = 0; i < prot_array_length; i++) {
        data_source.geometry.coordinates = JSON.parse(protocol_lib.value)[i].geometry.coordinates;
        prot_counter = prot_counter + 1;
        source_name = 'maine' + prot_counter;
        map.addSource(source_name, {
            'type': 'geojson',
            'data': data_source
        });
        map.addLayer({
            'id': source_name,
            'type': 'fill',
            'source': source_name,
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.5
            }
        });
    }
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


var speedCanvas = document.getElementById("myChart");

var dataBird = {
    label: "In Ride",
    data: [0, 100, 50, 50, 0],
    lineTension: 0,
    fill: false,
    borderColor: '#ffc82a'
};

var dataLime = {
    label: "Not Deployed",
    data: [20, 100, 100, 0, 0],
    lineTension: 0,
    fill: false,
    borderColor: '#87fd05'
};

var dataJump = {
    label: "Parked",
    data: [0, 50, 50, 25, 0],
    lineTension: 0,
    fill: false,
    borderColor: '#D6393C'
};

var dataOthers = {
    label: "Others",
    data: [0, 0, 10, 25, 50],
    lineTension: 0,
    fill: false,
    borderColor: '#37A2EB'
};

var speedData = {
    labels: ["0900", "1200", "1500", "1800", "2100"],
    datasets: [dataBird, dataLime, dataJump, dataOthers]
};

var chartOptions = {
    legend: {
        display: true,
        position: 'top',
        labels: {
            boxWidth: 80,
            fontColor: "white"
        }
    }
};

var lineChart = new Chart(speedCanvas, {
    type: 'line',
    data: speedData,
    options: {
        chartArea: {
            backgroundColor: 'white'
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#B8BFCE",
                    min: 0,
                    max: 150,
                    stepSize: 50
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "#B8BFCE"
                }
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: true
        }
    }
});


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}


document.getElementById('no_access_checkbox').onclick = function() {
    if ( this.checked ) {
        console.log('checked');
        document.getElementById("selected1").disabled = true;
        document.getElementById("selected2").disabled = true;
        document.getElementById("selected3").disabled = true;
    } else {
        console.log('unchecked');
        document.getElementById("selected1").disabled = false;
        document.getElementById("selected2").disabled = false;
        document.getElementById("selected3").disabled = false;
    }
};

    $("#nextProButton").click(function() {
        var plan_name = document.getElementById("plan_name").value;
        console.log(plan_name);
        document.getElementById("plan_name_header").textContent = plan_name;
        var token = '';
        login()
        .then(parsed => localStorage.setItem('token', parsed.user.token))
        .catch((error) => {
            console.log(error.toString());
        });
        login_lib.value = localStorage.getItem('token');
        //console.log(login_lib.value);
        $("#protMenu").hide();
        $("#ledger-interface").show();
    });

    var counter = 0;

    var protocol_data = '{"type": "protocol","geometry": {"coordinates": [[[-84.38058502972126,33.78169663161206],[-84.38034497201443,33.78169663161206],[-84.38034497201443,33.78187163545368],[-84.38058502972126,33.78187163545368],[-84.38058502972126,33.78169663161206]]],"type": "Polygon"},"properties": {"protocol": {"code": 102,"name": "Midtown","type": "speed_preset","created": "2020-06-24 09:00:00","duration": 500,"plan":35,"speed":8,"fleet":1}}}';

    $("#add-prot-to-ledger-intersection").click(function() {
        var prot_json4 = JSON.parse(protocol_data);
        counter = counter + 1;
        var data = draw.getSelected();
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(data.features[0].geometry.coordinates));
        var prot_coordinates = data.features[0].geometry.coordinates;
        var prot_name = document.getElementById("prot_name_input_int").value;
        $("#container").append('<div class="ledger"><div id="ledger-entry"><h5 id="protocol_name_int"></h5><button id="protocol_type_int" type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false">Intersection Protocol</button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-edit"></i></button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-info-circle"></i></button></div>');
        var counter_string = '' + counter;
        var protocol_name_string = 'protocol_name_int' + counter_string;
        document.getElementById('protocol_name_int').id = protocol_name_string;
        document.getElementById(protocol_name_string).textContent = prot_name;
        prot_json4.properties.protocol.name = prot_name + ' Intersection';
        prot_json4.properties.protocol.type = 'speed_intersection';
        prot_json4.properties.protocol.speed = 5;
        prot_json4.geometry.coordinates = prot_coordinates;
        token = login_lib.value;
        console.log(token);
        console.log(JSON.stringify(prot_json4));
        post_protocol('api endpoint goes here', prot_json4, token);
        alert('Protocol(s) has been added to the database!');
        $("#protocol-config-interface-intersection").hide();
        $("#protocol-config-interface").hide();
        $("#ledger-interface").show();
        $("#sideProtocolMenu").hide();
    });

    $("#add-prot-to-ledger").click(function() {
        var prot_json = JSON.parse(protocol_data);
        var prot_json2 = JSON.parse(protocol_data);
        var prot_json3 = JSON.parse(protocol_data);
        //console.log(JSON.stringify(prot_json.properties.protocol.name));
        counter = counter + 1;
        var data = draw.getSelected();
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(data.features[0].geometry.coordinates));
        var prot_coordinates = data.features[0].geometry.coordinates;
        var prot_name = document.getElementById("prot_name_input").value;
        if (document.getElementById('no_access_checkbox').checked) {
            console.log('works fine');
            $("#container").append('<div class="ledger"><div id="ledger-entry"><h5 id="protocol_name_noacc"></h5><button id="protocol_type_noacc" type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false">No Access Zone</button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-edit"></i></button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-info-circle"></i></button></div>');
            var counter_string = '' + counter;
            var protocol_name_string = 'protocol_name_noacc' + counter_string;
            document.getElementById('protocol_name_noacc').id = protocol_name_string;
            document.getElementById(protocol_name_string).textContent = prot_name;
            prot_json3.properties.protocol.name = prot_name + ' No Access Zone';
            prot_json3.properties.protocol.type = 'speed_preset'; //CHANGE
            prot_json3.properties.protocol.speed = 0;
            prot_json3.geometry.coordinates = prot_coordinates;
            token = login_lib.value;
            console.log(token);
            console.log(JSON.stringify(prot_json3));
            post_protocol('api endpoint goes here', prot_json3, token);
            alert('Protocol(s) has been added to the database!');
        } else {
            var prot_speed = document.getElementById('selected1').textContent;
            var sidewalk_prot_type = document.getElementById('selected2').textContent;
            var parking_prot_type = document.getElementById('selected3').textContent;
            console.log(prot_name);
            console.log(sidewalk_prot_type);
            console.log(parking_prot_type);
            $("#container").append('<div class="ledger"><div id="ledger-entry"><h5 id="protocol_name"></h5><button id="protocol_speed" type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"></button><button id="protocol_type" type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"></button><button id="protocol_type_parking" type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"></button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-edit"></i></button><button type="button" class="btn btn-propLedger btn-secondary" aria-haspopup="true" aria-expanded="false"><i class="fas fa-info-circle"></i></button></div>');
            var counter_string = '' + counter;
            var protocol_name_string = 'protocol_name' + counter_string;
            var protocol_speed_string = 'protocol_speed' + counter_string;
            var protocol_type_string = 'protocol_type' + counter_string;
            var protocol_type_parking_string = 'protocol_type_parking' + counter_string;
            document.getElementById('protocol_name').id = protocol_name_string;
            document.getElementById('protocol_speed').id = protocol_speed_string;
            document.getElementById('protocol_type').id = protocol_type_string;
            document.getElementById('protocol_type_parking').id = protocol_type_parking_string;
            //console.log(document.getElementById(protocol_name_string).id)
            //console.log(document.getElementById(protocol_speed_string).id)
            //console.log(document.getElementById(protocol_type_string).id)
            document.getElementById(protocol_name_string).textContent = prot_name;
            document.getElementById(protocol_speed_string).textContent = prot_speed;
            document.getElementById(protocol_type_string).textContent = sidewalk_prot_type;
            document.getElementById(protocol_type_parking_string).textContent = parking_prot_type;
            //console.log(counter);
            //console.log(protocol_name_string);
            var prot_sidewalk_backend = '';
            var prot_parking_backend = '';
            var speed_backend = 0;

            if (sidewalk_prot_type === "Speed Restricted") {
                prot_sidewalk_backend = 'speed_preset';
            } else if (sidewalk_prot_type === "Sidewalk Pedestrian Density") {
                prot_sidewalk_backend = 'speed_sidewalk_pedestrian_density';
            } else if (sidewalk_prot_type === "Sidewalk Speed Preset") {
                prot_sidewalk_backend = 'speed_sidewalk_preset';
            }else {
                prot_sidewalk_backend = 'na';
            }

            if (parking_prot_type === "Parking Incentive") {
                prot_parking_backend = 'parking_incentive';
            } else if (parking_prot_type === "Parking Restriction") {
                prot_parking_backend = 'parking_restriction';
            } else {
                prot_parking_backend = 'na';
            }

            console.log(prot_sidewalk_backend);
            console.log(prot_parking_backend);

            if (prot_speed === "5 mph") {
                speed_backend = 5;
            } else if (prot_speed === "10 mph") {
                speed_backend = 10;
            } else if (prot_speed === "15 mph") {
                speed_backend = 15;
            }else {
                speed_backend = 0;
            }
            
            console.log(speed_backend);

            prot_json.properties.protocol.name = prot_name + ' Sidewalk';
            prot_json.properties.protocol.type = prot_sidewalk_backend;
            prot_json.properties.protocol.speed = speed_backend;
            prot_json.geometry.coordinates = prot_coordinates;

            prot_json2.properties.protocol.name = prot_name + ' Parking';
            prot_json2.properties.protocol.type = prot_parking_backend;
            prot_json2.properties.protocol.speed = speed_backend;
            prot_json2.geometry.coordinates = prot_coordinates;

            console.log(JSON.stringify(prot_json));
            console.log(JSON.stringify(prot_json2));

            token = login_lib.value;
            console.log(token);
            if (prot_sidewalk_backend !== 'na') {
                post_protocol('api endpoint goes here', prot_json, token);
            }
            if (prot_parking_backend !== 'na') {
                post_protocol('api endpoint goes here', prot_json2, token);
            } 
            alert('Protocol(s) has been added to the database!');     
        }
        
        $("#protocol-config-interface").hide();
        $("#protocol-config-interface-intersection").hide();
        $("#ledger-interface").show();
        $("#sideProtocolMenu").hide();

    });
});

var ctx = document.getElementById("fleetChart");
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['In Ride', 'Not Deployed', 'Others', 'Parked'],
        datasets: [{
            label: '',
            data: [250, 200, 50, 150],
            backgroundColor: [
                '#ffc82a',
                '#87fd05',
                '#37A2EB',
                '#D6393C'
            ],
            borderColor: [
                '#ffc82a',
                '#87fd05',
                '#37A2EB',
                '#D6393C'
            ],
            borderWidth: 1
        }]
    },
    options: {
        //cutoutPercentage: 40,
        responsive: true,
        legend: {
            display: false
        }
    }
});


var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        trash: true
    }
});
map.addControl(draw);

document.getElementById('draw_polygon').onclick = function() {
    draw.changeMode('draw_polygon');

}

document.getElementById('draw_line_string').onclick = function() {
    draw.changeMode('draw_line_string');

}

document.getElementById('draw_point').onclick = function() {
    draw.changeMode('draw_polygon');

}

// $(function() {
//     $('input[name="datetimes"]').daterangepicker({
//       timePicker: true,
//       startDate: moment().startOf('hour'),
//       endDate: moment().startOf('hour').add(32, 'hour'),
//       locale: {
//         format: 'M/DD hh:mm A'
//       }
//     });
//   });

  $('.dropdown2 button').click(function(){
    $('#selected2').text($(this).text());
  });


  $('.dropdown1 button').click(function(){
    $('#selected1').text($(this).text());
  });


  $('.dropdown3 button').click(function(){
    $('#selected3').text($(this).text());
  });

  $('.dropdown4 button').click(function(){
    $('#selected4').text($(this).text());
  });

  $('.dropdown5 button').click(function(){
    $('#selected5').text($(this).text());
  });


  $('.dropdown6 button').click(function(){
    $('#selected6').text($(this).text());
  });

  $('.dropdown7 button').click(function(){
    $('#selected7').text($(this).text());
  });


  async function postLogin(url = 'api endpoint goes here') {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      body: {"uid" : "UID","pass" : "PASS","fleet" :0,"token" : "first_time"} 
    });
    return response.json(); 
  }

  
  async function login(url = 'api endpoint goes here') {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify({"uid" : "UID","pass" : "PASS","fleet" :0,"token" : "first_time"})
    });
    return response.json();
  }

 
  async function post_protocol(url, protocol_json, bearer) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Authorization': "Bearer "+ bearer,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(protocol_json)
    });
    response.json().then(function(parsedJson) {
        console.log(parsedJson);
      });
  }


