﻿    // XMLHttpRequest to pull current question information from the database.
    function getQuestions() {
      client = new XMLHttpRequest();

    client.open('GET','http://developer.cege.ucl.ac.uk:30290/getGeoJSON/quizlet/geom');
      client.onreadystatechange = questionResponse; 
      client.send();
    }
    function questionResponse() {
    if (client.readyState == 4) {
      var questiondata = client.responseText;
      loadquestionlayer(questiondata);
      }
    }


    //Global array defined for proximity funtionality: Proximity.js
    var app_array = [];
    // convert the received data - which is text - to JSON format and add it to the map
    function loadquestionlayer(questiondata) {
      // convert the text received from the server to JSON
      var questionjson = JSON.parse(questiondata);

      // load the geoJSON layer
      var questionlayer = L.geoJson(questionjson,
      {

        //Function that holds each markers question and answers and submission functions. All appears inside leaflet popup. 
        //Hidden values are used for answered() function which compares choosen answer to actual answer. 
        onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.question+'<div> <form id="Qform" style= "text-align:center" onsubmit="return (answered()&& startAnswerUpload());"> <input type="radio" name="answer" id=check1 value="one" checked>'+feature.properties.answerone+ '<br> <input type="radio" name="answer" id=check2 value="two">'+feature.properties.answertwo+ '<br> <input type="radio" name="answer" id=check3 value="three">'+feature.properties.answerthree+ '<br> <input type="radio" name="answer" id=check4 value="four">' + feature.properties.answerfour +'<br> <input id="hidden" type="hidden" name="hidden" value='+feature.properties.correct+'><input id="question" type="hidden" name="question" value="'+feature.properties.question+'"><br /><input type="submit" name="mysubmit" value="Submit"/></form></div>');

  }, 

        // use point to layer to create the points
        pointToLayer: function (feature, latlng)
        {
        quiz_marker = L.marker(latlng, {icon:testMarkerGray});
        app_array.push(quiz_marker);
        return quiz_marker
        
    },
  }).addTo(mymap);
mymap.fitBounds(questionlayer.getBounds()); 
} 

//Function for checking answer features chosen in the popup and giving user information on success. Implemented within the popup.
function answered(){
        var chosen = document.querySelector('input[name="answer"]:checked').value;
        var correct = document.getElementById("hidden").value
        if(chosen==correct){
          alert('Correct Answer, Congratulations!');
          return true;
        }
        else{
          alert('Wrong Answer, Try Again.');
          return true;
        }
      }

//Function for uploading answer information to the database into answer table.
function startAnswerUpload() {
  var question = document.getElementById("question").value;
  var answer = document.querySelector('input[name="answer"]:checked').value;
  var correct = document.getElementById("hidden").value;
  var postString = "question="+question+"&answer="+answer+"&correct="+correct;
  processAnswer(postString);
}

var client;
function processAnswer(postString) {
  client = new XMLHttpRequest();
  client.open('POST','http://developer.cege.ucl.ac.uk:30290/uploadAnswer',true);
  client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  client.onreadystatechange = answerUploaded;
  client.send(postString);
}

// create the code to wait for the response from the data server, and process the response once it is received
function answerUploaded() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
if (client.readyState == 4) {
// change the DIV to show the response
alert("Answer Submitted");
}
}




