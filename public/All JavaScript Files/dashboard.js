// Define categories that will be showing on the forms

// For expense
const categories = {
    food: "Food",
    transport: "Transport",
    entertainment: "Entertainment",
    utilities: "Utilities",
    healthcare: "Healthcare",
    other: "Other"
};

//  For income
const categories2 = {
    salary: "Salary",
    lottery: "Lottery",
    bonus: "Bonus",
    reward: "Reward",
    coupan: "Coupan",
    other: "Other"
};
// Showing the categories as a dropdown in both forms
const categorySelectExpense = document.getElementById('category');
const categorySelectIncome = document.getElementById('category2');

for (const [key, value] of Object.entries(categories)) {
    const expenseOption = document.createElement('option');
    expenseOption.value = key;
    expenseOption.textContent = value;
    categorySelectExpense.appendChild(expenseOption);
}

for (const [key, value] of Object.entries(categories2)) {
    const incomeOption = document.createElement('option');
    incomeOption.value = key;
    incomeOption.textContent = value;
    categorySelectIncome.appendChild(incomeOption);
}

// Selecting the elements of the forms
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const expenseForm = document.getElementById('expenseForm');
const incomeForm = document.getElementById('IncomeForm');
const overlay = document.getElementById('overlay');
const expenseFormElement = document.getElementById('expenseFormElement');
const incomeFormElement = document.getElementById('incomeFormElement');

let expenses = [];
let incomes = [];

// Open Expense Form
openFormBtn.addEventListener('click', function () {
    expenseForm.style.display = 'block';
    overlay.style.display = 'block'; // Show overlay
});

// Close Expense Form
closeFormBtn.addEventListener('click', function () {
    expenseForm.style.display = 'none';
    overlay.style.display = 'none';
});


// Open Income Form 
const openIncomeFormBtn = document.getElementById('openIncomeFormBtn');
openIncomeFormBtn.addEventListener('click', function () {
    incomeForm.style.display = 'block';
    overlay.style.display = 'block'; // Show overlay
});

// Close Income Form
const closeIncomeFormBtn = document.getElementById('closeFormBtn2');
closeIncomeFormBtn.addEventListener('click', function () {
    incomeForm.style.display = 'none';
    overlay.style.display = 'none';
});


// Overlay click to close both forms
overlay.addEventListener('click', function () {
    expenseForm.style.display = 'none';
    incomeForm.style.display = 'none';
    overlay.style.display = 'none';
});





// For showing the data from database and server.js to the dashboard page
document.addEventListener("DOMContentLoaded", () => {
    fetchTotalExpense();
    fetchTotalIncome();
});


// Get the expense data from the server.js and showing them on the cards
function fetchTotalExpense() {

    // this initiates an HTTP GET request to the /totalExpense endpoint on the server.
    fetch("/totalExpense")

        // This part handles the initial response
        .then(response => {
            if (!response.ok)  //response unsuccessful
            {
                throw new Error(`Error fetching total expense: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Total Expense fetched:", data.totalExpense);
            document.getElementById("totalExpense").innerText = parseFloat(data.totalExpense || 0).toFixed(2);
            updateRemainingBalance();
        })
        .catch(error => console.error("Error in fetchTotalExpense:", error));
}

// Get the income data from the server.js and showing them on the cards
function fetchTotalIncome() {


    // this initiates an HTTP GET request to the /totalExpense endpoint on the server.
    fetch("/totalIncome")
        // This part handles the initial response
        .then(response => {
            if (!response.ok) //response unsuccessful
            {
                throw new Error(`Error fetching total income: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Total Income fetched:", data.totalIncome);
            document.getElementById("totalIncome").innerText = parseFloat(data.totalIncome || 0).toFixed(2);
            updateRemainingBalance();
        })
        .catch(error => console.error("Error in fetchTotalIncome:", error));
}

// Updating the remaining balance according to income and expense
function updateRemainingBalance() {
    const totalIncome = parseFloat(document.getElementById("totalIncome").innerText) || 0;
    const totalExpense = parseFloat(document.getElementById("totalExpense").innerText) || 0;
    const remainingBalance = totalIncome - totalExpense;
    document.getElementById("remainingBalance").innerText = remainingBalance.toFixed(2);
}
