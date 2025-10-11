// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', savedTheme === 'dark');

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Calculator Logic
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('calc-btn')) return;

            e.target.classList.add('button-press');
            setTimeout(() => e.target.classList.remove('button-press'), 150);

            const { action, number, operator } = e.target.dataset;

            if (number !== undefined) this.inputNumber(number);
            else if (action === 'decimal') this.inputDecimal();
            else if (action === 'clear') this.clear();
            else if (action === 'toggle-sign') this.toggleSign();
            else if (action === 'operator') this.inputOperator(operator);
            else if (action === 'equals') this.calculate();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') this.inputNumber(e.key);
            else if (e.key === '.') this.inputDecimal();
            else if (['+', '-', '*', '/'].includes(e.key)) this.inputOperator(e.key);
            else if (e.key === 'Enter' || e.key === '=') this.calculate();
            else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') this.clear();
        });
    }

    updateDisplay() {
        this.display.textContent = this.formatNumber(this.currentInput);
        this.display.classList.add('scale-105');
        setTimeout(() => this.display.classList.remove('scale-105'), 100);
    }

    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0))
            return number.toExponential(6);
        return number.toString();
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === '') this.previousInput = inputValue;
        else if (this.operator) {
            const newValue = this.performCalculation(this.previousInput, inputValue, this.operator);
            this.currentInput = String(newValue);
            this.previousInput = newValue;
            this.updateDisplay();
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    calculate() {
        const inputValue = parseFloat(this.currentInput);
        if (this.previousInput !== '' && this.operator) {
            const newValue = this.performCalculation(this.previousInput, inputValue, this.operator);
            this.currentInput = String(newValue);
            this.previousInput = '';
            this.operator = null;
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    }

    performCalculation(a, b, operator) {
        switch (operator) {
            case '+': return a + b;
           

