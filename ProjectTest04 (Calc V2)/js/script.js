const mD = document.getElementById("main-display");
let mDV = mD.value

// Loop checkings
let loopCount = 0;

const keyop = ["+", "-", "*", "/" ,"^", "%", "(", ")", "!"] // char key selectors
document.addEventListener("keydown", function (event) {
    const keyPressed = event.key;

  if (keyPressed >= "0" && keyPressed <= "9") { // Inserts numbers via keyboard
    insertNumber(keyPressed);
  } else if (keyPressed === "Backspace") { // Backspaces / Deletes the last number or char
    backspace();
  } else if (keyPressed === ".") { // Inserts decimal
    insertDecimal();
  } else if (keyPressed === "=" || keyPressed === "Enter") { // Calculates via keyboard
    calculate();
  } else {
    for (i = 0; i < operators.length; i++ ) {
        if (keyPressed === keyop[i]) { // Finds the correct operator
            insertOperator(operators[i]);
            break
        }
    }
  }
});

function insertNumber(number) { // Inserts a number or a special operator, number = the number or special char from the button
    if (["Infinity"].includes(mDV) ||
     Number(mDV) === "NaN" && !(["sin", "cos", "tan"].includes(mDV) || ["π", "e", "Ans"].includes(number))) { // Replaces non numbers
        mD.value = number;
    } else if (!(["π", "e", "Ans"].includes(number)) ||
     (["π", "e", "Ans"].includes(number) && !(mDV.endsWith(".")))){ // Finds "π,"e" or "Ans" or adds a number
        let SpNumber = (function() { // Checks whether inverse variable is active
            if (number === "π") {
                if (inverse) {
                    return "i";
                } else if (inverse === false) { 
                    return "π";
                }
            } else if (number === "e") {
                if (inverse) {
                    return "φ";
                } else if (inverse === false) {
                    return "e";
                }
            } else if (number === "Ans") {
                if (inverse) {
                    return Math.random();
                } else if (inverse === false) {
                    return "Ans";
                }
            } else { // Defaults to normal number
                return number
            }
        })()
       if (typeof SpNumber === "number" && ["Ans"].includes(number)) { 
            for (let i = 1; i <= mDV.length; i++) {
                if (["+", "-", "×", "÷" ,"^", "%", "(", ")", "!"].includes(mDV[mDV.length - i])) { // Checks if last index has an operator
                    break;
                } else if (mDV[mDV.length - i] === ".") { // Checks digits with decimals
                    mD.value += "×";
                    break;
                }
            }
       }
       if (mDV == "0") { // Replaces empty display
        mD.value = SpNumber;
       } else { // Adds special char instead
        mD.value += SpNumber;
       }
        
    }
    recount(); // reloads variables
}

const operators = ["+", "-", "×", "÷" ,"^", "%", "(", ")", "!", "sin(", "cos(", "tan("]; // Selection of Operators and Special Operators
let maxDecimal = 1; // sets maximum decimals allowed in the display
function insertDecimal() { 
    let countD = 0;
    for (i = 0; i < mDV.length; i++) {
        if (mDV[i] === ".") {
            countD++;
        }
    }
    if (countD < maxDecimal) {
        if ((countD + 1) < maxDecimal) {
            maxDecimal = countD + 1;
        }
        mD.value += ".";
    }
    recount();
}

function insertOperator(operator) {
    let op = operator;
    let opT = true;
    let dec = true;

    const opAdjMatch = ["openP", "closeP", "sin", "cos", "tan", "log"];
    const opAdj = (function() {
        if (inverse) {
            return ["(", ")", "arcsin(", "arccos(", "arctan(", "10^"];
        } else {
            return ["(", ")", "sin(", "cos(", "tan(", "log("];
        }
    })();
    
    for (i = 0; i < opAdjMatch.length; i++) { // Replaces op with the right operator
        if (op == opAdjMatch[i]) {
            op = opAdj[i];
            break
        }
    }

    if ((["0", "Infinity"].includes(mDV) ||
    Number(mDV) === "NaN" && !(["sin", "cos", "tan", "log", "asin", "acos", "atan"].includes(mDV))) &&
     ["-", "(", "√", "sin(", "cos(", "tan(", "log(", "arcsin(", "arccos(", "arctan(", "10^"].includes(op)) {
        mD.value = op;
        opT = false;

    } else if ((["NaN"].includes(mDV) || mDV.includes("Error"))) {
        if (op === "10^") {
            mD.value = op;
        } else {
            mD.value = "0" + op;
        }
        opT = false;

    } else if (!((["(", "√", "sin(", "cos(", "tan(", "log(", "10^"].includes(op)) ||
        (["!", "(", ")", "√"].includes(mDV[mDV.length - 1])) ||
         /\d$/.test(mDV))) {
        for (i = 0; i < operators.length; i++ ) {
            if (mDV.endsWith(operators[i])) {
               mD.value = mDV.slice(0, -1);
               break
            }
        }
    } else if (mDV.endsWith("(") && !(["-", "(", "√", "sin(", "cos(", "tan(", "log(",
         "arcsin(", "arccos(", "arctan("].includes(op))) {
        opT = false;
    } else if (mDV.endsWith("√") && op === "(") {
        dec = false;
    }

    if (mDV.endsWith(".")) {
        mD.value += "0";
    }

    

    if (opT === true) {
        if (op === "10^" && ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(mDV[mDV.length - 1])) {
            mD.value += "×";
        }
        mD.value += op;
        if (dec === true) {
            maxDecimal++;
        }
    }

    recount();
}

function backspace() {
    let sliceUp = -1;

    if (!(mDV === "0")) {
        if (mDV.includes("Error")) { // Resets Calc Display
            mDV = "0"
            sliceUp = 0;
        } else if (mDV.length === 1) {
            mDV = "0" + mDV;
        } else if (mDV.endsWith("(")) {
            if (mDV[mDV.length - 2] === "√") {
                maxDecimal++;
            } else if (["n", "s", "g"].includes(mDV[mDV.length - 2])) {
                if (mDV[mDV.length - 5] === "c" && (mDV.length - 5) >= 0) {
                    sliceUp = -7;
                } else {
                    sliceUp = -4;
                }
            }
            
        } else if (["s"].includes(mDV[mDV.length - 1])) {
            sliceUp = -3;
        }
        for (i = 1; i <= operators.length; i++ ) {
            if (mDV.endsWith(operators[i])) {
                maxDecimal--;
                break
            } 
        }
        mD.value = mDV.slice(0, sliceUp);
        recount();
        if (mDV === "") {
            mD.value = "0";
        }
    }

    recount();
}

function reset() { // Resets display
    maxDecimal = 1;
    mD.value = "0";
    recount();
}

let ANs = 0;
function calculate() {
    let pEror = "Error: Calc";
    try {
        mDV = mDV + "";
        // Finding Missing Parentheses
        if (mDV.includes("(") || mDV.includes(")")) {
            let pOpen  = 0;
            let pClose = 0;
            for (i = 0; i < mDV.length; i++) {
                if (mDV[i] === "(") {
                    pOpen++;
                } else if (mDV[i] === ")") {
                    pClose++;
                }
            }
            if (pOpen < pClose) {
                while (pOpen < pClose) {
                    mDV = "(" + mDV;
                    pOpen++;
                }
            } else if (pOpen > pClose) {
                while (pOpen > pClose) {
                    mDV = mDV + ")";
                    pClose++;
                }
            }
        }
        let EndV = Acalculate();
        pEror = EndV;

        // rounds number
        EndV = EndV.toFixed(11);
        NumV = Number(EndV)

        ANs = NumV;

        if (NumV === 1.61803398875) {
            NumV = "φ";
        }
        mD.value = NumV;
    } catch (error) {
        mD.value = pEror;
    } finally {
        recount();
    };
}


function recount() { // Aligns mDV variable with mD's value
    mDV = mD.value;
}

function visibility(id) {
    if (id === 0) {
        const exB = document.getElementById("expandButton");
        if (exB.textContent === "[+]") {
            exB.textContent = "[-]";
        } else {
            exB.textContent = "[+]";
        }
        const hB = document.querySelectorAll(".hideable-button");
        hB.forEach(function(element) {
            element.classList.toggle("hidden");
        });
    }
}


function Acalculate() {
    const input = mDV;
    const operrs = ["+", "-", "×", "÷", // All operators and special chars
          "^", "√", "%", "(", ")",
          "!", "s", "c", "t", "l", "A", "a", 
          "i", "e", "π", "φ", "i"];
    
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]; // All digits
    let allData = []; // Empty array to store converted string into array
    

    let currentNumber = ""; // Inserts digit elements in allData array
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (digits.includes(char)) { // Checks then inserts char in currentNumber
            currentNumber += char;
        } else if (operrs.includes(char)) { // Checks then continues to the next number after operator
            let charEnter = char;
            let pushChar = true;
            if (char === "-" && currentNumber === "") {
                currentNumber += char;
                pushChar = false;
            }
            if (["s", "c", "t", "l", "A", "a"].includes(char)) { // Finding Sin Cos Tan
                const charOP = (function() { // Conditional value of CharOP.
                    if (char === "a") {
                        if (i + 5 < input.length) {
                            return char + input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4] + input[i + 5];
                        } else {
                            return "Error: Insufficient elements"
                        }
                    } else {
                        if (i + 2 < input.length) {
                            return char + input[i + 1] + input[i + 2];
                        }
                    }
                })()
                if (["sin", "cos", "tan", "log", "Ans"].includes(charOP)) { // Checking if it's valid
                    charEnter = charOP;
                    i = i + 2;
                } else if (["arcsin", "arccos", "arctan"].includes(charOP)) {
                    charEnter = charOP;
                    i = i + 5;
                }
            }
            if (currentNumber !== "" && pushChar) { // Adding the last number
                allData.push(Number(currentNumber));
                currentNumber = "";
            } 
            if (typeof charEnter === "string" && pushChar) {
                allData.push(charEnter);
            }
            
        }
    }
    if (currentNumber !== "") {
        allData.push(Number(currentNumber));
    }

    //Special cases check
    for (i = 0; i < allData.length; i++) { // finds "π" or other operators
        let touch = false;
        if (allData[i] === "π") { 
            allData[i] = Math.PI;
            touch = true;
        } else if (allData[i] === "Ans") {
            allData[i] = ANs;
            touch = true;
        } else if (allData[i] === "e") {
            allData[i] = Math.E;
            touch = true
        } else if (allData[i] === "φ") {
            allData[i] = 1.61803398875;
            touch = true;
        }
        if (touch === true) {
            if (typeof allData[i-1] === "number") {
                allData.splice(i, 0, "×");
                i++
            } 
            if (typeof allData[i+1] === "number") {
                allData.splice(i+1, 0, "×");
            }
        }
    }

    for (i = 0; i < allData.length; i++) {
        if (["s"].includes(allData[i])) {
            allData.splice(i, 1);
            i--
        }
    }

    for (i = 0; i < allData.length; i++) {
        if (typeof allData[i-1] === "number" &&
             (["√","("].includes(allData[i]) ||
              allData[i] === "√" && allData[i-1] === ")")) { // finds ")√", "[number]√" or "[number]("
            allData.splice(i, 0, "×");
            i++
            
        } else if (allData[i] === ")" &&
             ( typeof allData[i+1] === "number" ||
             allData[i+1] === "(")) { // finds ")[number]" or ")("
            allData.splice(i+1, 0, "×");
            console.log("All Data:", allData);
        }
    } 
    
    console.log("Input:", input);
    console.log("All Data:", allData);
    newData = operatorManagement(allData, 1);
    
    console.log("allDataTOTALEnd:", newData);
    return newData;
}

function factorial(n) {
    if (n === 0) return 1;
    if (n < 0) return "Error: Factorial of negative number"; //Handle potential error
    let result = 1;
    if (!(Number.isInteger(n))) return "Error: Factorial of non-integer number"

    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

let RDEG = "rad";
function operatorManagement(iNPUT, countLOOP) {

    let allData = iNPUT;
    console.log(`iNPUT[${countLOOP}]:`, allData)

    const operrs = ["+", "-", "×", "÷",
         "^", "√", "%", "log",
         "(", ")", "!",
         "sin", "cos", "tan", "arcsin", "arccos", "arctan"];  // Operators
    const opsTier = [
        ["(", ")"], 
        ["!", "sin", "cos", "tan", "arcsin", "arccos", "arctan"],
        ["^", "√", "log"],
        ["×", "÷", "%"],
        ["+", "-"]
        ]; // Operator precedence
    for (let tier = 0; tier < opsTier.length; tier++) {
        for (let i = 0; i < allData.length; i++) {
            if (operrs.includes(allData[i])) {
                const opertor = allData[i];
                if (opsTier[tier].includes(opertor)) {
                    let result = 0;
                    if (tier === 0) { // First tier
                        if (opertor === "(") { // Finds "("
                            arrsult = []; // Temporary data storage
                            let OpPrnt = 0; // Counts open Parentheses
                            for (j = 1; j < allData.length; j++) {
                                if (i+j < allData.length) {
                                    if (allData[i+j] === "(") {
                                        OpPrnt++;
                                        arrsult.push(allData[i+j]);
                                        console.log(`arrsult[${j}]:`, arrsult);
                                    } else if (allData[i+j] === ")") {
                                        if (OpPrnt > 0) {
                                            OpPrnt--;
                                            arrsult.push(allData[i+j]);
                                            console.log(`arrsult[${j}]:`, arrsult);
                                        } else if (OpPrnt <= 0) {
                                            console.log(`arrsult[${j}] pre-calc[${countLOOP}]:`, arrsult);
                                            const delPrnt = allData.splice(i+1, j);
                                            result = operatorManagement(arrsult, countLOOP+1);
                                            allData[i] = result;
                                            console.log(`deleted:[${countLOOP}]`, delPrnt);
                                            console.log("resultP:", result);
                                            console.log(`arrsult[${j}] post-calc[${countLOOP}]:`, arrsult);
                                            break;
                                        }
                                    } else {
                                        arrsult.push(allData[i+j]);
                                        console.log(`arrsult[${j}]:`, arrsult);
                                    }
                                } else {
                                    console.log(`arrsultENDLIMIT:`, arrsult);
                                    break;
                                }
                            }
                        }
                    } else if (tier === 1) {
                        let RadConvert = allData[i + 1];
                        if (opertor === "!") {
                            if (i+1 !== allData.length && typeof allData[i+1] === "number") {
                                allData.splice(i+1, 0, "×");
                            }
                            result = factorial(allData[i - 1]);
                        } else if (opertor === "sin") {
                            if (RDEG === "deg") {
                                RadConvert = allData[i + 1] * (Math.PI / 180);
                            }
                            result = Math.sin(RadConvert);
                        } else if (opertor === "cos") {
                            if (RDEG === "deg") {
                                RadConvert = allData[i + 1] * (Math.PI / 180);
                            }
                            result = Math.cos(RadConvert);
                        } else if (opertor === "tan") {
                            safeTan = true;
                            if (RDEG === "deg") {
                                if (RadConvert === 90) {
                                    result = Infinity;
                                    safeTan = false;
                                } else {
                                    RadConvert = allData[i + 1] * (Math.PI / 180);
                                }
                            } else if (RDEG === "rad") {
                                if (RadConvert === (Math.PI / 2)) {
                                    result = Infinity;
                                    safeTan = false;
                                }
                            }
                            if (safeTan === true) {
                                result = Math.tan(RadConvert);
                            }
                            
                        } else if (opertor === "arcsin") {
                            if (RadConvert <= 1 && RadConvert >= -1) {
                                result = Math.asin(RadConvert);
                                if (RDEG === "deg") {
                                    result *= (180 / Math.PI);
                                }
                            } else {
                                result = "Error: Value is outside of -1 to 1 range";
                            }
                        } else if (opertor === "arccos") {
                            if (RadConvert <= 1 && RadConvert >= -1) {
                                result = Math.acos(RadConvert);
                                if (RDEG === "deg") {
                                    result *= (180 / Math.PI);
                                }
                            } else {
                                result = "Error: Value is outside of -1 to 1 range";
                            }
                        } else if (opertor === "arctan") {
                            result = Math.atan(RadConvert);
                            if (RDEG === "deg") {
                                result *= (180 / Math.PI);
                            }
                            
                        }
                        
                    } else if (tier === 2) {
                        if (opertor === "^") {
                            result = allData[i-1] ** allData[i+1];
                        } else if (opertor === "√") {
                            if (allData[i+1] >= 0) {
                                result = Math.sqrt(allData[i+1]);
                                console.log("allData1:", allData);
                            } else {
                                return "Error: Square of negative number" //Handle potential error
                            }
                        } else if (opertor === "log") {
                            result = Math.log10(allData[i + 1]);
                        }
                    } else if (tier === 3) {
                        if (opertor === "×") {
                            result = allData[i-1] * allData[i+1];
                        } else if (opertor === "÷") {
                            result = allData[i-1] / allData[i+1];
                        } else if (opertor === "%") {
                            result = allData[i-1] % allData[i+1];
                            if (i+1 > allData.length) {
                                result = allData[i-1] / 100;
                            }
                        }
                    } else if (tier === 4) {
                        if (opertor === "+") {
                            result = allData[i-1] + allData[i+1];
                        } else if (!(i-1 < 0 || ["(", "√"].includes(allData[i-1]))) {
                            result = allData[i-1] - allData[i+1];
                        } else {
                            result = -1 * allData[i+1];
                        }
                    }
                    console.log(`ResultENDCALC[${countLOOP}]:`, result);
                    console.log(`allData Pre-Result[${countLOOP}]:`, allData); 
                    let iNdEX = i-1;
                    if (["sin", "cos", "tan", "arcsin", "arccos", "arctan", "log"].includes(opertor) ||
                     (opertor === "-" && (["(", "√"].includes(allData[i-1]) || i-1 < 0))) { 
                        // checks opertor for sqrtroot, unary minus, etc
                        iNdEX = i;
                    } else if (["√"].includes(opertor)) {
                        iNdEX = i+1;
                    }

                    if (tier !== 0) {
                        allData[iNdEX] = result; // Store result position
                    }
                    console.log(`allData Mid-Result[${countLOOP}]:`, allData); 

                    let delChar = 2;
                    let delLct = i;
                    if (["!", "√", "sin", "cos", "tan", "arcsin", "arccos", "arctan", "log", "-"].includes(opertor) && tier !== 0) {
                        delChar = 1;
                        if (["!", "√"].includes(opertor)) { 
                            delLct = i;
                        } else if ((opertor === "-" && (["(", "√"].includes(allData[i-1]) || i-1 < 0)) || ["sin", "cos", "tan", "log"].includes(opertor)) {
                            delLct = i+1;
                        }
                        if (["arcsin", "arccos", "arctan"].includes(opertor)) {
                            delLct++;
                        }
                    }
                    if (tier !==  0) {
                        allData.splice(delLct, delChar); // Remove the leftover characters
                        console.log("delLct&delChar", delLct, delChar)
                        i-- // Adjust index since elements were removed
                    }
                    if (allData.length === 1) {
                        break
                    }
                    console.log(`allData Post-Result[${countLOOP}]:`, allData); // Check the data in allData
                }
            }
           
        }
    }
    console.log("allDataEnd:", allData);
    return allData[0];
}

function degRadCyle() {
    const radDegree = document.getElementById("radDeg");
    if (radDegree.textContent === "rad") {
        radDegree.textContent = "deg";
        RDEG = "deg"
    } else {
        radDegree.textContent = "rad";
        RDEG = "rad";
    }
}

let inverse = false;
function InVerse() {
    const invB = document.getElementById("InverseB");
    inverse = !inverse;
    if (inverse) {
        invB.classList.add("On");
    } else {
        invB.classList.remove("On");
    }

    const iDs = ["sin", "cos", "tan", "log", "ans", "e", "pi"]; // getting ids
    const cTxt = ["asin", "acos", "atan", "10ˣ", "Rnd", "φ" , "i"]; // converted to
    const orgTxt = ["sin", "cos", "tan", "log", "Ans", "e", "π"]; // convert back
    const getId = [];
    for (let i = 0; i < iDs.length; i++) {
        getId.push(document.getElementById(iDs[i]))
    }

    if (inverse) {
        for (let i = 0; i < getId.length; i++) {
            getId[i].textContent = cTxt[i];
            if (cTxt[i] === "i") {
                document.getElementById("pi").disabled = true;
            }
        }
    } else {
        for (let i = 0; i < getId.length; i++) {
            getId[i].textContent = orgTxt[i];
        }
    }
}

function tempcalchide() {
    
}

function RickRoll() {
    window.location.href = "https://youtu.be/AlHBkmyOHig?si=XQtJtkbWrZBXofEa";
}