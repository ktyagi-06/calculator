// script.js

let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
}

function insert(value) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function insertFunction(func) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  
  if (currentInput === '0') {
    currentInput = func + '(';
  } else {
    currentInput += func + '(';
  }
  updateDisplay();
}

function insertConstant(constant) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  
  let value = constant === 'pi' ? Math.PI.toString() : Math.E.toString();
  
  if (currentInput === '0') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '0';
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function calculate() {
  try {
    // Replace display symbols with JavaScript operators and Math functions
    let expression = currentInput
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**') // Power operator
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      // log() in the calculator is typically base 10 (log10), or natural log (log)
      // Using Math.log10 for common scientific calculator interpretation
      .replace(/log\(/g, 'Math.log10(') 
      .replace(/sqrt\(/g, 'Math.sqrt(');

    // Note: Using eval() is functional but carries security risks in production. 
    // For advanced/secure calculators, use a dedicated expression parser.
    let result = eval(expression);
    
    // Handle special cases
    if (isNaN(result)) {
      currentInput = 'Error';
    } else if (!isFinite(result)) {
      currentInput = 'Infinity';
    } else {
      // Round to avoid floating point precision issues (12 significant digits)
      currentInput = parseFloat(result.toPrecision(12)).toString();
    }
    
    shouldResetDisplay = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    shouldResetDisplay = true;
    updateDisplay();
  }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
  const key = event.key;
  
  // Numbers and basic operators
  if (key >= '0' && key <= '9') {
    insert(key);
  } else if (key === '.' || key === '+' || key === '-') {
    insert(key);
  } else if (key === '*') {
    insert('×'); // Insert display symbol for multiplication
  } else if (key === '/') {
    event.preventDefault(); // Prevent browser shortcuts (like quick find)
    insert('÷'); // Insert display symbol for division
  } else if (key === '^') {
    insert('^'); // Insert display symbol for power
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
  } else if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
  } else if (key === '(' || key === ')') {
    insert(key);
  }
});
});

updateDisplay();

