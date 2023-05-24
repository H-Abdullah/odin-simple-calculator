const buttons = document.getElementsByClassName('button');
const topOutput = document.getElementById('output-screen-top');
const bottomOutput = document.getElementById('output-screen-bottom');
const clears = document.getElementsByClassName('clear');
const operations = document.getElementsByClassName('operation');
const numbers = document.getElementsByClassName('number');

let firstNum = '';
let secondNum = '';
let operator = '';
// Clear bottomOutput once for the inputNumbers() second half.
let isCleared = false; 
// Ensure that only one operator entered at time
let opCount = 0; 
let lastOp = ''; // Hold past Op to replace in replaceOperator()
let calcOp = ''; // Use for calcResult(), holding last operation before changed

function calcResult(calcOp) {
  firstNum = parseInt(firstNum);
  secondNum = parseInt(secondNum);
  switch (calcOp) {
    case '\53': // this is plus '+'
      let add = firstNum + secondNum;
      firstNum = add; 
      bottomOutput.innerText = firstNum;
      break;
    case '\u2212': // this is minus '-'
      let minus = firstNum - secondNum; 
      firstNum = minus; 
      bottomOutput.innerText = firstNum;
      break;
    case '\327': // this is multiply 'x'
      let multiply = firstNum * secondNum; 
      firstNum = multiply; 
      bottomOutput.innerText = firstNum;    
      break;
    case '\367': // this is divide '/'
      let divide = firstNum / secondNum; 
      firstNum = divide; 
      bottomOutput.innerText = firstNum;
      break;
  }
}

function allClear() { // Resetting everything
  firstNum = '';
  secondNum = '';
  operator = '';
  isCleared = false;
  opCount = 0;
  lastOp = '';
  topOutput.innerText = '';
  bottomOutput.innerText = '';
}

function clearOnly() {
  if (firstNum === '' && secondNum === '') return;
  if (firstNum !== '' && secondNum === '') {
    firstNum = '';
    topOutput.innerText = '';
    bottomOutput.innerText = '';
  }
  // if (firstNum !== '' && second !== '') {
  //   secondNum = '';
  //   bottomOutput.innerText = '';
  // }
}

function replaceOperator(event) {
  let newOp = event.target.innerText;
  let replaceOp = topOutput.innerText.split('').reverse().join('')
    .replace(lastOp, newOp)
    .split('').reverse().join('');
  topOutput.innerText = replaceOp;
  operator = newOp;
  lastOp = newOp;
}

function clearSomething(event) {
  let btn = event.target.innerText;
  switch (btn) {
    case 'AC':
      allClear();
      break;
    case 'C':
      clearOnly();
      break;
  }
}

function operand(event) {
  let numOperator = event.target.innerText;
  if (topOutput.innerText === '') return; // No operators as first input
  if (topOutput.innerText === '\75') {
    calcResult();
    return;
  }
  if (opCount === 1) { // Change operator
    operator = numOperator;
    replaceOperator(event);
  }

  if (operator === '' || opCount === 0) { 
    operator = numOperator;
    lastOp = numOperator;
    topOutput.innerText += numOperator;
    isCleared = false;
    opCount = 1;
    if (secondNum === '') {
      return;
    } else {
      calcResult(calcOp);
    }
  }
}

function inputNumbers(event) {
  let strNum = event.target.innerText;

  // Ensure no number input after equal '='
  if (lastOp !== '\75') {

    // Ensure no '0' or '00' inputted as first num
    if (operator === '' && firstNum === '' 
      && (strNum === '0' || strNum === '00' || strNum === '.')) 
      return;

    // Ensure any numbers (except zeros) can be inputted as first num
    if (operator === '') {
      firstNum += strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
    }  

    // Switch to secondNum after firstNum is filled
    if (operator !== '' && isCleared === false) {
      bottomOutput.innerText = '';
      secondNum = strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
      isCleared =  true;
      opCount = 0;
      calcOp = lastOp;
    } else if (operator !== '' && isCleared === true) {
      secondNum += strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
    }
  }
  return;
}

Array.from(clears).forEach(clear => {
  clear.addEventListener('click', clearSomething);
})

Array.from(operations).forEach(operation => {
  operation.addEventListener('click', operand);
})

Array.from(numbers).forEach(number => {
  number.addEventListener('click', inputNumbers);
})
