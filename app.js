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
    const orderPage = document.getElementById('order-page');
    const orderImg = document.getElementById('order-img');
    const orderText = document.getElementById('order-text');
    const inviteTitle = document.querySelector('.invite-title');
    const inviteText = document.querySelector('.invite-text');
    const searchInput = document.querySelector('.search-bar input');
    const autoCompleteList = document.createElement('ul');
    autoCompleteList.className = 'autocomplete-list';
    document.querySelector('.search-bar').appendChild(autoCompleteList);

    let productNames = [];  // Массив для хранения названий товаров

    // Адаптация темы интерфейса под профиль пользователя в Telegram
    const themeParams = telegram.themeParams;
    document.documentElement.style.setProperty('--background-color', themeParams.bg_color || '#232e3c');
    document.documentElement.style.setProperty('--card-background-color', themeParams.secondary_bg_color || '#17212b');
    document.documentElement.style.setProperty('--button-background-color', themeParams.button_color || '#232e3c');
    document.documentElement.style.setProperty('--text-color', themeParams.text_color || '#ffffff');
    document.documentElement.style.setProperty('--highlight-color', themeParams.link_color || '#007aff');
    document.documentElement.style.setProperty('--close-button-color', themeParams.button_text_color || '#ff3b30');
    document.documentElement.style.setProperty('--invite-text-color', themeParams.text_color || '#000000');

    // Изменение цвета текста кнопки "Зови друзей"
    inviteTitle.style.color = themeParams.text_color || '#000000';
    inviteText.style.color = themeParams.text_color || '#000000';

    homeBtn.addEventListener('click', () => {
        mainContent.classList.remove('hidden');
        orderPage.classList.add('hidden');
        homeBtn.classList.add('hidden');
    });

    statsBtn.addEventListener('click', () => {
        fetch('https://gadgetmark.ru/get-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Log file sent to Telegram successfully");
            } else {
                alert("Error sending log file: " + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении файла:', error);
        });
    });

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
                    productCard.dataset.description = product.description;

                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="img">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">Цена: ${product.price} ₽</p>
                            ${product.old_price ? `<p class="old-price">Старая цена: <s>${product.old_price} ₽</s></p>` : ''}
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
            if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Обработчики для кнопок "Добавить"
    function attachButtonEvents() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.id.replace('btn', '');
                const productCard = document.querySelector(`#btn${productId}`).closest('.item');
                const productImg = productCard.querySelector('img').src;
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('Цена: ', '').replace(' ₽', ''));
                const productOldPrice = productCard.querySelector('.old-price') ? parseFloat(productCard.querySelector('.old-price').textContent.replace('Старая цена: ', '').replace(' ₽', '')) : '';
                const productDescription = productCard.dataset.description;

                const product = {
                    id: parseInt(productId, 10),
                    image: productImg,
                    name: productName,
                    price: productPrice,
                    old_price: productOldPrice,
                    description: productDescription
                };

                window.location.href = `order.html?product_data=${encodeURIComponent(JSON.stringify(product))}`;
            });
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showCategory(targetCategory);
        });
    });

    moreCategoriesBtn.addEventListener('click', () => {
        moreCategoriesModal.classList.remove('hidden');
        moreCategoriesModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        moreCategoriesModal.classList.add('hidden');
        moreCategoriesModal.style.display = 'none';
    });

    modalTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCategory = button.getAttribute('data-tab');
            moreCategoriesModal.classList.add('hidden');
            moreCategoriesModal.style.display = 'none';
            showCategory(targetCategory);
        });
    });

    tabs[0].click();
    loadProducts();

    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        telegram.close();
    });

    const initDataUnsafe = telegram.initDataUnsafe;
    const user = initDataUnsafe.user;

    if (user) {
        localStorage.setItem('telegramUser', JSON.stringify(user));
        const allowedUsers = [698266175, 6039728055, 408985787];
        if (allowedUsers.includes(user.id)) {
            statsBtn.style.display = 'block';
        }
    }

    telegram.onEvent('web_app_data', data => {
        const profileData = JSON.parse(data);
        console.log('Получены данные профиля:', profileData);
    });

    searchInput.addEventListener('input', searchProducts);
});
