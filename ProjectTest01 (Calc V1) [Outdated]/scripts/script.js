let display = document.getElementById('display');

        // Inserts Numbers
        function insertNumber(number) {
            display.value += number;
        }

        // Inserts Decimals
        function insertDecimal(decimal) {
            if (!display.value.includes(decimal)) {
                display.value += decimal;
            }
        }

        // Inserts Operators
        function insertOperator(operator) {
            if (display.value.length > 0) {
                display.value += operator;
            }
        }

        // Inserts Roots
        function insertRoot(root) {
            if (display.value.length > 0) {
                if (root === 2) {
                    display.value = Math.sqrt(display.value);
                } else if (root === 3) {
                    display.value = Math.cbrt(display.value);
                }
            }
        }

        //Inserts Log
        function insertLog() {
            if (display.value.length > 0) {
               display.value = Math.log(display.value) / Math.log(10)
            }
        }

        // Inserts Factorial
        function insertFactorial() {
            let num = parseInt(display.value);
            let factorial = 1;
            if (num < 0) { // Finds Negative Numbers
              display.value = 'Error';
            } else if (num === 0) { // Makes 0 into 1
              display.value = 1;
            } else { // Factorial Function
              for (let i = 1; i <= num; i++) {
                factorial *= i;
              }
              display.value = factorial;
            } 
          } 

        // Turns into Percentage
        function insertPercentage() {
            display.value /= 100;
        } 

        // Inserts Parentheses
        function insertParentheses(type) {
            if (type === 1) {
                display.value += '(' ;
            } else if (type === 2) {
                display.value += ')';
            }
        } 

        // Removes all digits
        function clearDisplay() {
            display.value = '';
        }

        // Removes last digit typed
        function backspace() {
            display.value = display.value.slice(0, -1);
        }

        // Calculates digits
        function calculate() {
            try {
                let output = display.value

                // Turns "^" sign into a working power function
                if (output.includes("^")) {
                    output = output.replace("^", "**");
                }

                // Finds unconnected Parentheses "()"
                if (output.includes("("|")")) {
                    let count1 = 0;
                    let count2 = 0;
                    for (let i = 0; i < output.length; i++) {
                        if (output[i] === "(") {
                            count1++;
                        } else if (output[i] === ")") {
                            count2++;
                        }
                    }

                    // Adds missing parentheses
                    if (count1 > count2) {
                        for (let i = count2; i < count1; i++) {
                            output += ")";
                        }
                    } else if (count1 < count2) {
                        for (let i = count1; i < count2; i++) {
                            output = "(" + output;
                        }
                    }
                    output = output.replace(/\d\(\d+|\(\d+\)\d+/g,'$1*$2');
                }

                // Calculates the operations and digits
                display.value = math.evaluate(output);

            // Catches errors (0 / 0)
            } catch (error) {
                display.value = "Error";
            }
        }
        // Resizes the calculator for extra buttons
        function resizeCalc() {
            let sizeCalc = document.querySelector('#calculator')
            let sizeDisplay = document.querySelector('#display')
            let resizeButton = document.getElementById('resize')
            let hiddenButton = document.getElementsByClassName('hiddenButton');
            // Makes buttons visible and invisible
            if (resizeButton.innerHTML === "[+]") {
                sizeCalc.classList.add('large')
                sizeDisplay.classList.add('large')
                for (let i = 0; i < hiddenButton.length; i++) {
                    hiddenButton[i].classList.add('visible')
                }
                resizeButton.innerHTML = "[-]";
            } else {
                sizeCalc.classList.remove('large')
                sizeDisplay.classList.remove('large')
                for (let i = 0; i < hiddenButton.length; i++) {
                    hiddenButton[i].classList.remove('visible')
                }
                resizeButton.innerHTML = "[+]";
            }
           
        }