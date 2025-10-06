// script.js

let display = document.getElementById('display');
let historyDisplay = document.getElementById('history-display');
let currentInput = '0';
let shouldResetDisplay = false;

// Initialize display on load
document.addEventListener('DOMContentLoaded', updateDisplay);

function updateDisplay() {
    display.value = currentInput;
}

function insert(value) {
    // Reset or clear if the previous operation resulted in an Error, Infinity, or a calculated result
    if (shouldResetDisplay) {
        if ('+-*/'.includes(value) || value === '(') {
             // If the user hits an operator or parenthesis after a result, start the new expression with the result
            shouldResetDisplay = false; 
        } else {
            currentInput = '';
            historyDisplay.textContent = '';
            shouldResetDisplay = false;
        }
    }
    
    // Prevent multiple leading zeros (e.g., '00', '012')
    if (currentInput === '0' && value !== '.' && !'+-*/'.includes(value)) {
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
        historyDisplay.textContent = '';
    }
    
    // If input is not empty and the last char is a digit, insert multiplication (e.g., 5sin(30))
    const lastChar = currentInput.slice(-1);
    if (currentInput !== '0' && /\d/.test(lastChar)) {
        currentInput += '*';
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
        historyDisplay.textContent = '';
    }
    
    let value = constant === 'pi' ? Math.PI.toString() : Math.E.toString();
    
    // If the last character is a number or constant, assume multiplication
    const lastChar = currentInput.slice(-1);
    if (currentInput !== '0' && /\d|\)|\e|π/.test(lastChar)) {
        currentInput += '*';
    }

    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    historyDisplay.textContent = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    // Cannot delete if an error or infinity is displayed
    if (shouldResetDisplay) return;

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    if (shouldResetDisplay || currentInput === 'Error' || currentInput === 'Infinity') return;
    
    // Move current input to history
    historyDisplay.textContent = currentInput;
    
    try {
        // --- Expression Sanitization and Math Conversion ---
        let expression = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        // Regex to find trig functions with arguments (e.g., sin(90))
        // This is crucial: trig functions in JS (Math.sin/cos/tan) use Radians, but calculators often use Degrees.
        // We assume **Radians** for simplicity and standard JS behavior.
        const trigRegex = /(sin|cos|tan)\(([^)]+)\)/g;
        
        // This block handles the trig functions to ensure they are evaluated correctly by eval()
        expression = expression.replace(trigRegex, (match, func, arg) => {
            // Revert back to the original function call syntax for eval()
            return `Math.${func}(${arg})`;
        });
        
        // Handle log (assumed base 10) and square root
        expression = expression
            .replace(/log\(/g, 'Math.log10(') 
            .replace(/sqrt\(/g, 'Math.sqrt(');
        
        // --- Evaluation ---
        let result = eval(expression);
        
        // --- Result Formatting ---
        if (isNaN(result)) {
            currentInput = 'Error';
        } else if (!isFinite(result)) {
            currentInput = 'Infinity';
        } else {
            // Rounding to a reasonable precision (12 significant digits)
            currentInput = parseFloat(result.toPrecision(12)).toString();
        }
        
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        console.error('Calculation Error:', error);
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// --- Keyboard Support ---

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Map keyboard keys to calculator actions/symbols
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', '+': '+', '-': '-', '(': '(', ')': ')',
        '*': '×', // Map * to display symbol ×
        '/': '÷', // Map / to display symbol ÷
        '^': '^' 
    };
    
    if (keyMap[key]) {
        if (key === '*' || key === '/') {
            event.preventDefault(); // Prevent browser shortcuts
        }
        insert(keyMap[key]);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});
