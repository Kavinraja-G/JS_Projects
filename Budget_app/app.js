var budgetControl = (function () {
    //Function Constructors
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    //Individual Expense Percentage values
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
          this.percentage = Math.round((this.value/totalIncome) * 100);
        }
        else{
          this.percentage = -1
        }
    };
    //Returning the calculated percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(present){
          sum = sum + present.value;
        });
        data.allTotals[type] = sum;

    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        allTotals: {
            exp: 0,
            inc: 0
        },
        budget:  0,
        percentage: -1
    };

    return {
        addItem: function (type, des, value) {
            var newItem, ID;
            //Initializing the respective type array last ID + 1:
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else ID = 0;
            //Creating a new input array based on the 'type':
            if (type === 'exp')
                newItem = new Expense(ID, des, value);
            else if (type === 'inc')
                newItem = new Income(ID, des, value);
            //Pushing into the respective array based on 'type':
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },


        calculateBudget: function(){
            //Total Income and Expenses:
            calcTotal('exp');
            calcTotal('inc');
            // Budget: Income - expenses
            data.budget = data.allTotals.inc - data.allTotals.exp;
            // Percentage of Income
            data.percentage = Math.round((data.allTotals.exp / data.allTotals.inc) * 100)
        },

        calculatePercentages: function(){
                data.allItems.exp.forEach(function(cur){
                  cur.calcPercentage(data.allTotals.inc);
                });
        },

        getPercentages: function(){
            var allPercent = data.allItems.exp.map(function(cur){
              return cur.getPercentage();
            });
            return allPercent;
        },


        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.allTotals.inc,
                totalExpense: data.allTotals.exp,
                percentage: data.percentage,

            };
        }
    };

})();



var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        espensesPercentage: '.item__percentage',
        dataLabel: '.budget__title--month',
    };

    var formatNumber = function(num, type){
        var numSplit,int,decimal,type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        decimal = numSplit[1];
        if(int.length>3){
          int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
        }
        return (type==='exp'?'-':'+') + ' ' + int + '.' + decimal;
    };

    var nodeList = function(list,callback){
        for(var i=0;i<list.length;i++){
          callback(list[i], i);
        }
    };

    return {
        getinput: function () {
            return {
                budgetType: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },
        //Note:Another object is being passed so put ,
        addListItem: function (obj, type) {

            var html,newHtml,elemet;
            if (type === 'inc') {
                elemet = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                elemet = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

            document.querySelector(elemet).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
          var field,fieldArray;
          field = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
          fieldArray = Array.prototype.slice.call(field);
          fieldArray.forEach(function(current, index, array){
                current.value = "";
          });
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpense,'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages){
          var fields = document.querySelectorAll(DOMstrings.espensesPercentage);

          nodeList(fields, function(current, index){
            if(percentages[index] > 0){
              current.textContent = percentages[index] + '%';
            }
            else{
                current.textContent = '--';
            }
          });

        },

        displayYear: function(){
          var current,month,year;
          current = new Date();
          months = ['January','February','March','April','May','June','July','August','September','October','November','December',]
          month = current.getMonth();
          year = current.getFullYear();
          document.querySelector(DOMstrings.dataLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function(){
          var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);
          nodeList(fields, function(current){
            current.classList.toggle('red-focus');
          });
          document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();



// APP CONTROLLER MODULE:
var controller = (function (budgetctrl, UIctrl) {
    var setEventListeners = function () {
        var DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', itemAdd);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                itemAdd();
            }
        });
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
    };

    var updateBudget = function(){
      //Calculation of Budget
      budgetctrl.calculateBudget();
      //Returning the Budget
      var budget = budgetctrl.getBudget();
      //Displaying Budget
      UIctrl.displayBudget(budget);
    };

    var updatePercentages = function(){

      budgetctrl.calculatePercentages();

      var percentages = budgetctrl.getPercentages();

      UIctrl.displayPercentages(percentages);
    };

    var itemAdd = function ()
    {
        var inputCtrl = UIctrl.getinput();
        if(inputCtrl.description!=="" && !isNaN(inputCtrl.amount))
        {
          var newItem = budgetctrl.addItem(inputCtrl.budgetType, inputCtrl.description, inputCtrl.amount);

          UIctrl.addListItem(newItem,inputCtrl.budgetType);

          UIctrl.clearFields();

          updateBudget();

          updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Deleting the data from datastructure
            budgetctrl.deleteItem(type,ID);
            //Removing from UI
            UIctrl.deleteListItem(itemID);
            //Updating the budget
            updateBudget();

        }
    };

    return {
        initialization: function () {
            console.log('Welcome to  Kavin\'s Budget Monitorring App:)');
            UIctrl.displayYear();
            UIctrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1,

            });
            setEventListeners();
        }
    };

})(budgetControl, UIController);

//Starting the App:
controller.initialization();
