


const ENTER_KEY_CODE = 13;
const THREE_SECONDS = 3000;


var app = angular.module('myApp', []);

var correctAnswer;

var selectedMode = "Scale Degree";
var modes = ["Scale Degree", "Chord"];

var selectedChordType = "Triads";
var chordTypes = ["Triads", "Tetrads"];

var activeKeys = ["0"];

// initCheckboxes();

initInputsToCorrectState();

app.controller('myCtrl', function($scope, $http) {
	$scope.modeSelection = "Scale Degree";
	$scope.userSelectedKey = "0";

	// $scope.backgroundColor = "#f00";

	$http.get("data.json")
		.then(function(response) {
			console.log(response);
			$scope.data = response.data;

			console.log($scope.data["hues"]);
			$scope.colorOptions = [];
			for(let i = 0; i < $scope.data["hues"].length; i++) {
				$scope.colorOptions.push($scope.data["hues"][i]["answer"]);
			}

			displayQuestion($scope);
		});

	$scope.filterColors = function() {
		return;
	}

	$scope.alterActiveChordType = function(event) {
		console.log(event);
		if(event.target.value.toLowerCase() == "triads") {
			selectedChordType = "Triads";
		} else if(event.target.value.toLowerCase() == "tetrads") {
			selectedChordType = "Tetrads"
		} else if(event.target.value.toLowerCase() == "both") {
			selectedChordType = "Both"
		}

		displayQuestion($scope);
		return;
	}

	$scope.alterActiveMode = function(event) {
		console.log(event);
		if(event.target.value.toLowerCase() == "scale-degree") {
			selectedMode = "Scale Degree";
		} else if(event.target.value.toLowerCase() == "chord") {
			selectedMode = "Chord"
		} else if(event.target.value.toLowerCase() == "both") {
			selectedMode = "Both"
		}

		displayQuestion($scope);
		return;
	}

	$scope.checkAnswer = function(event) {
		if(wasTriggeredByClickOrEnter(event)) {
			if(activeKeys.length > 0) {
				if(answerIsUndefinedOrIncorrect($scope.answer, correctAnswer)) {
					flashResultsIcon("&cross;", "#FF0000");
				} else {
					flashResultsIcon("&#x2713;", "#00FF00");
					displayQuestion($scope);
				}
			} else {
				console.log("WARNING: activeKeys length <= 0");
			}

			$scope.answer = "";
		}
	}

	$scope.alterActiveKeys = function(event) {
		console.log(event);
		var key = event.target.value;
		$scope.userSelectedKey = key;
		var checked = event.target.checked;
		if(checked) {
			if(!activeKeys.includes(key)) {
				activeKeys.push(key);
			}
		} else {
			for(i = 0; i < activeKeys.length; i++) {
				if(activeKeys[i] == key) {
					activeKeys.splice(i, 1);
				}
			}
		}

		displayQuestion($scope);
		console.log(activeKeys);
		return;
	}

	$scope.toggleHelpTable = function() {
		var state = $("#help-btn").prop("value");
		if(state == "Show Help") {
			$("#help-tables-container").show();
			$("#help-btn").prop("value", "Hide Help");
		} else {
			$("#help-tables-container").hide();
			$("#help-btn").prop("value", "Show Help");
		}

		return;
	}

});

function initCheckboxes() {

	// for(let i = 0; i < 12; i += 1) {
		// let label = $("<label></label");
//
		// let checkBox = $("<input></input>").attr(
			// {
				// "type": "checkbox",
				// "value": "",
				// "checked": "true",
				// "ng-click": "alterActiveKeys($event)"
			// }
		// );
//
		// let p = $("<p></p>").text(i.toString());
		// label.append(checkBox);
		// label.append(p);
		// $("#color-options-selection").append(label);
	// }

	return;
}

function flashResultsIcon(iconStr, colorStr) {
	$("#result-icon").stop();
	$("#result-icon").html(iconStr);
	$("#result-icon").css("color", colorStr);
	$("#result-icon").css("opacity", "1");
	$("#result-icon").animate({opacity: 0}, THREE_SECONDS);
	return;
}

function answerIsUndefinedOrIncorrect(answer, correctAnswer) {
	return (answer == undefined) || (answer.toLowerCase() != correctAnswer);
}

function wasTriggeredByClickOrEnter(event) {
	return (event == undefined) || (event.keyCode == ENTER_KEY_CODE);
}

function displayQuestion($scope) {
	console.log("Global Mode: " + selectedMode);

	var currentChordType;
	var rn;
	if(selectedChordType.toLowerCase() == "both") {
		rn = Math.floor(Math.random() * chordTypes.length);
		currentChordType = chordTypes[rn];
	} else {
		currentChordType = selectedChordType;
	}
	console.log("Chord Type: " + currentChordType);

	$scope.chordTypeSelection = currentChordType;

	var currentMode;
	if(selectedMode.toLowerCase() == "both") {
		rn = Math.floor(Math.random() * modes.length);
		currentMode = modes[rn];
	} else {
		currentMode = selectedMode;
	}
	console.log("Mode: " + currentMode);

	$scope.modeSelection = currentMode;

	var length = activeKeys.length;
	if(length > 0) {
		rn = Math.floor(Math.random() * length);
		$scope.keySelection = rn;
		console.log("Key Selection: " + $scope.keySelection);

		$scope.question = $scope.data.hues[$scope.keySelection]["question"].toLowerCase();

		correctAnswer = "";
		if(currentChordType.toLowerCase() == "triads") {
			console.log("chord type is: triads");
			correctAnswer = $scope.data.hues[$scope.keySelection]["answer"].toLowerCase();
		} else if(currentChordType.toLowerCase() == "tetrads") {
			console.log("chord type is: tetrads");
			correctAnswer = $scope.data.tetrads[$scope.keySelection][$scope.question].toLowerCase();
		}

		console.log("Question: " + $scope.question);
		console.log("Answer: " + correctAnswer);
		console.log("");
	} else {
		$scope.keySelection = "";
		$scope.question = "";
	}

	return;
}

function initInputsToCorrectState() {
	$("#chord-type-options input:first").prop("checked", "true");
	$("#mode-options input:first").prop("checked", "true");
	$("#key-options input").prop("checked", "");
	$("#key-options input:first").prop("checked", "true");
	return;
}

