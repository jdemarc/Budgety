// Budget Controller
var budgetController = (function() {

    // Function constructors for Expense and Income
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
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

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            //2. Replace placeholder with actual data.
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //3. Insert HTML into DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
    };


    var updateBudget = function() {
        //1. Calculate budget.

        //2. Return budget.

        //3. Display budget in UI.

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
        }

    };

    return {
        init: function() {
            console.log('Starting application.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
