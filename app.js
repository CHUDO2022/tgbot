document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const tabs = document.querySelectorAll('.tab-button');
    const telegram = window.Telegram.WebApp;
    const searchInput = document.querySelector('.search-bar input');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.className = 'autocomplete-list';
    document.querySelector('.search-bar').appendChild(autoCompleteList);

    let productNames = []; // Массив для хранения названий товаров

    // Адаптация темы интерфейса под профиль пользователя в Telegram
    const themeParams = telegram.themeParams;
    document.documentElement.style.setProperty('--background-color', themeParams.bg_color || '#232e3c');
    document.documentElement.style.setProperty('--text-color', themeParams.text_color || '#ffffff');

    // Функция для загрузки продуктов с сервера
    async function loadProducts() {
        try {
            const response = await fetch('https://gadgetmark.ru/get-products');
            const data = await response.json();

            if (data.status !== "success") {
                alert("Ошибка при загрузке данных с сервера.");
                return;
            }

            const products = data.products;
            productNames = products.map(product => product.name);

            // Отображение товаров на главной странице
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('item');
                productCard.setAttribute('data-id', product.id);
                productCard.dataset.inStock = product.in_stock;
                productCard.dataset.images = JSON.stringify(product.images || []);
                productCard.dataset.reviews = JSON.stringify(product.reviews || []);

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="img">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price ? `Цена: ${product.price} ₽` : 'Цена не указана'}</p>
                        ${product.old_price ? `<p class="old-price"><s>${product.old_price} ₽</s></p>` : ''}
                        <p class="availability">${product.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии'}</p>
                        <button class="btn" id="btn${product.id}">Оформить заказ</button>
                    </div>
                `;
                productList.appendChild(productCard);
            });

            attachButtonEvents();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Функция для автодополнения
    function showAutoComplete(text) {
        const matches = productNames.filter(name => name.toLowerCase().includes(text.toLowerCase()));
        autoCompleteList.innerHTML = '';
        matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = match;
            li.addEventListener('click', () => {
                searchInput.value = match;
                autoCompleteList.innerHTML = '';
                searchProducts();
            });
            autoCompleteList.appendChild(li);
        });
    }

    // Функция для поиска товаров
    function searchProducts() {
        const searchText = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            const productName = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = productName.includes(searchText) ? 'block' : 'none';
        });
        showAutoComplete(searchText);
    }

    // Обработчик кнопок "Оформить заказ"
    function attachButtonEvents() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.id.replace('btn', '');
                const productCard = document.querySelector(`#btn${productId}`).closest('.item');
                const productData = {
                    id: parseInt(productId, 10),
                    image: productCard.querySelector('img').src,
                    name: productCard.querySelector('h3').textContent,
                    price: productCard.querySelector('.price').textContent.replace('Цена: ', '').replace(' ₽', ''),
                    old_price: productCard.querySelector('.old-price') ? productCard.querySelector('.old-price').textContent.replace(' ₽', '') : '',
                    in_stock: productCard.dataset.inStock,
                    images: JSON.parse(productCard.dataset.images),
                    reviews: JSON.parse(productCard.dataset.reviews)
                };

                // Переход на страницу оформления заказа с передачей данных через URL
                window.location.href = `order.html?product_data=${encodeURIComponent(JSON.stringify(productData))}`;
            });
        });
    }

    // Инициализация поиска и загрузка товаров
    searchInput.addEventListener('input', searchProducts);
    loadProducts();
});
