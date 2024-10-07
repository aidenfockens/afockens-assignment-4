let chart = null;  // Global variable to keep track of the chart instance

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('query').value;
    const response = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const results = await response.json();
    
    // Update results list
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = results.map((result, index) => 
        `<div class="result">
            <p>${index + 1}. ${result.doc}</p>
            <p class="similarity-score">Similarity Score: ${result.similarity.toFixed(4)}</p>
        </div>`
    ).join('');

    // Check if a chart already exists, and if so, destroy it
    if (chart !== null) {
        chart.destroy();
    }

    // Create a new chart
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: results.map((_, i) => `Doc ${i + 1}`),
            datasets: [{
                label: 'Cosine Similarity',
                data: results.map(result => result.similarity.toFixed(4)),  // Ensure precision
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 1,  // Limit y-axis to max of 1
                    ticks: {
                        stepSize: 0.1  // Control the steps on the y-axis
                    }
                }
            }
        }
    });
});
