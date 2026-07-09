const input = document.getElementById('expr-input');
const output = document.getElementById('output');

const valueButtons = document.querySelectorAll('#buttons button[data-val]');

const CONSTANTS = ['pi', 'e'];
let userVariables = {}; 

document.getElementById('add-var-btn').addEventListener('click', () => {
  const name = document.getElementById('var-name').value.trim();
  const value = parseFloat(document.getElementById('var-value').value);

  if (CONSTANTS.includes(name)) {
    alert(`"${name}" is a reserved constant name`);
    return;
  }
  if (name === '' || isNaN(value)) {
    alert('Enter a valid name and numeric value');
    return;
  }

  userVariables[name] = value;
  renderVariables();
});

function renderVariables() {
  const list = document.getElementById('var-list');
  list.innerHTML = '';
  for (const name in userVariables) {
    list.innerHTML += `<div>${name} = ${userVariables[name]}</div>`;
  }
}

valueButtons.forEach(button => {
  button.addEventListener('click', () => {
    input.value += button.dataset.val;
    input.focus();
  });
});

document.getElementById('clear-btn').addEventListener('click', () => {
  input.value = '';
  output.textContent = '0';
});

document.getElementById('backspace-btn').addEventListener('click', () => {
  input.value = input.value.slice(0, -1);
});

function preprocessExpression(expr) {
  let jsExpr = expr.trim();          

  jsExpr = jsExpr.replaceAll('^', '**');

  jsExpr = jsExpr.replaceAll('sqrt(', 'Math.sqrt(');
  jsExpr = jsExpr.replaceAll('sin(', 'Math.sin(');
  jsExpr = jsExpr.replaceAll('cos(', 'Math.cos(');
  jsExpr = jsExpr.replaceAll('tan(', 'Math.tan(');

  jsExpr = jsExpr.replace(/\bpi\b/g, 'Math.PI');
  jsExpr = jsExpr.replace(/\be\b/g, 'Math.E');

  // replace user variables
  for (const name in userVariables) {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    jsExpr = jsExpr.replace(regex, userVariables[name]);
  }

  return jsExpr;
}

function evaluateExpression(expr) {
  const jsExpr = preprocessExpression(expr);

  if (jsExpr === '') {
    throw new Error('Expression is empty');
  }

  let result;
  try {
    
    result = Function(`"use strict"; return (${jsExpr})`)();
  } catch (err) {
    throw new Error('Invalid expression');
  }

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error(result === Infinity ? 'Cannot divide by zero' : 'Invalid result');
  }

  return result;
}

// working when click is pressed. 
document.getElementById('equals-btn').addEventListener('click', () => {
  try {
    const result = evaluateExpression(input.value);
    output.textContent = result.toFixed(4);   // "fixed to 4 decimal points"
    //addHistoryItem(input.value, result.toFixed(4));
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});


