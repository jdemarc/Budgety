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
        inputBtn: '.add__btn'
    };



    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // INC or EXP
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
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


    var ctrlAddItem = function() {
        var input, newItem;

        //1. Get field input data.
        input = UICtrl.getInput();

        //2. Add item to budget controller.
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add item to UI.

        //4. Calculate budget.

        //5. Display budget in UI.
    };

    return {
        init: function() {
            console.log('Starting application.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
