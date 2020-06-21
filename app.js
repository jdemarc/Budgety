// Budget Controller
var budgetController = (function() {



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
        //1. Get field input data.
        var input = UICtrl.getInput();

        //2. Add item to budget controller.

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
