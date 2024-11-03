# Calculator Web App README

## Overview

This project is a web-based calculator built with HTML, CSS, and JavaScript. It includes a simple and intuitive user interface, supporting basic arithmetic operations such as addition, subtraction, multiplication, and division. Additional features include negation, modulus calculation, and decimal point input.

## Features

- **Basic Arithmetic**: Addition, subtraction, multiplication, and division.
- **Additional Functions**:
  - **Clear (C)**: Clears all current inputs.
  - **Negate (+/-)**: Toggles the sign of the current number.
  - **Modulus (%)**: Calculates the modulus of a division.
  - **Backspace**: Deletes the last digit entered.
- **Responsive Design**: Scales well across devices due to the viewport meta tag.

## Project Structure

- **HTML**: Defines the structure and layout of the calculator interface.
- **CSS (style.css)**: Handles the styling of buttons, layout sections, and color themes.
- **JavaScript (script.js)**: Implements the logic for handling button clicks, performing calculations, and updating the display.

## Code Breakdown

### HTML Structure

1. **Head Section**:
   - Sets up character encoding, viewport for responsiveness, title, and links to the CSS and JavaScript files.
2. **Output Section**:
   - Displays the expression and current result.
3. **Input Section**:
   - Contains buttons for digits, operations, and special functions. Each button is defined with `data-action` and `data-value` attributes for targeting by JavaScript.

### Button Details

- **Number Buttons**: Buttons with `data-action="number"` handle digit inputs.
- **Operator Buttons**: Buttons with `data-action` values like `addition`, `subtraction`, `multiplication`, and `division`.
- **Special Function Buttons**:
  - `data-action="clear"` for clearing.
  - `data-action="negate"` for toggling sign.
  - `data-action="mod"` for modulus.
  - `data-action="backspace"` for deleting the last digit.
  - `data-action="submit"` for calculating the result.

## Usage

1. **Run the App**: Open the `index.html` file in a web browser.
2. **Use the Calculator**:
   - Click buttons to enter numbers and operations.
   - Press `=` or the submit button to evaluate the expression.
   - Use `C` to clear and `+/-` to negate numbers as needed.

## Requirements

- **Web Browser**: Any modern browser with HTML, CSS, and JavaScript support.

## Future Enhancements

Potential improvements could include:

- Keyboard input support.
- Advanced operations (e.g., square root, exponents).
