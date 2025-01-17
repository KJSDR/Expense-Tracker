// Initialize data
let income = 0;
let allocations = {};  // Store dynamic categories and their allocations
let categories = [];  // Store the list of dynamic categories

// Add category dynamically
function addCategory() {
    const categoryName = prompt("Enter a new category name:");

    if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
        allocations[categoryName] = 0;

        // Create category input elements
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("mb-3");
        categoryDiv.innerHTML = `
            <label for="allocation-${categoryName}" class="form-label">${categoryName} Allocation</label>
            <input type="number" id="allocation-${categoryName}" class="form-control" placeholder="Enter allocation for ${categoryName}" required>
        `;

        document.getElementById("dynamic-categories").appendChild(categoryDiv);

        // Update the budget summary dynamically
        updateBudgetSummary();
    }
}

// Update income value and allocations
function updateIncome() {
    income = parseFloat(document.getElementById("monthly-income").value) || 0;

    // Update allocations from dynamic categories
    categories.forEach(category => {
        allocations[category] = parseFloat(document.getElementById(`allocation-${category}`).value) || 0;
    });

    // Update the budget summary
    updateBudgetSummary();

    // Update remaining income
    updateRemainingIncome();

    // Update the income allocation pie chart
    updateIncomePieChart();
}

// Update budget summary with dynamic categories
function updateBudgetSummary() {
    const budgetSummary = document.getElementById("budget-summary");
    budgetSummary.innerHTML = '';

    categories.forEach(category => {
        const allocation = allocations[category];
        const percentage = income > 0 ? ((allocation / income) * 100).toFixed(2) : 0;
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = `${category}: $${allocation.toFixed(2)} (${percentage}%)`;
        budgetSummary.appendChild(listItem);
    });
}

// Update remaining income
function updateRemainingIncome() {
    const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
    const remainingIncome = income - totalAllocated;
    document.getElementById("remaining-income-amount").textContent = remainingIncome.toFixed(2);
}

// Update the income allocation pie chart
function updateIncomePieChart() {
    const ctx = document.getElementById("income-allocation-chart").getContext("2d");

    const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
    const remainingIncome = income - totalAllocated;

    const chartData = {
        labels: [...categories, "Remaining Income"],
        datasets: [{
            label: "Income Allocation",
            data: [...Object.values(allocations), remainingIncome],
            backgroundColor: [
                ...categories.map(() => getRandomColor()),
                "#FFD700"  // Remaining Income (Yellow)
            ],
            borderColor: [
                ...categories.map(() => getRandomColor()),
                "#FFD700"
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

    // Destroy previous chart instance if it exists
    if (window.incomeChart) {
        window.incomeChart.destroy();
    }

    // Create new chart
    window.incomeChart = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: chartOptions
    });
}

// Generate a random color for chart segments
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
