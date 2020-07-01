// Budget Controller
var budgetController = (function() {

    // Function constructors for Expense and Income
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentages = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
           sum += cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {

            var newItem, ID;

            // Create new ID.
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on type, inc or exp.
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push into data structure
            data.allItems[type].push(newItem);

            // Return new element.
            return newItem;
        },

        deleteItem: function(type, id) {

            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // Returns the index number of the element of the array.
            index = ids.indexOf(id);

            if (index !== -1) {
                // Splice allows you to start at a given (index) value and delete the number of elements following it. In this example, it is 1.
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage of income that is spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            // Expense = 100 and income of 200. Spent 50% of income.
            // 100 / 200 = .5 * 100
            // Round to eliminate decimals.
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {

            /*
            A = 20
            B = 10
            C = 40

            totalIncome = 100;

            A = 20/100 * 100
            B = 10/100 * 100
            ...

            */

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentages();
            });

            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI Controller
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        /*
        + or - before number
        2 decimal points
        comma separating thousands

        2310.3452 >> + 2,310.35
        */

        // Find absolute value of number
        num = Math.abs(num);

        // Fix to two decimal places.
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // INC or EXP
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            //1. Create HTML string with placeholder text.

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            //2. Replace placeholder with actual data.
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //3. Insert HTML into DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },


        clearFields: function() {
            var fields, fieldsArray;

            // Returns a list.
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // If we slice a list, it will return an array.
            fieldsArray = Array.prototype.slice.call(fields);

            // This anonymous function can accept 3 parameters.
            // Current value, index number, and the entire array
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();

        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            // Returns a node list.
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };


})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        //Key press event -- hitting enter key.
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                // ENTER key is pressed.
                ctrlAddItem();

             }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };




    var updateBudget = function() {
        //1. Calculate budget.
        budgetCtrl.calculateBudget();

        //2. Return budget.
        var budget = budgetCtrl.getBudget();

        //3. Display budget in UI.
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calculate percentages.
        budgetCtrl.calculatePercentages();

        // Read percentages from budget controller.
        var percentages = budgetCtrl.getPercentages();

        // Update UI with new percentages.
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        //1. Get field input data.
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add item to budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add item to UI.
            UICtrl.addListItem(newItem, input.type);

            //4. Clear input fields.
            UICtrl.clearFields();

            //5. Calculate and update budget.
            updateBudget();

            //6. Calculate and update percentages.
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        //Traversal of DOM structure
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            // Convert string to integer.
            ID = parseInt(splitID[1]);

            // Delete item from data structure.
            budgetCtrl.deleteItem(type, ID);

            // Delete item from UI.
            UICtrl.deleteListItem(itemID);

            // Update and show new totals (budget).
            updateBudget();

            // Calculate and update percentages.
            updatePercentages();

        }

    };

    return {
        init: function() {
            console.log('Starting application.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
