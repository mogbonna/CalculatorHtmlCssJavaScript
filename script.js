// Constants
const MAX_INPUT_LENGTH = 15;
const VALID_OPERATORS = ["+", "-", "*", "/"];
const VALID_SPECIAL_CHARS = ["(", ")", "."];

// Access DOM elements of the calculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

let expression = "";
let result = "";

// Input Validation Functions
function isValidCharacter(char) {
  return (
    /[0-9]/.test(char) ||
    VALID_OPERATORS.includes(char) ||
    VALID_SPECIAL_CHARS.includes(char)
  );
}

function validateParentheses(expr) {
  let stack = 0;
  for (let char of expr) {
    if (char === "(") stack++;
    if (char === ")") stack--;
    if (stack < 0) return false;
  }
  return stack === 0;
}

function hasConsecutiveOperators(expr) {
  return /[+\-*/]{2,}/.test(expr);
}

// Enhanced addValue function with validation
function addValue(value) {
  // Check maximum length
  if (expression.length >= MAX_INPUT_LENGTH) {
    showError("Maximum input length reached");
    return;
  }

  // Validate character
  if (!isValidCharacter(value)) {
    showError("Invalid character");
    return;
  }

  // Handle decimal points
  if (value === ".") {
    const lastNumberIndex = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("-"),
      expression.lastIndexOf("*"),
      expression.lastIndexOf("/")
    );
    const lastDecimalIndex = expression.lastIndexOf(".");

    if (lastDecimalIndex > lastNumberIndex) {
      showError("Invalid decimal point placement");
      return;
    }
  }

  // Handle operators
  if (VALID_OPERATORS.includes(value)) {
    if (expression === "" && value !== "-") {
      showError("Expression cannot start with an operator");
      return;
    }
    if (isLastCharOperator() && value !== "-") {
      showError("Cannot have consecutive operators");
      return;
    }
  }

  expression += value;
  updateDisplay();
}

// Enhanced Error Handling
function showError(message) {
  result = `Error: ${message}`;
  updateDisplay();
  setTimeout(() => {
    if (result.startsWith("Error: " + message)) {
      result = "";
      updateDisplay();
    }
  }, 2000);
}

function evaluateExpression() {
  try {
    // Basic validation
    if (expression.trim() === "") {
      throw new Error("Empty expression");
    }

    // Validate characters
    if (!/^[0-9+\-*/().\s]*$/.test(expression)) {
      throw new Error("Invalid characters in expression");
    }

    // Check for invalid decimal usage
    if (/\.\d*\./.test(expression)) {
      throw new Error("Invalid decimal point usage");
    }

    // Check for division by zero
    if (/\/0\b/.test(expression)) {
      throw new Error("Cannot divide by zero");
    }

    // Validate parentheses
    if (!validateParentheses(expression)) {
      throw new Error("Mismatched parentheses");
    }

    // Check for consecutive operators
    if (hasConsecutiveOperators(expression)) {
      throw new Error("Invalid operator sequence");
    }

    const evalResult = Function('"use strict";return (' + expression + ")")();

    if (isNaN(evalResult) || !isFinite(evalResult)) {
      throw new Error("Invalid operation");
    }

    // Format result based on size
    if (Math.abs(evalResult) > 1e15) {
      throw new Error("Result too large");
    }

    return evalResult < 1
      ? parseFloat(evalResult.toFixed(10))
      : parseFloat(evalResult.toFixed(2));
  } catch (error) {
    return error.message;
  }
}

// Keyboard Support
function handleKeyboardInput(event) {
  event.preventDefault();
  const key = event.key;

  // Number keys
  if (/^[0-9]$/.test(key)) {
    addValue(key);
    return;
  }

  // Operator keys
  const operatorMap = {
    "+": "+",
    "-": "-",
    "*": "*",
    x: "*",
    "/": "/",
    Enter: "=",
    "=": "=",
    ".": ".",
    "(": "(",
    ")": ")",
    Backspace: "backspace",
    Delete: "clear",
    Escape: "clear",
  };

  if (key in operatorMap) {
    const action = operatorMap[key];
    switch (action) {
      case "=":
        submit();
        break;
      case "backspace":
        backspace();
        break;
      case "clear":
        clear();
        break;
      default:
        if (!isLastCharOperator() || (action === "-" && expression === "")) {
          addValue(action);
        }
    }
    updateDisplay();
  }
}

// Update existing functions
function updateDisplay() {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function clear() {
  expression = "";
  result = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Event Listeners
inputBox.addEventListener("click", buttonClick);
document.addEventListener("keydown", handleKeyboardInput);

// The rest of your existing calculator functions remain the same...

function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
  expression += result + value;
}

function submit() {
  result = evaluateExpression();
  expression = "";
}

function negate() {
  if (expression === "" && result !== "") {
    result = -result;
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  } else {
    expression = "-" + expression;
  }
}

function percentage() {
  if (expression !== "") {
    result = evaluateExpression();
    expression = "";
    result /= 100;
  } else if (result !== "") {
    result /= 100;
  }
}

function decimal(value) {
  if (!expression.endsWith(".") && !isNaN(expression.slice(-1))) {
    addValue(value);
  }
}

function square() {
  if (expression || result) {
    // Use the result if the expression is empty
    const number = expression ? parseFloat(expression) : parseFloat(result);

    if (!isNaN(number)) {
      result = number ** 2;
      expression = ""; // Clear expression after using the result
      updateDisplay();
    }
  }
}

function sqrt() {
  if (expression || result) {
    // Use the result if the expression is empty
    const number = expression ? parseFloat(expression) : parseFloat(result);

    if (!isNaN(number)) {
      result = Math.sqrt(number);
      expression = ""; // Clear expression after using the result
      updateDisplay();
    }
  }
}

// Define event handler for button clicks
function buttonClick(event) {
  const target = event.target;

  if (!target.dataset.action) return; // Ensure action exists

  const action = target.dataset.action;

  switch (action) {
    case "number":
      addValue(target.dataset.value);
      break;
    case "clear":
      clear();
      break;
    case "backspace":
      backspace();
      break;
    case "addition":
    case "subtraction":
    case "multiplication":
    case "division":
      if (expression === "" && result !== "")
        startFromResult(target.dataset.value);
      else if (!isLastCharOperator()) addValue(target.dataset.value);
      break;
    case "submit":
      submit();
      break;
    case "negate":
      negate();
      break;
    case "mod":
      percentage();
      break;
    case "decimal":
      decimal(target.dataset.value);
      break;
    case "square":
      square();
      break;
    case "sqrt":
      sqrt();
      break;
    case "parenthesis":
      addValue(target.dataset.value);
      break;
  }

  updateDisplay();
}
