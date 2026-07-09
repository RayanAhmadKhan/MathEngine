const input = document.getElementById('expr-input');
const output = document.getElementById('output');


const valueButtons = document.querySelectorAll('#buttons button[data-val]');

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