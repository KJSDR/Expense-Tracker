// Initialize data
let expenses = [];
let budgets = {
    food: 0,
    entertainment: 0,
    transportation: 0
};
let income = 0;
let allocations = {
    food: 0,
    entertainment: 0,
    transportation: 0
};

// Update income value
function updateIncome() {
    income = parseFloat(document.getElementById("monthly-income").value) || 0;
    
    // Update allocations
    allocations.food = parseFloat(document.getElementById("food-allocation").value) || 0;
    allocations.entertainment = parseFloat(document.getElementById("entertainment-allocation").value) || 0;
    allocations.transportation = parseFloat(document.getElementById("transportation-allocation").value) || 0;

    // Update the budget summary
    updateBudgetSummary();

    // Update remaining income
    updateRemainingIncome();

    // Update advice based on allocations
    showBudgetAdvice();

    // Update the income allocation pie chart
    updateIncomePieChart();
}

// Add expense
function addExpense() {
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value.toLowerCase();
    const description = document.getElementById("expense-description").value;

    // Check if all required fields are filled
    if (amount && category && budgets[category] !== undefined) {
        // Create an expense object
        const expense = { amount, category, description };

        // Log the expense to the console for debugging
        console.log("Adding expense:", expense);

        // Push the expense to the expenses array
        expenses.push(expense);

        // Update the expense list and budget summary
        updateExpenseList();
        updateBudgetSummary();
        updateChart();

        // Clear the input fields after adding
        document.getElementById("expense-amount").value = "";
        document.getElementById("expense-category").value = "";
        document.getElementById("expense-description").value = "";
    } else {
        console.log("Invalid input: please check the values entered.");
    }
}

// Update the expense list
function updateExpenseList() {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    // Loop through expenses array and create a list item for each expense
    expenses.forEach((expense, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}: $${expense.amount} - ${expense.description || "No description"}`;
        expenseList.appendChild(listItem);
    });
}

// Update budget summary
function updateBudgetSummary() {
    budgets.food = allocations.food;
    budgets.entertainment = allocations.entertainment;
    budgets.transportation = allocations.transportation;

    document.getElementById("food-summary").textContent = getCategoryTotal("food");
    document.getElementById("entertainment-summary").textContent = getCategoryTotal("entertainment");
    document.getElementById("transportation-summary").textContent = getCategoryTotal("transportation");

    document.getElementById("food-allocated").textContent = budgets.food;
    document.getElementById("entertainment-allocated").textContent = budgets.entertainment;
    document.getElementById("transportation-allocated").textContent = budgets.transportation;
}

// Get total expenses for a category
function getCategoryTotal(category) {
    return expenses.filter(exp => exp.category === category).reduce((total, exp) => total + exp.amount, 0);
}

// Update remaining income
function updateRemainingIncome() {
    const totalAllocated = allocations.food + allocations.entertainment + allocations.transportation;
    const remainingIncome = income - totalAllocated;
    document.getElementById("remaining-income-amount").textContent = remainingIncome.toFixed(2);
}

// Provide budget advice
function showBudgetAdvice() {
    const adviceList = document.getElementById("advice-list");
    adviceList.innerHTML = "";

    const totalAllocated = allocations.food + allocations.entertainment + allocations.transportation;
    const remainingIncome = income - totalAllocated;

    // Advice based on income and allocation
    if (remainingIncome < 0) {
        const adviceItem = document.createElement("li");
        adviceItem.textContent = "You have allocated more than your income! Consider reducing some of your budget categories.";
        adviceList.appendChild(adviceItem);
    } else if (remainingIncome < 0.2 * income) {
        const adviceItem = document.createElement("li");
        adviceItem.textContent = "Your income is almost fully allocated. Be cautious of overspending.";
        adviceList.appendChild(adviceItem);
    } else {
        const adviceItem = document.createElement("li");
        adviceItem.textContent = "You're doing well! Keep up the good work with your budgeting.";
        adviceList.appendChild(adviceItem);
    }
}

// Update the expense chart with the latest data
function updateChart() {
    const ctx = document.getElementById("expense-chart").getContext("2d");

    const chartData = {
        labels: ["Food", "Entertainment", "Transportation"],
        datasets: [{
            label: "Total Spent",
            data: [
                getCategoryTotal("food"),
                getCategoryTotal("entertainment"),
                getCategoryTotal("transportation")
            ],
            backgroundColor: ["#FF5733", "#33FF57", "#3357FF"],
            borderColor: ["#FF5733", "#33FF57", "#3357FF"],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    };

    new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}

// Update the income allocation pie chart
function updateIncomePieChart() {
    const ctx = document.getElementById("income-allocation-chart").getContext("2d");

    const totalAllocated = allocations.food + allocations.entertainment + allocations.transportation;
    const remainingIncome = income - totalAllocated;

    const chartData = {
        labels: ["Food", "Entertainment", "Transportation", "Remaining Income"],
        datasets: [{
            label: "Income Allocation",
            data: [
                allocations.food,
                allocations.entertainment,
                allocations.transportation,
                remainingIncome
            ],
            backgroundColor: [
                "#FF5733",  // Food (Red)
                "#33FF57",  // Entertainment (Green)
                "#3357FF",  // Transportation (Blue)
                "#FFD700"   // Remaining Income (Yellow)
            ],
            borderColor: [
                "#FF5733",  // Food border color
                "#33FF57",  // Entertainment border color
                "#3357FF",  // Transportation border color
                "#FFD700"   // Remaining Income border color
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: $${context.raw.toFixed(2)}`;
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: chartOptions
    });
}

