var config = {
    //apiKey: "apiKey goes here"
    
    authDomain: "train-scheduler-application.firebaseapp.com",
    databaseURL: "https://train-scheduler-application.firebaseio.com",
    projectId: "train-scheduler-application",
    storageBucket: "train-scheduler-application.appspot.com",
    messagingSenderId: "813096377598"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var trainName = "";
  var trainDestination = "";
  var firstTime = "";
  var trainFrequency = 0;
  var timeFormat = "HH:mm";

  $("#submit-button").on("click", function(event) {
    event.preventDefault();
    trainName = $("#train-name").val().trim();
    trainDestination = $("#destination").val().trim();
    firstTime = $("#first-time").val().trim();
    trainFrequency = $("#frequency").val().trim();

    database.ref().push({
        name: trainName,
        destination: trainDestination,
        initialTime: firstTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  });

  database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {
    var dataName;
    var dataDestination;
    var dataTime;
    var dataFrequency = 0;
    var nextArrival;
    var minutesAway = 0;

    var trainRow = $("<tr>");
    var nameCol = $("<td>");
    dataName = snapshot.val().name;
    nameCol.text(dataName);
    var destCol = $("<td>");
    dataDestination = snapshot.val().destination;
    destCol.text(dataDestination);
    var freqCol = $("<td>");
    dataFrequency = snapshot.val().frequency;
    freqCol.text(dataFrequency);
    var nextCol = $("<td>");

    
    nextCol.text(nextArrival);
    var minCol = $("<td>");
    
    minCol.text(minutesAway);
    trainRow.append(nameCol);
    trainRow.append(destCol);
    trainRow.append(freqCol);
    trainRow.append(nextCol);
    trainRow.append(minCol);
    $("#train-info").append(trainRow);
});
