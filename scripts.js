const buttons = document.getElementsByClassName('button');
const topOutput = document.getElementById('output-screen-top');
const bottomOutput = document.getElementById('output-screen-bottom');
const clears = document.getElementsByClassName('clear');
const operations = document.getElementsByClassName('operation');
const numbers = document.getElementsByClassName('number');

function clearSomething() {
  console.log('You have clicked any clear buttons');
}

function operand() {
  console.log('You have clicked any operation buttons');
}

function inputNumbers() {
  console.log('You have clicked any number buttons');
}

Array.from(clears).forEach(clear => {
  clear.addEventListener('click', clearSomething);
});

Array.from(operations).forEach(operation => {
  operation.addEventListener('click', operand);
});

Array.from(numbers).forEach(number => {
  number.addEventListener('click', inputNumbers);
});
