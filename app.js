// Budget Controller
var budgetController = (function() {



})();

// UI Controller
var UIController = (function() {



})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {
        //1. Get field input data.
        //2. Add item to budget controller.
        //3. Add item to UI.
        //4. Calculate budget.
        //5. Display budget in UI.
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    //Key press event -- hitting enter key.
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            // ENTER key is pressed.
            ctrlAddItem();

        }
    });

})(budgetController, UIController);
