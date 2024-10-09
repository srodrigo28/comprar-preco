const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(e.target[0].value)

    const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=fio')

})