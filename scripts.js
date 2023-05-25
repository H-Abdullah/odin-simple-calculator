const buttons = document.getElementsByClassName('button');
const topOutput = document.getElementById('output-screen-top');
const bottomOutput = document.getElementById('output-screen-bottom');
const outputContainer = document.getElementById('output-container');
const clears = document.getElementsByClassName('clear');
const operations = document.getElementsByClassName('operation');
const numbers = document.getElementsByClassName('number');

let firstNum = ''; // Hold number for the first group of numbers
let secondNum = ''; // Hold number for the second group of numbers
let operator = ''; // Hold the operator that used for calculation
let isCleared = false; // Clear bottomOutput once for the inputNumbers() second-half
let opCount = 0; // Ensure that only one operator entered at time
let lastOp = ''; // Hold past operator to replace in replaceOperator()
let calcOp = ''; // Used for calcResult(), holding last operation before changed
let pointCount = 0; // Ensure no second point '.' entered after the first one

function updateTopScreen(strNum) { // Refresh and update top screen
  return topOutput.innerText += strNum;
}
function updateBottomScreen(strNum) { // Refresh and update bottom screen
  return bottomOutput.innerText += strNum;
}
function clearScreen(output) { // Clear screen from previous values
  return output.innerText = '';
}

function calcResult(calcOp) { // Calculate value that provided in *num variables
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

function allClear() { // Reset everything
  firstNum = '';
  secondNum = '';
  operator = '';
  isCleared = false;
  opCount = 0;
  lastOp = '';
  calcOp = '';
  pointCount = 0;
  topOutput.style.removeProperty('font-size'); // Remove added properties from maxLimitResetCalc() 
  topOutput.style.removeProperty('color'); // Remove added properties from maxLimitResetCalc()
  bottomOutput.style.removeProperty('font-size'); // Remove added properties from maxLimitResetCalc()
  bottomOutput.style.removeProperty('color'); // Remove added properties from maxLimitResetCalc()
  clearScreen(topOutput);
  clearScreen(bottomOutput);
}

function clearEntry() { // Clear last number entries
  if (firstNum === '' && secondNum === '') return; // Nothing to delete if nothing to delete
  // Delete last inputted numbers from firstNum until an operator is inputted  
  if (firstNum !== '' && secondNum === '' && operator === '') { 
    firstNum = '';
    clearScreen(topOutput);
    clearScreen(bottomOutput);
  }

  // Delete last inputted numbers from secondNum until an operator is inputted  
  if (firstNum !== '' && secondNum !== '') { 
    let clearLastInput = topOutput.innerText
      .split('').reverse().join('')
      .replace(secondNum.split('').reverse().join(''), '')
      .split('').reverse().join('');
    secondNum = '';
    topOutput.innerText = clearLastInput;
    clearScreen(bottomOutput);
  }
}

// Change last inputted operators flexibly (except for the first operator <-- this is bug)
function replaceOperator(event) { 
  let newOp = event.target.innerText;
  let replaceOp = topOutput.innerText
    .split('').reverse().join('')
    .replace(lastOp, newOp)
    .split('').reverse().join('');
  topOutput.innerText = replaceOp;
  operator = newOp;
  lastOp = newOp;
}

// Function that triggered if any of 'AC' or 'C' buttons clicked
function clearSomething(event) { 
  let btn = event.target.innerText;
  switch (btn) {
    case 'AC':
      allClear();
      break;
    case 'CE':
      clearEntry();
      break;
  }
}

// Create and hold operator symbol to be used later
function operand(event) {
  let numOperator = event.target.innerText;
  // No operators as first input in firstNum and secondNum
  if (secondNum === '' && (firstNum === '' || operator !== '')) return; 
  // If equal '=' inputted, no other button can be clicked except 'AC' button
  if (topOutput.innerText === '\75') {
    return calcResult();
  }
  
  if (opCount === 1 && operator !== '') { // Change operators flexibly
    operator = numOperator;
    replaceOperator(event);
  } else { 
    // Original conditional before refactored:
    // if (opCount === 0 || operator === 0);
    operator = numOperator;
    lastOp = numOperator;
    topOutput.innerText += numOperator;
    isCleared = false;
    opCount = 1;
    pointCount = 0;
    if (secondNum !== '') {
      calcResult(calcOp);
    } 
  }
}

// Get numbers from buttons and keep in *num variables
function inputNumbers(event) {
  let strNum = event.target.innerText;

  // Prevent any number inputted after equal '='
  if (lastOp !== '\75') {

    // Prevent any '0','00' and '.' inputted as first num in firstNum
    if ((operator === '' && firstNum === '') 
      && (strNum === '0' || strNum === '00' || strNum === '.')) 
      return;

    // Prevent any '0','00' and '.' inputted as first num in secondNum
    if ((operator !== '' && secondNum === '') 
      && (strNum === '0' || strNum === '00' || strNum === '.')) 
      return;

    // Prevent any '.' twice inputted after initial '.' inputted
    if (operator !== '' && strNum === '.' && secondNum.includes('.'))
      return;

    // Input any numbers (except zeros) as first number in firstNum
    if (operator === '' && strNum === '.' && pointCount === 0) {
      firstNum += strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
      pointCount = 1;
    } else if (operator === '' && strNum !== '.') {
      firstNum += strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
    }

    // Switch to secondNum after firstNum is filled
    if (operator !== '' && isCleared === false) {
      clearScreen(bottomOutput); // One-time clear to update the screen
      secondNum = strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
      isCleared =  true;
      opCount = 0;
      pointCount = 1;
      calcOp = lastOp;
    } else if (operator !== '' && isCleared === true) {
      secondNum += strNum;
      topOutput.innerText += strNum;
      bottomOutput.innerText += strNum;
    }
  }
  return;
}

// Reset calculator if max input reached
function maxLimitResetCalc(output) {
  output.style.setProperty('font-size', '0.8em');
  output.style.setProperty('color', 'red');
  output.innerText = '<Max Input: Resetting in five seconds..>';
  setTimeout(allClear, 5000);
}

// Check max screen input
function checkScreenOverflow() {
  setInterval(() => {
    const isTopOverflow = topOutput.scrollWidth > outputContainer.clientWidth;
    const isBottomOverflow = bottomOutput.scrollWidth > outputContainer.clientWidth;
    if (isTopOverflow) {
      maxLimitResetCalc(topOutput);
    } else if (isBottomOverflow) {
      maxLimitResetCalc(bottomOutput);
    } else {
      return;
    }
  }, 100);
}

// Add event listener for all red buttons
Array.from(clears).forEach(clear => {
  clear.addEventListener('click', clearSomething);
})

// Add event listener for all orange buttons
Array.from(operations).forEach(operation => {
  operation.addEventListener('click', operand);
})

// Add event listener for all white buttons
Array.from(numbers).forEach(number => {
  number.addEventListener('click', inputNumbers);
})

// Interval check for max output screen
checkScreenOverflow();
