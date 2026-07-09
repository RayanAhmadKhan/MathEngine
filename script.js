const input = document.getElementById('expr-input');
const output = document.getElementById('output');

const valueButtons = document.querySelectorAll('#buttons button[data-val]');

const CONSTANTS = ['pi', 'e'];
let userVariables = {}; 
let history = [];

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

  if (typeof result !== 'number') {
    throw new Error('Invalid result');
  }

  return result;
}

function formatResult(result) {
  if (!Number.isFinite(result)) {
    return 'Result too large';
  }

  const absResult = Math.abs(result);

  if (absResult !== 0 && (absResult >= 1e9 || absResult < 1e-4)) {
    return result.toExponential(2).replace('e+', ' x 10^').replace('e-', ' x 10^-');
  }

  return result.toFixed(4);
}

// working when click is pressed. 
document.getElementById('equals-btn').addEventListener('click', () => {
  try {
    const result = evaluateExpression(input.value);
    const displayResult = formatResult(result);
    output.textContent = displayResult;
    addHistoryItem(input.value, displayResult);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});


//history management

function addHistoryItem(expr, result) {
  history.push({ expr, result, id: Date.now() });
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  history.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.expr} = ${item.result}`;
    div.addEventListener('click', () => {
      input.value = item.expr;
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'x';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();   // prevents the click from also filling the input
      history = history.filter(h => h.id !== item.id);
      renderHistory();
    });

    div.appendChild(delBtn);
    list.appendChild(div);
  });
}