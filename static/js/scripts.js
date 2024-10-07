document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('query').value;
    const response = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const results = await response.json();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = results.map((result, index) => 
        `<div class="result">
            <p>${index + 1}. ${result.doc}</p>
            <p class="similarity-score">Similarity Score: ${result.similarity.toFixed(4)}</p>
        </div>`
    ).join('');


    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: results.map((_, i) => `Doc ${i + 1}`),
            datasets: [{
                label: 'Cosine Similarity',
                data: results.map(result => result.similarity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
});