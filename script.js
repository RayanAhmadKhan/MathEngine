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