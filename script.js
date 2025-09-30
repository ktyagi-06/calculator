let display = document.getElementById("display");
let currentInput = "0";
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
}

function insert(value) {
  if (shouldResetDisplay || currentInput === "0" || currentInput === "Error") {
    currentInput = "";
    shouldResetDisplay = false;
  }
  currentInput += value;
  updateDisplay();
}

function insertFunction(func) {
  if (shouldResetDisplay || currentInput === "0" || currentInput === "Error") {
    currentInput = "";
    shouldResetDisplay = false;
  }
  switch (func) {
    case "sin": currentInput += "sin("; break;
    case "cos": currentInput += "cos("; break;
    case "tan": currentInput += "tan("; break;
    case "sqrt": currentInput += "sqrt("; break;
    case "log": currentInput += "log("; break;
  }
  updateDisplay();
}

function insertConstant(constant) {
  if (shouldResetDisplay || currentInput === "0" || currentInput === "Error") {
    currentInput = "";
    shouldResetDisplay = false;
  }
  switch (constant) {
    case "pi": currentInput += Math.PI.toString(); break;
    case "e": currentInput += Math.E.toString(); break;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = "0";
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay();
}

function calculate() {
  try {
    let expression = currentInput
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/(\d+)\^(\d+)/g, "Math.pow($1,$2)");

    let result = eval(expression);
    if (isNaN(result) || !isFinite(result)) {
      currentInput = "Error";
    } else {
      currentInput = (Math.round(result * 1e9) / 1e9).toString();
    }
    shouldResetDisplay = true;
    updateDisplay();
  } catch {
    currentInput = "Error";
    shouldResetDisplay = true;
    updateDisplay();
  }
}

function factorial() {
  try {
    let num = parseInt(currentInput);
    if (isNaN(num) || num < 0 || num > 170) {
      currentInput = "Error";
      shouldResetDisplay = true;
      updateDisplay();
      return;
    }
    let fact = 1;
    for (let i = 1; i <= num; i++) fact *= i;
    currentInput = fact.toString();
    shouldResetDisplay = true;
    updateDisplay();
  } catch {
    currentInput = "Error";
    shouldResetDisplay = true;
    updateDisplay();
  }
}

// Keyboard Support
document.addEventListener("keydown", function (event) {
  if (!isNaN(event.key) || "+-*/().".includes(event.key)) {
    insert(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    deleteLast();
  } else if (event.key === "Escape" || event.key.toLowerCase() === "c") {
    event.preventDefault();
    clearDisplay();
  }
});

updateDisplay();
