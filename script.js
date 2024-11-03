// Access DOM elements of the calculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

let expression = "";
let result = "";

function addValue(value) {
  if (value === ".") {
    const lastNumberIndex = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("-"),
      expression.lastIndexOf("*"),
      expression.lastIndexOf("/")
    );
    const lastDecimalIndex = expression.lastIndexOf(".");

    if (lastDecimalIndex < lastNumberIndex || lastDecimalIndex === -1) {
      expression += value;
    }
  } else {
    expression += value;
  }
}

function updateDisplay() {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function clear() {
  expression = "";
  result = "";
}

function backspace() {
  expression = expression.slice(0, -1);
}

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

function evaluateExpression() {
  try {
    if (/\/0\b/.test(expression)) throw new Error("Cannot divide by zero");

    const evalResult = Function('"use strict";return (' + expression + ")")(); // Safer alternative to eval

    if (isNaN(evalResult) || !isFinite(evalResult))
      throw new Error("Invalid operation");

    return evalResult < 1
      ? parseFloat(evalResult.toFixed(10))
      : parseFloat(evalResult.toFixed(2));
  } catch (error) {
    return error.message; // Displays error message in the result
  }
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
  if (expression) {
    const number = parseFloat(expression);

    if (!isNaN(number)) {
      result = number ** 2;
      expression = "";
    }
  }
}

function sqrt() {
  if (expression) {
    const number = parseFloat(expression);

    if (!isNaN(number)) {
      result = Math.sqrt(number);
      expression = ""; // Clear the input after calculation
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

inputBox.addEventListener("click", buttonClick);
