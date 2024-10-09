const form = document.querySelector('form');
const input = document.querySelector('input');
const lista = document.querySelector('.product-list');
const priceChat = document.querySelector('.price-chart')
let myChart = ""

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const limit = 10;
    const inputValue = input.value
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)
    const products = (await data.json()).results.slice(0, limit)

    console.log(products.length)

    displayItems(products)
    updatePriceChart(products)
})

function displayItems(products) {
    lista.innerHTML = products.map(produt => `
        <div class="product-card">
            <img src="${stringImg(produt.thumbnail)}" alt="${produt.title}">
            <h3>${stringText(produt.title, 40)}</h3>
            <p class="product-price">${moeda(produt.price)}</p>
            <p class="product-loja">Loja: ${produt.seller.nickname}</p>
        </div>
    `).join("")
}

function updatePriceChart(products) {
    const ctx = priceChat.getContext('2d')

    if (myChart) {
        myChart.destroy()
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => stringText(p.title, 20)),
            datasets: [{
                label: 'Preço',
                data: products.map(p => p.price),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return moeda(value)
                        }
                    },
                    plugins: {
                        legend: {
                            displayItems: false,
                        },
                        title: {
                            display: true,
                            text: 'Preço dos Produtos',
                            font: { size: 18}
                        }
                    }
                }
            }
        }
    })
    /** exemplo 2
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(p => p.title),
                datasets: [{
                    label: 'Preço',
                    data: products.map(p => p.price),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            }
            }
        )
     */
}

/**    Funções helpes     */
function moeda(valor) {
    return valor.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });
}

function stringText(text, size) {
    return text.substring(0, size) + '...';
}

function stringImg(imgFomart) {
    return imgFomart.replace(/\w\.jpg/gi, 'W.jpg');
}