let currentInput = '0';
let shouldResetDisplay = false;

function switchMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));
    document.getElementById(mode + '-mode').classList.add('active');
    clearDisplay();
}

function updateDisplay() {
    document.getElementById('display').textContent = currentInput;
}

function appendToDisplay(value) {
    if (shouldResetDisplay) { currentInput = ''; shouldResetDisplay = false; }
    currentInput = (currentInput === '0' && value !== '.') ? value : currentInput + value;
    updateDisplay();
}

function appendFunction(func) {
    if (shouldResetDisplay) { currentInput = ''; shouldResetDisplay = false; }
    currentInput = (currentInput === '0') ? func : currentInput + func;
    updateDisplay();
}

function clearDisplay() { currentInput = '0'; updateDisplay(); }
function clearEntry() { currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0'; updateDisplay(); }

function calculate() {
    try {
        let expr = currentInput.replace(/×/g, '*').replace(/\^/g, '**').replace(/(\d+)!/g, (m,n)=>factorial(parseInt(n)));
        expr = expr.replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(')
                   .replace(/asin\(/g,'Math.asin(').replace(/acos\(/g,'Math.acos(').replace(/atan\(/g,'Math.atan(')
                   .replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/sqrt\(/g,'Math.sqrt(');
        currentInput = eval(expr).toString();
        shouldResetDisplay = true; updateDisplay();
    } catch { currentInput = 'Error'; shouldResetDisplay = true; updateDisplay(); }
}

function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }

function evaluateMathExpression(expression, x) {
    let expr = expression.replace(/x/g, x).replace(/\^/g,'**')
             .replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan')
             .replace(/log/g,'Math.log10').replace(/ln/g,'Math.log').replace(/sqrt/g,'Math.sqrt')
             .replace(/pi/g,'Math.PI').replace(/e/g,'Math.E');
    return eval(expr);
}

// Calculus functions
function calculateDerivative() {
    const func = document.getElementById('function-input').value;
    const xVal = parseFloat(document.getElementById('x-value').value) || 0;
    try {
        const h = 0.0001;
        const derivative = (evaluateMathExpression(func, xVal + h) - evaluateMathExpression(func, xVal - h)) / (2 * h);
        currentInput = `f'(${xVal}) = ${derivative.toFixed(6)}`; updateDisplay();
    } catch { currentInput = 'Error in derivative calculation'; updateDisplay(); }
}

function calculateIntegral() { currentInput = 'Symbolic integration not available'; updateDisplay(); }

function calculateDefiniteIntegral() {
    document.getElementById('integral-bounds').style.display = 'block';
    const func = document.getElementById('function-input').value;
    const a = parseFloat(document.getElementById('lower-bound').value) || 0;
    const b = parseFloat(document.getElementById('upper-bound').value) || 1;
    try {
        const n = 1000, h = (b - a)/n;
        let sum = evaluateMathExpression(func,a) + evaluateMathExpression(func,b);
        for (let i=1;i<n;i++){const x=a+i*h;sum+=(i%2===0?2:4)*evaluateMathExpression(func,x);}
        currentInput = `∫[${a},${b}](${func})dx = ${(h/3*sum).toFixed(6)}`; updateDisplay();
    } catch { currentInput = 'Error in integral calculation'; updateDisplay(); }
}

function evaluateFunction() {
    const func = document.getElementById('function-input').value;
    const xVal = parseFloat(document.getElementById('x-value').value) || 0;
    try { currentInput = `f(${xVal}) = ${evaluateMathExpression(func,xVal)}`; updateDisplay(); }
    catch { currentInput='Error evaluating function'; updateDisplay(); }
}

function findRoots() { currentInput='Root finding: Use numerical methods'; updateDisplay(); }
function plotFunction() { currentInput='Plotting: Feature coming soon'; updateDisplay(); }

document.addEventListener('keydown', function(event){
    const key=event.key;
    if(key>='0'&&key<='9') appendToDisplay(key);
    else if(key=='.') appendToDisplay('.');
    else if('+-*/'.includes(key)) appendToDisplay(key);
    else if(key=='Enter'||key=='='){event.preventDefault(); calculate();}
    else if(key=='Escape'||key=='c'||key=='C') clearDisplay();
    else if(key=='Backspace') clearEntry();
});

           





