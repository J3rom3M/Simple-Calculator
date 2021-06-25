
new Vue({
    el: '#app',
    data () {
        return {
          calculator: {
              displayValue: '0',
              firstOperand: null,
              waitingForSecondOperand: false,
              operator: null,
          },
          errValue: null,
          keypad: [
              {label:'7', value: 7},
              {label:'8', value: 8},
              {label:'9', value: 9},
              {label:'x', value: '*'},
              {label:'4', value: 4},
              {label:'5', value: 5},
              {label:'6', value: 6},
              {label:'+', value: '+'},
              {label:'1', value: 1},
              {label:'2', value: 2},
              {label:'3', value: 3},
              {label:'-', value: '-'},
              {label:'AC', value: 'AC'},
              {label:'.', value: '.'},
              {label:'0', value: 0},
              {label:'/', value: '/'},
          ],
        }
    },
    methods: {
      processKey: function(val) {
          this.errValue = null
          switch (val){
            case "AC": this.resetCalculator()
              break;
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9: this.inputDigit(val)
            break; 
            case "+": this.handleOperator("+")
              break;
            case "-": this.handleOperator("-")
              break;
            case "/": this.handleOperator("/")
              break;
            case "*": this.handleOperator("*")
              break;
            case "=": this.equalPressed();
              break;
            case ".": this.inputDecimal(".");
                break;
            default:
                this.errValue = 'KEY ERROR: in default'
          }
      },
      equalPressed() {
          const { firstOperand, displayValue, operator } = this.calculator
          try{
              this.calculator.displayValue = this.calculate(firstOperand, displayValue, operator)
          }
          catch (e){
              this.errValue = e
          }
      },
      inputDigit(digit) {
          const { displayValue, waitingForSecondOperand } = this.calculator
          console.log(waitingForSecondOperand)
          if (waitingForSecondOperand === true) {
              this.calculator.displayValue = digit
              this.calculator.waitingForSecondOperand = false
          } else {
              console.log(displayValue)
              this.calculator.displayValue =
                  displayValue === '0' ? digit : displayValue + '' + digit
          }
      },
      inputDecimal(dot) {
          const { displayValue, waitingForSecondOperand } = this.calculator
          if (waitingForSecondOperand === true) {
              this.calculator.displayValue = '0.'
              this.calculator.waitingForSecondOperand = false
              return
          }
  
          // check for existing decimal
          if (displayValue % 1 === 0) {
              this.calculator.displayValue += dot
          }
      },
      handleOperator(nextOperator) {
          const { firstOperand, displayValue, operator, waitingForSecondOperand } = this.calculator
          const inputValue = parseFloat(displayValue)
          
          if (operator && waitingForSecondOperand) {
              this.calculator.operator = nextOperator
              return
          }
          
          if (firstOperand == null && !isNaN(inputValue)) {
              this.calculator.firstOperand = inputValue
          } else if (operator) {
              const currentValue = firstOperand || 0
              const result = this.calculate(currentValue, inputValue, operator)
              this.calculator.displayValue = String(result)
              this.calculator.firstOperand = result
          }
          
          this.calculator.waitingForSecondOperand = true
          this.calculator.operator = nextOperator
      },
      calculate(firstOperand, secondOperand, operator) {
          if (operator === '+') {
              return firstOperand + secondOperand
          } else if (operator === '-') {
              return firstOperand - secondOperand
          } else if (operator === '*') {
              return firstOperand * secondOperand
          } else if (operator === '/') {
              if (secondOperand == 0){
                  this.errValue = 'ERROR: Cannot divide by 0'
              }
              else {
                  return firstOperand / secondOperand
              }
          }
          
          return secondOperand
      },
      resetCalculator() {
        this.calculator.displayValue = '0'
        this.calculator.firstOperand = null
        this.calculator.waitingForSecondOperand = false
        this.calculator.operator = null
      },
    },
  })