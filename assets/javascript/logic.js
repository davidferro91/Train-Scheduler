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

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
});
// Generating data on initial page load.

// Regenerating the data every 1 seconds.
setInterval(generateData, 1000);

function generateData () {
  console.log("function running");
  $("#train-info").empty();
  database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {
    var dataName;
    var dataDestination;
    var dataTime;
    var dataFrequency = 0;
    var nextArrival;
    var minutesAway = 0;

    var trainRow = $("<tr>");

    //Adding the data from Firebase to the columns.
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
    dataTime = snapshot.val().initialTime;
    //Doing the time calculations using moment.js.
    var dataTimeConverted = moment(dataTime, "HH:mm").subtract(1, "weeks");
    var differenceInTime = moment().diff(moment(dataTimeConverted), "minutes");
    var timeRemainder = differenceInTime % dataFrequency;
    minutesAway = dataFrequency - timeRemainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    nextCol.text(moment(nextArrival).format("LT"));
    var minCol = $("<td>");
    minCol.text(minutesAway);

    //Appending the columns to the table.
    trainRow.append(nameCol);
    trainRow.append(destCol);
    trainRow.append(freqCol);
    trainRow.append(nextCol);
    trainRow.append(minCol);
    $("#train-info").append(trainRow);
  });
}
