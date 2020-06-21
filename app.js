// Budget Controller
var budgetController = (function() {



})();

// UI Controller
var UIController = (function() {



})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {


    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    //Key press event -- hitting enter key.
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            // ENTER key is pressed.

        }
    });

})(budgetController, UIController);
