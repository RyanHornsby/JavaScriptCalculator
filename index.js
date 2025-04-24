// Updates the screen display when a number is pressed
function numberChanged(numberPressed) {    
    let screenValue = document.getElementById("screenValue");
    // If their last action was clicking equals, typing starts afresh instead of editing the shown number
    if (newEquation == true) {
        newEquation = false;
        screenValue.textContent = "";
    }
    // If the current value on screen is 0, or an action has been presed, set it to blank so I can concatenate properly
    if (["plus", "minus", "divide", "times", "0", "ERR: TOO BIG", "Infinity"].includes(screenValue.textContent)) {
        screenValue.textContent = "";
    }
    // Deletes latest number if they press backspace
    if (numberPressed == "Backspace") {
        screenValue.textContent = screenValue.textContent.slice(0, -1);
        // Handles pressing backspace when no number available or if it's only a minus symbol
        if (screenValue.textContent.length == 0 || screenValue.textContent == "-") {
            screenValue.textContent = 0;
        }
        return "Backspace pressed";
    }
    // Prevents them from typing multiple full stops. Also adds in a 0 if it's just a decimal point
    if (numberPressed == ".") {
        if (screenValue.textContent == "") {
            screenValue.textContent = "0.";
            return "Added a leading zero."
        }
        if (screenValue.textContent.includes(".")) {
            return "Already has a decimal point."
        }
    }
    // Don't let the number ever be longer than 9 characters
    if ((Math.abs(screenValue.textContent).length == 9 && !screenValue.textContent.includes(".")) || Math.abs(screenValue.textContent).length == 10) {
        return "Number too long";
    }
    // Whatever number they click, concatenate it to the current number
    screenValue.textContent += numberPressed;
}

// Runs the relevant command when an action button is pressed
// I declare the variables outside the function so I can reference them in the global scope
let operation = null;
let number1 = null;
function instructionGiven(buttonPressed) {
    operation = buttonPressed;
    // Handles if they press multiple operations in a row
    if (!["plus", "minus", "divide", "times", "ERR: TOO BIG", "Infinity"].includes(screenValue.textContent)) {
        number1 = screenValue.textContent;
    }
    screenValue.textContent = buttonPressed;
}

let number2 = null;
let newEquation = false;
// Runs the calculation when equals is pressed
function equalsPressed(number1, operation) {
    // Handles if any of the values are null (pressing enter with nothing to calculate)
    if ([number1, operation].some(param => param === null)) {
        return "No changes made."
    }
    // Handles if they press equals without entering a second number    
    if (["plus", "minus", "divide", "times", "ERR: TOO BIG", "Infinity"].includes(screenValue.textContent)) {
        screenValue.textContent = number1;
        return "No changes made."
    }
    number2 = screenValue.textContent;
    // Runs the maths
    result = calculator(number1, operation, number2);
    // If it's more than 9 digits long, don't display it. Rounds decimals to fit within 9s.f.
    if (String(result).includes(".")) {
        // If it starts with a 0, round to 8 as it doesn't auto count that
        if (String(Math.abs(result))[0] == "0") {
            result = Number(parseFloat(result.toFixed(8)).toPrecision(8));
        }
        else {
            result = Number(parseFloat(result.toFixed(9)).toPrecision(9));
        }
    }
    // Show an error message if it's too big for the display. Does abs to ignore minus
    if ((String(Math.abs(result)).length > 9 && !String(Math.abs(result)).includes(".")) || String(Math.abs(result)).length > 10 ) {
        screenValue.textContent = "ERR: TOO BIG"
    }
    else {
        console.log(`Result: ${result}`);
        screenValue.textContent = result;
    }
    // Resets values. If they press equals again immediately, it will do nothing
    resetter();
}

// Does the actual calculations 
function calculator(number1, operation, number2) {
    // Converts the string to float
    number1 = parseFloat(number1);
    number2 = parseFloat(number2);
    console.log(`Number 1: ${number1}, Operation: ${operation}, Number 2: ${number2}`)

    // Runs the calculation
    switch (operation) {
        case "plus":
            return number1 + number2;
        case "minus":
            return number1 - number2;
        case "times": 
            return number1 * number2;
        case "divide":
            // I was gonna add in protection for dividing by 0, but it auto sets to infinity lol
            return number1 / number2;
    }
}

// Toggles minus in the input
function toggleMinus() {
    let screenValue = document.getElementById("screenValue");
    // Doesn't add a minus unless it's a real input. Including 0 because otherwise you can get -infinity etc and I cba with that
    if (["plus", "minus", "divide", "times", "ERR: TOO BIG", "Infinity", "0"].includes(screenValue.textContent)) {
        return "No sign added."
    }
    if (screenValue.textContent[0] == "-") {
        screenValue.textContent = screenValue.textContent.slice(1);
    }
    else {
        screenValue.textContent = "-" + screenValue.textContent;
    }
}

// Resets values
function resetter() {
    number1 = null;
    operation = null;
    number2 = "";
    newEquation = true;
}

// More powerful resetter for when they press AC
function allClear(callback) {
    let screenValue = document.getElementById("screenValue");
    screenValue.textContent = "0";
    callback();
}

// Upon initialisation, run an IIFE that does an animation for the calculator turning on
(() => {
    document.getElementById("calculatorScreen").classList.add("turnOn1");
    list = ["R", "Y", "A", "N", " ", "H", "O", "R", "N", "S", "B", "Y", "!"];
    setTimeout(function() {list.forEach((listItem, index) => setTimeout(function() {document.getElementById("screenValue").textContent += listItem}, index*150))}, 1500);
    setTimeout(function() {document.getElementById("calculatorScreen").classList.remove("turnOn1"); document.getElementById("calculatorScreen").classList.add("turnOn2")}, 3450);
    setTimeout(function() {document.getElementById("calculatorScreen").classList.remove("turnOn2"); document.getElementById("screenValue").textContent = "0"; document.querySelectorAll("button").forEach((button) => button.disabled = false)}, 4950);
})();