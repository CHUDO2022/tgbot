document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const tabs = document.querySelectorAll('.tab-button');
    const modalTabButtons = document.querySelectorAll('.modal-tab-button');
    const moreCategoriesBtn = document.getElementById('more-categories-btn');
    const moreCategoriesModal = document.getElementById('more-categories-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const telegram = window.Telegram.WebApp;
    const userInfo = document.getElementById('user-info');
    const homeBtn = document.getElementById('home-btn');
    const mainContent = document.getElementById('main-content');
    const statsBtn = document.getElementById('stats-btn');
    const searchInput = document.querySelector('.search-bar input');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.className = 'autocomplete-list';
    document.querySelector('.search-bar').appendChild(autoCompleteList);

    let productNames = []; // Массив для хранения названий товаров

    // Адаптация темы интерфейса под профиль пользователя в Telegram
    const themeParams = telegram.themeParams;
    document.documentElement.style.setProperty('--background-color', themeParams.bg_color || '#232e3c');
    document.documentElement.style.setProperty('--card-background-color', themeParams.secondary_bg_color || '#17212b');
    document.documentElement.style.setProperty('--button-background-color', themeParams.button_color || '#232e3c');
    document.documentElement.style.setProperty('--text-color', themeParams.text_color || '#ffffff');

    // Функция для загрузки продуктов с сервера
    function loadProducts() {
        fetch('https://gadgetmark.ru/get-products')
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                productNames = products.map(product => product.name);

                // Создаем карточки для всех продуктов
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('item');
                    productCard.setAttribute('data-category', product.category);
                    productCard.dataset.colors = JSON.stringify(product.colors || []);
                    productCard.dataset.memory = JSON.stringify(product.memory || []);
                    productCard.dataset.connectivity = JSON.stringify(product.connectivity || []);
                    productCard.dataset.description = product.description;

                    // Используем одно изображение для карточки товара
                    const mainImage = product.image || product.images[0];
                    const stockStatus = product.in_stock === 'Да' ? 'В наличии' : 'Нет в наличии';
                    const stockClass = product.in_stock === 'Да' ? 'in-stock' : 'out-of-stock';

                    productCard.innerHTML = `
                        <img src="${mainImage}" alt="${product.name}" class="img">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">Цена: ${product.price} ₽</p>
                            ${product.old_price ? `<p class="old-price">Старая цена: <s>${product.old_price} ₽</s></p>` : ''}
                            <p class="${stockClass}">${stockStatus}</p>
                            <button class="btn" id="btn${product.id}">Добавить</button>
                        </div>
                    `;

                    productList.appendChild(productCard);
                });

                attachButtonEvents();
                showCategory('tab1');
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }

    // Функция для отображения товаров определенной категории
    function showCategory(category) {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.display = item.getAttribute('data-category') === category ? 'block' : 'none';
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
    }

    // Закрытие списка автодополнения при клике вне поля поиска
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-bar')) {
            autoCompleteList.innerHTML = '';
        }
    });

    // Обработчики для кнопок "Добавить"
    function attachButtonEvents() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.id.replace('btn', '');
                const productCard = document.querySelector(`#btn${productId}`).closest('.item');
                const product = {
                    id: parseInt(productId, 10),
                    images: JSON.parse(productCard.dataset.images || '[]'),
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('.price').textContent.replace('Цена: ', '').replace(' ₽', '')),
                    old_price: productCard.querySelector('.old-price') ? parseFloat(productCard.querySelector('.old-price').textContent.replace('Старая цена: ', '').replace(' ₽', '')) : '',
                    description: productCard.dataset.description,
                    in_stock: productCard.querySelector('.out-of-stock') ? 'Нет' : 'Да',
                    colors: JSON.parse(productCard.dataset.colors || '[]'),
                    memory: JSON.parse(productCard.dataset.memory || '[]'),
                    connectivity: JSON.parse(productCard.dataset.connectivity || '[]')
                };

                window.location.href = `order.html?product_data=${encodeURIComponent(JSON.stringify(product))}`;
            });
        });
    }

    // Обработчик кликов по вкладкам
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showCategory(targetCategory);
        });
    });

    // Изначально показываем карточки первой вкладки
    tabs[0].click();

    loadProducts();
});
